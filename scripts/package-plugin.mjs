#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import YAML from "yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packId = process.argv[2];
if (!packId) {
  console.error("usage: npm run package-plugin -- <pack-id>");
  process.exit(1);
}

const packFile = path.join(root, "packs", `${packId}.yaml`);
if (!fs.existsSync(packFile)) throw new Error(`unknown pack ${packId}`);
const pack = YAML.parse(fs.readFileSync(packFile, "utf8"));
if (pack.distribution !== "plugin" || !pack.plugin_path) {
  throw new Error(`${packId} is not a skill-bearing plugin pack`);
}
const pluginSource = path.join(root, pack.plugin_path);
const manifest = JSON.parse(
  fs.readFileSync(path.join(pluginSource, ".codex-plugin", "plugin.json"), "utf8"),
);
if (manifest.name !== pack.id || manifest.version !== pack.version) {
  throw new Error("plugin name/version does not match its pack manifest");
}

const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "men-of-letters-package-"));
const stage = path.join(temporary, pack.id);
const outputDirectory = path.join(root, "dist");
fs.cpSync(pluginSource, stage, { recursive: true });
fs.copyFileSync(path.join(root, "LICENSE"), path.join(stage, "LICENSE"));
fs.writeFileSync(
  path.join(stage, "PROVENANCE.json"),
  `${JSON.stringify(
    {
      schema_version: 1,
      canonical_repository: "https://github.com/RJChristofoli/men-of-letters",
      commit: process.env.GITHUB_SHA ?? null,
      third_party: YAML.parse(fs.readFileSync(path.join(root, "provenance.yaml"), "utf8")).third_party,
    },
    null,
    2,
  )}\n`,
);

function files(directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? files(target) : [target];
    })
    .sort();
}

const releaseFiles = files(stage).map((file) => ({
  path: path.relative(stage, file).split(path.sep).join("/"),
  sha256: crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"),
}));
fs.writeFileSync(
  path.join(stage, "RELEASE-MANIFEST.json"),
  `${JSON.stringify(
    {
      schema_version: 1,
      pack: pack.id,
      version: pack.version,
      files: releaseFiles,
    },
    null,
    2,
  )}\n`,
);

fs.mkdirSync(outputDirectory, { recursive: true });
const archive = path.join(outputDirectory, `${pack.id}-${pack.version}.tar.gz`);
const result = spawnSync("tar", ["-czf", archive, "-C", temporary, pack.id], {
  encoding: "utf8",
});
fs.rmSync(temporary, { recursive: true, force: true });
if (result.status !== 0) throw new Error(result.stderr || "tar failed");
console.log(
  JSON.stringify(
    {
      archive: path.relative(root, archive),
      bytes: fs.statSync(archive).size,
      files: releaseFiles.length + 1,
    },
    null,
    2,
  ),
);
