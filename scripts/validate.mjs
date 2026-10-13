#!/usr/bin/env node
// Checks the marketplace and plugin manifests, the MCP config, and skill and
// rule frontmatter. Run from the repo root: node scripts/validate.mjs

import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors = [];
const namePattern = /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/;

async function readJson(file) {
  try {
    return JSON.parse(await fs.readFile(path.join(root, file), "utf8"));
  } catch (error) {
    errors.push(`${file}: ${error.message}`);
    return null;
  }
}

async function exists(file) {
  return fs.access(path.join(root, file)).then(() => true, () => false);
}

async function frontmatter(file, keys) {
  const text = await fs.readFile(path.join(root, file), "utf8");
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return errors.push(`${file}: missing YAML frontmatter`);
  for (const key of keys) {
    if (!new RegExp(`^${key}:`, "m").test(match[1])) errors.push(`${file}: frontmatter has no "${key}"`);
  }
}

const marketplace = await readJson(".cursor-plugin/marketplace.json");
for (const entry of marketplace?.plugins ?? []) {
  const dir = path.normalize(entry.source);
  const manifest = await readJson(path.join(dir, ".cursor-plugin/plugin.json"));
  if (!manifest) continue;
  if (!namePattern.test(manifest.name ?? "")) errors.push(`${dir}: invalid plugin name "${manifest.name}"`);
  if (manifest.name !== entry.name) errors.push(`${dir}: name "${manifest.name}" does not match marketplace entry "${entry.name}"`);
  if (manifest.logo && !(await exists(path.join(dir, manifest.logo)))) errors.push(`${dir}: logo ${manifest.logo} is missing`);

  const mcp = await readJson(path.join(dir, "mcp.json"));
  for (const [name, server] of Object.entries(mcp?.mcpServers ?? {})) {
    // Grok Bot attaches only hosted servers, never stdio or localhost.
    if (!/^https:\/\/(?!localhost|127\.)/.test(server.url ?? "")) errors.push(`${dir}/mcp.json: ${name} needs a hosted https url`);
  }

  for (const skill of await fs.readdir(path.join(root, dir, "skills"))) {
    const file = path.join(dir, "skills", skill, "SKILL.md");
    await frontmatter(file, ["name", "description"]);
    const text = await fs.readFile(path.join(root, file), "utf8");
    if (!new RegExp(`^name: ${skill}$`, "m").test(text)) errors.push(`${file}: name must be "${skill}"`);
  }
  for (const rule of await fs.readdir(path.join(root, dir, "rules"))) {
    await frontmatter(path.join(dir, "rules", rule), ["description"]);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}
console.log("Validation passed.");
