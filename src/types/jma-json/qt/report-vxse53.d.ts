import type { QT } from "./components.js";

export namespace VXSE53 {
  export namespace Domestic {
    export interface Report extends QT.Report {
      Control: Control;
      Head:    Head;
      Body:    Required<Pick<QT.Body, "Earthquake" | "Comments">> & {
        Intensity: Intensity;
      };
    }

    export interface Control extends QT.Control {
      Title: "震源・震度に関する情報";
    }

    export interface Head extends QT.Head {
      Title: "震源・震度情報";
      InfoKind: "地震情報";
      Serial: `${number}`;
    }

    export interface Intensity extends QT.Intensity {
      Observation: {
        Pref: IntensityObsPref[];
      };
    }
    export interface IntensityObsPref extends QT.IntensityObsPref {}
    export interface IntensityObsArea extends QT.IntensityObsArea {
      City: QT.IntensityObsCity[];
    }
  }

  export namespace Overseas {
    export interface Report extends QT.Report {
      Control: Control;
      Head:    Head;
      Body:    Body;
    }

    export interface Control extends QT.Control {
      Title: "震源・震度に関する情報";
    }

    export interface Head extends QT.Head {
      Title: "遠地地震に関する情報";
      InfoKind: "地震情報";
      Serial: `${number}`;
    }

    export interface Body extends Required<Pick<QT.Body, "Earthquake" | "Comments">> {
      Earthquake: QT.DetailedEarthquake;
    }
  }

  export type Report = Domestic.Report | Overseas.Report;
}
