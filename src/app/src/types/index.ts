import { z } from "zod";
import { urlSchema } from "../schema";

export type StatType = {
  createdAt: Date;
  visits: number;
  lastAccessedAt?: Date;
  deviceStats?: Record<string, number>;
  cpuStats?: Record<string, number>;
  typeStats?: Record<string, number>;
  browserStats?: Record<string, number>;
}

export type URLItemType = {
  id: string;
  longUrl: string;
  shortUrl: string;
  stats: StatType;
}

export type EncodeUrlType = z.infer<typeof urlSchema>;

export type URLStateType = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  encodeUrl: (data: EncodeUrlType) => Promise<DefaultResponseType>;
  listUrls: () => Promise<DefaultResponseType>;
}

export type ModalType  = {
  children: React.ReactNode;
  onClose: () => void;
}

export type NotificationType = 'success' | 'error';

export type NotificationPropsType =  {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

export type DefaultResponseType = {
  message: string
  data: any
}
