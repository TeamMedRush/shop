import { PharmacyCrossTagRegular } from "@attaditya/iconoir-preact";
import { CartActions } from "@components/block/cart-actions";
import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { Text } from "@components/ui/text/text";
import { Medicine } from "@interfaces/medince";
import { useClasses } from "@styles";

interface CheckoutItemProps {
  count: number;
  details: Medicine;
}

export function CheckoutItem({ details }: CheckoutItemProps) {
  return (
    <Container className={useClasses("checkout-item")}>
      <Container className={useClasses("checkout-item-image")}>
        {details.imageUrl && <img
          src={details.imageUrl}
          alt={details.name}
        />}

        {!details.imageUrl && <PharmacyCrossTagRegular
          className={useClasses("checkout-item-image-placeholder")}
        />}
      </Container>

        <Container className={useClasses("checkout-item-content")}>
          <Heading size="small" className={useClasses("checkout-item-name")}>
            {details.name}
          </Heading>

          <Container className={useClasses("checkout-item-price")}>
            {details.price.currency?.prefix && <Text
              className={useClasses("checkout-item-price-text")}
            >
              {details.price.currency.prefix}
            </Text>}

            {details.price.original
              && details.price.original !== details.price.final

              && (
              <Text
                className={useClasses(
                  "checkout-item-price-text",
                  "checkout-item-price-striked"
                )}
              >

              {details.price.original}
            </Text>)}

            <Text className={useClasses("checkout-item-price-text")}>
              {details.price.final}
            </Text>

            {details.price.currency?.suffix && <Text
              className={useClasses("checkout-item-price-text")}
            >
              {details.price.currency.suffix}
            </Text>}
          </Container>
        </Container>

      <Container className={useClasses("checkout-item-details")}>
        <CartActions
          medicine={details}
        />
      </Container>
    </Container>
  );
}

