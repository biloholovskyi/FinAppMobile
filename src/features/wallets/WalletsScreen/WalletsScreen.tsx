import { Text, View } from "react-native";

import { useWalletsScreen } from "./useWalletsScreen";

export function WalletsScreen() {
  useWalletsScreen();

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Wallets</Text>
    </View>
  );
}
