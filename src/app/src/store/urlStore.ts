import { create } from "zustand";
import { DefaultResponseType, EncodeUrlType, URLStateType } from "../types";
import { apiService } from "../service/apiService";

export const useURLStore = create<URLStateType>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  encodeUrl: async (requestData: EncodeUrlType): Promise<DefaultResponseType> => {
    set({ isLoading: true })
    try {
      const response = await apiService<EncodeUrlType, DefaultResponseType>({
        method: "POST",
        url: "encode",
        data: requestData,
      })
      return response.data;
    } catch (err) {
      throw err;
    } finally {
      set({ isLoading: false })
    }
  },
  listUrls: async (): Promise<DefaultResponseType> =>{
    set({ isLoading: true })
    try {
      const response = await apiService<void, DefaultResponseType>({
        method: "GET",
        url: "list",
      })
      return response.data;
    } catch (err) {
      throw err;
    } finally {
      set({ isLoading: false })
    }
  }
}));

export default useURLStore;