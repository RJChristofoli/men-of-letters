import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import YAML from "yaml";

export const INSTALLER_VERSION = "0.1.0-dev.0";

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function normalizePolicy(content) {
  return `${content.replaceAll("\r\n", "\n").replace(/\n+$/, "")}\n`;
}

function listFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(target));
    else files.push(target);
  }
  return files.sort();
}

export function hashTree(directory) {
  const entries = listFiles(directory).map((file) => {
    const relative = path.relative(directory, file).split(path.sep).join("/");
    return `${relative}\0${sha256(fs.readFileSync(file))}`;
  });
  return sha256(`${entries.join("\n")}\n`);
}

export function buildManagedBlock({ policyId, packId, version, content }) {
  const normalized = normalizePolicy(content);
  const checksum = sha256(normalized);
  return {
    checksum,
    text:
      `<!-- men-of-letters:start policy=${policyId} pack=${packId} version=${version} checksum=${checksum} -->\n` +
      normalized +
      `<!-- men-of-letters:end policy=${policyId} -->`,
  };
}

export function parseManagedBlocks(content) {
  const markerCount = (content.match(/<!-- men-of-letters:(?:start|end) /g) ?? []).length;
  const pattern =
    /^<!-- men-of-letters:start policy=([a-z][a-z0-9-]*) pack=([a-z][a-z0-9-]*) version=([^ ]+) checksum=([a-f0-9]{64}) -->\n([\s\S]*?)^<!-- men-of-letters:end policy=\1 -->$/gm;
  const blocks = [];
  for (const match of content.matchAll(pattern)) {
    const normalized = normalizePolicy(match[5]);
    blocks.push({
      policy_id: match[1],
      pack_id: match[2],
      version: match[3],
      declared_checksum: match[4],
      actual_checksum: sha256(normalized),
      start: match.index,
      end: match.index + match[0].length,
      text: match[0],
    });
  }
  if (markerCount !== blocks.length * 2) {
    throw new Error("persistent instruction file contains malformed or nested managed markers");
  }
  const ids = new Set();
  for (const block of blocks) {
    if (ids.has(block.policy_id)) throw new Error(`duplicate managed policy ${block.policy_id}`);
    ids.add(block.policy_id);
  }
  return blocks;
}

function semverParts(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?/);
  if (!match) throw new Error(`invalid semantic version ${version}`);
  return [Number(match[1]), Number(match[2]), Number(match[3]), match[4]?.split(".") ?? null];
}

function compareSemver(left, right) {
  const a = semverParts(left);
  const b = semverParts(right);
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return a[index] < b[index] ? -1 : 1;
  }
  if (a[3] === null || b[3] === null) return a[3] === b[3] ? 0 : a[3] === null ? 1 : -1;
  const length = Math.max(a[3].length, b[3].length);
  for (let index = 0; index < length; index += 1) {
    if (a[3][index] === undefined) return -1;
    if (b[3][index] === undefined) return 1;
    const aNumeric = /^\d+$/.test(a[3][index]);
    const bNumeric = /^\d+$/.test(b[3][index]);
    if (aNumeric && bNumeric && Number(a[3][index]) !== Number(b[3][index])) {
      return Number(a[3][index]) < Number(b[3][index]) ? -1 : 1;
    }
    if (aNumeric !== bNumeric) return aNumeric ? -1 : 1;
    if (a[3][index] !== b[3][index]) return a[3][index] < b[3][index] ? -1 : 1;
  }
  return 0;
}

export function satisfies(version, range) {
  return range.split(/\s+/).every((token) => {
    const match = token.match(/^(>=|<=|>|<|=)?(.+)$/);
    const comparison = compareSemver(version, match[2]);
    switch (match[1] ?? "=") {
      case ">=":
        return comparison >= 0;
      case "<=":
        return comparison <= 0;
      case ">":
        return comparison > 0;
      case "<":
        return comparison < 0;
      default:
        return comparison === 0;
    }
  });
}

