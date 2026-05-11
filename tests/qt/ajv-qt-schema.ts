import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Ajv } from "ajv";
import { createGenerator } from "ts-json-schema-generator";

export const defaultFixtureRoot = fileURLToPath(new URL("../../db", import.meta.url));
export const defaultTsconfigPath = fileURLToPath(new URL("../../tsconfig.json", import.meta.url));

export function collectJsonFiles(dirPath: string, predicate: (fileName: string) => boolean): string[] {
	const result: string[] = [];
	for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
		const entryPath = path.join(dirPath, entry.name);
		if (entry.isDirectory()) {
			result.push(...collectJsonFiles(entryPath, predicate));
			continue;
		}
		if (entry.isFile() && entry.name.endsWith(".json") && predicate(entry.name)) {
			result.push(entryPath);
		}
	}
	return result;
}

export function collectJsonFilesByToken(dirPath: string, token: string): string[] {
	return collectJsonFiles(dirPath, (fileName) => fileName.includes(`_${token}_`));
}

export function readJson(filePath: string): unknown {
	return JSON.parse(readFileSync(filePath, "utf8")) as unknown;
}

export function createSchema(typePath: string, typeName: string, tsconfigPath: string = defaultTsconfigPath): object {
	const generator = createGenerator({
		path: typePath,
		tsconfig: tsconfigPath,
		type: typeName,
		expose: "none",
		topRef: false,
		strictTuples: true,
		skipTypeCheck: true,
	});

	return generator.createSchema(typeName);
}

export function validateJsonFilesWithSchema(label: string, files: string[], schema: object): void {
	assert.ok(files.length > 0, `No ${label} JSON files were found`);

	const ajv = new Ajv({ allErrors: true, strict: false });
	const validate = ajv.compile(schema);

	for (const filePath of files) {
		const parsed = readJson(filePath);
		if (!validate(parsed)) {
			const errorText = ajv.errorsText(validate.errors, { dataVar: filePath });
			assert.fail(errorText);
		}
	}
}
