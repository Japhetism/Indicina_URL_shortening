import { create } from "zustand";
import { EncodeUrlType, URLStateType } from "../types";
import { apiService } from "../service/apiService";

export const useURLStore = create<URLStateType>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  encodeUrl: async (requestData: EncodeUrlType) => {
    set({ isLoading: true })
    try {
      const response = await apiService<EncodeUrlType, any>({
        method: "POST",
        url: "encode",
        data: requestData,
      })
      const { data } = response.data;
      return data;
    } catch (err) {
      throw err;
    } finally {
      set({ isLoading: false })
    }
  }
}));

export default useURLStore;