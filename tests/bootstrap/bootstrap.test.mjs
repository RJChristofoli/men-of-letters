import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import Ajv2020 from "ajv/dist/2020.js";
import YAML from "yaml";

import {
  buildManagedBlock,
  execute,
  parseManagedBlocks,
  satisfies,
} from "../../bootstrap/lib/bootstrap.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

function temporaryDirectory(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "men-of-letters-test-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

function context(target, sourceRoot = repositoryRoot, extra = {}) {
  return { sourceRoot, cwd: target, home: target, ...extra };
}

function writeYaml(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, YAML.stringify(value));
}

function createFixtureRepository(t, capabilities, pack) {
  const source = temporaryDirectory(t);
  writeYaml(path.join(source, "catalog.yaml"), { schema_version: 1, capabilities });
  writeYaml(path.join(source, "packs", `${pack.id}.yaml`), pack);
  return source;
}

function policyCapability(id, source) {
  return {
    id,
    type: "policy",
    status: "experimental",
    owner: "test",
    source,
    dependencies: [],
    compatibility: {},
    evaluation_suite: null,
    installation_pack: "test-policies",
    introduced_release: null,
    deprecated_release: null,
    context_budget_tokens: 100,
  };
}

function workflowCapability(id, source, installationPack = "test-workflows") {
  return {
    id,
    type: "workflow",
    status: "experimental",
    owner: "test",
    source,
    dependencies: [],
    compatibility: {},
    evaluation_suite: null,
    installation_pack: installationPack,
    introduced_release: null,
    deprecated_release: null,
    context_budget_tokens: 100,
  };
}

test("semantic version ranges include prereleases explicitly", () => {
  assert.equal(satisfies("0.1.0-dev.0", ">=0.1.0-dev.0 <1.0.0"), true);
  assert.equal(satisfies("0.1.0-dev.0", ">=0.1.0 <1.0.0"), false);
  assert.equal(satisfies("1.0.0", ">=0.1.0 <1.0.0"), false);
});

test("managed blocks expose checksum tampering", () => {
  const block = buildManagedBlock({
    policyId: "evidence",
    packId: "core-policies",
    version: "0.1.0-dev.0",
    content: "Classify important claims.\n",
  });
  const parsed = parseManagedBlocks(`${block.text}\n`);
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].actual_checksum, block.checksum);
  const changed = parseManagedBlocks(`${block.text.replace("important", "material")}\n`);
  assert.notEqual(changed[0].actual_checksum, changed[0].declared_checksum);
});

test("list reports planned packs", () => {
  const result = execute(["list"], context(repositoryRoot));
  assert.equal(result.command, "list");
  assert.ok(result.packs.some(({ id }) => id === "engineering-discovery"));
});

test("proposed pack needs explicit local-evaluation opt-in", (t) => {
  const target = temporaryDirectory(t);
  assert.throws(
    () =>
      execute(
        ["install", "engineering-discovery", "--scope", "repo", "--target", target],
        context(target),
      ),
    /--allow-proposed/,
  );
});

test("dry-run does not create installation state or skills", (t) => {
  const target = temporaryDirectory(t);
  const result = execute(
    [
      "install",
      "engineering-discovery",
      "--scope",
      "repo",
      "--target",
      target,
      "--allow-proposed",
      "--dry-run",
    ],
    context(target),
  );
  assert.equal(result.dry_run, true);
  assert.equal(result.plan[0].action, "create");
  assert.equal(fs.existsSync(path.join(target, ".agents")), false);
  assert.equal(fs.existsSync(path.join(target, ".men-of-letters")), false);
});

test("clean copied install is idempotent, discoverable, healthy, and removable", (t) => {
  const target = temporaryDirectory(t);
  const args = [
    "install",
    "engineering-discovery",
    "--scope",
    "repo",
    "--target",
    target,
    "--allow-proposed",
  ];
  const installed = execute(args, context(target));
  const skill = path.join(target, ".agents", "skills", "engineering-discovery", "SKILL.md");
  assert.equal(installed.changed, true);
  assert.equal(fs.existsSync(skill), true);
  assert.equal(fs.lstatSync(path.dirname(skill)).isSymbolicLink(), false);
  assert.equal(execute(args, context(target)).changed, false);
  assert.deepEqual(
    execute(["doctor", "--scope", "repo", "--target", target], context(target)),
    { command: "doctor", healthy: true, issues: [] },
  );
  const removed = execute(
    ["uninstall", "engineering-discovery", "--scope", "repo", "--target", target],
    context(target),
  );
  assert.equal(removed.changed, true);
  assert.equal(fs.existsSync(path.dirname(skill)), false);
});

