import { QTList } from "./components.js";

export namespace TsunamiList {
  export type EntryTitle = "津波予報" |
    "津波注意報" | "津波注意報・津波予報" |
    "津波警報" | "津波警報・津波予報" | "津波警報・津波注意報" | "津波警報・津波注意報・津波予報" |
    "大津波警報" | "大津波警報・津波予報" | "大津波警報・津波注意報" | "大津波警報・津波注意報・津波予報" |
    "大津波警報・津波警報" | "大津波警報・津波警報・津波予報" | "大津波警報・津波警報・津波注意報" | "大津波警報・津波警報・津波注意報・津波予報" |
    "津波観測に関する情報" | "各地の満潮時刻・津波到達予想時刻に関する情報" | "沖合の津波観測に関する情報";

  export type TsunamiListEntry = {
    ctt: string; // Content Time
    eid: string; // Event ID
    rdt: string; // Report Date-Time (ISO8601)
    ttl: EntryTitle; // Title (ja)
    ift: QTList.EntryInfoType; // Info Type
    ser: `${number}` | 0; // Serial (sometimes number 0)
    at: string; // Announce Time (ISO8601)
    anm: string; // Area Name (ja)
    acd: string; // Area Code
    cod: string; // Coordinate String
    mag: string; // Magnitude Text
    kind: TsunamiKindEntry[]; // Advisory/Forecast Codes
    json: string; // Detail JSON Filename
    en_ttl?: string;
    en_anm?: string;
  };
}
