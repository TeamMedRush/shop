import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://127.0.0.1:8000/api/v1";

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ action: string }> }
) {
    const { action } = await context.params;

    const ALLOWED_ACTIONS = ["login", "register", "verify-otp", "send-otp", "refresh", "logout"];
    if (!ALLOWED_ACTIONS.includes(action)) {
        return NextResponse.json({ error: "Invalid action" }, { status: 404 });
    }

    // For logout, we just clear cookies on the Next.js side
    if (action === "logout") {
        const response = NextResponse.json({ message: "Logged out" });
        response.cookies.delete("access_token");
        response.cookies.delete("refresh_token");
        return response;
    }

    try {
        const body = await request.json();

        const apiResponse = await fetch(`${API_URL}/auth/${action}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await apiResponse.json();

        if (!apiResponse.ok) {
            return NextResponse.json(data, { status: apiResponse.status });
        }

        const response = NextResponse.json(data);

        // If login/verify-otp returns tokens, set httpOnly cookies
        if (data.access_token && data.refresh_token) {
            response.cookies.set("access_token", data.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 15 * 60, // 15 mins
            });

            response.cookies.set("refresh_token", data.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 7 * 24 * 60 * 60, // 7 days
            });
        }

        return response;
    } catch (error) {
        console.error(`[Auth Proxy] Error on action=${action}:`, error);
        return NextResponse.json({ error: "Could not connect to auth server" }, { status: 502 });
    }
}
