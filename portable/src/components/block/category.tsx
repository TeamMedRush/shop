import { useEffect, useState } from "preact/compat";

import { MedicineCard } from "@components/block/medicine-card";
import { Section } from "@components/kit/section";
import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { useMedicine } from "@contexts/medicine";
import { Category } from "@interfaces/medince";
import { useClasses } from "@styles";

interface CategoryProps {
  id: string;
  title: string;
}

export function CategorySection({ id, title }: CategoryProps) {
  const { getCategoryData } = useMedicine();
  const [category, setCategory] = useState<Category | undefined>(undefined);

  useEffect(() => {
    getCategoryData(id).then(setCategory);
  }, [id, getCategoryData]);

  const medicines = category?.medicines || [];

  return (
    <Section>
      <Heading size="large">
        {title}
      </Heading>

      <Container className={useClasses("category-list")}>
        {medicines.map(medicine => (
          <MedicineCard
            key={medicine.id}
            medicine={medicine}
          />
        ))}
      </Container>
    </Section>
  );
}

