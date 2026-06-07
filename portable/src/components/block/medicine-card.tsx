import { PharmacyCrossTagRegular } from "@attaditya/iconoir-preact";
import { CartActions } from "@components/block/cart-actions";
import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { Text } from "@components/ui/text/text";
import { Medicine } from "@interfaces/medince";
import { useClasses } from "@styles";

interface MedicineCardProps {
  medicine: Medicine;
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  return (
    <Container className={useClasses("medicine-card")}>
      <Container className={useClasses("medicine-card-image")}>
        {medicine.imageUrl && <img
          src={medicine.imageUrl}
          alt={medicine.name}
        />}

        {!medicine.imageUrl && <PharmacyCrossTagRegular
          className={useClasses("medicine-card-image-placeholder")}
        />}
      </Container>

      <Container className={useClasses("medicine-card-content")}>
        <Heading size="small" className={useClasses("medicine-card-name")}>
          {medicine.name}
        </Heading>

        <Container className={useClasses("medicine-card-price")}>
          {medicine.price.currency?.prefix && <Text
            className={useClasses("medicine-card-price-text")}
          >
            {medicine.price.currency.prefix}
          </Text>}

          {medicine.price.original
            && medicine.price.original !== medicine.price.final

            && (
            <Text
              className={useClasses(
                "medicine-card-price-text",
                "medicine-card-price-striked"
              )}
            >

            {medicine.price.original}
          </Text>)}

          <Text className={useClasses("medicine-card-price-text")}>
            {medicine.price.final}
          </Text>

          {medicine.price.currency?.suffix && <Text
            className={useClasses("medicine-card-price-text")}
          >
            {medicine.price.currency.suffix}
          </Text>}
        </Container>
      </Container>

      <CartActions
        medicine={medicine}
      />
    </Container>
  );
}

