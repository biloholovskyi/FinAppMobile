# Research — Android Emulator on Windows

Facts-only discovery. No solutioning.

## Host machine

| Fact | Value |
|------|-------|
| OS | Windows 11 Pro 10.0.26200 |
| CPU | AMD Ryzen 7 7700X, 8 cores |
| RAM | 31.2 GB |
| Free disk (C:) | 140.2 GB |
| `HypervisorPresent` | True (Hyper-V / VBS layer already active) |

## Installed tooling

| Tool | State |
|------|-------|
| `ANDROID_HOME` / `ANDROID_SDK_ROOT` | not set |
| `%LOCALAPPDATA%\Android\Sdk` | absent |
| Android Studio (`%ProgramFiles%\Android\Android Studio`) | absent |
| `adb` on PATH | absent |
| `java` on PATH | absent |

Conclusion: no part of the Android toolchain exists on this machine.

## Project facts

| Fact | Value | Source |
|------|-------|--------|
| Expo SDK | 54.0.33 | `package.json` |
| React Native | 0.81.5 | `package.json` |
| React | 19.1.0 | `package.json` |
| Expo Router | 6.0.23 | `package.json` |
| Package manager | yarn (`yarn.lock` present) | repo root |
| `android.package` in app config | absent (only `ios.bundleIdentifier` = `com.amitil13.finappmobile`) | `app.json` |
| Config plugins | `expo-router`, `expo-updates` | `app.json` |
| `expo-dev-client` | not a dependency | `package.json` |
| EAS build profiles | only `production` | `eas.json` |
| API base URL | `process.env['EXPO_PUBLIC_API_URL']` | `src/shared/api/base.ts:8` |
| `.env` / `.env.local` | absent in repo root | filesystem scan |
| Existing npm script | `"android": "expo start --android"` | `package.json:7` |

## Native module compatibility with Expo Go (SDK 54)

| Package | In Expo Go SDK 54 | Notes |
|---------|-------------------|-------|
| `expo-linear-gradient` | yes | used in `DashboardScreen.tsx` |
| `expo-router`, `expo-constants`, `expo-linking`, `expo-status-bar`, `expo-updates` | yes | Expo-owned |
| `react-native-reanimated` 4.1 + `react-native-worklets` | yes | SDK 54 bundles both |
| `react-native-screens`, `react-native-safe-area-context`, `react-native-svg` | yes | SDK 54 bundles them |
| `@react-native-community/datetimepicker` | yes | bundled in Expo Go |
| `react-native-gifted-charts` | yes | pure JS over `react-native-svg` |
| `lucide-react-native` | yes | pure JS over `react-native-svg` |
| `nativewind` 4 | yes | build-time Babel/Metro only |
| `react-native-linear-gradient` | **no** | declared in `package.json`, zero imports in `src/` |

Conclusion: every module actually imported by `src/` is available in Expo Go SDK 54. A custom dev client is not required for day-to-day work.

## Networking boundary facts

- Android emulator reaches the host loopback through the alias `10.0.2.2`; `localhost` inside the emulator resolves to the emulator itself.
- Expo CLI sets up `adb reverse` for the Metro port (8081) automatically for attached emulators/devices.
- Emulator traffic exits through the host network stack, so a host VPN tunnel is inherited; emulator DNS is the point that most often breaks under a VPN and can be overridden at emulator launch.
- AMD CPU + already-active Hyper-V means the emulator must use Windows Hypervisor Platform (WHPX). The AMD-specific `AEHD`/`gvm` driver is incompatible with an active Hyper-V stack.

## Open questions

| Question | Impact | Default assumption used by the plan |
|----------|--------|-------------------------------------|
| Is the API consumed from a locally running `fin-app-backend` or a remote host? | Value of `EXPO_PUBLIC_API_URL` | Plan covers both: `10.0.2.2:<port>` for local, plain URL for remote |
| Is the VPN required for reaching the API, or only for unrelated traffic? | Whether emulator DNS/proxy tuning is needed | Plan treats VPN as host-level and only adds DNS fallback steps |
| Is iOS coverage needed? | Not achievable on Windows | Out of scope — iOS simulator requires macOS |

## Related

- `plans/android-emulator-setup/android-emulator-setup-implementation-plan.md`
