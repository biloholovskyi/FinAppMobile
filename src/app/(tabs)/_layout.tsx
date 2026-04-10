import { Tabs } from 'expo-router'
import { Home, List } from 'lucide-react-native'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#10101C',
          borderTopColor: 'rgba(255,255,255,0.04)',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#4F9EFF',
        tabBarInactiveTintColor: '#44445A',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Главная',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="operations"
        options={{
          title: 'Операции',
          tabBarIcon: ({ color, size }) => <List color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}
