import { MedicineCard } from "@components/block/medicine-card";
import { Section } from "@components/kit/section";
import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { useClasses } from "@styles";

interface CategoryProps {
  title: string;
}

export function Category({
  title
}: CategoryProps) {
  return (
    <Section>
      <Heading size="large">
        {title}
      </Heading>

      <Container className={useClasses("category-list")}>
        <MedicineCard
          name="Paracetamol"

          price={{
            original: 100,
            final: 80,
          }}
        />

        <MedicineCard
          name="Ibuprofen"

          price={{
            final: 120,
          }}
        />

        <MedicineCard
          name="Amoxicillin"

          price={{
            original: 200,
            final: 150,
          }}
        />
      </Container>
    </Section>
  );
}

