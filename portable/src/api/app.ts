declare const process: {
  env: Record<string, string | undefined>;
};

import type {
  ApiError,
  AuthSession,
  Order,
  Product,
  SessionActionResult,
  User,
} from "@interfaces/app";
import {
  toOrder,
  toProduct,
  toSession,
} from "@transformers/app";

interface CredentialsInput {
  email: string;
  password: string;
}

export interface UserRegistrationInput extends CredentialsInput {
  name: string;
  phone: string;
  age: number;
  homeLat: number;
  homeLong: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface UserProfileUpdateInput {
  name: string;
  email: string;
  phone: string;
  age: number;
  homeLat: number;
  homeLong: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  password?: string;
}

export interface CheckoutOrderInput {
  items: Array<{
    medicineId: string;
    quantity: number;
  }>;
}

interface RawSessionResponse {
  token: string;
  persona?: string;
  profile: Record<string, unknown>;
}

interface RawMedicine {
  id?: string;
  name?: string;
  description?: string;
  requires_prescription?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface RawOrder {
  id?: string;
  user_id?: string;
  partner_id?: string;
  agent_id?: string;
  status?: string;
  items?: Array<Record<string, unknown>>;
  delivery_address?: Record<string, unknown>;
  total?: number;
  created_at?: string;
  updated_at?: string;
}

interface CatalogResponse {
  medicines: RawMedicine[];
}

interface OrdersResponse {
  orders: RawOrder[];
}

interface OrderResponse {
  order: RawOrder;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH";
  body?: unknown;
  token?: string;
}

const API_BASE_URL = (
  window.localStorage.getItem("medrush.apiBaseUrl")
  || process.env.API_BASE_URL
  || "http://localhost:8000"
).replace(/\/$/, "");

const API_TIMEOUT_MS = Number(process.env.API_TIMEOUT_MS || "10000");
const API_AUTH_HEADER = process.env.API_AUTH_HEADER || "token";
const ENABLE_MOCK_DATA = (
  process.env.ENABLE_MOCK_DATA === "true"
  || process.env.ENABLE_MOCK_DATA === "1"
);

const STORAGE_KEYS = {
  session: "medrush.shop.session",
  catalog: "medrush.shop.catalog",
  orders: "medrush.shop.orders",
};

export const ENDPOINTS = {
  auth: {
    signup: "/api/v1/auth/signup",
    signin: "/api/v1/auth/signin",
  },
  user: {
    account: "/api/v1/user/account",
    orders: "/api/v1/user/order",
  },
  catalog: {
    medicines: "/api/v1/medicines",
  },
} as const;

function readStorage<T>(key: string, fallback: T): T {
  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) as T : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function createApiError(
  partial: Partial<ApiError> & { message: string },
): ApiError {
  return {
    code: partial.code || "api_error",
    message: partial.message,
    status: partial.status,
    hint: partial.hint,
    details: partial.details,
  };
}

export function normalizeApiError(error: unknown): ApiError {
  if (
    typeof error === "object"
    && error !== null
    && "message" in error
    && "code" in error
  ) {
    return error as ApiError;
  }

  if (error instanceof Error) {
    return createApiError({
      code: "runtime_error",
      message: error.message,
    });
  }

  return createApiError({
    code: "unknown_error",
    message: "Something went wrong while contacting MedRush.",
  });
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  const method = options.method || "GET";
  const headers = new Headers();

  headers.set("Accept", "application/json");

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set(API_AUTH_HEADER, options.token);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: options.body === undefined
        ? undefined
        : JSON.stringify(options.body),
      signal: controller.signal,
    });

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const apiMessage = (
        typeof payload === "object"
        && payload !== null
        && "error" in payload
      )
        ? String(payload.error)
        : `Request failed with status ${response.status}`;

