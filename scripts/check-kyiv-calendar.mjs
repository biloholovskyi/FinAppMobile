/**
 * Checks the Kyiv calendar utility against the cross-project consistency scenarios
 * (backend plan `kyiv-calendar-unification`, phase 09). Every scenario runs under
 * several process time zones; the result must not depend on the device time zone.
 *
 * The utility is TypeScript: Node 24 strips types natively, and a resolve hook maps
 * the `@/` alias and extensionless specifiers to `.ts` files.
 *
 * Requires Node 22.15+ (`module.registerHooks` and type stripping).
 *
 * Usage: node scripts/check-kyiv-calendar.mjs
 */
import { existsSync, statSync } from 'node:fs'
import * as nodeModule from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'src')
/** Process time zones the scenarios must be stable under. */
const TIME_ZONES = ['UTC', 'America/New_York', 'Europe/Kyiv']
const NOW = new Date('2026-10-31T22:30:00.000Z')
const NATIVE_FORMAT_TO_PARTS = Intl.DateTimeFormat.prototype.formatToParts
/** Parts sources: native `formatToParts`, and the `format()` fallback Hermes may need. */
const PARTS_MODES = [
  { name: 'formatToParts', enable: () => { Intl.DateTimeFormat.prototype.formatToParts = NATIVE_FORMAT_TO_PARTS } },
  { name: 'format() fallback', enable: () => { delete Intl.DateTimeFormat.prototype.formatToParts } },
]

function isFile(path) {
  return existsSync(path) && statSync(path).isFile()
}

function toLocalPath(specifier, parentURL) {
  if (specifier.startsWith('@/')) return join(SRC, specifier.slice(2))
  if (specifier.startsWith('.') && parentURL?.startsWith('file:')) {
    return resolve(dirname(fileURLToPath(parentURL)), specifier)
  }
  return null
}

if (typeof nodeModule.registerHooks !== 'function') {
  console.error(`calendar:check needs Node 22.15+ (module.registerHooks); current ${process.version}`)
  process.exit(1)
}

nodeModule.registerHooks({
  resolve(specifier, context, nextResolve) {
    const base = toLocalPath(specifier, context.parentURL)
    const target = base && [base, `${base}.ts`, join(base, 'index.ts')].find(isFile)
    return nextResolve(target ? pathToFileURL(target).href : specifier, context)
  },
})

const calendar = await import('../src/shared/utils/kyivCalendar/index.ts')
const { getTransactionsDateWindow } = await import('../src/shared/utils/dateWindows.ts')

/**
 * Runs `run` while the engine reports Kyiv midnight as hour `24`
 * (some engines do this despite `hourCycle: 'h23'`); restores the prototype afterwards.
 */
function withMidnightAsHour24(run) {
  const proto = Intl.DateTimeFormat.prototype
  const formatDescriptor = Object.getOwnPropertyDescriptor(proto, 'format')
  const formatToParts = proto.formatToParts
  Object.defineProperty(proto, 'format', {
    configurable: true,
    get() {
      const format = formatDescriptor.get.call(this)
      return (date) => format(date).replace(' 00:', ' 24:')
    },
  })
  if (formatToParts) {
    proto.formatToParts = function (date) {
      return formatToParts.call(this, date).map((part) =>
        part.type === 'hour' && part.value === '00' ? { ...part, value: '24' } : part)
    }
  }
  try {
    return run()
  } finally {
    Object.defineProperty(proto, 'format', formatDescriptor)
    if (formatToParts) proto.formatToParts = formatToParts
  }
}

function errorName(run) {
  try {
    run()
    return 'no error'
  } catch (err) {
    return err instanceof Error ? err.name : String(err)
  }
}

