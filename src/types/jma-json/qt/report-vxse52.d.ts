import type { QT } from "./components.js";

export namespace VXSE52 {
  export interface Report extends QT.Report {
    Control: Control;
    Head:    Head;
    Body:    Required<Pick<QT.Body, "Earthquake" | "Comments">>;
  }

  export interface Control extends QT.Control {
    Title: "震源に関する情報";
  }

  export interface Head extends QT.Head {
    Title: "震源に関する情報";
    InfoKind: "震源速報";
    Serial: null;
  }
}
