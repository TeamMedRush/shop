import { medicinesByCategory } from "@api/medicine";

export const APIS: {
  [apiId: string]: {
    caller: (...params: any[]) => unknown;
  };
} = {
  "medicinesByCategory": {
    caller: (category: string) => medicinesByCategory(category),
  }
}

