import { Footer } from "@components/block/footer";
import { CartButton } from "@components/kit/cart-button";
import { Menu } from "@components/kit/menu";
import { MenuBrand } from "@components/kit/menu-brand";
import { ScrollTopButton } from "@components/kit/scroll-top-button";
import { ThemeButton } from "@components/kit/theme-button";
import { Container } from "@components/ui/structure/container";
import { Top } from "@components/ui/structure/top";
import { HomeView } from "@components/view/home-view";
import { CartProvider } from "@contexts/cart";
import { useForwarded } from "@utils/path";
import { type LayoutProps, useRouter } from "@utils/router";

function Layout({ dynamic, children }: LayoutProps) {
  return <>
    {children}
    {(!children && !dynamic) && (<Container>
      <Menu position="top-left">
        <MenuBrand />
      </Menu>

      <CartProvider>
        <Menu position="top-right">
          <ThemeButton />
          <CartButton />
          <ScrollTopButton />
        </Menu>

        <Top />
        <HomeView />
        <Footer />
      </CartProvider>
    </Container>)}
  </>;
}

export function HomePage() {
  return useRouter(useForwarded(), Layout, {});
}