test("user scope keeps skills and state under the selected home", (t) => {
  const target = temporaryDirectory(t);
  execute(
    [
      "install",
      "engineering-discovery",
      "--scope",
      "user",
      "--target",
      target,
      "--allow-proposed",
    ],
    context(target),
  );
  assert.equal(
    fs.existsSync(path.join(target, ".agents", "skills", "engineering-discovery", "SKILL.md")),
    true,
  );
  const stateFile = path.join(target, ".local", "state", "men-of-letters", "state.json");
  const state = JSON.parse(fs.readFileSync(stateFile, "utf8"));
  const stateSchema = JSON.parse(
    fs.readFileSync(path.join(repositoryRoot, "schemas", "install-state.schema.json"), "utf8"),
  );
  assert.equal(new Ajv2020({ strict: true }).compile(stateSchema)(state), true);
  assert.equal(
    execute(["doctor", "--scope", "user", "--target", target], context(target)).healthy,
    true,
  );
});

test("install updates an owned artifact and recorded pack version", (t) => {
  const target = temporaryDirectory(t);
  const capability = workflowCapability(
    "test-workflow",
    "plugins/test-workflows/skills/test-workflow/SKILL.md",
  );
  const pack = {
    schema_version: 1,
    id: "test-workflows",
    version: "0.1.0-dev.0",
    status: "experimental",
    owner: "test",
    distribution: "plugin",
    plugin_path: "plugins/test-workflows",
    capabilities: ["test-workflow"],
    dependencies: [],
    suggested_policies: [],
  };
  const source = createFixtureRepository(t, [capability], pack);
  const skillSource = path.join(source, capability.source);
  fs.mkdirSync(path.dirname(skillSource), { recursive: true });
  fs.writeFileSync(skillSource, "---\nname: test-workflow\ndescription: Initial test workflow.\n---\n");
  const args = ["install", "test-workflows", "--scope", "repo", "--target", target];
  execute(args, context(target, source));

  fs.writeFileSync(skillSource, "---\nname: test-workflow\ndescription: Updated test workflow.\n---\n");
  pack.version = "0.1.1-dev.0";
  writeYaml(path.join(source, "packs", "test-workflows.yaml"), pack);
  const updated = execute(args, context(target, source));
  assert.equal(updated.changed, true);
  assert.equal(updated.plan[0].action, "update");
  assert.match(
    fs.readFileSync(path.join(target, ".agents", "skills", "test-workflow", "SKILL.md"), "utf8"),
    /Updated test workflow/,
  );
  const state = JSON.parse(
    fs.readFileSync(path.join(target, ".men-of-letters", "state.json"), "utf8"),
  );
  assert.equal(state.packs["test-workflows"].version, "0.1.1-dev.0");
});

test("local-development links are explicit and doctor detects breakage", (t) => {
  const target = temporaryDirectory(t);
  execute(
    [
      "install",
      "engineering-discovery",
      "--scope",
      "repo",
      "--target",
      target,
      "--allow-proposed",
      "--local-link",
    ],
    context(target),
  );
  const skill = path.join(target, ".agents", "skills", "engineering-discovery");
  assert.equal(fs.lstatSync(skill).isSymbolicLink(), true);
  fs.rmSync(skill);
  const diagnosis = execute(["doctor", "--scope", "repo", "--target", target], context(target));
  assert.equal(diagnosis.healthy, false);
  assert.match(diagnosis.issues[0], /missing/);
});

test("unmanaged collisions fail before mutation", (t) => {
  const target = temporaryDirectory(t);
  const collision = path.join(target, ".agents", "skills", "engineering-discovery");
  fs.mkdirSync(collision, { recursive: true });
  fs.writeFileSync(path.join(collision, "manual.md"), "owned by user\n");
  assert.throws(
    () =>
      execute(
        [
          "install",
          "engineering-discovery",
          "--scope",
          "repo",
          "--target",
          target,
          "--allow-proposed",
        ],
        context(target),
      ),
    /unmanaged target/,
  );
  assert.equal(fs.existsSync(path.join(target, ".men-of-letters", "state.json")), false);
  assert.equal(fs.readFileSync(path.join(collision, "manual.md"), "utf8"), "owned by user\n");
});

test("uninstall refuses locally modified managed artifacts", (t) => {
  const target = temporaryDirectory(t);
  execute(
    [
      "install",
      "engineering-discovery",
      "--scope",
      "repo",
      "--target",
      target,
      "--allow-proposed",
    ],
    context(target),
  );
  const skill = path.join(target, ".agents", "skills", "engineering-discovery", "SKILL.md");
  fs.appendFileSync(skill, "\nlocal change\n");
  assert.throws(
    () =>
      execute(
        ["uninstall", "engineering-discovery", "--scope", "repo", "--target", target],
        context(target),
      ),
    /modified or missing/,
  );
  assert.equal(fs.existsSync(skill), true);
});

