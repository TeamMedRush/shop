import { Category } from "@components/block/category";
import { Hero } from "@components/block/hero";
import { Navbar } from "@components/block/navbar";
import { MedicineProvider } from "@contexts/medicine";

export function HomeView() {
  return (
    <>
      <Hero />
      <Navbar />
      <MedicineProvider>
        <Category
          title="Most Bought"
        />

        <Category
          title="First Aid"
        />

        <Category
          title="Essentials"
        />

        <Category
          title="Supplements"
        />
      </MedicineProvider>
    </>
  );
}