/** @type {{ name: string; run: () => unknown; expected: unknown }[]} */
const SCENARIOS = [
  {
    name: 'Начало месяца',
    run: () => [calendar.getKyivCurrentMonthKey(NOW), calendar.getKyivToday(NOW)],
    expected: ['2026-11', '2026-11-01'],
  },
  {
    name: 'Граница транзакции',
    run: () => {
      const moment = '2026-09-30T21:30:00.000Z'
      return [calendar.getKyivMonthKey(moment), calendar.getKyivDayKey(moment)]
    },
    expected: ['2026-10', '2026-10-01'],
  },
  {
    name: 'Диапазон месяца',
    run: () => calendar.getKyivMonthRange('2026-10'),
    expected: { dateFrom: '2026-09-30T21:00:00.000Z', dateTo: '2026-10-31T21:59:59.999Z' },
  },
  {
    name: 'DST весна',
    run: () => calendar.getKyivMonthRange('2026-03'),
    expected: { dateFrom: '2026-02-28T22:00:00.000Z', dateTo: '2026-03-31T20:59:59.999Z' },
  },
  {
    name: 'Ключ бюджета',
    run: () => calendar.toBudgetMonthKey('2026-10'),
    expected: '2026-10-01T00:00:00.000Z',
  },
  {
    name: 'День из формы',
    run: () => {
      const stored = calendar.toStoredDay('2026-10-05')
      return [stored, calendar.formatStoredDay(stored, 'uk-UA')]
    },
    expected: ['2026-10-05T00:00:00.000Z', '05.10.2026'],
  },
  {
    name: 'Legacy-день',
    run: () => calendar.formatStoredDay('2026-08-15T21:00:00.000Z', 'uk-UA'),
    expected: '16.08.2026',
  },
  {
    name: 'Месяц плана',
    run: () => calendar.monthKeyFromStoredMonth('2026-10-31T23:59:59.999Z'),
    expected: '2026-10',
  },
  {
    name: 'Окно ленты',
    run: () => [getTransactionsDateWindow(0, NOW), getTransactionsDateWindow(1, NOW)],
    expected: [
      { dateFrom: '2026-09-21T21:00:00.000Z' },
      { dateFrom: '2026-09-11T21:00:00.000Z', dateTo: '2026-09-21T20:59:59.999Z' },
    ],
  },
  {
    name: 'Дни перехода DST',
    run: () => [
      calendar.getKyivDayStart('2026-03-29').toISOString(),
      calendar.getKyivDayStart('2026-03-30').toISOString(),
      calendar.getKyivDayStart('2026-10-25').toISOString(),
      calendar.getKyivDayStart('2026-10-26').toISOString(),
    ],
    expected: [
      '2026-03-28T22:00:00.000Z',
      '2026-03-29T21:00:00.000Z',
      '2026-10-24T21:00:00.000Z',
      '2026-10-25T22:00:00.000Z',
    ],
  },
  {
    name: 'Граница года',
    run: () => [
      calendar.shiftMonthKey('2026-12', 1),
      calendar.shiftMonthKey('2026-01', -1),
      calendar.shiftDayKey('2026-12-31', 1),
      calendar.getDaysInMonth('2028-02'),
      calendar.getDaysInMonth('2026-02'),
    ],
    expected: ['2027-01', '2025-12', '2027-01-01', 29, 28],
  },
  {
    name: 'Полночь как час 24',
    run: () => withMidnightAsHour24(() => calendar.getKyivParts('2026-01-15T22:30:00.000Z')),
    expected: { year: 2026, month: 1, day: 16, hour: 0, minute: 30, second: 0 },
  },
  {
    name: 'Невалидная дата',
    run: () => [errorName(() => calendar.getKyivDayKey('garbage')), calendar.monthKeyFromStoredMonth('2026-13-01')],
    expected: ['KyivCalendarError', null],
  },
  {
    name: 'Самопроверка',
    run: () => calendar.verifyKyivCalendar(),
    expected: { ok: true },
  },
]

/** `JSON.stringify` with sorted object keys, so key order does not affect the comparison. */
function stableStringify(value) {
  return JSON.stringify(value, (_key, item) =>
    item && typeof item === 'object' && !Array.isArray(item)
      ? Object.fromEntries(Object.entries(item).sort(([left], [right]) => left.localeCompare(right)))
      : item)
}

function runScenario({ run, expected }) {
  try {
    const actual = stableStringify(run())
    return { ok: actual === stableStringify(expected), actual }
  } catch (err) {
    return { ok: false, actual: `throws ${err instanceof Error ? err.message : String(err)}` }
  }
}

function runAll(label) {
  let failed = 0
  console.log(`\n${label}`)
  for (const scenario of SCENARIOS) {
    const { ok, actual } = runScenario(scenario)
    if (!ok) failed += 1
    const details = ok ? actual : `${actual} (expected ${stableStringify(scenario.expected)})`
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${scenario.name}: ${details}`)
  }
  return failed
}

let failedCount = 0
for (const mode of PARTS_MODES) {
  mode.enable()
  for (const timeZone of TIME_ZONES) {
    process.env.TZ = timeZone
    failedCount += runAll(`[${mode.name}] TZ=${timeZone}`)
  }
}
PARTS_MODES[0].enable()

console.log(failedCount === 0 ? '\nAll scenarios passed' : `\n${failedCount} scenario(s) failed`)
process.exit(failedCount === 0 ? 0 : 1)
