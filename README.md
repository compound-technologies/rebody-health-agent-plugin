# Rebody Health plugin (works with Grok Bot)

A Cursor-format plugin that connects an AI assistant to Rebody Health's
public catalog. Grok Bot installs plugins from the Cursor Marketplace, so the
same plugin works in Grok Bot and in Cursor.

Rebody Health (rebodyhealth.com) is a LegitScript-certified U.S. telehealth
service for adults. Every treatment starts with a private online visit, and a
licensed clinician decides whether to prescribe.

## What it adds

- The `rebody` MCP connector at `https://rebodyhealth.com/api/mcp/grok`
  (streamable HTTP, no login, no API key).
- The `rebody` skill: connect steps, the tool map, how to quote prices, and
  boundaries.
- The `rebody-find-a-treatment` skill: from a goal or a treatment name to a
  visit link.
- A `rebody` rule with the same boundaries, for Cursor.

The connector's tools are read-only. They list Rebody's treatments with
strengths and plan prices, check state availability, explain how a visit
works, and return a signed one-hour visit link that carries no personal data.
No tool takes a name, email, or health details, and the server stores
nothing an assistant sends.

## Install

- Grok Bot: Connect apps (Cmd+Shift+M), then add Rebody Health. Before the
  listing is approved, add a custom MCP server instead: name `rebody`, Remote
  HTTPS, URL `https://rebodyhealth.com/api/mcp/grok`, no auth.
- Cursor: install from the Marketplace, or copy `plugins/rebody-health` to
  `~/.cursor/plugins/local/rebody-health` and reload the window.

## Layout

```text
.cursor-plugin/marketplace.json      repo marketplace (one plugin)
plugins/rebody-health/
  .cursor-plugin/plugin.json         plugin manifest
  mcp.json                           rebody -> https://rebodyhealth.com/api/mcp/grok
  rules/rebody.mdc                   boundaries (Cursor)
  skills/rebody/SKILL.md             connect, tools, prices, boundaries
  skills/rebody-find-a-treatment/    goal -> options -> visit link
  assets/logo.png
scripts/validate.mjs                 manifest and frontmatter checks
```

Run `node scripts/validate.mjs` from the repo root before you submit.

Grok and Grok Bot are trademarks of SpaceXSI. This plugin is not made or
endorsed by SpaceXSI or Cursor.

## License

MIT. See `LICENSE`.
