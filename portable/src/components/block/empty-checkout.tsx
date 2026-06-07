import { ShoppingBagWarningRegular } from "@attaditya/iconoir-preact";
import { Button } from "@components/ui/interactive/button";
import { Link } from "@components/ui/interactive/link";
import { Container } from "@components/ui/structure/container";
import { Text } from "@components/ui/text/text";
import { useClasses } from "@styles";

export function EmptyCheckout() {
  return (
    <Container className={useClasses("empty-checkout")}>
      <ShoppingBagWarningRegular
        className={useClasses("empty-checkout-icon")}
      />

      <Text>
        Your cart is empty.
      </Text>

      <Link url="/">
        <Button>
          Start Shopping
        </Button>
      </Link>
    </Container>
  );
}

