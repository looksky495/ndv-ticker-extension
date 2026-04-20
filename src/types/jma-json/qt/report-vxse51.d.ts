import type { QT } from "./components.js";

export namespace VXSE51 {
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
    Observation: {
      Pref: IntensityObsPref[];
    };
  }

  export interface IntensityObsPref extends QT.IntensityObsPref {}
  export interface IntensityObsArea extends QT.IntensityObsArea {
    City: never;
  }
}
