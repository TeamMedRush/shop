import { CategorySection } from "@components/block/category";
import { Hero } from "@components/block/hero";
import { Navbar } from "@components/block/navbar";
import { MedicineProvider } from "@contexts/medicine";

export function HomeView() {
  return (
    <>
      <Hero />
      <Navbar />
      <MedicineProvider>
        <CategorySection
          id="most-bought"
          title="Most Bought"
        />

        <CategorySection
          id="first-aid"
          title="First Aid"
        />

        <CategorySection
          id="essentials"
          title="Essentials"
        />

        <CategorySection
          id="supplements"
          title="Supplements"
        />
      </MedicineProvider>
    </>
  );
}

