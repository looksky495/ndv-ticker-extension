import type { QT } from "./components.js";

export namespace VXSE62 {
  export interface Report extends QT.Report {
    Control: Control;
    Head: Head;
    Body: Body;
  }
  
  export interface Control extends QT.Control {
    Title: "長周期地震動に関する観測情報";
  }
  
  export interface Head extends QT.Head {
    Title: "長周期地震動に関する観測情報";
    InfoKind: "長周期地震動に関する観測情報";
    Serial: `${number}`;
    enTitle?: never;
  }
  
  export interface Body extends Required<Pick<QT.Body, "Earthquake" | "Comments" | "Intensity">> {
    Earthquake: QT.Earthquake | QT.DetailedEarthquake;
    Intensity: QT.LgIntensity;
  }
}
