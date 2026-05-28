import {
  getCachedOrder,
  getCachedProduct,
  listUserOrders,
  loadCachedCatalog,
  loadCachedOrders,
  loadCatalogProducts,
  normalizeApiError,
  placeUserOrder,
  type UserProfileUpdateInput,
  type UserRegistrationInput,
} from "@api/app";
import { About } from "@components/block/about";
import { AppShell } from "@components/kit/app-shell";
import { StatePanel } from "@components/kit/state-panel";
import { useAuth } from "@contexts/auth-context";
import { useCart } from "@contexts/cart-context";
import type {
  ApiError,
  Order,
  Product,
  User,
} from "@interfaces/app";
import {
  formatAddress,
  formatCurrency,
} from "@transformers/app";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";

export interface ShopRouteState {
  page:
    | "home"
    | "login"
    | "register"
    | "products"
    | "product-detail"
    | "cart"
    | "checkout"
    | "orders"
    | "order-detail"
    | "profile"
    | "not-found";
  path: string;
  productId?: string;
  orderId?: string;
}

interface HomeViewProps {
  route: ShopRouteState;
}

interface CatalogSourceState {
  loading: boolean;
  error: ApiError | null;
  products: Product[];
  refresh: () => Promise<void>;
}

interface OrdersSourceState {
  loading: boolean;
  placing: boolean;
  error: ApiError | null;
  orders: Order[];
  refresh: () => Promise<void>;
  place: (
    items: Array<{ medicineId: string; quantity: number }>,
  ) => Promise<Order | null>;
}

