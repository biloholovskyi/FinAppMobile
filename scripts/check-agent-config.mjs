/**
 * Checks that the agent configuration stays consistent across clients:
 * canon files in `ai/` ↔ Claude adapters (`.claude/`) ↔ Codex adapters
 * (`.agents/skills/`, `.codex/agents/`), invocation policy per skill class,
 * and that every referenced project path exists.
 *
 * Transitional mode (default) checks only pairs that already started migrating
 * and tolerates missing targets that later phases create. Strict mode requires
 * the full expected set.
 *
 * Usage: node scripts/check-agent-config.mjs [--strict] [--root <dir>]
 */
import { Buffer } from 'node:buffer'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, posix, relative, resolve, sep } from 'node:path'

/** Skills that must have one canon procedure and two client adapters. */
const EXPECTED_SKILLS = [
  'audit-plan', 'audit-security', 'commit', 'deploy-preflight', 'eas-build', 'eas-status', 'eas-submit',
  'implement-plan-step', 'lint', 'post-code', 'review-react-perf', 'start-task', 'typecheck', 'ui-ux-pro-max',
]
/** Skills with external side effects: explicit invocation only, in both clients. */
const MANUAL_SKILLS = new Set(['eas-build', 'eas-submit'])
/** Roles that must have one canon and two client adapters. */
const EXPECTED_ROLES = [
  'code-reviewer', 'codebase-researcher', 'command-runner', 'dependency-analyst', 'eas-deployer',
  'finapp-mobile-expert', 'full-package-auditor', 'plan-auditor', 'react-performance-reviewer', 'screen-designer',
]
/** Entry points and indexes required once the migration is complete. */
const STRICT_ENTRY_POINTS = [
  'AGENTS.md', 'CLAUDE.md', 'ai/agents/INDEX.md', '.claude/INDEX.md', '.codex/README.md', '.codex/config.toml',
]
/** Codex concatenates AGENTS.md into every turn — byte budget. */
const AGENTS_MD_MAX_BYTES = 12 * 1_024
/** Codex concatenates AGENTS.md into every turn — line budget. */
const AGENTS_MD_MAX_LINES = 150
/** Repo-root prefixes that mark a backtick token as a project path. */
const PATH_PREFIXES = ['ai/', 'plans/', 'scripts/', 'src/', 'designs/', 'docs/', '.claude/', '.codex/', '.agents/', '.github/']
/** Root-level files checked when mentioned without a directory. */
const ROOT_FILES = new Set([
  'AGENTS.md', 'CLAUDE.md', 'CHANGELOG.md', 'package.json', 'app.json', 'eas.json', 'tsconfig.json',
  '.mcp.json', 'yarn.lock', 'eslint.config.js', 'orval.config.ts',
])
/** Markers of template paths that describe a pattern, not a concrete file. */
const TEMPLATE_MARKERS = ['<', '>', '*', '{', '}', 'YYYY', 'XX', '$', '...']
/** Targets created by later phases; tolerated as missing in transitional mode only. */
const PENDING_TARGETS = [
  'AGENTS.md', 'ai/agents/', 'ai/skills/', '.agents/skills/', '.codex/agents/', '.codex/README.md', '.claude/INDEX.md',
]
/** Paths the rules name on purpose as forbidden or as the future home of code. */
const INTENTIONALLY_ABSENT = new Set(['docs/plans/', 'src/shared/stores/', 'src/shared/utils/platform.ts'])
/** Files and directories scanned for path references. */
const SCAN_ROOTS = ['AGENTS.md', 'CLAUDE.md', 'ai', '.claude', '.codex', '.agents']
/** Subtrees skipped by the path scan: client memory, history, local settings, skill data. */
const SCAN_EXCLUDES = [
  '.claude/agent-memory/', '.claude/reviews/', '.claude/settings.local.json',
  'ai/skills/ui-ux-pro-max/data/', '.claude/skills/ui-ux-pro-max/data/',
]
/** Extensions of files that the path scan reads. */
const SCAN_EXTENSIONS = ['.md', '.toml', '.json', '.yaml', '.yml', '.rules']
/** Matches a repo-root path inside config values. */
const CONFIG_PATH_RE = /(?<![\w./-])((?:ai|plans|scripts|src|designs|docs|\.claude|\.codex|\.agents|\.github)\/[\w./-]*[\w-])/g
/** Matches a skill canon reference. */
const SKILL_CANON_RE = /ai\/skills\/([\w-]+)\/procedure\.md/g
/** Matches a role canon reference. */
const ROLE_CANON_RE = /ai\/agents\/([\w-]+)\.md/g

