import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Transactions" }} />
      <Tabs.Screen name="wallets" options={{ title: "Wallets" }} />
    </Tabs>
  );
}
