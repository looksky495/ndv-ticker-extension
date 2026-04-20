import type { QT } from "./components.js";

export namespace VTSE41 {
  export interface Report extends QT.Report {
    Control: Control;
    Head:    Head;
    Body:    Body;
  }

  export interface Control extends QT.Control {
    Title: "津波警報・注意報・予報a";
  }

  export interface Head extends QT.Head {
    Title: "津波予報" | "津波注意報" | "津波注意報・津波予報" |
      "津波警報" | "津波警報・津波予報" | "津波警報・津波注意報" | "津波警報・津波注意報・津波予報" |
      "大津波警報" | "大津波警報・津波予報" | "大津波警報・津波注意報" | "大津波警報・津波注意報・津波予報" |
      "大津波警報・津波警報" | "大津波警報・津波警報・津波予報" | "大津波警報・津波警報・津波注意報" | "大津波警報・津波警報・津波注意報・津波予報";
    ValidDateTime: string;
    InfoKind: "津波警報・注意報・予報";
    Serial: null;
  }

  export type TsunamiQuake = QT.DetailedEarthquake | QT.DetailedDomesticEarthquake;

  export interface Body extends Required<Pick<QT.Body, "Earthquake" | "Comments">> {
    Earthquake: TsunamiQuake[];
    Tsunami: Tsunami;
  }

  export interface Tsunami {
    Forecast: {
      CodeDefine: {
        Type: "警報等情報要素／津波警報・注意報・予報";
      };
      Item: TsunamiForecastItem[];
    };
  }

  export interface TsunamiForecastItem {
    Area: {
      Name: string;
      Code: string;
      enName: string;
    }
    Category: {
      Kind: TsunamiForecastKind;
      LastKind: TsunamiForecastKind;
    }
    FirstHeight?: QT.TsunamiForecastFirstHeight;
    MaxHeight?: {
      Condition?: "重要";
      TsunamiHeight: ">10" | "10" | "5" | "3" | "1" | "<0.2" | "巨大" | "高い";
      Revise?: "更新" | "追加";
    }
  }

  export interface TsunamiForecastKind {
    Name: string;
    Code: string;
    enName: string;
  }
}