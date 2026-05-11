import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  collectJsonFilesByToken,
  createSchema,
  defaultFixtureRoot,
  validateJsonFilesWithSchema,
} from "./ajv-qt-schema.ts";

const schemaTypePath = fileURLToPath(new URL("../../src/types/jma-json/qt/report-vtse51.d.ts", import.meta.url));

test("db VTSE51 json files match report-vtse51.d.ts via AJV", () => {
  const jsonFiles = collectJsonFilesByToken(defaultFixtureRoot, "VTSE51");
  const schema = createSchema(schemaTypePath, "VTSE51.Report");
  validateJsonFilesWithSchema("VTSE51", jsonFiles, schema);
});
