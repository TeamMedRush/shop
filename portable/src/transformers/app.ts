import type {
  Address,
  AuthSession,
  Order,
  OrderItem,
  Persona,
  Product,
  User,
} from "@interfaces/app";

interface RawRecord {
  [key: string]: unknown;
}

interface RawSessionResponse {
  token: string;
  persona?: string;
  profile: RawRecord;
}

interface RawMedicine extends RawRecord {
  id?: string;
  name?: string;
  description?: string;
  requires_prescription?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface RawOrderItem extends RawRecord {
  medicine_id?: string;
  name?: string;
  quantity?: number;
  price?: number;
}

interface RawOrder extends RawRecord {
  id?: string;
  user_id?: string;
  partner_id?: string;
  agent_id?: string;
  status?: string;
  items?: RawOrderItem[];
  delivery_address?: RawRecord;
  total?: number;
  created_at?: string;
  updated_at?: string;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function deriveBrand(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts[0] || "MedRush";
}

function deriveCategory(name: string, description: string) {
  const haystack = `${name} ${description}`.toLowerCase();

  if (haystack.includes("syrup")) {
    return "Syrup";
  }

  if (haystack.includes("tablet")) {
    return "Tablet";
  }

  if (haystack.includes("capsule")) {
    return "Capsule";
  }

  if (haystack.includes("drops")) {
    return "Drops";
  }

  return "General medicine";
}

function stableHash(input: string) {
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = ((hash << 5) - hash) + input.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

export function toAddress(record: RawRecord | undefined): Address {
  if (!record) {
    return {};
  }

  return {
    label: typeof record.name === "string" ? record.name : undefined,
    latitude: asNumber(record.home_lat ?? record.lat ?? record.latitude),
    longitude: asNumber(record.home_long ?? record.long ?? record.longitude),
    addressLine1: typeof record.address_line_1 === "string"
      ? record.address_line_1
      : undefined,
    addressLine2: typeof record.address_line_2 === "string"
      ? record.address_line_2
      : undefined,
    city: typeof record.city === "string" ? record.city : undefined,
    state: typeof record.state === "string" ? record.state : undefined,
    pincode: typeof record.pincode === "string" ? record.pincode : undefined,
    country: typeof record.country === "string" ? record.country : undefined,
  };
}

export function toUser(record: RawRecord, persona: Persona): User {
  return {
    id: typeof record.id === "string" ? record.id : "",
    persona,
    name: typeof record.name === "string" ? record.name : "Customer",
    email: typeof record.email === "string" ? record.email : "",
    phone: typeof record.phone === "string" ? record.phone : "",
    age: asNumber(record.age),
    homeLatitude: asNumber(record.home_lat),
    homeLongitude: asNumber(record.home_long),
    address: toAddress(record),
    createdAt: typeof record.created_at === "string"
      ? record.created_at
      : undefined,
    updatedAt: typeof record.updated_at === "string"
      ? record.updated_at
      : undefined,
  };
}

export function toSession(
  payload: RawSessionResponse,
  persona: Persona,
): AuthSession<User> {
  return {
    token: payload.token,
    persona,
    profile: toUser(payload.profile, persona),
    source: "remote",
  };
}

export function toProduct(raw: RawMedicine): Product {
  const name = typeof raw.name === "string" ? raw.name : "Medicine";
  const description = typeof raw.description === "string" ? raw.description : "";
  const hash = stableHash(`${raw.id || name}${description}`);
  const price = 65 + (hash % 255);
  const stockQuantity = 3 + (hash % 18);
  const availabilityText = stockQuantity <= 5
    ? `${stockQuantity} left in the current storefront estimate`
    : "In stock";

  return {
    id: typeof raw.id === "string" ? raw.id : "",
    medicineId: typeof raw.id === "string" ? raw.id : "",
    name,
    brand: deriveBrand(name),
    category: deriveCategory(name, description),
    description,
    price,
    stockQuantity,
    prescriptionRequired: Boolean(raw.requires_prescription),
    partnerName: null,
    partnerId: null,
    availabilityText,
    createdAt: typeof raw.created_at === "string" ? raw.created_at : undefined,
    updatedAt: typeof raw.updated_at === "string" ? raw.updated_at : undefined,
  };
}

export function toOrder(raw: RawOrder): Order {
  const rawItems = Array.isArray(raw.items) ? raw.items : [];

  return {
    id: typeof raw.id === "string" ? raw.id : "",
    userId: typeof raw.user_id === "string" ? raw.user_id : undefined,
    partnerId: typeof raw.partner_id === "string" ? raw.partner_id : null,
    agentId: typeof raw.agent_id === "string" ? raw.agent_id : null,
    status: typeof raw.status === "string" ? raw.status : "pending_assignment",
    items: rawItems.map<OrderItem>((item) => ({
      medicineId: typeof item.medicine_id === "string" ? item.medicine_id : "",
      name: typeof item.name === "string" ? item.name : "Medicine",
      quantity: asNumber(item.quantity) ?? 0,
      price: asNumber(item.price) ?? 0,
    })),
    deliveryAddress: toAddress(raw.delivery_address),
    total: asNumber(raw.total) ?? 0,
    createdAt: typeof raw.created_at === "string" ? raw.created_at : undefined,
    updatedAt: typeof raw.updated_at === "string" ? raw.updated_at : undefined,
  };
}

export function formatAddress(address?: Address | null): string {
  if (!address) {
    return "Not available yet";
  }

  const parts = [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.pincode,
  ].filter(Boolean);

  return parts.length ? parts.join(", ") : "Not available yet";
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