class UnsupportedSyntaxError extends Error {}

// ---------------------------------------------------------------- CLI context

function parseArgs(argv) {
  const args = { strict: false, root: process.cwd() }
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--strict') args.strict = true
    else if (argv[i] === '--root' && argv[i + 1]) args.root = resolve(argv[++i])
    else throw new Error(`Unknown argument: ${argv[i]}`)
  }
  return args
}

function createContext({ strict, root }) {
  const violations = []
  return {
    strict,
    root,
    abs: (rel) => join(root, ...rel.split('/')),
    has: (rel) => existsSync(join(root, ...rel.split('/'))),
    read: (rel) => readFileSync(join(root, ...rel.split('/')), 'utf8').replace(/\r\n/g, '\n'),
    report: (file, message) => violations.push(`${file}: ${message}`),
    violations,
  }
}

function listDir(ctx, rel, { dirs }) {
  if (!ctx.has(rel)) return []
  return readdirSync(ctx.abs(rel), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() === dirs)
    .map((entry) => entry.name)
}

// ---------------------------------------------------------------- YAML subset

/** Decodes escapes of a double-quoted YAML or basic TOML string. */
function decodeEscapes(raw) {
  const simple = { '\\': '\\', '"': '"', '/': '/', n: '\n', t: '\t', r: '\r', b: '\b', f: '\f', 0: '\0' }
  return raw.replace(/\\(u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8}|x[0-9a-fA-F]{2}|.)/g, (_, esc) => {
    if (esc in simple) return simple[esc]
    if (/^[uUx]/.test(esc) && esc.length > 1) return String.fromCodePoint(parseInt(esc.slice(1), 16))
    throw new UnsupportedSyntaxError(`unknown escape \\${esc}`)
  })
}

/** Reads a quoted scalar that must close on the same line. */
function readQuoted(value, quote) {
  const re = quote === '"' ? /^"((?:[^"\\]|\\.)*)"\s*(#.*)?$/ : /^'((?:[^']|'')*)'\s*(#.*)?$/
  const match = value.match(re)
  if (!match) throw new UnsupportedSyntaxError(`multi-line or unterminated ${quote}-quoted scalar`)
  return quote === '"' ? decodeEscapes(match[1]) : match[1].replace(/''/g, "'")
}