function parseOptions(argv) {
  const [command, maybePack, ...rest] = argv;
  if (!["list", "install", "uninstall", "doctor"].includes(command)) {
    throw new Error("usage: men-of-letters list|install <pack>|uninstall <pack>|doctor [options]");
  }
  const needsPack = ["install", "uninstall"].includes(command);
  const pack = needsPack ? maybePack : null;
  const options = {
    command,
    pack,
    scope: null,
    target: null,
    instructions: null,
    dry_run: false,
    yes: false,
    local_link: false,
    allow_proposed: false,
  };
  const tokens = needsPack ? rest : [maybePack, ...rest].filter(Boolean);
  if (needsPack && (!pack || pack.startsWith("--"))) throw new Error(`${command} requires a pack ID`);
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (["--scope", "--target", "--instructions"].includes(token)) {
      const key = token.slice(2).replaceAll("-", "_");
      if (!tokens[index + 1]) throw new Error(`${token} requires a value`);
      options[key] = tokens[++index];
    } else if (token === "--dry-run") options.dry_run = true;
    else if (token === "--yes") options.yes = true;
    else if (token === "--local-link") options.local_link = true;
    else if (token === "--allow-proposed") options.allow_proposed = true;
    else throw new Error(`unknown option ${token}`);
  }
  if (options.scope !== null && !["repo", "user"].includes(options.scope)) {
    throw new Error("--scope must be repo or user");
  }
  if (["install", "uninstall", "doctor"].includes(command) && options.scope === null) {
    throw new Error(`${command} requires --scope repo|user`);
  }
  return options;
}

function readYaml(file) {
  return YAML.parse(fs.readFileSync(file, "utf8"));
}

function loadRepository(sourceRoot) {
  const catalog = readYaml(path.join(sourceRoot, "catalog.yaml"));
  const packDirectory = path.join(sourceRoot, "packs");
  const packs = new Map(
    fs
      .readdirSync(packDirectory)
      .filter((file) => file.endsWith(".yaml"))
      .map((file) => {
        const pack = readYaml(path.join(packDirectory, file));
        return [pack.id, pack];
      }),
  );
  return {
    catalog,
    capabilityById: new Map(catalog.capabilities.map((capability) => [capability.id, capability])),
    packs,
  };
}

function resolvePacks(packId, repository, allowProposed) {
  const resolved = [];
  const visiting = new Set();
  const visited = new Set();
  function visit(id) {
    if (visiting.has(id)) throw new Error(`pack dependency cycle at ${id}`);
    if (visited.has(id)) return;
    const pack = repository.packs.get(id);
    if (!pack) throw new Error(`unknown pack ${id}`);
    if (pack.status === "proposed" && !allowProposed) {
      throw new Error(`${id} is proposed; pass --allow-proposed for local evaluation`);
    }
    if (["deprecated", "retired"].includes(pack.status)) {
      throw new Error(`${id} is ${pack.status} and cannot be newly installed`);
    }
    visiting.add(id);
    for (const dependency of pack.dependencies) {
      const dependencyPack = repository.packs.get(dependency.id);
      if (!dependencyPack) throw new Error(`${id} depends on unknown pack ${dependency.id}`);
      if (!satisfies(dependencyPack.version, dependency.version)) {
        throw new Error(
          `${id} requires ${dependency.id} ${dependency.version}, found ${dependencyPack.version}`,
        );
      }
      visit(dependency.id);
    }
    visiting.delete(id);
    visited.add(id);
    resolved.push(pack);
  }
  visit(packId);
  return resolved;
}

function pathsFor(options, environment) {
  const hasExplicitTarget = options.target !== null;
  const targetRoot = path.resolve(options.target ?? (options.scope === "user" ? environment.home : environment.cwd));
  if (!fs.existsSync(targetRoot) || !fs.statSync(targetRoot).isDirectory()) {
    throw new Error(`target root does not exist: ${targetRoot}`);
  }
  const xdgStateHome =
    typeof environment.xdgStateHome === "string" && path.isAbsolute(environment.xdgStateHome)
      ? path.resolve(environment.xdgStateHome)
      : null;
  const stateRoot =
    options.scope === "repo"
      ? path.join(targetRoot, ".men-of-letters")
      : !hasExplicitTarget && xdgStateHome
        ? path.join(xdgStateHome, "men-of-letters")
        : path.join(targetRoot, ".local", "state", "men-of-letters");
  return { targetRoot, stateRoot, stateFile: path.join(stateRoot, "state.json") };
}

function emptyState(scope, targetRoot) {
  return {
    schema_version: 1,
    installer_version: INSTALLER_VERSION,
    scope,
    target_root: targetRoot,
    operation_id: null,
    packs: {},
    artifacts: {},
    managed_blocks: {},
    backups: [],
  };
}

