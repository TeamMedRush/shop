import { backendCaller } from "@api/base/backend";
import { MOCK_MEDICINES } from "@registry/mock";

export function medicinesByCategory(category: string) {
  return MOCK_MEDICINES.find(c => c.id === category);
  return backendCaller.callApi("/medicines");
}

