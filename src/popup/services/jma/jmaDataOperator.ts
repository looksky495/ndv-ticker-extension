import type { AreaOperator } from "./common.ts";
import { createAreaOperator } from "./common.ts";
import { createEarthquakeOperator, type EarthquakeOperator } from "./earthquake.ts";
import { createTsunamiOperator, type TsunamiOperator } from "./tsunami.ts";
import { createTyphCommentOperator, type TyphCommentOperator } from "./typhoon.ts";
import { createWarnCurrentOperator, type WarnCurrentOperator } from "./warning.ts";

export type DataOperatorType = {
  area: AreaOperator;
  tsunami: TsunamiOperator;
  earthquake: EarthquakeOperator;
  typh_comment: TyphCommentOperator;
  warn_current: WarnCurrentOperator;
};

const area = createAreaOperator();

const DataOperator: DataOperatorType = {
  area,
  tsunami: createTsunamiOperator(),
  earthquake: createEarthquakeOperator(),
  typh_comment: createTyphCommentOperator(),
  warn_current: createWarnCurrentOperator(area)
};

export { DataOperator };