      throw createApiError({
        status: response.status,
        code: "request_failed",
        message: apiMessage,
        details: payload,
      });
    }

    return payload as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw createApiError({
        code: "timeout",
        message: "The MedRush server took too long to respond.",
        hint: "Check that the backend is running on http://localhost:8000.",
      });
    }

    if (error instanceof TypeError) {
      throw createApiError({
        code: "network_error",
        message: "The MedRush server could not be reached from the browser.",
        hint: "This usually means the backend is offline or CORS is blocking requests on a different port.",
      });
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function mockCatalog(): Product[] {
  return [
    toProduct({
      id: "mock-paracetamol",
      name: "Paracetamol 650",
      description: "Mock storefront fallback for shop development.",
      requires_prescription: false,
    }),
    toProduct({
      id: "mock-augmentin",
      name: "Augmentin Syrup",
      description: "Prescription-only mock item used when ENABLE_MOCK_DATA is turned on.",
      requires_prescription: true,
    }),
  ];
}

export function loadCachedSession(): AuthSession<User> | null {
  return readStorage<AuthSession<User> | null>(STORAGE_KEYS.session, null);
}

export function saveCachedSession(session: AuthSession<User> | null) {
  if (!session) {
    window.localStorage.removeItem(STORAGE_KEYS.session);
    return;
  }

  writeStorage(STORAGE_KEYS.session, session);
}

export function loadCachedCatalog(): Product[] {
  return readStorage<Product[]>(STORAGE_KEYS.catalog, []);
}

export function loadCachedOrders(): Order[] {
  return readStorage<Order[]>(STORAGE_KEYS.orders, []);
}

export function getCachedProduct(productId: string): Product | null {
  return loadCachedCatalog().find((item) => item.id === productId) || null;
}

export function getCachedOrder(orderId: string): Order | null {
  return loadCachedOrders().find((item) => item.id === orderId) || null;
}

export async function signInUser(
  input: CredentialsInput,
): Promise<AuthSession<User>> {
  const payload = await request<RawSessionResponse>(ENDPOINTS.auth.signin, {
    method: "POST",
    body: {
      persona: "user",
      email: input.email,
      password: input.password,
    },
  });

  const session = toSession(payload, "user");
  saveCachedSession(session);
  return session;
}

export async function registerUser(
  input: UserRegistrationInput,
): Promise<AuthSession<User>> {
  const payload = await request<RawSessionResponse>(ENDPOINTS.auth.signup, {
    method: "POST",
    body: {
      persona: "user",
      name: input.name,
      email: input.email,
      password: input.password,
      phone: input.phone,
      age: input.age,
      home_lat: input.homeLat,
      home_long: input.homeLong,
      address_line_1: input.addressLine1,
      address_line_2: input.addressLine2 || "",
      city: input.city,
      state: input.state,
      pincode: input.pincode,
      country: input.country,
    },
  });

  const session = toSession(payload, "user");
  saveCachedSession(session);
  return session;
}

export async function updateUserProfile(
  token: string,
  input: UserProfileUpdateInput,
): Promise<User> {
  const payload = await request<{ profile: Record<string, unknown> }>(
    ENDPOINTS.user.account,
    {
      method: "PATCH",
      token,
      body: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        age: input.age,
        home_lat: input.homeLat,
        home_long: input.homeLong,
        address_line_1: input.addressLine1,
        address_line_2: input.addressLine2 || "",
        city: input.city,
        state: input.state,
        pincode: input.pincode,
        country: input.country,
        password: input.password || undefined,
      },
    },
  );

  const session = loadCachedSession();
  const nextProfile = toSession(
    { token, profile: payload.profile, persona: "user" },
    "user",
  ).profile;

  if (session) {
    saveCachedSession({
      ...session,
      profile: nextProfile,
      source: "cached",
    });
  }

  return nextProfile;
}

export async function loadCatalogProducts(): Promise<Product[]> {
  try {
    const payload = await request<CatalogResponse>(ENDPOINTS.catalog.medicines, {
      method: "GET",
    });

    const products = payload.medicines.map((medicine) => toProduct(medicine));
    writeStorage(STORAGE_KEYS.catalog, products);
    return products;
  } catch (error) {
    if (ENABLE_MOCK_DATA) {
      const products = mockCatalog();
      writeStorage(STORAGE_KEYS.catalog, products);
      return products;
    }

    throw error;
  }
}

export async function listUserOrders(token: string): Promise<Order[]> {
  const payload = await request<OrdersResponse>(ENDPOINTS.user.orders, {
    method: "GET",
    token,
  });

  const orders = payload.orders.map((order) => toOrder(order));
  writeStorage(STORAGE_KEYS.orders, orders);
  return orders;
}

export async function placeUserOrder(
  token: string,
  input: CheckoutOrderInput,
): Promise<Order> {
  const payload = await request<OrderResponse>(ENDPOINTS.user.orders, {
    method: "POST",
    token,
    body: {
      items: input.items.map((item) => ({
        medicine_id: item.medicineId,
        quantity: item.quantity,
      })),
    },
  });

  const order = toOrder(payload.order);
  const current = loadCachedOrders().filter((item) => item.id !== order.id);
  current.unshift(order);
  writeStorage(STORAGE_KEYS.orders, current);
  return order;
}

export function logoutUser(): SessionActionResult<null> {
  window.localStorage.removeItem(STORAGE_KEYS.session);
  return { ok: true, data: null };
}

// TODO(server): replace the local cart and cached product/order detail fallbacks
// when the backend exposes cart endpoints and single-product/order detail routes.
