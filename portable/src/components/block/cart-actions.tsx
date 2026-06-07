import { MinusRegular, PlusRegular } from "@attaditya/iconoir-preact";
import { Button } from "@components/ui/interactive/button";
import { Container } from "@components/ui/structure/container";
import { useCart } from "@contexts/cart";
import { Medicine } from "@interfaces/medince";
import { useClasses } from "@styles";

interface CartActionsProps {
  medicine: Medicine;
}

export function CartActions({ medicine }: CartActionsProps) {
  const {
    entries,
    addToCart,
    removeFromCart,
  } = useCart();

  const entry = entries[medicine.id];

  return (<>
    <Container className={useClasses("cart-actions")}>
      {(!entry || !entry.count) && <Button
        className={useClasses("cart-action-full")}
        onClick={() => addToCart(medicine)}
      >
        Add to Cart
      </Button>}

      {entry && entry.count > 0 && <>
        <Button
          className={useClasses("cart-action-square")}
          onClick={() => removeFromCart(medicine.id)}
        >
          <MinusRegular className={useClasses("cart-action-icon")} />
        </Button>

        <Button
          disabled={true}

          className={useClasses(
            "cart-action-full",
            "cart-action-secondary",
          )}
        >
          {entry.count}
        </Button>

        <Button
          className={useClasses("cart-action-square")}
          onClick={() => addToCart(medicine)}
        >
          <PlusRegular className={useClasses("cart-action-icon")} />
        </Button>
      </>}
    </Container>
  </>);
}

