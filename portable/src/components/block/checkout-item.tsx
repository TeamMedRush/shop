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

export function CheckoutItem({ count, details }: CheckoutItemProps) {
  return (
    <Container className={useClasses("medicine-card")}>
      <Container className={useClasses("medicine-card-image")}>
        {details.imageUrl && <img
          src={details.imageUrl}
          alt={details.name}
        />}

        {!details.imageUrl && <PharmacyCrossTagRegular
          className={useClasses("medicine-card-image-placeholder")}
        />}
      </Container>

      <Container className={useClasses("medicine-card-content")}>
        <Heading size="small" className={useClasses("medicine-card-name")}>
          {details.name}
        </Heading>

        <Container className={useClasses("medicine-card-price")}>
          {details.price.currency?.prefix && <Text
            className={useClasses("medicine-card-price-text")}
          >
            {details.price.currency.prefix}
          </Text>}

          {details.price.original
            && details.price.original !== details.price.final

            && (
            <Text
              className={useClasses(
                "medicine-card-price-text",
                "medicine-card-price-striked"
              )}
            >

            {details.price.original}
          </Text>)}

          <Text className={useClasses("medicine-card-price-text")}>
            {details.price.final}
          </Text>

          {details.price.currency?.suffix && <Text
            className={useClasses("medicine-card-price-text")}
          >
            {details.price.currency.suffix}
          </Text>}
        </Container>
      </Container>

      <CartActions
        medicine={details}
      />
    </Container>
  );
}

