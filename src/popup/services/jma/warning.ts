import { TrafficTracker } from "../../ui/traffic-tracker.ts";
import type { AreaOperator } from "./common.ts";

/**
 * JMA bosai の `warning/data/r8/map.json` に含まれる 1 電文分のデータ。
 * 本モジュールで参照するプロパティのみを定義している。
 */
export type WarnDataMapItem = {
  reportDatetime: string;
  publishingOffice: string;
  warning: {
    /** 一次細分区域ごとの発表状況。発表対象がない電文には存在しない */
    class10Items?: {
      areaCode: string;
      kinds: {
        /** 警報・注意報コード（`warnCodesNew` のキー）。「発表警報・注意報はなし」のときは存在しない */
        code?: string;
        status: string;
      }[];
    }[];
  };
};

type WarnCurrentState = {
  area: any[];
  lastUpdated: number;
  /** 注意報まで含めた全ての発表状況のテキスト */
  textAll: string;
  /** 警報（レベル３）以上に絞った発表状況のテキスト */
  textLvl3: string;
};

export type WarningEventType = "report";

type WarningReportDetail = {
  state: WarnCurrentState;
};

type WarningReportListener = (state: WarnCurrentState) => void;

// Source: 気象庁ホームページ（レベル表記を含む新しい警報・注意報コード表）
export const warnCodesNew: Record<string, { shortNameParts: string[]; nameParts: string[]; elem: string; level: number }> = {
  "10": { shortNameParts: ["レベル２"], nameParts: ["レベル２", "大雨", "注意報"], elem: "rain", level: 20 },
  "12": { shortNameParts: ["注"], nameParts: ["大雪", "注意報"], elem: "snow", level: 20 },
  "13": { shortNameParts: ["注"], nameParts: ["風雪", "注意報"], elem: "wind_snow", level: 20 },
  "14": { shortNameParts: ["注"], nameParts: ["雷", "注意報"], elem: "thunder", level: 20 },
  "15": { shortNameParts: ["注"], nameParts: ["強風", "注意報"], elem: "wind", level: 20 },
  "16": { shortNameParts: ["注"], nameParts: ["波浪", "注意報"], elem: "wave", level: 20 },
  "17": { shortNameParts: ["注"], nameParts: ["融雪", "注意報"], elem: "snow_melting", level: 20 },
  "18": { shortNameParts: ["注"], nameParts: ["洪水", "注意報"], elem: "flood", level: 20 },
  "19": { shortNameParts: ["レベル２"], nameParts: ["レベル２", "高潮", "注意報"], elem: "tide", level: 20 },
  "20": { shortNameParts: ["注"], nameParts: ["濃霧", "注意報"], elem: "fog", level: 20 },
  "21": { shortNameParts: ["注"], nameParts: ["乾燥", "注意報"], elem: "dry", level: 20 },
  "22": { shortNameParts: ["注"], nameParts: ["なだれ", "注意報"], elem: "avalanche", level: 20 },
  "23": { shortNameParts: ["注"], nameParts: ["低温", "注意報"], elem: "cold", level: 20 },
  "24": { shortNameParts: ["注"], nameParts: ["霜", "注意報"], elem: "frost", level: 20 },
  "25": { shortNameParts: ["注"], nameParts: ["着氷", "注意報"], elem: "ice_accretion", level: 20 },
  "26": { shortNameParts: ["注"], nameParts: ["着雪", "注意報"], elem: "snow_accretion", level: 20 },
  "29": { shortNameParts: ["レベル２"], nameParts: ["レベル２", "土砂災害", "注意報"], elem: "landslide", level: 20 },
  "32": { shortNameParts: ["特"], nameParts: ["暴風雪", "特別警報"], elem: "wind_snow", level: 50 },
  "33": { shortNameParts: ["レベル５"], nameParts: ["レベル５", "大雨", "特別警報"], elem: "rain", level: 50 },
  "35": { shortNameParts: ["特"], nameParts: ["暴風", "特別警報"], elem: "wind", level: 50 },
  "36": { shortNameParts: ["特"], nameParts: ["大雪", "特別警報"], elem: "snow", level: 50 },
  "37": { shortNameParts: ["特"], nameParts: ["波浪", "特別警報"], elem: "wave", level: 50 },
  "38": { shortNameParts: ["レベル５"], nameParts: ["レベル５", "高潮", "特別警報"], elem: "tide", level: 50 },
  "39": { shortNameParts: ["レベル５"], nameParts: ["レベル５", "土砂災害", "特別警報"], elem: "landslide", level: 50 },
  "43": { shortNameParts: ["レベル４"], nameParts: ["レベル４", "大雨", "危険警報"], elem: "rain", level: 40 },
  "48": { shortNameParts: ["レベル４"], nameParts: ["レベル４", "高潮", "危険警報"], elem: "tide", level: 40 },
  "49": { shortNameParts: ["レベル４"], nameParts: ["レベル４", "土砂災害", "危険警報"], elem: "landslide", level: 40 },
  "03": { shortNameParts: ["レベル３"], nameParts: ["レベル３", "大雨", "警報"], elem: "rain", level: 30 },
  "09": { shortNameParts: ["レベル３"], nameParts: ["レベル３", "土砂災害", "警報"], elem: "landslide", level: 30 },
  "08": { shortNameParts: ["レベル３"], nameParts: ["レベル３", "高潮", "警報"], elem: "tide", level: 30 },
  "05": { shortNameParts: ["警"], nameParts: ["暴風", "警報"], elem: "wind", level: 30 },
  "02": { shortNameParts: ["警"], nameParts: ["暴風雪", "警報"], elem: "wind_snow", level: 30 },
  "06": { shortNameParts: ["警"], nameParts: ["大雪", "警報"], elem: "snow", level: 30 },
  "04": { shortNameParts: ["警"], nameParts: ["洪水", "警報"], elem: "flood", level: 30 },
  "07": { shortNameParts: ["警"], nameParts: ["波浪", "警報"], elem: "wave", level: 30 }
};

