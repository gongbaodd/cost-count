import { Stack } from "expo-router";

export default function RootLayout() {
  return (
      <Stack screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="category/index" options={{ presentation: 'modal' }} />
        <Stack.Screen name="record/index"/>
        <Stack.Screen name="record/[id]" />
        <Stack.Screen name="user/index"  />
      </Stack>
  );
}
