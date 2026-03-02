import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://127.0.0.1:8000/api/v1";

export async function GET(request: NextRequest) {
    // Pass the access_token cookie as Authorization header to the FastAPI backend
    const token = request.cookies.get("access_token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
        const apiResponse = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });

        const data = await apiResponse.json();

        if (!apiResponse.ok) {
            return NextResponse.json(data, { status: apiResponse.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