test("tampered state cannot escape the selected scope", (t) => {
  const outer = temporaryDirectory(t);
  const target = path.join(outer, "target");
  fs.mkdirSync(target);
  execute(
    [
      "install",
      "engineering-discovery",
      "--scope",
      "repo",
      "--target",
      target,
      "--allow-proposed",
    ],
    context(target),
  );
  const victim = path.join(outer, "victim");
  fs.mkdirSync(victim);
  fs.writeFileSync(path.join(victim, "keep.txt"), "keep\n");
  const stateFile = path.join(target, ".men-of-letters", "state.json");
  const state = JSON.parse(fs.readFileSync(stateFile, "utf8"));
  const record = state.artifacts[".agents/skills/engineering-discovery"];
  delete state.artifacts[".agents/skills/engineering-discovery"];
  state.artifacts["../victim"] = record;
  fs.writeFileSync(stateFile, `${JSON.stringify(state, null, 2)}\n`);

  const diagnosis = execute(["doctor", "--scope", "repo", "--target", target], context(target));
  assert.equal(diagnosis.healthy, false);
  assert.match(diagnosis.issues[0], /unsafe target/);
  assert.throws(
    () =>
      execute(
        ["uninstall", "engineering-discovery", "--scope", "repo", "--target", target],
        context(target),
      ),
    /unsafe target/,
  );
  assert.equal(fs.readFileSync(path.join(victim, "keep.txt"), "utf8"), "keep\n");
});

test("policy activation requires confirmation and preserves unmanaged bytes", (t) => {
  const target = temporaryDirectory(t);
  const source = createFixtureRepository(
    t,
    [policyCapability("evidence", "policies/evidence.md")],
    {
      schema_version: 1,
      id: "test-policies",
      version: "0.1.0-dev.0",
      status: "experimental",
      owner: "test",
      distribution: "bootstrap",
      plugin_path: null,
      capabilities: ["evidence"],
      dependencies: [],
      suggested_policies: [],
    },
  );
  fs.mkdirSync(path.join(source, "policies"));
  fs.writeFileSync(path.join(source, "policies", "evidence.md"), "Classify material claims.\n");
  const instructions = path.join(target, "AGENTS.md");
  const manual = "# Manual project instructions";
  fs.writeFileSync(instructions, manual);
  const args = [
    "install",
    "test-policies",
    "--scope",
    "repo",
    "--target",
    target,
    "--instructions",
    instructions,
  ];
  assert.throws(() => execute(args, context(target, source)), /--yes/);
  assert.equal(fs.readFileSync(instructions, "utf8"), manual);
  execute([...args, "--yes"], context(target, source));
  const installed = fs.readFileSync(instructions, "utf8");
  assert.ok(installed.startsWith(`${manual}\n<!-- men-of-letters:start`));
  assert.equal(parseManagedBlocks(installed).length, 1);
  assert.equal(
    execute(["doctor", "--scope", "repo", "--target", target], context(target, source)).healthy,
    true,
  );
  execute(
    [
      "uninstall",
      "test-policies",
      "--scope",
      "repo",
      "--target",
      target,
      "--yes",
    ],
    context(target, source),
  );
  assert.equal(fs.readFileSync(instructions, "utf8"), manual);
});

test("failed multi-artifact install rolls back earlier writes", (t) => {
  const target = temporaryDirectory(t);
  const capabilities = [
    workflowCapability("first-workflow", "plugins/test/skills/first-workflow/SKILL.md"),
    workflowCapability("second-workflow", "plugins/test/skills/second-workflow/SKILL.md"),
  ];
  const source = createFixtureRepository(t, capabilities, {
    schema_version: 1,
    id: "test-workflows",
    version: "0.1.0-dev.0",
    status: "experimental",
    owner: "test",
    distribution: "plugin",
    plugin_path: "plugins/test",
    capabilities: ["first-workflow", "second-workflow"],
    dependencies: [],
    suggested_policies: [],
  });
  for (const capability of capabilities) {
    const file = path.join(source, capability.source);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, `---\nname: ${capability.id}\ndescription: Test workflow capability.\n---\n`);
  }
  assert.throws(
    () =>
      execute(
        ["install", "test-workflows", "--scope", "repo", "--target", target],
        context(target, source, {
          beforeApply: () =>
            fs.rmSync(path.join(source, "plugins", "test", "skills", "second-workflow"), {
              recursive: true,
            }),
        }),
      ),
    /rolled back/,
  );
  assert.equal(fs.existsSync(path.join(target, ".agents")), false);
  assert.equal(fs.existsSync(path.join(target, ".men-of-letters", "state.json")), false);
});