function readPlain(value, nextLine, indent) {
  const text = value.replace(/\s+#.*$/, '').trim()
  if (/^[[{&*!%@`|>]/.test(text)) throw new UnsupportedSyntaxError(`unsupported scalar start in "${text}"`)
  if (/:\s|:$/.test(text)) throw new UnsupportedSyntaxError(`plain scalar contains ": " — quote it: "${text}"`)
  if (nextLine && indentOf(nextLine) > indent && !isKeyLine(nextLine)) {
    throw new UnsupportedSyntaxError(`multi-line plain scalar after "${text}"`)
  }
  if (text === 'true' || text === 'false') return text === 'true'
  return text
}

const indentOf = (line) => line.match(/^ */)[0].length
const isBlank = (line) => /^\s*(#.*)?$/.test(line)
const isKeyLine = (line) => /^ *[A-Za-z0-9_-]+:(\s|$)/.test(line)

/** Reads a `|` or `>` block scalar; returns [value, nextIndex]. */
function readBlockScalar(header, lines, start, indent) {
  const match = header.match(/^([|>])([+-]?)\s*$/)
  if (!match) throw new UnsupportedSyntaxError(`unsupported block scalar header "${header}"`)
  let end = start
  while (end < lines.length && (lines[end].trim() === '' || indentOf(lines[end]) > indent)) end++
  const body = lines.slice(start, end)
  const indents = body.filter((l) => l.trim()).map(indentOf)
  if (indents.length === 0) throw new UnsupportedSyntaxError(`empty block scalar "${header}"`)
  const contentIndent = Math.min(...indents)
  const content = body.map((l) => l.slice(contentIndent))
  while (content.length && content[content.length - 1] === '') content.pop()
  const text = match[1] === '|' ? content.join('\n') : foldLines(content)
  const chomped = match[2] === '-' ? text : `${text}\n`
  return [chomped, end]
}

/** YAML folding: lines of a paragraph join with a space, each blank line becomes a newline. */
function foldLines(lines) {
  if (lines.length === 0) return ''
  return lines.reduce((acc, line, i) => {
    if (i === 0) return line
    if (line === '') return `${acc}\n`
    return acc.endsWith('\n') || acc === '' ? `${acc}${line}` : `${acc} ${line}`
  }, '')
}

function nextMeaningful(lines, from) {
  let i = from
  while (i < lines.length && isBlank(lines[i])) i++
  return i
}

/** Parses a block list of scalars; returns [array, nextIndex]. */
function readList(lines, start, indent) {
  const items = []
  let i = nextMeaningful(lines, start)
  while (i < lines.length && indentOf(lines[i]) === indent && /^ *- /.test(lines[i])) {
    const value = lines[i].trim().slice(2).trim()
    items.push(value.startsWith('"') || value.startsWith("'") ? readQuoted(value, value[0]) : readPlain(value, null, indent))
    i = nextMeaningful(lines, i + 1)
  }
  return [items, i]
}

/** Parses the value that follows `key:`; returns [value, nextIndex]. */
function readValue(value, lines, next, indent) {
  if (value === '') {
    const peek = nextMeaningful(lines, next)
    if (peek >= lines.length) return [null, peek]
    if (/^ *- /.test(lines[peek]) && indentOf(lines[peek]) >= indent) return readList(lines, peek, indentOf(lines[peek]))
    if (indentOf(lines[peek]) > indent) return parseYamlMapping(lines, peek, indentOf(lines[peek]))
    return [null, peek]
  }
  if (value[0] === '|' || value[0] === '>') return readBlockScalar(value, lines, next, indent)
  if (value[0] === '"' || value[0] === "'") return [readQuoted(value, value[0]), next]
  return [readPlain(value, lines[next], indent), next]
}

/** Parses a mapping at a fixed indentation; returns [object, nextIndex]. */
function parseYamlMapping(lines, start, indent) {
  const data = {}
  let i = nextMeaningful(lines, start)
  while (i < lines.length) {
    const line = lines[i]
    if (line.includes('\t')) throw new UnsupportedSyntaxError('tab indentation')
    if (indentOf(line) < indent) break
    const match = line.match(/^( *)([A-Za-z0-9_-]+):(?:\s+(.*))?$/)
    if (!match || match[1].length !== indent) throw new UnsupportedSyntaxError(`unsupported line "${line.trim()}"`)
    if (match[2] in data) throw new UnsupportedSyntaxError(`duplicate key "${match[2]}"`)
    const [value, next] = readValue((match[3] ?? '').trim(), lines, i + 1, indent)
    data[match[2]] = value
    i = nextMeaningful(lines, next)
  }
  return [data, i]
}

function parseYaml(text) {
  if (/^(---|\.\.\.)\s*$/m.test(text)) throw new UnsupportedSyntaxError('multiple YAML documents')
  return parseYamlMapping(text.split('\n'), 0, 0)[0]
}

/** Splits `---` frontmatter from the body; null frontmatter when absent. */
function splitFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---(?:\n|$)([\s\S]*)$/)
  return match ? { yaml: match[1], body: match[2] } : { yaml: null, body: text }
}

// ---------------------------------------------------------------- TOML subset

function readTomlMultiline(lines, i, rest, delim) {
  let text = rest.startsWith('\n') ? rest.slice(1) : rest
  let j = i
  while (!text.includes(delim)) {
    j++
    if (j >= lines.length) throw new UnsupportedSyntaxError(`unterminated ${delim} string`)
    text += `\n${lines[j]}`
  }
  const end = text.indexOf(delim)
  if (text.slice(end + 3).trim().replace(/^#.*/, '') !== '') throw new UnsupportedSyntaxError('content after multi-line string')
  const raw = text.slice(0, end).replace(/^\n/, '')
  const value = delim === '"""' ? decodeEscapes(raw.replace(/\\\n\s*/g, '')) : raw
  return [value, j + 1]
}

function readTomlScalar(raw) {
  const text = raw.replace(/\s+#.*$/, '').trim()
  let match = text.match(/^"((?:[^"\\]|\\.)*)"$/)
  if (match) return decodeEscapes(match[1])
  match = text.match(/^'([^']*)'$/)
  if (match) return match[1]
  if (text === 'true' || text === 'false') return text === 'true'
  if (/^[+-]?\d[\d_]*(\.\d+)?$/.test(text)) return Number(text.replace(/_/g, ''))
  match = text.match(/^\[(.*)\]$/)
  if (match) return match[1].trim() === '' ? [] : match[1].split(',').map((item) => readTomlScalar(item))
  throw new UnsupportedSyntaxError(`unsupported TOML value "${text}"`)
}

function parseToml(text) {
  const lines = text.split('\n')
  const data = {}
  let table = data
  let i = 0
  while (i < lines.length) {
    const line = lines[i].trim()
    if (line === '' || line.startsWith('#')) { i++; continue }
    const header = line.match(/^\[([A-Za-z0-9_.-]+)\]\s*(#.*)?$/)
    if (header) {
      table = header[1].split('.').reduce((node, key) => (node[key] ??= {}), data)
      i++
      continue
    }
    const pair = lines[i].match(/^\s*([A-Za-z0-9_-]+)\s*=\s*(.*)$/)
    if (!pair) throw new UnsupportedSyntaxError(`unsupported TOML line "${line}"`)
    const delim = ['"""', "'''"].find((d) => pair[2].startsWith(d))
    if (delim) [table[pair[1]], i] = readTomlMultiline(lines, i, pair[2].slice(3), delim)
    else [table[pair[1]], i] = [readTomlScalar(pair[2]), i + 1]
  }
  return data
}

// ---------------------------------------------------------------- Pair checks

/** Parses an adapter or reports the syntax error; returns null on failure. */
function load(ctx, rel, kind) {
  try {
    const text = ctx.read(rel)
    if (kind === 'toml') return { data: parseToml(text), body: '' }
    if (kind === 'yaml') return { data: parseYaml(text), body: '' }
    const { yaml, body } = splitFrontmatter(text)
    if (yaml === null) throw new UnsupportedSyntaxError('missing --- frontmatter')
    return { data: parseYaml(yaml), body }
  } catch (error) {
    if (!(error instanceof UnsupportedSyntaxError)) throw error
    ctx.report(rel, `unsupported syntax: ${error.message}`)
    return null
  }
}

/** Ensures `text` references its own canon and no other canon of the same kind. */
function checkCanonPointer(ctx, rel, text, canonRe, name) {
  const referenced = [...text.matchAll(canonRe)].map((m) => m[1]).filter((n) => n !== 'INDEX')
  if (!referenced.includes(name)) ctx.report(rel, `does not reference its canon for "${name}"`)
  for (const other of new Set(referenced.filter((n) => n !== name))) ctx.report(rel, `references a foreign canon "${other}"`)
}

function compareIdentity(ctx, name, claude, codex) {
  for (const field of ['name', 'description']) {
    if (claude.data[field] !== codex.data[field]) {
      ctx.report(name, `decoded "${field}" differs between Claude and Codex adapters`)
    }
  }
}

function checkCanonFile(ctx, rel) {
  if (!ctx.has(rel)) return ctx.report(rel, 'canon is missing')
  const text = ctx.read(rel)
  if (text.startsWith('---\n')) ctx.report(rel, 'canon must not have frontmatter')
  if (text.includes('$ARGUMENTS')) ctx.report(rel, 'canon must not use $ARGUMENTS')
}

function loadAdapter(ctx, rel, kind) {
  if (!ctx.has(rel)) {
    ctx.report(rel, 'adapter is missing')
    return null
  }
  return load(ctx, rel, kind)
}

function checkUnknownNames(ctx, found, expected, label) {
  for (const [name, where] of found) {
    if (!expected.includes(name)) ctx.report(where, `unknown ${label} "${name}"`)
  }
}

function checkSkillPolicy(ctx, name, claude) {
  const manual = MANUAL_SKILLS.has(name)
  if ((claude.data['disable-model-invocation'] === true) !== manual) {
    ctx.report(`.claude/skills/${name}/SKILL.md`, `disable-model-invocation must be ${manual ? 'true' : 'absent'}`)
  }
  const policyRel = `.agents/skills/${name}/agents/openai.yaml`
  if (manual && !ctx.has(policyRel)) return ctx.report(policyRel, 'policy file is missing for a manual skill')
  const policy = ctx.has(policyRel) ? load(ctx, policyRel, 'yaml') : null
  const implicit = policy?.data?.policy?.allow_implicit_invocation
  if (manual && implicit !== false) ctx.report(policyRel, 'policy.allow_implicit_invocation must be false')
  if (!manual && implicit === false) ctx.report(policyRel, 'implicit invocation must stay enabled for this skill class')
}

function checkSkill(ctx, name) {
  const canon = `ai/skills/${name}/procedure.md`
  const codexRel = `.agents/skills/${name}/SKILL.md`
  if (!ctx.strict && !ctx.has(canon) && !ctx.has(codexRel)) return
  checkCanonFile(ctx, canon)
  const claudeRel = `.claude/skills/${name}/SKILL.md`
  const claude = loadAdapter(ctx, claudeRel, 'md')
  const codex = loadAdapter(ctx, codexRel, 'md')
  for (const [rel, adapter] of [[claudeRel, claude], [codexRel, codex]]) {
    if (!adapter) continue
    if (adapter.data.name !== name) ctx.report(rel, `name must be "${name}"`)
    checkCanonPointer(ctx, rel, adapter.body, SKILL_CANON_RE, name)
  }
  if (claude && codex) compareIdentity(ctx, `skill ${name}`, claude, codex)
  if (claude) checkSkillPolicy(ctx, name, claude)
}

function checkRole(ctx, name) {
  const canon = `ai/agents/${name}.md`
  const codexRel = `.codex/agents/${name}.toml`
  if (!ctx.strict && !ctx.has(canon) && !ctx.has(codexRel)) return
  checkCanonFile(ctx, canon)
  const claudeRel = `.claude/agents/${name}.md`
  const claude = loadAdapter(ctx, claudeRel, 'md')
  const codex = loadAdapter(ctx, codexRel, 'toml')
  if (claude) checkCanonPointer(ctx, claudeRel, claude.body, ROLE_CANON_RE, name)
  if (codex) {
    for (const key of ['name', 'description', 'developer_instructions']) {
      if (typeof codex.data[key] !== 'string') ctx.report(codexRel, `"${key}" must be a string`)
    }
    checkCanonPointer(ctx, codexRel, codex.data.developer_instructions ?? '', ROLE_CANON_RE, name)
  }
  if (claude && codex) compareIdentity(ctx, `role ${name}`, claude, codex)
}

function collectSkillNames(ctx) {
  const found = []
  for (const base of ['ai/skills', '.claude/skills', '.agents/skills']) {
    for (const name of listDir(ctx, base, { dirs: true })) found.push([name, `${base}/${name}`])
  }
  return found
}

function collectRoleNames(ctx) {
  const found = []
  const sources = [['ai/agents', '.md'], ['.claude/agents', '.md'], ['.codex/agents', '.toml']]
  for (const [base, ext] of sources) {
    for (const file of listDir(ctx, base, { dirs: false })) {
      if (file.endsWith(ext) && file !== 'INDEX.md') found.push([file.slice(0, -ext.length), `${base}/${file}`])
    }
  }
  return found
}

function checkPairs(ctx) {
  const skills = collectSkillNames(ctx)
  const roles = collectRoleNames(ctx)
  checkUnknownNames(ctx, skills, EXPECTED_SKILLS, 'skill')
  checkUnknownNames(ctx, roles, EXPECTED_ROLES, 'role')
  EXPECTED_SKILLS.forEach((name) => checkSkill(ctx, name))
  EXPECTED_ROLES.forEach((name) => checkRole(ctx, name))
}

// ---------------------------------------------------------------- Entry points

function checkEntryPoints(ctx) {
  if (ctx.strict) {
    for (const rel of STRICT_ENTRY_POINTS) if (!ctx.has(rel)) ctx.report(rel, 'required entry point is missing')
  }
  if (!ctx.has('AGENTS.md')) return
  const text = ctx.read('AGENTS.md')
  const bytes = Buffer.byteLength(text, 'utf8')
  const lines = text.replace(/\n$/, '').split('\n').length
  if (bytes > AGENTS_MD_MAX_BYTES) ctx.report('AGENTS.md', `${bytes} bytes exceeds ${AGENTS_MD_MAX_BYTES}`)
  if (lines > AGENTS_MD_MAX_LINES) ctx.report('AGENTS.md', `${lines} lines exceeds ${AGENTS_MD_MAX_LINES}`)
}

// ---------------------------------------------------------------- Path scan

function walk(ctx, rel, out) {
  if (!ctx.has(rel)) return out
  if (SCAN_EXCLUDES.some((ex) => `${rel}/`.startsWith(ex) || rel === ex)) return out
  const entries = readdirSync(ctx.abs(rel), { withFileTypes: true })
  for (const entry of entries) {
    const child = `${rel}/${entry.name}`
    if (entry.isDirectory()) walk(ctx, child, out)
    else if (SCAN_EXTENSIONS.some((ext) => entry.name.endsWith(ext)) && !SCAN_EXCLUDES.includes(child)) out.push(child)
  }
  return out
}

function collectScanFiles(ctx) {
  const files = []
  for (const rel of SCAN_ROOTS) {
    if (!ctx.has(rel)) continue
    if (statSync(ctx.abs(rel)).isFile()) files.push(rel)
    else walk(ctx, rel, files)
  }
  return files
}

const isTemplate = (token) => TEMPLATE_MARKERS.some((marker) => token.includes(marker))
const isProjectPath = (token) => PATH_PREFIXES.some((p) => token.startsWith(p)) || ROOT_FILES.has(token)

/** Extracts path references from a Markdown file, ignoring fenced code blocks. */
function markdownReferences(text) {
  const prose = text.replace(/^```[\s\S]*?^```/gm, '')
  const refs = []
  for (const [, span] of prose.matchAll(/`([^`\n]+)`/g)) {
    for (const token of span.split(/\s+/)) {
      const clean = token.replace(/[,;:)]+$/, '')
      if (isProjectPath(clean)) refs.push(clean)
    }
  }
  const outsideSpans = prose.replace(/`[^`\n]*`/g, '')
  for (const [, target] of outsideSpans.matchAll(/(?:^|[\s(])@([\w./-]+\.[A-Za-z]+)/gm)) refs.push(target)
  for (const [, target] of prose.matchAll(/\[[^\]\n]*\]\(([^)\s]+)\)/g)) {
    if (!/^(https?:|mailto:|#)/.test(target)) refs.push(target.split('#')[0])
  }
  return refs
}

function configReferences(text) {
  return [...text.matchAll(CONFIG_PATH_RE)].map((m) => m[1])
}

function resolveReference(ctx, file, ref) {
  const normalized = posix.normalize(ref.replace(/^\.\//, ''))
  const fromFile = relative(ctx.root, join(dirname(ctx.abs(file)), ...ref.split('/'))).split(sep).join('/')
  return { normalized, found: ctx.has(normalized) || ctx.has(fromFile) }
}

function isTolerated(ctx, normalized) {
  const withSlash = normalized.endsWith('/') ? normalized : `${normalized}/`
  if (INTENTIONALLY_ABSENT.has(withSlash) || INTENTIONALLY_ABSENT.has(normalized)) return true
  return !ctx.strict && PENDING_TARGETS.some((target) => withSlash === target || withSlash.startsWith(target))
}

function checkPaths(ctx) {
  const files = collectScanFiles(ctx)
  for (const file of files) {
    const text = ctx.read(file)
    const refs = file.endsWith('.md') ? markdownReferences(text) : configReferences(text)
    for (const ref of new Set(refs)) {
      if (ref === '' || isTemplate(ref)) continue
      const { normalized, found } = resolveReference(ctx, file, ref)
      if (!found && !isTolerated(ctx, normalized)) ctx.report(file, `broken reference "${ref}"`)
    }
  }
  return files.length
}

// ---------------------------------------------------------------- Main

function main() {
  const ctx = createContext(parseArgs(process.argv.slice(2)))
  checkEntryPoints(ctx)
  checkPairs(ctx)
  const scanned = checkPaths(ctx)
  const mode = ctx.strict ? 'strict' : 'transitional'
  if (ctx.violations.length > 0) {
    ctx.violations.sort().forEach((line) => console.error(line))
    console.error(`\nagents:check (${mode}) failed: ${ctx.violations.length} violation(s)`)
    process.exit(1)
  }
  console.log(`agents:check (${mode}) passed: ${scanned} files scanned`)
}

try {
  main()
} catch (error) {
  console.error(`\nagents:check crashed: ${error.message}\n`)
  process.exit(1)
}
