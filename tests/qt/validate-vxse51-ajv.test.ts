import { fileURLToPath } from "node:url";
import test from "node:test";

import {
	collectJsonFilesByToken,
	createSchema,
	defaultFixtureRoot,
	validateJsonFilesWithSchema,
} from "./ajv-qt-schema.js";

const schemaTypePath = fileURLToPath(new URL("../../src/types/jma-json/qt/report-vxse51.d.ts", import.meta.url));

test("db VXSE51 json files match report-vxse51.d.ts via AJV", () => {
	const jsonFiles = collectJsonFilesByToken(defaultFixtureRoot, "VXSE51");
	const schema = createSchema(schemaTypePath, "VXSE51.Report");
	validateJsonFilesWithSchema("VXSE51", jsonFiles, schema);
});
