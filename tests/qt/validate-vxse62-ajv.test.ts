import { fileURLToPath } from "node:url";
import test from "node:test";

import {
	collectJsonFilesByToken,
	createSchema,
	defaultFixtureRoot,
	validateJsonFilesWithSchema,
} from "./ajv-qt-schema.ts";

const schemaTypePath = fileURLToPath(new URL("../../src/types/jma-json/qt/report-vxse62.d.ts", import.meta.url));

test("db VXSE62 json files match report-vxse62.d.ts via AJV", () => {
	const jsonFiles = collectJsonFilesByToken(defaultFixtureRoot, "VXSE62");
	const schema = createSchema(schemaTypePath, "VXSE62.Report");
	validateJsonFilesWithSchema("VXSE62", jsonFiles, schema);
});