function readState(stateFile, scope, targetRoot) {
  if (!fs.existsSync(stateFile)) return emptyState(scope, targetRoot);
  const state = JSON.parse(fs.readFileSync(stateFile, "utf8"));
  if (state.schema_version !== 1) throw new Error(`unsupported state schema ${state.schema_version}`);
  if (state.scope !== scope || path.resolve(state.target_root) !== targetRoot) {
    throw new Error("installer state scope or target does not match this operation");
  }
  return state;
}

function relativeTarget(targetRoot, target) {
  const relative = path.relative(targetRoot, target);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`unsafe target outside selected scope: ${target}`);
  }
  return relative.split(path.sep).join("/");
}

function resolveStateTarget(targetRoot, relative) {
  if (typeof relative !== "string" || path.isAbsolute(relative)) {
    throw new Error(`unsafe path in installer state: ${relative}`);
  }
  const target = path.resolve(targetRoot, relative);
  relativeTarget(targetRoot, target);
  return target;
}

function atomicWrite(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = path.join(path.dirname(file), `.${path.basename(file)}.${process.pid}.tmp`);
  fs.writeFileSync(temporary, content, { mode: 0o600 });
  fs.renameSync(temporary, file);
}

function currentArtifactChecksum(target, kind) {
  let stats;
  try {
    stats = fs.lstatSync(target);
  } catch {
    return null;
  }
  if (kind === "link") return stats.isSymbolicLink() ? sha256(fs.readlinkSync(target)) : "wrong-kind";
  return stats.isDirectory() && !stats.isSymbolicLink() ? hashTree(target) : "wrong-kind";
}

function appendBlock(content, block) {
  if (content.length === 0) return `${block}\n`;
  return `${content}${content.endsWith("\n") ? "" : "\n"}${block}\n`;
}

function replaceBlock(content, current, replacement) {
  return `${content.slice(0, current.start)}${replacement}${content.slice(current.end)}`;
}

function removeBlock(content, current, prefixAdded) {
  const start = prefixAdded ? current.start - 1 : current.start;
  const end = content[current.end] === "\n" ? current.end + 1 : current.end;
  return `${content.slice(0, start)}${content.slice(end)}`;
}

function buildInstallPlan(options, repository, paths, state, sourceRoot) {
  const packs = resolvePacks(options.pack, repository, options.allow_proposed);
  const artifacts = [];
  const policies = [];
  const plan = [];
  for (const pack of packs) {
    for (const capabilityId of pack.capabilities) {
      const capability = repository.capabilityById.get(capabilityId);
      if (!capability?.source) throw new Error(`${capabilityId} is not implemented`);
      const source = path.resolve(sourceRoot, capability.source);
      relativeTarget(sourceRoot, source);
      if (!fs.existsSync(source)) throw new Error(`${capabilityId} source is missing`);
      if (capability.type === "policy") {
        if (!options.instructions) {
          throw new Error(`${pack.id} contains policies; pass --instructions <durable-instruction-file>`);
        }
        policies.push({ pack, capability, source });
        continue;
      }
      if (!["router", "workflow"].includes(capability.type)) continue;
      const sourceDirectory = path.dirname(source);
      const target = path.join(paths.targetRoot, ".agents", "skills", capability.id);
      const relative = relativeTarget(paths.targetRoot, target);
      const kind = options.local_link ? "link" : "directory";
      const desiredChecksum = options.local_link ? sha256(sourceDirectory) : hashTree(sourceDirectory);
      const record = state.artifacts[relative];
      const actualChecksum = currentArtifactChecksum(target, record?.kind ?? kind);
      if (actualChecksum !== null && !record) throw new Error(`collision with unmanaged target ${relative}`);
      if (record && record.pack_id !== pack.id) throw new Error(`${relative} is owned by ${record.pack_id}`);
      if (record && actualChecksum !== record.checksum) throw new Error(`modified managed target ${relative}`);
      const action = actualChecksum === desiredChecksum && record?.kind === kind ? "noop" : actualChecksum ? "update" : "create";
      const operation = {
        action,
        kind,
        pack_id: pack.id,
        capability_id: capability.id,
        source: sourceDirectory,
        target,
        relative,
        checksum: desiredChecksum,
      };
      artifacts.push(operation);
      plan.push({ action, kind, pack: pack.id, capability: capability.id, target: relative });
    }
  }

  let instructionOperation = null;
  if (policies.length > 0) {
    if (!path.isAbsolute(options.instructions)) {
      throw new Error("--instructions must be an absolute path inside the selected scope");
    }
    const instructions = path.resolve(options.instructions);
    relativeTarget(paths.targetRoot, instructions);
    let content = fs.existsSync(instructions) ? fs.readFileSync(instructions, "utf8") : "";
    let blocks = parseManagedBlocks(content);
    const records = [];
    for (const { pack, capability, source } of policies) {
      const existing = blocks.find(({ policy_id: id }) => id === capability.id);
      const stateRecord = state.managed_blocks[capability.id];
      if (existing && !stateRecord) throw new Error(`collision with unmanaged policy block ${capability.id}`);
      if (existing && stateRecord) {
        if (
          existing.declared_checksum !== stateRecord.checksum ||
          existing.actual_checksum !== stateRecord.checksum ||
          stateRecord.pack_id !== pack.id
        ) {
          throw new Error(`modified managed policy block ${capability.id}`);
        }
      }
      const desired = buildManagedBlock({
        policyId: capability.id,
        packId: pack.id,
        version: pack.version,
        content: fs.readFileSync(source, "utf8"),
      });
      const unchanged =
        existing?.actual_checksum === desired.checksum &&
        existing.version === pack.version &&
        stateRecord?.version === pack.version;
      const action = unchanged ? "noop" : existing ? "update" : "create";
      const prefixAdded = action === "create" && content.length > 0 && !content.endsWith("\n");
      if (action === "create") content = appendBlock(content, desired.text);
      else if (action === "update") content = replaceBlock(content, existing, desired.text);
      blocks = parseManagedBlocks(content);
      records.push({
        action,
        policy_id: capability.id,
        pack_id: pack.id,
        version: pack.version,
        checksum: desired.checksum,
        instruction_path: relativeTarget(paths.targetRoot, instructions),
        prefix_added: action === "create" ? prefixAdded : stateRecord?.prefix_added ?? false,
      });
      plan.push({ action, kind: "policy", pack: pack.id, capability: capability.id, target: relativeTarget(paths.targetRoot, instructions) });
    }
    instructionOperation = { target: instructions, content, records };
  }
  return { packs, artifacts, instructionOperation, plan };
}