function SectionHeader(
  { title, summary, actionLabel, actionHref, onAction }:
  {
    title: string;
    summary: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
  },
) {
  return (
    <div className="view-section__header">
      <div>
        <p className="view-section__eyebrow">MedRush Customer Flow</p>
        <h2>{title}</h2>
        <p>{summary}</p>
      </div>

      {actionLabel && actionHref ? (
        <a className="view-button view-button--secondary" href={actionHref}>
          {actionLabel}
        </a>
      ) : null}

      {actionLabel && onAction ? (
        <button
          className="view-button view-button--secondary"
          type="button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

function useCatalogSource(): CatalogSourceState {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [products, setProducts] = useState<Product[]>(() => loadCachedCatalog());

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextProducts = await loadCatalogProducts();
      setProducts(nextProducts);
    } catch (caught) {
      setError(normalizeApiError(caught));
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    products,
    refresh,
  };
}

function useOrdersSource(token: string | undefined): OrdersSourceState {
  const [loading, setLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [orders, setOrders] = useState<Order[]>(() => loadCachedOrders());

  const refresh = useCallback(async () => {
    if (!token) {
      setOrders(loadCachedOrders());
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nextOrders = await listUserOrders(token);
      setOrders(nextOrders);
    } catch (caught) {
      setError(normalizeApiError(caught));
    } finally {
      setLoading(false);
    }
  }, [token]);

  const place = useCallback(async (
    items: Array<{ medicineId: string; quantity: number }>,
  ) => {
    if (!token) {
      return null;
    }

    setPlacing(true);
    setError(null);

    try {
      const created = await placeUserOrder(token, { items });
      setOrders((current) => [created, ...current.filter((item) => item.id !== created.id)]);
      return created;
    } catch (caught) {
      setError(normalizeApiError(caught));
      return null;
    } finally {
      setPlacing(false);
    }
  }, [token]);

  return {
    loading,
    placing,
    error,
    orders,
    refresh,
    place,
  };
}

function ProductCard(
  {
    product,
    onAdd,
  }:
  {
    product: Product;
    onAdd: (product: Product) => void;
  },
) {
  return (
    <article className="product-card">
      <div className="product-card__topline">
        <span className="product-card__pill">{product.category}</span>
        <strong>{formatCurrency(product.price)}</strong>
      </div>

      <div className="product-card__copy">
        <h3>{product.name}</h3>
        <p className="product-card__subline">{product.brand} | {product.availabilityText}</p>
        <p className="product-card__description">
          {product.description || "Description is currently limited by the public medicines endpoint."}
        </p>
      </div>

      <div className="product-card__tags">
        <span className={`product-tag${product.prescriptionRequired ? " product-tag--warning" : ""}`}>
          {product.prescriptionRequired ? "Prescription required" : "OTC"}
        </span>
        <span className="product-tag">
          {product.partnerName || "Partner assigned after order acceptance"}
        </span>
      </div>

      <div className="product-card__actions">
        <a className="view-button view-button--ghost" href={`/products/${product.id}`}>
          View product
        </a>
        <button
          className="view-button view-button--primary"
          type="button"
          disabled={product.stockQuantity <= 0}
          onClick={() => onAdd(product)}
        >
          {product.stockQuantity <= 0 ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <article className="order-card">
      <div className="order-card__topline">
        <span className={`order-card__status order-card__status--${order.status}`}>
          {order.status.replaceAll("_", " ")}
        </span>
        <strong>{formatCurrency(order.total)}</strong>
      </div>

      <h3>Order {order.id}</h3>
      <p className="order-card__note">{formatAddress(order.deliveryAddress)}</p>

      <div className="order-card__stats">
        <div>
          <span>Items</span>
          <strong>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</strong>
        </div>
        <div>
          <span>Lines</span>
          <strong>{order.items.length}</strong>
        </div>
        <div>
          <span>Partner</span>
          <strong>{order.partnerId || "Pending"}</strong>
        </div>
      </div>

      <div className="order-card__actions">
        <a className="view-button view-button--ghost" href={`/orders/${order.id}`}>
          View order
        </a>
      </div>
    </article>
  );
}

function LoginPage() {
  const { signIn, busy, error, clearError } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function onSubmit(event: Event) {
    event.preventDefault();
    clearError();
    const result = await signIn(form);

    if (result.ok) {
      window.location.href = "/products";
    }
  }

  return (
    <section className="view-form-panel">
      <SectionHeader
        title="Customer sign in"
        summary="Use the MedRush user persona to access order history, checkout, and profile updates from the current backend routes."
      />

      <form className="view-form" onSubmit={onSubmit}>
        <label>
          <span>Email</span>
          <input
            required
            type="email"
            value={form.email}
            onInput={(event) => setForm((current) => ({
              ...current,
              email: (event.currentTarget as HTMLInputElement).value,
            }))}
          />
        </label>

        <label>
          <span>Password</span>
          <input
            required
            type="password"
            value={form.password}
            onInput={(event) => setForm((current) => ({
              ...current,
              password: (event.currentTarget as HTMLInputElement).value,
            }))}
          />
        </label>

        {error ? (
          <div className="view-error-banner">
            <strong>{error.message}</strong>
            {error.hint ? <span>{error.hint}</span> : null}
          </div>
        ) : null}

        <div className="view-form__actions">
          <button className="view-button view-button--primary" type="submit" disabled={busy}>
            {busy ? "Signing in..." : "Sign in"}
          </button>
          <a className="view-button view-button--ghost" href="/register">
            Create account
          </a>
        </div>
      </form>
    </section>
  );
}

function RegisterPage() {
  const { register, busy, error, clearError } = useAuth();
  const [form, setForm] = useState<UserRegistrationInput>({
    name: "",
    email: "",
    password: "",
    phone: "",
    age: 30,
    homeLat: 12.9716,
    homeLong: 77.5946,
    addressLine1: "",
    addressLine2: "",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "",
    country: "India",
  });

  async function onSubmit(event: Event) {
    event.preventDefault();
    clearError();
    const result = await register(form);

    if (result.ok) {
      window.location.href = "/products";
    }
  }

  return (
    <section className="view-form-panel">
      <SectionHeader
        title="Create a MedRush customer account"
        summary="Registration writes directly to the current auth and user account contract so checkout can reuse the saved delivery address."
      />

      <form className="view-form" onSubmit={onSubmit}>
        <label>
          <span>Full name</span>
          <input
            required
            type="text"
            value={form.name}
            onInput={(event) => setForm((current) => ({
              ...current,
              name: (event.currentTarget as HTMLInputElement).value,
            }))}
          />
        </label>

        <div className="view-form__grid">
          <label>
            <span>Email</span>
            <input
              required
              type="email"
              value={form.email}
              onInput={(event) => setForm((current) => ({
                ...current,
                email: (event.currentTarget as HTMLInputElement).value,
              }))}
            />
          </label>

          <label>
            <span>Phone</span>
            <input
              required
              type="tel"
              value={form.phone}
              onInput={(event) => setForm((current) => ({
                ...current,
                phone: (event.currentTarget as HTMLInputElement).value,
              }))}
            />
          </label>
        </div>

        <div className="view-form__grid">
          <label>
            <span>Age</span>
            <input
              required
              min="1"
              type="number"
              value={String(form.age)}
              onInput={(event) => setForm((current) => ({
                ...current,
                age: Number((event.currentTarget as HTMLInputElement).value || "0"),
              }))}
            />
          </label>

          <label>
            <span>Password</span>
            <input
              required
              type="password"
              value={form.password}
              onInput={(event) => setForm((current) => ({
                ...current,
                password: (event.currentTarget as HTMLInputElement).value,
              }))}
            />
          </label>
        </div>

        <label>
          <span>Address line 1</span>
          <input
            required
            type="text"
            value={form.addressLine1}
            onInput={(event) => setForm((current) => ({
              ...current,
              addressLine1: (event.currentTarget as HTMLInputElement).value,
            }))}
          />
        </label>

        <label>
          <span>Address line 2</span>
          <input
            type="text"
            value={form.addressLine2 || ""}
            onInput={(event) => setForm((current) => ({
              ...current,
              addressLine2: (event.currentTarget as HTMLInputElement).value,
            }))}
          />
        </label>

        <div className="view-form__grid view-form__grid--triple">
          <label>
            <span>City</span>
            <input
              required
              type="text"
              value={form.city}
              onInput={(event) => setForm((current) => ({
                ...current,
                city: (event.currentTarget as HTMLInputElement).value,
              }))}
            />
          </label>

          <label>
            <span>State</span>
            <input
              required
              type="text"
              value={form.state}
              onInput={(event) => setForm((current) => ({
                ...current,
                state: (event.currentTarget as HTMLInputElement).value,
              }))}
            />
          </label>

          <label>
            <span>Pincode</span>
            <input
              required
              type="text"
              value={form.pincode}
              onInput={(event) => setForm((current) => ({
                ...current,
                pincode: (event.currentTarget as HTMLInputElement).value,
              }))}
            />
          </label>
        </div>

        <div className="view-form__grid">
          <label>
            <span>Latitude</span>
            <input
              required
              step="0.0001"
              type="number"
              value={String(form.homeLat)}
              onInput={(event) => setForm((current) => ({
                ...current,
                homeLat: Number((event.currentTarget as HTMLInputElement).value || "0"),
              }))}
            />
          </label>

          <label>
            <span>Longitude</span>
            <input
              required
              step="0.0001"
              type="number"
              value={String(form.homeLong)}
              onInput={(event) => setForm((current) => ({
                ...current,
                homeLong: Number((event.currentTarget as HTMLInputElement).value || "0"),
              }))}
            />
          </label>
        </div>

        {error ? (
          <div className="view-error-banner">
            <strong>{error.message}</strong>
            {error.hint ? <span>{error.hint}</span> : null}
          </div>
        ) : null}

        <div className="view-form__actions">
          <button className="view-button view-button--primary" type="submit" disabled={busy}>
            {busy ? "Creating account..." : "Create account"}
          </button>
          <a className="view-button view-button--ghost" href="/login">
            Back to login
          </a>
        </div>
      </form>
    </section>
  );
}

function ProductsPage(
  {
    products,
    loading,
    error,
    onRefresh,
    onAdd,
  }:
  {
    products: Product[];
    loading: boolean;
    error: ApiError | null;
    onRefresh: () => void;
    onAdd: (product: Product) => void;
  },
) {
  const [query, setQuery] = useState("");
  const [prescriptionOnly, setPrescriptionOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery = `${product.name} ${product.brand} ${product.category} ${product.description}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesPrescription = prescriptionOnly
        ? product.prescriptionRequired
        : true;
      const matchesStock = inStockOnly
        ? product.stockQuantity > 0
        : true;

      return matchesQuery && matchesPrescription && matchesStock;
    });
  }, [inStockOnly, prescriptionOnly, products, query]);

  return (
    <section className="view-stack">
      <SectionHeader
        title="Browse medicines"
        summary="Search and filter locally because the backend catalog endpoint does not parse query strings yet."
        actionLabel="Refresh catalog"
        onAction={onRefresh}
      />

      <div className="toolbar-card">
        <label className="toolbar-card__search">
          <span>Search products</span>
          <input
            type="search"
            value={query}
            placeholder="Search medicine, brand, or category"
            onInput={(event) => setQuery((event.currentTarget as HTMLInputElement).value)}
          />
        </label>

        <label className="toolbar-card__toggle">
          <input
            checked={prescriptionOnly}
            type="checkbox"
            onInput={(event) => setPrescriptionOnly((event.currentTarget as HTMLInputElement).checked)}
          />
          <span>Prescription only</span>
        </label>

        <label className="toolbar-card__toggle">
          <input
            checked={inStockOnly}
            type="checkbox"
            onInput={(event) => setInStockOnly((event.currentTarget as HTMLInputElement).checked)}
          />
          <span>In stock only</span>
        </label>
      </div>

      {loading ? (
        <StatePanel
          title="Loading medicine catalog"
          message="Syncing storefront data from GET /api/v1/medicines."
        />
      ) : null}

      {error ? (
        <StatePanel
          title="Catalog unavailable"
          message={`${error.message}${error.hint ? ` ${error.hint}` : ""}`}
          tone="danger"
        />
      ) : null}

      {!loading && filteredProducts.length === 0 ? (
        <StatePanel
          title="No medicines match this filter"
          message="Try broadening your local search or refresh when the backend catalog changes."
        />
      ) : (
        <div className="feature-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProductDetailPage(
  {
    route,
    products,
    onAdd,
  }:
  {
    route: ShopRouteState;
    products: Product[];
    onAdd: (product: Product) => void;
  },
) {
  const product = useMemo(() => {
    if (!route.productId) {
      return null;
    }

    return products.find((item) => item.id === route.productId)
      || getCachedProduct(route.productId);
  }, [products, route.productId]);

  if (!product) {
    return (
      <StatePanel
        title="Product detail unavailable"
        message="The backend does not expose a single-product endpoint yet, so this page depends on cached catalog data from the product list."
        tone="warning"
        actionLabel="Back to products"
        actionHref="/products"
      />
    );
  }

  return (
    <section className="view-stack">
      <SectionHeader
        title={product.name}
        summary="This detail page reuses catalog data already loaded into the storefront because a dedicated product endpoint is not available yet."
        actionLabel="Back to products"
        actionHref="/products"
      />

      <div className="detail-grid">
        <article className="detail-card">
          <span className="detail-card__eyebrow">Brand and category</span>
          <h3>{product.brand}</h3>
          <p>{product.category}</p>
        </article>

        <article className="detail-card">
          <span className="detail-card__eyebrow">Price and stock</span>
          <h3>{formatCurrency(product.price)}</h3>
          <p>{product.availabilityText}</p>
        </article>

        <article className="detail-card">
          <span className="detail-card__eyebrow">Prescription</span>
          <h3>{product.prescriptionRequired ? "Required" : "Not required"}</h3>
          <p>Badge driven from the public medicines payload.</p>
        </article>

        <article className="detail-card">
          <span className="detail-card__eyebrow">Partner</span>
          <h3>{product.partnerName || "Assigned later"}</h3>
          <p>Partner details are limited until order assignment is added on the backend.</p>
        </article>
      </div>

      <article className="detail-card detail-card--wide">
        <span className="detail-card__eyebrow">Description</span>
        <h3>Medicine overview</h3>
        <p>{product.description || "This medicine currently has a minimal description from the public catalog."}</p>
      </article>

      <div className="view-form__actions">
        <button className="view-button view-button--primary" type="button" onClick={() => onAdd(product)}>
          Add to cart
        </button>
        <a className="view-button view-button--ghost" href="/cart">
          Open cart
        </a>
      </div>
    </section>
  );
}

function CartPage() {
  const { items, totalItems, totalPrice, removeItem, setQuantity } = useCart();

  if (items.length === 0) {
    return (
      <StatePanel
        title="Your cart is empty"
        message="Add medicines from the storefront first. Cart storage is local until the backend exposes dedicated cart endpoints."
        actionLabel="Browse products"
        actionHref="/products"
      />
    );
  }

  return (
    <section className="view-stack">
      <SectionHeader
        title="Your cart"
        summary="Quantities live in localStorage for now because the backend does not provide a cart API yet."
        actionLabel="Proceed to checkout"
        actionHref="/checkout"
      />

      <div className="metric-grid">
        <article className="metric-card">
          <span>Items</span>
          <strong>{totalItems}</strong>
          <p>Total quantity across your cart.</p>
        </article>
        <article className="metric-card">
          <span>Lines</span>
          <strong>{items.length}</strong>
          <p>Distinct medicines saved locally.</p>
        </article>
        <article className="metric-card">
          <span>Estimated total</span>
          <strong>{formatCurrency(totalPrice)}</strong>
          <p>Final backend totals may differ if pricing changes before order placement.</p>
        </article>
      </div>

      <div className="cart-list">
        {items.map((item) => (
          <article className="cart-row" key={item.product.id}>
            <div className="cart-row__copy">
              <h3>{item.product.name}</h3>
              <p>{item.product.brand} | {formatCurrency(item.product.price)} each</p>
            </div>

            <div className="cart-row__controls">
              <label>
                <span>Quantity</span>
                <input
                  min="1"
                  type="number"
                  value={String(item.quantity)}
                  onInput={(event) => setQuantity(
                    item.product.id,
                    Math.max(1, Number((event.currentTarget as HTMLInputElement).value || "1")),
                  )}
                />
              </label>

              <strong>{formatCurrency(item.product.price * item.quantity)}</strong>

              <button
                className="view-button view-button--ghost"
                type="button"
                onClick={() => removeItem(item.product.id)}
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CheckoutPage(
  {
    session,
    placing,
    orderError,
    onPlace,
  }:
  {
    session: User;
    placing: boolean;
    orderError: ApiError | null;
    onPlace: (
      items: Array<{ medicineId: string; quantity: number }>,
    ) => Promise<Order | null>;
  },
) {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { updateProfile, busy, error, clearError } = useAuth();
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [form, setForm] = useState<UserProfileUpdateInput>({
    name: session.name,
    email: session.email,
    phone: session.phone,
    age: session.age || 30,
    homeLat: session.homeLatitude || 12.9716,
    homeLong: session.homeLongitude || 77.5946,
    addressLine1: session.address?.addressLine1 || "",
    addressLine2: session.address?.addressLine2 || "",
    city: session.address?.city || "Bengaluru",
    state: session.address?.state || "Karnataka",
    pincode: session.address?.pincode || "",
    country: session.address?.country || "India",
    password: "",
  });

  if (items.length === 0) {
    return (
      <StatePanel
        title="Cart required for checkout"
        message="Add products to the local cart before placing an order."
        tone="warning"
        actionLabel="Browse products"
        actionHref="/products"
      />
    );
  }

  async function onSubmit(event: Event) {
    event.preventDefault();
    clearError();
    setSavedMessage(null);

    const profileResult = await updateProfile(form);
    if (!profileResult.ok) {
      return;
    }

    const order = await onPlace(items.map((item) => ({
      medicineId: item.product.medicineId,
      quantity: item.quantity,
    })));

    if (order) {
      clearCart();
      setSavedMessage("Order placed successfully through POST /api/v1/user/order.");
      window.location.href = `/orders/${order.id}`;
    }
  }

  return (
    <section className="view-form-panel">
      <SectionHeader
        title="Checkout"
        summary="Address updates are sent first to the user account endpoint, then the order is placed through the current user order contract."
      />

      <div className="metric-grid">
        <article className="metric-card">
          <span>Items</span>
          <strong>{totalItems}</strong>
          <p>Total units included in this order.</p>
        </article>
        <article className="metric-card">
          <span>Lines</span>
          <strong>{items.length}</strong>
          <p>Distinct medicines in your local cart.</p>
        </article>
        <article className="metric-card">
          <span>Estimated total</span>
          <strong>{formatCurrency(totalPrice)}</strong>
          <p>Frontend estimate based on catalog pricing.</p>
        </article>
      </div>

      <form className="view-form" onSubmit={onSubmit}>
        <label>
          <span>Name</span>
          <input
            required
            type="text"
            value={form.name}
            onInput={(event) => setForm((current) => ({
              ...current,
              name: (event.currentTarget as HTMLInputElement).value,
            }))}
          />
        </label>

        <div className="view-form__grid">
          <label>
            <span>Email</span>
            <input
              required
              type="email"
              value={form.email}
              onInput={(event) => setForm((current) => ({
                ...current,
                email: (event.currentTarget as HTMLInputElement).value,
              }))}
            />
          </label>

          <label>
            <span>Phone</span>
            <input
              required
              type="tel"
              value={form.phone}
              onInput={(event) => setForm((current) => ({
                ...current,
                phone: (event.currentTarget as HTMLInputElement).value,
              }))}
            />
          </label>
        </div>

        <label>
          <span>Address line 1</span>
          <input
            required
            type="text"
            value={form.addressLine1}
            onInput={(event) => setForm((current) => ({
              ...current,
              addressLine1: (event.currentTarget as HTMLInputElement).value,
            }))}
          />
        </label>

        <label>
          <span>Address line 2</span>
          <input
            type="text"
            value={form.addressLine2 || ""}
            onInput={(event) => setForm((current) => ({
              ...current,
              addressLine2: (event.currentTarget as HTMLInputElement).value,
            }))}
          />
        </label>

        <div className="view-form__grid view-form__grid--triple">
          <label>
            <span>City</span>
            <input
              required
              type="text"
              value={form.city}
              onInput={(event) => setForm((current) => ({
                ...current,
                city: (event.currentTarget as HTMLInputElement).value,
              }))}
            />
          </label>

          <label>
            <span>State</span>
            <input
              required
              type="text"
              value={form.state}
              onInput={(event) => setForm((current) => ({
                ...current,
                state: (event.currentTarget as HTMLInputElement).value,
              }))}
            />
          </label>

          <label>
            <span>Pincode</span>
            <input
              required
              type="text"
              value={form.pincode}
              onInput={(event) => setForm((current) => ({
                ...current,
                pincode: (event.currentTarget as HTMLInputElement).value,
              }))}
            />
          </label>
        </div>

        <div className="view-form__grid">
          <label>
            <span>Latitude</span>
            <input
              required
              step="0.0001"
              type="number"
              value={String(form.homeLat)}
              onInput={(event) => setForm((current) => ({
                ...current,
                homeLat: Number((event.currentTarget as HTMLInputElement).value || "0"),
              }))}
            />
          </label>

          <label>
            <span>Longitude</span>
            <input
              required
              step="0.0001"
              type="number"
              value={String(form.homeLong)}
              onInput={(event) => setForm((current) => ({
                ...current,
                homeLong: Number((event.currentTarget as HTMLInputElement).value || "0"),
              }))}
            />
          </label>
        </div>

        {error ? (
          <div className="view-error-banner">
            <strong>{error.message}</strong>
            {error.hint ? <span>{error.hint}</span> : null}
          </div>
        ) : null}

        {orderError ? (
          <div className="view-error-banner">
            <strong>{orderError.message}</strong>
            {orderError.hint ? <span>{orderError.hint}</span> : null}
          </div>
        ) : null}

        {savedMessage ? (
          <div className="view-success-banner">
            {savedMessage}
          </div>
        ) : null}

        <div className="view-form__actions">
          <button className="view-button view-button--primary" type="submit" disabled={busy || placing}>
            {busy || placing ? "Placing order..." : "Place order"}
          </button>
        </div>
      </form>
    </section>
  );
}

function OrdersPage(
  {
    orders,
    loading,
    error,
    onRefresh,
  }:
  {
    orders: Order[];
    loading: boolean;
    error: ApiError | null;
    onRefresh: () => void;
  },
) {
  return (
    <section className="view-stack">
      <SectionHeader
        title="Your orders"
        summary="Order history comes from GET /api/v1/user/order, while single-order detail still relies on cached list data."
        actionLabel="Refresh orders"
        onAction={onRefresh}
      />

      {loading ? (
        <StatePanel
          title="Loading order history"
          message="Fetching customer orders from the backend."
        />
      ) : null}

      {error ? (
        <StatePanel
          title="Order history unavailable"
          message={`${error.message}${error.hint ? ` ${error.hint}` : ""}`}
          tone="danger"
        />
      ) : null}

      {!loading && orders.length === 0 ? (
        <StatePanel
          title="No orders yet"
          message="Place your first medicine order to see order history here."
        />
      ) : (
        <div className="feature-grid">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </section>
  );
}

function OrderDetailPage(
  {
    route,
    orders,
  }:
  {
    route: ShopRouteState;
    orders: Order[];
  },
) {
  const order = useMemo(() => {
    if (!route.orderId) {
      return null;
    }

    return orders.find((item) => item.id === route.orderId)
      || getCachedOrder(route.orderId);
  }, [orders, route.orderId]);

  if (!order) {
    return (
      <StatePanel
        title="Order detail unavailable"
        message="The backend does not expose a single-order endpoint yet, so this page uses cached order history data when possible."
        tone="warning"
        actionLabel="Back to orders"
        actionHref="/orders"
      />
    );
  }

  return (
    <section className="view-stack">
      <SectionHeader
        title={`Order ${order.id}`}
        summary="This detail page is assembled from the cached order list until the backend provides a dedicated order detail endpoint."
        actionLabel="Back to orders"
        actionHref="/orders"
      />

      <div className="detail-grid">
        <article className="detail-card">
          <span className="detail-card__eyebrow">Status</span>
          <h3>{order.status.replaceAll("_", " ")}</h3>
          <p>Backend fulfillment lifecycle is still limited.</p>
        </article>

        <article className="detail-card">
          <span className="detail-card__eyebrow">Total</span>
          <h3>{formatCurrency(order.total)}</h3>
          <p>Displayed from the latest cached order history response.</p>
        </article>

        <article className="detail-card">
          <span className="detail-card__eyebrow">Delivery address</span>
          <h3>Drop location</h3>
          <p>{formatAddress(order.deliveryAddress)}</p>
        </article>

        <article className="detail-card">
          <span className="detail-card__eyebrow">Assignment</span>
          <h3>{order.partnerId || "Partner pending"}</h3>
          <p>{order.agentId || "Agent pending"}</p>
        </article>
      </div>

      <article className="detail-card detail-card--wide">
        <span className="detail-card__eyebrow">Items</span>
        <h3>{order.items.length} line items</h3>
        <ul className="detail-list">
          {order.items.map((item) => (
            <li key={`${item.medicineId}-${item.name}`}>
              <strong>{item.name}</strong>
              <span>{item.quantity} units</span>
              <span>{formatCurrency(item.price)}</span>
            </li>
          ))}
        </ul>
      </article>

      <StatePanel
        title="Order actions are intentionally minimal"
        message="Cancel, reorder, payment retries, and delivery tracking depend on backend endpoints that are not available yet."
        tone="warning"
      />
    </section>
  );
}

function ProfilePage({ session }: { session: User }) {
  const { updateProfile, busy, error, clearError } = useAuth();
  const [saved, setSaved] = useState<string | null>(null);
  const [form, setForm] = useState<UserProfileUpdateInput>({
    name: session.name,
    email: session.email,
    phone: session.phone,
    age: session.age || 30,
    homeLat: session.homeLatitude || 12.9716,
    homeLong: session.homeLongitude || 77.5946,
    addressLine1: session.address?.addressLine1 || "",
    addressLine2: session.address?.addressLine2 || "",
    city: session.address?.city || "Bengaluru",
    state: session.address?.state || "Karnataka",
    pincode: session.address?.pincode || "",
    country: session.address?.country || "India",
    password: "",
  });

  async function onSubmit(event: Event) {
    event.preventDefault();
    clearError();
    setSaved(null);
    const result = await updateProfile(form);

    if (result.ok) {
      setSaved("Customer profile updated through PATCH /api/v1/user/account.");
      setForm((current) => ({ ...current, password: "" }));
    }
  }

  return (
    <section className="view-form-panel">
      <SectionHeader
        title="Customer profile"
        summary={`Current saved delivery address: ${formatAddress(session.address)}`}
      />

      <form className="view-form" onSubmit={onSubmit}>
        <label>
          <span>Name</span>
          <input
            required
            type="text"
            value={form.name}
            onInput={(event) => setForm((current) => ({
              ...current,
              name: (event.currentTarget as HTMLInputElement).value,
            }))}
          />
        </label>

        <div className="view-form__grid">
          <label>
            <span>Email</span>
            <input
              required
              type="email"
              value={form.email}
              onInput={(event) => setForm((current) => ({
                ...current,
                email: (event.currentTarget as HTMLInputElement).value,
              }))}
            />
          </label>

          <label>
            <span>Phone</span>
            <input
              required
              type="tel"
              value={form.phone}
              onInput={(event) => setForm((current) => ({
                ...current,
                phone: (event.currentTarget as HTMLInputElement).value,
              }))}
            />
          </label>
        </div>

        <label>
          <span>Address line 1</span>
          <input
            required
            type="text"
            value={form.addressLine1}
            onInput={(event) => setForm((current) => ({
              ...current,
              addressLine1: (event.currentTarget as HTMLInputElement).value,
            }))}
          />
        </label>

        <label>
          <span>Address line 2</span>
          <input
            type="text"
            value={form.addressLine2 || ""}
            onInput={(event) => setForm((current) => ({
              ...current,
              addressLine2: (event.currentTarget as HTMLInputElement).value,
            }))}
          />
        </label>

        <div className="view-form__grid view-form__grid--triple">
          <label>
            <span>City</span>
            <input
              required
              type="text"
              value={form.city}
              onInput={(event) => setForm((current) => ({
                ...current,
                city: (event.currentTarget as HTMLInputElement).value,
              }))}
            />
          </label>

          <label>
            <span>State</span>
            <input
              required
              type="text"
              value={form.state}
              onInput={(event) => setForm((current) => ({
                ...current,
                state: (event.currentTarget as HTMLInputElement).value,
              }))}
            />
          </label>

          <label>
            <span>Pincode</span>
            <input
              required
              type="text"
              value={form.pincode}
              onInput={(event) => setForm((current) => ({
                ...current,
                pincode: (event.currentTarget as HTMLInputElement).value,
              }))}
            />
          </label>
        </div>

        <div className="view-form__grid">
          <label>
            <span>Latitude</span>
            <input
              required
              step="0.0001"
              type="number"
              value={String(form.homeLat)}
              onInput={(event) => setForm((current) => ({
                ...current,
                homeLat: Number((event.currentTarget as HTMLInputElement).value || "0"),
              }))}
            />
          </label>

          <label>
            <span>Longitude</span>
            <input
              required
              step="0.0001"
              type="number"
              value={String(form.homeLong)}
              onInput={(event) => setForm((current) => ({
                ...current,
                homeLong: Number((event.currentTarget as HTMLInputElement).value || "0"),
              }))}
            />
          </label>
        </div>

        <label>
          <span>New password</span>
          <input
            type="password"
            value={form.password || ""}
            placeholder="Leave blank to keep the current password"
            onInput={(event) => setForm((current) => ({
              ...current,
              password: (event.currentTarget as HTMLInputElement).value,
            }))}
          />
        </label>

        {error ? (
          <div className="view-error-banner">
            <strong>{error.message}</strong>
            {error.hint ? <span>{error.hint}</span> : null}
          </div>
        ) : null}

        {saved ? (
          <div className="view-success-banner">
            {saved}
          </div>
        ) : null}

        <div className="view-form__actions">
          <button className="view-button view-button--primary" type="submit" disabled={busy}>
            {busy ? "Saving..." : "Save profile"}
          </button>
        </div>
      </form>
    </section>
  );
}

function RequireSession({ session }: { session: User | null }) {
  if (session) {
    return null;
  }

  return (
    <StatePanel
      title="Sign in required"
      message="Checkout, order history, and profile updates rely on a saved customer session in localStorage."
      tone="warning"
      actionLabel="Go to login"
      actionHref="/login"
    />
  );
}

function NotFoundPage() {
  return (
    <StatePanel
      title="Route not found"
      message="This MedRush Shop route does not exist yet. Use the navigation to return to the supported storefront pages."
      tone="warning"
      actionLabel="Back to products"
      actionHref="/products"
    />
  );
}

export function HomeView({ route }: HomeViewProps) {
  const { session, logout } = useAuth();
  const { addItem, totalItems } = useCart();
  const {
    loading: catalogLoading,
    error: catalogError,
    products,
    refresh: refreshCatalog,
  } = useCatalogSource();
  const {
    loading: ordersLoading,
    placing: ordersPlacing,
    error: ordersError,
    orders,
    refresh: refreshOrders,
    place,
  } = useOrdersSource(session?.token);

  useEffect(() => {
    if (["products", "product-detail", "cart", "checkout", "home"].includes(route.page)) {
      refreshCatalog();
    }
  }, [refreshCatalog, route.page]);

  useEffect(() => {
    if (
      session
      && ["orders", "order-detail", "checkout"].includes(route.page)
    ) {
      refreshOrders();
    }
  }, [refreshOrders, route.page, session]);

  const navigation = session
    ? [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: `Cart (${totalItems})`, href: "/cart" },
      { label: "Orders", href: "/orders" },
      { label: "Profile", href: "/profile" },
    ]
    : [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: `Cart (${totalItems})`, href: "/cart" },
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
    ];

  let content = <NotFoundPage />;

  if (route.page === "home") {
    content = <About session={session} />;
  }

  if (route.page === "login") {
    content = <LoginPage />;
  }

  if (route.page === "register") {
    content = <RegisterPage />;
  }

  if (route.page === "products") {
    content = (
      <ProductsPage
        products={products}
        loading={catalogLoading}
        error={catalogError}
        onRefresh={refreshCatalog}
        onAdd={(product) => addItem(product, 1)}
      />
    );
  }

  if (route.page === "product-detail") {
    content = (
      <ProductDetailPage
        route={route}
        products={products}
        onAdd={(product) => addItem(product, 1)}
      />
    );
  }

  if (route.page === "cart") {
    content = <CartPage />;
  }

  if (route.page === "checkout") {
    content = session ? (
      <CheckoutPage
        session={session.profile}
        placing={ordersPlacing}
        orderError={ordersError}
        onPlace={place}
      />
    ) : <RequireSession session={session?.profile || null} />;
  }

  if (route.page === "orders") {
    content = session ? (
      <OrdersPage
        orders={orders}
        loading={ordersLoading}
        error={ordersError}
        onRefresh={refreshOrders}
      />
    ) : <RequireSession session={session?.profile || null} />;
  }

  if (route.page === "order-detail") {
    content = session ? (
      <OrderDetailPage route={route} orders={orders} />
    ) : <RequireSession session={session?.profile || null} />;
  }

  if (route.page === "profile") {
    content = session ? (
      <ProfilePage session={session.profile} />
    ) : <RequireSession session={session?.profile || null} />;
  }

  return (
    <AppShell
      appName="Shop"
      strapline="Customer medicine storefront"
      navItems={navigation}
      currentPath={route.path}
      session={session}
      onLogout={() => {
        logout();
        window.location.href = "/";
      }}
    >
      {content}
    </AppShell>
  );
}
