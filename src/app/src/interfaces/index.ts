export interface IStat {
  createdAt: Date;
  visits: number;
  lastAccessedAt?: Date;
  deviceStats?: Record<string, number>;
  cpuStats?: Record<string, number>;
  typeStats?: Record<string, number>;
  browserStats?: Record<string, number>;
}

export interface IURLItem {
  id: string;
  longUrl: string;
  shortUrl: string;
  stats: IStat
}

export interface IEncodeUrl {
  longUrl: string
}

export interface IURLState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  encodeUrl: (data: IEncodeUrl) => Promise<any>;
}

export interface IModal {
  children: React.ReactNode;
  onClose: () => void;
}