function snapshotTargets(targets) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "men-of-letters-rollback-"));
  const snapshots = [];
  targets.forEach((target, index) => {
    const exists = fs.existsSync(target);
    const backup = path.join(directory, String(index));
    if (exists) fs.cpSync(target, backup, { recursive: true, dereference: false });
    snapshots.push({ target, exists, backup });
  });
  return { directory, snapshots };
}

function restoreSnapshots(snapshot) {
  for (const item of snapshot.snapshots.reverse()) {
    fs.rmSync(item.target, { recursive: true, force: true });
    if (item.exists) {
      fs.mkdirSync(path.dirname(item.target), { recursive: true });
      fs.cpSync(item.backup, item.target, { recursive: true, dereference: false });
    }
  }
  fs.rmSync(snapshot.directory, { recursive: true, force: true });
}

function discardSnapshots(snapshot) {
  fs.rmSync(snapshot.directory, { recursive: true, force: true });
}

function performInstall(options, installPlan, paths, state) {
  if (options.dry_run) return { changed: false, plan: installPlan.plan };
  if (installPlan.instructionOperation && !options.yes) {
    throw new Error("policy activation changes persistent instructions; rerun with --yes after reviewing --dry-run");
  }
  const operationId = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const possibleContainers = [
    path.join(paths.targetRoot, ".agents"),
    path.join(paths.targetRoot, ".agents", "skills"),
    paths.stateRoot,
    ...(installPlan.instructionOperation ? [path.dirname(installPlan.instructionOperation.target)] : []),
  ];
  const missingContainers = [...new Set(possibleContainers)].filter(
    (directory) => directory !== paths.targetRoot && !fs.existsSync(directory),
  );
  const targets = [
    ...installPlan.artifacts.filter(({ action }) => action !== "noop").map(({ target }) => target),
    ...(installPlan.instructionOperation && installPlan.instructionOperation.records.some(({ action }) => action !== "noop")
      ? [installPlan.instructionOperation.target]
      : []),
    paths.stateFile,
  ];
  const snapshot = snapshotTargets([...new Set(targets)]);
  try {
    for (const artifact of installPlan.artifacts) {
      if (artifact.action !== "noop") {
        fs.rmSync(artifact.target, { recursive: true, force: true });
        fs.mkdirSync(path.dirname(artifact.target), { recursive: true });
        if (artifact.kind === "link") fs.symlinkSync(artifact.source, artifact.target, "dir");
        else fs.cpSync(artifact.source, artifact.target, { recursive: true });
      }
      state.artifacts[artifact.relative] = {
        kind: artifact.kind,
        pack_id: artifact.pack_id,
        capability_id: artifact.capability_id,
        checksum: artifact.checksum,
        source: artifact.source,
      };
    }
    if (installPlan.instructionOperation) {
      const instruction = installPlan.instructionOperation;
      if (instruction.records.some(({ action }) => action !== "noop")) {
        const backupDirectory = path.join(paths.stateRoot, "backups", operationId);
        fs.mkdirSync(backupDirectory, { recursive: true });
        if (fs.existsSync(instruction.target)) {
          const backup = path.join(backupDirectory, path.basename(instruction.target));
          fs.copyFileSync(instruction.target, backup);
          state.backups.push({
            operation_id: operationId,
            target: relativeTarget(paths.targetRoot, instruction.target),
            backup: path.relative(paths.stateRoot, backup).split(path.sep).join("/"),
          });
        }
        atomicWrite(instruction.target, instruction.content);
      }
      for (const record of instruction.records) {
        const { action: _action, ...stored } = record;
        state.managed_blocks[record.policy_id] = stored;
      }
    }
    for (const pack of installPlan.packs) {
      state.packs[pack.id] = {
        version: pack.version,
        dependencies: pack.dependencies.map(({ id }) => id),
        installed_at: new Date().toISOString(),
      };
    }
    state.installer_version = INSTALLER_VERSION;
    state.operation_id = operationId;
    atomicWrite(paths.stateFile, `${JSON.stringify(state, null, 2)}\n`);
    discardSnapshots(snapshot);
    return { changed: installPlan.plan.some(({ action }) => action !== "noop"), plan: installPlan.plan };
  } catch (error) {
    restoreSnapshots(snapshot);
    fs.rmSync(path.join(paths.stateRoot, "backups", operationId), { recursive: true, force: true });
    for (const directory of missingContainers.sort((left, right) => right.length - left.length)) {
      if (!fs.existsSync(directory)) continue;
      if (directory === paths.stateRoot) fs.rmSync(directory, { recursive: true, force: true });
      else if (fs.statSync(directory).isDirectory() && fs.readdirSync(directory).length === 0) {
        fs.rmdirSync(directory);
      }
    }
    throw new Error(`install rolled back: ${error.message}`);
  }
}

