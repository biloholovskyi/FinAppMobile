import { Text, View } from "react-native";

import { useTransactionsScreen } from "./useTransactionsScreen";

export function TransactionsScreen() {
  useTransactionsScreen();

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Transactions</Text>
    </View>
  );
}
