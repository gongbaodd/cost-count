import Config from "@/packages/config";
import { ErrorBoundary } from "@/packages/ignite/ErrorScreen/ErrorBoundary";
import { Stack } from "expo-router";
import { ViewStyle } from "react-native";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";

if (__DEV__) {
  // Load Reactotron configuration in development. We don't want to
  // include this in our production bundle, so we are using `if (__DEV__)`
  // to only execute this in development.
  require("../packages/devtools/ReactotronConfig.ts")
}

export default function RootLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen
            name="category/index"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen name="record/index" />
          <Stack.Screen name="record/[id]" />
          <Stack.Screen name="user/index" />
        </Stack>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const $container: ViewStyle = {
  flex: 1,
};
