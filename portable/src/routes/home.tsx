import { type ShopRouteState, HomeView } from "@components/view/home-view";
import { useForwarded } from "@utils/path";

function resolveRoute(forwarded: string[]): ShopRouteState {
  const path = `/${forwarded.join("/")}`;

  if (forwarded.length === 0) {
    return { page: "home", path: "/" };
  }

  if (forwarded.length === 1) {
    const segment = forwarded[0];

    if (segment === "login") {
      return { page: "login", path };
    }

    if (segment === "register") {
      return { page: "register", path };
    }

    if (segment === "products") {
      return { page: "products", path };
    }

    if (segment === "cart") {
      return { page: "cart", path };
    }

    if (segment === "checkout") {
      return { page: "checkout", path };
    }

    if (segment === "orders") {
      return { page: "orders", path };
    }

    if (segment === "profile") {
      return { page: "profile", path };
    }
  }

  if (forwarded.length === 2 && forwarded[0] === "products") {
    return {
      page: "product-detail",
      path,
      productId: forwarded[1],
    };
  }

  if (forwarded.length === 2 && forwarded[0] === "orders") {
    return {
      page: "order-detail",
      path,
      orderId: forwarded[1],
    };
  }

  return { page: "not-found", path };
}

export function HomePage() {
  const forwarded = useForwarded();
  return <HomeView route={resolveRoute(forwarded)} />;
}

