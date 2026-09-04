/**
 * Starts the Android emulator (if it is not running yet) and then launches Expo
 * in localhost mode, so Metro is reached through `adb reverse` instead of the
 * host LAN address — the LAN path breaks while a VPN tunnel is active.
 *
 * Usage: node scripts/start-android.mjs [...extra expo args]
 * Example: node scripts/start-android.mjs --clear
 */
import { execFileSync, spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { homedir, platform } from 'node:os'
import { join } from 'node:path'

/** Name of the AVD created for this project. */
const DEFAULT_AVD_NAME = 'finapp_pixel7'
/** How long to wait for the emulator to finish booting. */
const BOOT_TIMEOUT_MS = 180_000
/** Delay between boot-state polls. */
const BOOT_POLL_INTERVAL_MS = 2_000
/** Value reported by `sys.boot_completed` once Android is ready. */
const BOOT_COMPLETED_FLAG = '1'

/**
 * Forces Node to resolve `localhost` to IPv4. Without it Metro binds `::1` only,
 * while `adb reverse` forwards the device to the host IPv4 loopback, and Expo Go
 * fails with `java.io.IOException: Failed to download remote update`.
 */
const IPV4_FIRST_NODE_OPTION = '--dns-result-order=ipv4first'

const isWindows = platform() === 'win32'
const exe = (name) => (isWindows ? `${name}.exe` : name)

/** Resolves the Android SDK location from env vars, falling back to OS defaults. */
function resolveSdkRoot() {
  const fromEnv = process.env['ANDROID_HOME'] ?? process.env['ANDROID_SDK_ROOT']
  if (fromEnv) return fromEnv

  const defaults = {
    win32: join(process.env['LOCALAPPDATA'] ?? '', 'Android', 'Sdk'),
    darwin: join(homedir(), 'Library', 'Android', 'sdk'),
    linux: join(homedir(), 'Android', 'Sdk'),
  }
  return defaults[platform()] ?? defaults.linux
}

const sdkRoot = resolveSdkRoot()
const adbPath = join(sdkRoot, 'platform-tools', exe('adb'))
const emulatorPath = join(sdkRoot, 'emulator', exe('emulator'))

/** Runs adb and returns trimmed stdout, or null when the call fails. */
function adb(args) {
  try {
    return execFileSync(adbPath, args, { encoding: 'utf8' }).trim()
  } catch {
    return null
  }
}

/** True when at least one emulator is attached and out of the `offline` state. */
function isEmulatorAttached() {
  const output = adb(['devices'])
  if (!output) return false
  return output
    .split('\n')
    .slice(1)
    .some((line) => line.startsWith('emulator-') && line.trim().endsWith('device'))
}

/** True when Android inside the emulator finished booting. */
function isBootCompleted() {
  return isEmulatorAttached() && adb(['shell', 'getprop', 'sys.boot_completed']) === BOOT_COMPLETED_FLAG
}

/** Launches the emulator detached so it survives this script exiting. */
function launchEmulator(avdName) {
  console.log(`> starting emulator ${avdName}`)
  const child = spawn(emulatorPath, ['-avd', avdName], { detached: true, stdio: 'ignore' })
  child.unref()
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** Polls the emulator until Android reports a completed boot. */
async function waitForBoot() {
  const deadline = Date.now() + BOOT_TIMEOUT_MS
  while (Date.now() < deadline) {
    if (isBootCompleted()) return
    await sleep(BOOT_POLL_INTERVAL_MS)
  }
  throw new Error(`Emulator did not finish booting within ${BOOT_TIMEOUT_MS / 1_000}s`)
}

/** Starts Expo in localhost mode and mirrors its exit code. */
function startExpo(extraArgs) {
  const args = ['expo', 'start', '--android', '--localhost', ...extraArgs]
  console.log(`> npx ${args.join(' ')}`)
  const nodeOptions = `${process.env['NODE_OPTIONS'] ?? ''} ${IPV4_FIRST_NODE_OPTION}`.trim()
  const child = spawn('npx', args, {
    stdio: 'inherit',
    shell: isWindows,
    env: { ...process.env, NODE_OPTIONS: nodeOptions },
  })
  child.on('exit', (code) => process.exit(code ?? 0))
}

async function main() {
  if (!existsSync(adbPath)) {
    throw new Error(`adb not found at ${adbPath}. Set ANDROID_HOME to your Android SDK folder.`)
  }

  const avdName = process.env['EXPO_AVD_NAME'] ?? DEFAULT_AVD_NAME

  if (isBootCompleted()) {
    console.log('> emulator already running')
  } else {
    if (!existsSync(emulatorPath)) {
      throw new Error(`emulator not found at ${emulatorPath}`)
    }
    if (!isEmulatorAttached()) launchEmulator(avdName)
    console.log('> waiting for emulator to boot')
    await waitForBoot()
    console.log('> emulator ready')
  }

  startExpo(process.argv.slice(2))
}

main().catch((error) => {
  console.error(`\n${error.message}\n`)
  process.exit(1)
})
