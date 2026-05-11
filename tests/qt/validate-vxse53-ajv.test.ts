import { fileURLToPath } from "node:url";
import test from "node:test";

import {
	collectJsonFilesByToken,
	createSchema,
	defaultFixtureRoot,
	validateJsonFilesWithSchema,
} from "./ajv-qt-schema.ts";

const schemaTypePath = fileURLToPath(new URL("../../src/types/jma-json/qt/report-vxse53.d.ts", import.meta.url));

test("db VXSE5k json files match report-vxse53.d.ts via AJV", () => {
	const jsonFiles = collectJsonFilesByToken(defaultFixtureRoot, "VXSE5k");
	const schema = createSchema(schemaTypePath, "VXSE53.Domestic.Report");
	validateJsonFilesWithSchema("VXSE5k", jsonFiles, schema);
});

test("db VXSE5e json files match report-vxse53.d.ts via AJV", () => {
  const jsonFiles = collectJsonFilesByToken(defaultFixtureRoot, "VXSE5e");
  const schema = createSchema(schemaTypePath, "VXSE53.Overseas.Report");
  validateJsonFilesWithSchema("VXSE5e", jsonFiles, schema);
});