function buildUninstallPlan(packId, paths, state) {
  if (!state.packs[packId]) throw new Error(`${packId} is not installed`);
  for (const [installedId, record] of Object.entries(state.packs)) {
    if (installedId !== packId && record.dependencies.includes(packId)) {
      throw new Error(`${packId} is required by installed pack ${installedId}`);
    }
  }
  const artifacts = [];
  const plan = [];
  for (const [relative, record] of Object.entries(state.artifacts)) {
    if (record.pack_id !== packId) continue;
    const target = resolveStateTarget(paths.targetRoot, relative);
    const actual = currentArtifactChecksum(target, record.kind);
    if (actual !== record.checksum) throw new Error(`modified or missing managed target ${relative}`);
    artifacts.push({ relative, target, record });
    plan.push({ action: "remove", kind: record.kind, pack: packId, capability: record.capability_id, target: relative });
  }
  const policies = [];
  const byInstruction = new Map();
  for (const [policyId, record] of Object.entries(state.managed_blocks)) {
    if (record.pack_id !== packId) continue;
    const instruction = resolveStateTarget(paths.targetRoot, record.instruction_path);
    if (!byInstruction.has(instruction)) {
      const content = fs.readFileSync(instruction, "utf8");
      byInstruction.set(instruction, { content, blocks: parseManagedBlocks(content) });
    }
    const holder = byInstruction.get(instruction);
    const block = holder.blocks.find(({ policy_id: id }) => id === policyId);
    if (
      !block ||
      block.pack_id !== record.pack_id ||
      block.version !== record.version ||
      block.actual_checksum !== record.checksum ||
      block.declared_checksum !== record.checksum
    ) {
      throw new Error(`modified or missing managed policy block ${policyId}`);
    }
    holder.content = removeBlock(holder.content, block, record.prefix_added);
    holder.blocks = parseManagedBlocks(holder.content);
    policies.push({ policyId, instruction });
    plan.push({ action: "remove", kind: "policy", pack: packId, capability: policyId, target: record.instruction_path });
  }
  return { artifacts, policies, instructions: byInstruction, plan };
}