export class WarnCurrentOperator extends EventTarget {
  private url = "https://www.jma.go.jp/bosai/warning/data/r8/map.json";
  private tracker = new TrafficTracker("JMA / Warning / map.json");
  private readonly areaOperator: AreaOperator;

  data: WarnCurrentState = {
    area: [],
    lastUpdated: 0,
    // サンプルの文章に現実の地名入ってたら怒られそうなので
    textAll: "（＊サンプル文章＊）　【セイライ島】 大雨警報・雷注意報　　【下風蝕地】 乾燥注意報　　【フォンテーヌ邸地区】 大雨特別警報・洪水危険警報・波浪警報　（インターネット接続を確認してください）",
    textLvl3: "こちらは警報（レベル３）以上の情報一覧です。"
  };

  constructor (areaOperator: AreaOperator){
    super();
    this.areaOperator = areaOperator;
  }

  subscribe (eventType: WarningEventType, listener: WarningReportListener){
    const eventListener: EventListener = (event) => {
      const detail = (event as CustomEvent<WarningReportDetail>).detail;
      listener(detail.state);
    };
    this.addEventListener(eventType, eventListener);
    return () => this.removeEventListener(eventType, eventListener);
  }

  notifyUpdate (){
    this.dispatchEvent(new CustomEvent<WarningReportDetail>("report", { detail: { state: this.data } }));
  }

  async load(){
    const areaData = await this.areaOperator.getData();
    await fetch(this.url + "?_=" + Date.now()).then(async res => {
      this.tracker.update();

      const lastModified = new Date(res.headers.get("Last-Modified") as string).getTime() / 1000;
      if (this.data.lastUpdated === lastModified) return null; // 更新されていない場合は終了

      // 同じ一次細分区域が複数の電文（警報種別ごとに分かれている）に現れるため、areaCode をキーにコードを集約する
      const all: Record<string, string[]> = {};
      const warnData = await res.json() as WarnDataMapItem[];
      for (const report of warnData){
        if (!report.warning.class10Items) continue;

        for (const area of report.warning.class10Items){
          const areaCode = area.areaCode;

          for (const kind of area.kinds){
            if (kind.status === "解除") continue;
            if (!kind.code) continue; // 発表がない区域はコードを持たない

            if (!all[areaCode]) all[areaCode] = [];
            all[areaCode].push(kind.code);
          }
        }
      }

      const allArray = Object.entries(all).sort((a, b) => Number(a[0]) - Number(b[0])); // areaCode 順にソート
      const warnListAll: string[] = [];
      const warnListLvl3: string[] = [];
      for (const [areaCode, codes] of allArray){
        const warnAll = codes.map(code => {
          const warn = warnCodesNew[code];
          return warn.nameParts.join("");
        }).join("・");
        const warnLvl3 = codes.filter(code => {
          const warn = warnCodesNew[code];
          return warn.level >= 30;
        }).map(code => {
          const warn = warnCodesNew[code];
          return warn.nameParts.join("");
        }).join("・");

        const class10s = areaData.class10s[areaCode];
        const offices = areaData.offices[class10s.parent];
        const head2 = areaCode.slice(0, 2); // コード先頭2文字
        const pointName = ((["13", "27", "37"].includes(head2) || ["460030", "472000", "473000", "474010", "474020"].includes(areaCode)) ? "" : (["01", "46", "47"].includes(head2) ? {"01": "北海道", "46": "鹿児島県", "47": "沖縄県"}[head2] : offices.name)) + class10s.name;

        warnListAll.push("【" + pointName + "】 " + warnAll);
        if (warnLvl3) warnListLvl3.push("【" + pointName + "】 " + warnLvl3);
      }

      this.data.textAll = warnListAll.length ? warnListAll.join("　　") : "なんと、気象警報が発表されている地域はありません。";
      this.data.textLvl3 = warnListLvl3.length ? warnListLvl3.join("　　") : "気象警報（レベル３）以上が発表されている地域はありません。";
      this.notifyUpdate();
      this.data.lastUpdated = lastModified;
    });
  }
}
