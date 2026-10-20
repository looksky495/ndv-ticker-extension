import type { QT } from "./components.js";

export namespace VXSE51 {
  type MaxIntCode = "3" | "4" | "5-" | "5+" | "6-" | "6+" | "7";

  export interface Control extends QT.Control {
    Title: "震度速報";
  }

  export interface HeadlineItemArea {
    Name: string;
    Code: string;
  }

  export interface HeadlineItem {
    Kind: {
      Name: QT.InfoShindoName;
    },
    Areas: {
      Area: HeadlineItemArea | HeadlineItemArea[];
    }
  }

  export interface Headline extends QT.Headline {
    Information: {
      Item: HeadlineItem | HeadlineItem[];
    }
  }

  export interface Head extends QT.Head {
    Title: "震度速報";
    InfoKind: "震度速報";
    Headline: Headline;
  }

  export interface Report extends QT.Report {
    Control: Control;
    Head:    Head;
    Body:    Body;
  }

  export interface Body extends Required<Pick<QT.Body, "Intensity" | "Comments">> {
    Intensity: Intensity;
  }

  export interface Intensity extends QT.Intensity {
    Observation: IntensityObs;
  }

  export interface IntensityObs extends QT.IntensityObs {
    Pref: IntensityObsPref[];
    MaxInt: MaxIntCode;
  }

  export interface IntensityObsPref extends Required<Pick<QT.IntensityObsPref, "Name" | "Code" | "MaxInt" | "Area" | "enName">> {
    Area: IntensityObsArea[];
    MaxInt: MaxIntCode;
  }

  export interface IntensityObsArea extends Required<Pick<QT.IntensityObsArea, "Name" | "Code" | "MaxInt" | "enName">> {
    MaxInt: MaxIntCode;
  }
}
