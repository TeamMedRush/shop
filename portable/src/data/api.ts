import { medicinesByCategory } from "@api/medicine";

export const APIS = {
  "medicinesByCategory": {
    caller: (category: string) => medicinesByCategory(category),
  }
}

