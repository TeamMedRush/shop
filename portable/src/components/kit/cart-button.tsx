import { MenuButton } from "@components/kit/menu-button";
import { Link } from "@components/ui/interactive/link";
import { useCart } from "@contexts/cart";

export function CartButton() {
  const { count } = useCart();

  return (<>
    <Link url="/cart">
      <MenuButton
        icon="ShoppingBagRegular"
        badge={count}
      />
    </Link>
  </>);
}

