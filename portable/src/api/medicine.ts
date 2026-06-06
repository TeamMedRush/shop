import { backendCaller } from "@api/base/backend";

export function medicinesByCategory(category: string) {
  return backendCaller.callApi("/medicines");
}

