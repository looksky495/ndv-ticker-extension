import { fileURLToPath } from "node:url";
import test from "node:test";

import {
	collectJsonFilesByToken,
	createSchema,
	defaultFixtureRoot,
	validateJsonFilesWithSchema,
} from "./ajv-qt-schema.ts";

const schemaTypePath = fileURLToPath(new URL("../../src/types/jma-json/qt/report-vxse61.d.ts", import.meta.url));

test("db VXSE61 json files match report-vxse61.d.ts via AJV", () => {
	const jsonFiles = collectJsonFilesByToken(defaultFixtureRoot, "VXSE61");
	const schema = createSchema(schemaTypePath, "VXSE61.Report");
	validateJsonFilesWithSchema("VXSE61", jsonFiles, schema);
});
