import { useCallback, useContext, useRef } from "preact/hooks";
import { ComponentChildren, createContext } from "preact";

import { medicinesByCategory } from "@api/medicine";
import { Category } from "@interfaces/medince";

type CategoryMap = {
  [categoryId: string]: Category;
}

interface MedicineMeta {
  getCategoryData: (categoryId: string) => Promise<Category | undefined>;
}

function createMedicineContext() {
  const MedicineContext = createContext<MedicineMeta | null>(null);

  function MedicineProvider({ children }: { children: ComponentChildren }) {
    const categories = useRef<CategoryMap>({}).current;

    const getCategoryData = useCallback(async (categoryId: string) => {
      if (categories[categoryId])
        return categories[categoryId];

      const categoryData = await medicinesByCategory(categoryId);

      if (categoryData)
        categories[categoryId] = categoryData;

      return categories[categoryId];
    }, [categories]);

    const value = {
      getCategoryData,
    };

    return <MedicineContext.Provider value={value}>
      {children}
    </MedicineContext.Provider>
  }

  function useMedicine(): MedicineMeta {
    return useContext(MedicineContext)!;
  }

  return { useMedicine, MedicineProvider };
}

export const {
  useMedicine,
  MedicineProvider,
} = createMedicineContext();

