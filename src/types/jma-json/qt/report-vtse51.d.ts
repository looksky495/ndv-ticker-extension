import type { QT } from "./components.js";

export namespace VTSE51 {
  export interface Report extends QT.Report {
    Control: Control;
    Head:    Head;
    Body:    Body;
  }

  export interface Control extends QT.Control {
    Title: "津波情報a";
  }

  export interface Head extends QT.Head {
    Title: "各地の満潮時刻・津波到達予想時刻に関する情報" | "津波観測に関する情報";
    InfoKind: "津波情報";
    Serial: `${number}`;
  }

  export type TsunamiQuake = QT.DetailedEarthquake | QT.DetailedDomesticEarthquake;

  export interface Body extends Required<Pick<QT.Body, "Earthquake" | "Comments">> {
    Earthquake: TsunamiQuake[];
    Tsunami: Tsunami;
  }

  export interface Tsunami {
    Observation?: {
      CodeDefine: {
        Type: "潮位観測点";
      }
      Item: TsunamiObservationItem[];
    }
    Forecast: {
      CodeDefine: {
        Type: "潮位観測点";
      }
      Item: TsunamiForecastItemBase[] | TsunamiForecastItemAppend[];
    }
  }

  export interface TsunamiForecastItemBase {
    Area: {
      Name: string;
      Code: string;
      enName: string;
    }
    Category: {
      Kind: TsunamiForecastKind;
      LastKind: TsunamiForecastKind;
    }
  }

  // type TsunamiForecastItemFirstHeight = {
  //   Revise?: "更新" | "追加";
  // } & ({
  //   ArrivalTime: string;
  //   Condition?: "ただちに津波来襲と予測";
  // } | {
  //   Condition: "津波到達中と推測" | "第１波の到達を確認"
  // });

  export type TsunamiForecastItemAppend = TsunamiForecastItemBase & ({
    MaxHeight: {
      TsunamiHeight: "<0.2";
      Revise?: "更新" | "追加";
    }
  } | {
    MaxHeight: {
      TsunamiHeight: ">10" | "10" | "5" | "3" | "1" | "巨大" | "高い";
      Condition?: "重要";
      Revise?: "更新" | "追加";
    }
    FirstHeight: {
      Revise?: "更新" | "追加";
    } & ({
      ArrivalTime: string;
      Condition?: "ただちに津波来襲と予測";
    } | {
      Condition: "津波到達中と推測" | "第１波の到達を確認"
    });
    Station: TsunamiForecastStation[];
  });

  export interface TsunamiForecastKind {
    Name: string;
    Code: string;
    enName: string;
  }

  export interface TsunamiForecastStation {
    Name: string;
    Code: string;
    HighTideDateTime: string;
    FirstHeight: QT.TsunamiForecastFirstHeight;
    latlon: {
      lat: number;
      lon: number;
    }
    enName: string;
  }

  export interface TsunamiObservationItem {
    Area: {
      Name: string;
      Code: string;
      enName: string;
    }
    Station: TsunamiObservationStation[];
  }

  export interface TsunamiObservationStation {
    Name: string;
    Code: string;
    FirstHeight: ({
      Condition: "第１波識別不能" | "欠測";
    } | {
      ArrivalTime: string;
      Initial: "押し" | "引き";
    }) & {
      Revise?: "更新" | "追加";
    }
    MaxHeight?: ({
      DateTime: string;
      TsunamiHeight: `${number}` | `≧${number}` | `${number}+` | `≧${number}+`;
      Condition?: "欠測" | "重要　欠測";
    } | {
      DateTime: string;
      Condition: "微弱" | "微弱　欠測";
    } | {
      Condition: "観測中" | "観測中　欠測"
    }) & {
      Revise?: "更新" | "追加";
    }
    latlon: {
      lat: number;
      lon: number;
    }
    enName: string;
  }
}