function performUninstall(options, uninstallPlan, packId, paths, state) {
  if (options.dry_run) return { changed: false, plan: uninstallPlan.plan };
  if (uninstallPlan.policies.length > 0 && !options.yes) {
    throw new Error("policy removal changes persistent instructions; rerun with --yes after reviewing --dry-run");
  }
  const targets = [
    ...uninstallPlan.artifacts.map(({ target }) => target),
    ...uninstallPlan.instructions.keys(),
    paths.stateFile,
  ];
  const snapshot = snapshotTargets([...new Set(targets)]);
  try {
    for (const artifact of uninstallPlan.artifacts) {
      fs.rmSync(artifact.target, { recursive: true });
      delete state.artifacts[artifact.relative];
    }
    for (const [instruction, holder] of uninstallPlan.instructions) {
      atomicWrite(instruction, holder.content);
    }
    for (const { policyId } of uninstallPlan.policies) delete state.managed_blocks[policyId];
    delete state.packs[packId];
    state.installer_version = INSTALLER_VERSION;
    state.operation_id = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    atomicWrite(paths.stateFile, `${JSON.stringify(state, null, 2)}\n`);
    discardSnapshots(snapshot);
    return { changed: uninstallPlan.plan.length > 0, plan: uninstallPlan.plan };
  } catch (error) {
    restoreSnapshots(snapshot);
    throw new Error(`uninstall rolled back: ${error.message}`);
  }
}

function doctor(paths, state) {
  const issues = [];
  for (const [relative, record] of Object.entries(state.artifacts)) {
    let target;
    try {
      target = resolveStateTarget(paths.targetRoot, relative);
    } catch (error) {
      issues.push(error.message);
      continue;
    }
    const actual = currentArtifactChecksum(target, record.kind);
    if (actual !== record.checksum) issues.push(`${relative}: missing, modified, or wrong artifact kind`);
  }
  const instructionCache = new Map();
  for (const [policyId, record] of Object.entries(state.managed_blocks)) {
    let instruction;
    try {
      instruction = resolveStateTarget(paths.targetRoot, record.instruction_path);
      if (!instructionCache.has(instruction)) {
        instructionCache.set(instruction, parseManagedBlocks(fs.readFileSync(instruction, "utf8")));
      }
      const block = instructionCache.get(instruction).find(({ policy_id: id }) => id === policyId);
      if (
        !block ||
        block.pack_id !== record.pack_id ||
        block.version !== record.version ||
        block.actual_checksum !== record.checksum ||
        block.declared_checksum !== record.checksum
      ) {
        issues.push(`${record.instruction_path}: policy ${policyId} is missing or modified`);
      }
    } catch (error) {
      issues.push(`${record.instruction_path}: ${error.message}`);
    }
  }
  return issues;
}

export function execute(argv, context = {}) {
  const sourceRoot = path.resolve(
    context.sourceRoot ?? path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".."),
  );
  const environment = {
    cwd: path.resolve(context.cwd ?? process.cwd()),
    home: path.resolve(context.home ?? os.homedir()),
    xdgStateHome: context.xdgStateHome ?? process.env.XDG_STATE_HOME,
  };
  const options = parseOptions(argv);
  const repository = loadRepository(sourceRoot);

  if (options.command === "list") {
    let installed = {};
    if (options.scope) {
      const paths = pathsFor(options, environment);
      installed = readState(paths.stateFile, options.scope, paths.targetRoot).packs;
    }
    return {
      command: "list",
      packs: [...repository.packs.values()].map((pack) => ({
        id: pack.id,
        version: pack.version,
        status: pack.status,
        distribution: pack.distribution,
        installed: installed[pack.id]?.version ?? null,
      })),
    };
  }

  const paths = pathsFor(options, environment);
  const state = readState(paths.stateFile, options.scope, paths.targetRoot);
  if (options.command === "doctor") {
    const issues = doctor(paths, state);
    return { command: "doctor", healthy: issues.length === 0, issues };
  }
  if (options.command === "install") {
    const plan = buildInstallPlan(options, repository, paths, state, sourceRoot);
    context.beforeApply?.(plan);
    return { command: "install", pack: options.pack, dry_run: options.dry_run, ...performInstall(options, plan, paths, state) };
  }
  const plan = buildUninstallPlan(options.pack, paths, state);
  return { command: "uninstall", pack: options.pack, dry_run: options.dry_run, ...performUninstall(options, plan, options.pack, paths, state) };
}
