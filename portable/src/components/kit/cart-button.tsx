import { MenuButton } from "@components/kit/menu-button";
import { Link } from "@components/ui/interactive/link";

export function CartButton() {
  return (<>
    <Link url="/cart">
      <MenuButton
        icon="ShoppingBagRegular"
      />
    </Link>
  </>);
}

