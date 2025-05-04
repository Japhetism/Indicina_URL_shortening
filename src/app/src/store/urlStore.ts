import { create } from "zustand";
import { IEncodeUrl, IURLState } from "../interfaces";
import { apiService } from "../service/apiService";

export const useURLStore = create<IURLState>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  encodeUrl: async (requestData: IEncodeUrl) => {
    set({ isLoading: true })
    try {
      const response = await apiService<IEncodeUrl, any>({
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