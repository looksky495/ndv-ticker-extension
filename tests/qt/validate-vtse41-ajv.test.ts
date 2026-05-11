import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  collectJsonFilesByToken,
  createSchema,
  defaultFixtureRoot,
  validateJsonFilesWithSchema,
} from "./ajv-qt-schema.ts";

const schemaTypePath = fileURLToPath(new URL("../../src/types/jma-json/qt/report-vtse41.d.ts", import.meta.url));

test("db VTSE41 json files match report-vtse41.d.ts via AJV", () => {
  const jsonFiles = collectJsonFilesByToken(defaultFixtureRoot, "VTSE41");
  const schema = createSchema(schemaTypePath, "VTSE41.Report");
  validateJsonFilesWithSchema("VTSE41", jsonFiles, schema);
});
