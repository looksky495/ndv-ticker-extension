import init from "../../wasm/rust/pkg/eewcalc.js";
import type { FeatureCollection } from "geojson";

const wasm = await init();
type WarnInfo = { warn?: string[]; lon: number; lat: number };
type MapPref = { pts: number; mem: number };
type CalcMemory = { property: { code?: string }; memory: number; num: number };

const calcMemories: CalcMemory[] = [];
const centerPtr = wasm.__wbindgen_malloc(16, 8);

function writePointsToWasm(points: number[][]): MapPref | null {
  if (points.length === 0) return null;

  const memPos = wasm.__wbindgen_malloc(4 + points.length * 8, 4);
  const pointBuffer = new Float32Array(wasm.memory.buffer, memPos, 1 + points.length * 2);
  pointBuffer[0] = points.length;

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    pointBuffer[i * 2 + 1] = point?.[0] ?? 0;
    pointBuffer[i * 2 + 2] = point?.[1] ?? 0;
  }

  return { pts: points.length, mem: memPos };
}

function prepareGeoData(data: FeatureCollection): number {
  calcMemories.length = 0;

  const features = Array.isArray(data?.features) ? data.features : [];
  for (const feature of features) {
    const geometry = feature?.geometry;
    if (!geometry) continue;

    const mapPref: MapPref[] = [];
    switch (geometry.type) {
      case "MultiPolygon": {
        const coordinates = geometry.coordinates as unknown as number[][][][];
        for (const c2 of coordinates) {
          const points = c2?.[0] as number[][] | undefined;
          if (!Array.isArray(points)) continue;
          const pref = writePointsToWasm(points);
          if (pref) mapPref.push(pref);
        }
        break;
      }
      case "Polygon": {
        const coordinates = geometry.coordinates as unknown as number[][][];
        const points = coordinates?.[0] as number[][] | undefined;
        if (Array.isArray(points)) {
          const pref = writePointsToWasm(points);
          if (pref) mapPref.push(pref);
        }
        break;
      }
      default:
        break;
    }

    if (mapPref.length === 0) continue;

    const prefInfoPtr = wasm.__wbindgen_malloc(4 + mapPref.length * 8, 4);
    const prefInfo = new Int32Array(wasm.memory.buffer, prefInfoPtr, 1 + mapPref.length * 2);
    prefInfo[0] = mapPref.length;
    for (let i = 0; i < mapPref.length; i++) {
      prefInfo[i * 2 + 1] = mapPref[i].pts;
      prefInfo[i * 2 + 2] = mapPref[i].mem;
    }

    calcMemories.push({
      property: (feature.properties as { code?: string } | null) ?? {},
      memory: prefInfoPtr,
      num: mapPref.length
    });
  }

  return 1;
}

export function calcMapZoom(info: WarnInfo): number {
  if (calcMemories.length === 0) return 1;

  const warnAreas = Array.isArray(info?.warn) ? info.warn : [];
  const center = new Float64Array(wasm.memory.buffer, centerPtr, 2);
  center[0] = info.lon;
  center[1] = info.lat;

  let prefMagnification = 999;
  let warnMagnification = 0;
  for (const memory of calcMemories) {
    const mag = wasm.quakemap_calc_magnification(memory.memory, centerPtr);
    prefMagnification = Math.min(prefMagnification, mag);
    if (warnAreas.includes(memory.property.code ?? "")) warnMagnification = Math.max(warnMagnification, mag);
  }

  const magnification = Math.max(prefMagnification, warnMagnification * 1.1);
  return Number.isFinite(magnification) ? magnification : 1;
}

const geojson: FeatureCollection = await fetch(new URL('/src/assets/data/20190125_AreaForecastLocalEEW_GIS_20.geojson', import.meta.url).href).then(r => r.json());
prepareGeoData(geojson);
