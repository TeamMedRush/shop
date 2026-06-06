import { PharmacyCrossTagRegular } from "@attaditya/iconoir-preact";
import { Button } from "@components/ui/interactive/button";
import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { Text } from "@components/ui/text/text";
import { useClasses } from "@styles";

interface MedicineCardProps {
  name: string;
  imageUrl?: string;

  price: {
    currency?: {
      prefix?: string;
      suffix?: string;
    };

    original?: number;
    final: number;
  }
}

export function MedicineCard({
  name,
  imageUrl,
  price: {
    currency = {
      prefix: "",
      suffix: "INR",
    },
    original,
    final
  }
}: MedicineCardProps) {
  return (
    <Container className={useClasses("medicine-card")}>
      <Container className={useClasses("medicine-card-image")}>
        {imageUrl && <img src={imageUrl} alt={name} />}
        {!imageUrl && <PharmacyCrossTagRegular
          className={useClasses("medicine-card-image-placeholder")}
        />}
      </Container>

      <Container className={useClasses("medicine-card-content")}>
        <Heading size="medium">
          {name}
        </Heading>

        <Container className={useClasses("medicine-card-price")}>
          <Text>
            {currency.prefix}
          </Text>

          <Text className={useClasses("medicine-card-price-striked")}>
            {original}
          </Text>

          <Text>
            {final}
          </Text>

          <Text>
            {currency.suffix}
          </Text>
        </Container>
      </Container>

      <Container className={useClasses("medicine-card-actions")}>
        <Button
          className={useClasses(
            "medicine-card-action-full",
            "medicine-card-action-secondary",
          )}
        >
          View Details
        </Button>

        <Button className={useClasses("medicine-card-action-full")}>
          Add to Cart
        </Button>
      </Container>
    </Container>
  );
}

