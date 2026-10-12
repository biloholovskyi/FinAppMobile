import "../../global.css";

import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { queryClient } from "@/shared/lib/queryClient";
import { verifyKyivCalendar } from "@/shared/utils/kyivCalendar";

/** В dev-сборке проверяет, что движок `Intl` считает киевский календарь верно. */
function useKyivCalendarSelfCheck() {
  useEffect(() => {
    if (!__DEV__) return;
    const result = verifyKyivCalendar();
    if (!result.ok) console.error(`[kyivCalendar] self-check failed: ${result.error}`);
  }, []);
}

export default function RootLayout() {
  useKyivCalendarSelfCheck();

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="transaction/[id]" options={{ headerShown: false }} />
          <Stack.Screen
            name="spending/[leafKey]"
            options={{
              headerShown: false,
              presentation: "formSheet",
              sheetAllowedDetents: [0.85],
              sheetGrabberVisible: true,
            }}
          />
          <Stack.Screen name="category/create" options={{ headerShown: false }} />
          <Stack.Screen name="category/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
