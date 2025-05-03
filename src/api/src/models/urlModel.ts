export interface IUrlStat {
  createdAt: Date;
  visits: number;
  lastAccessedAt?: Date;
  deviceStats?: Record<string, number>;
  cpuStats?: Record<string, number>;
  typeStats?: Record<string, number>;
  browserStats?: Record<string, number>;
}
  
export interface IShortUrlRecord {
  longUrl: string;
  shortUrl: string;
  stats: IUrlStat;
}