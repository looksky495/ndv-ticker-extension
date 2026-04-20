import { Component } from "../components.js";

export namespace QT {
  export interface Report {
    Control: Control;
    Head:    Head;
    Body:    Body;
  }

  export interface Control {
    Title:            string;
    DateTime:         string;
    Status:           Status;
    EditorialOffice:  string;
    PublishingOffice: string;
  }

  export enum Status {
    NORMAL = "通常",
    DRILL  = "訓練",
    TEST   = "試験",
  }

  export interface Head {
    Title:           string;
    ReportDateTime:  string;
    TargetDateTime:  string;
    EventID:         string;
    InfoType:        "発表" | "訂正" | "遅延" | "取消";
    Serial:          `${number}` | null;
    InfoKind:        string;
    InfoKindVersion: string;
    Headline:        Headline;
    enTitle:         string;
  }

  export interface Headline {
    Text: string;
  }

  export interface Body {
    Earthquake?:     Earthquake;
    Intensity?:      Intensity;
    Comments?:       Comments;
    EarthquakeInfo?: EarthquakeInfo;
    Text?:           string;
  }

  // 震源要素不明はおそらく想定されていない
  export interface Earthquake {
    OriginTime:  string;
    ArrivalTime: string;
    Hypocenter: {
      Area: {
        Name:       string;
        Code:       string;
        Coordinate: string;
        enName:     string;
      }
    }
    Magnitude: `${Component.Digit}.${Component.Digit}` | "Ｍ８を超える巨大地震" | "不明";
  }

  export interface DetailedEarthquake extends Earthquake {
    Hypocenter: {
      Area: {
        DetailedName: string;
        DetailedCode: string;
      }
      Source: EpicenterSource;
    }
  }

  export interface DetailedDomesticEarthquake extends Earthquake {
    Hypocenter: {
      Area: {
        NameFromMark: string;
        MarkCode:     string;
        Direction:    string;
        Distance:     `${number}`;
      }
    }
  }


  export interface Intensity {
    Observation: {
      MaxInt: ShortIntCode;
      Pref: IntensityObsPref[];
    };
  }

  export interface IntensityObsPref {
    Name:   string;
    Code:   string;
    MaxInt: ShortIntCode;
    Area:   IntensityObsArea[];
    enName: string;
  }

  export interface IntensityObsArea {
    Name:   string;
    Code:   string;
    MaxInt: ShortIntCode;
    City?:  IntensityObsCity[] | never;
    enName: string;
  }

  export interface IntensityObsCity {
    Name:   string;
    Code:   string;
    MaxInt: ShortIntCode;
    IntensityStation: IntensityObsStation[];
    enName: string;
  }

  export interface IntensityObsStation {
    Name:   string;
    Code:   string;
    Int:    ShortIntCode;
    latlon: {
      lat: number;
      lon: number;
    };
    enName: string;
  }


  export interface Comments {
    WarningComment?:  WarningComment;
    ForecastComment?: ForecastComment;
    VarComment?:      VarComment;
    FreeFormComment?: string;
    URI?:             string;
  }

  export interface CommentPrototype {
    Text:   string;
    Code:   string;
    enText: string;
  }

  export interface WarningComment extends CommentPrototype {}
  export interface ForecastComment extends CommentPrototype {}
  export interface VarComment extends CommentPrototype {}


  export interface EarthquakeInfo {
    InfoKind: string;
    InfoSerial: {
      Name: string;
      Code: string;
    };
    Text: string;
    Appendix: string;
  }

  // ========= Tsunami Components ==========

  export type TsunamiForecastFirstHeight = {
    Revise?: "更新" | "追加";
  } & ({
    ArrivalTime: string;
    Condition?: "ただちに津波来襲と予測";
  } | {
    Condition: "津波到達中と推測" | "第１波の到達を確認";
  });

  export type ShortIntCode = "1" | "2" | "3" | "4" | "5@" | "震度５弱以上未入電" | "5-" | "5+" | "6-" | "6+" | "7";
  export type InfoShindoName = "震度３" | "震度４" | "震度５弱以上未入電" | "震度５弱" | "震度５強" | "震度６弱" | "震度６強" | "震度７";
  export type InfoLPGMName = "長周期地震動階級４" | "長周期地震動階級３" | "長周期地震動階級２" | "長周期地震動階級１";

  export type EpicenterSource = 'ＰＴＷＣ' | 'ＮＴＷＣ' | 'ＵＳＧＳ' | 'ＳＣＳＴＡＣ' | 'ＣＡＴＡＣ' | 'ＷＣＡＴＷＣ';
}

export namespace QTList {
  export type EntryInfoType = "発表" | "訂正" | "遅延" | "取消" | "発表_K" | "訂正_K" | "遅延_K" | "取消_K";
}
