import { Button, Header, Screen, Text, TextField } from "@/packages/ignite";
import { UserStore } from "@/packages/models";
import { spacing } from "@/packages/theme";
import { router } from "expo-router";
import { useCallback, useState, useSyncExternalStore } from "react";
import { View, ViewStyle } from "react-native";

export default function User() {
  const user = useSyncExternalStore(UserStore.subscribe, UserStore.getSnapshot);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLoginPress = useCallback(async () => {
    if (!email || !password) {
      return;
    }
    try {
      await UserStore.login({ email, password });
    } catch (error) {}
  }, [email, password]);

  return (
    <Screen preset="auto">
      <Header leftIcon="back" onLeftPress={() => router.back()} />
      {!user && (
        <View style={$root}>
          <View style={$top}>
            <Text preset="heading" text="Login" style={$heading} />
            <Text text={"No registration, now"} style={$signTip} />
          </View>
          <TextField
            label="Email"
            placeholder="email"
            value={email}
            onChangeText={setEmail}
          />
          <TextField
            label="Password"
            placeholder="password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button
            text="Login"
            style={$addButton}
            preset="reversed"
            onPress={onLoginPress}
          />
        </View>
      )}
      {user && (
        <View style={$root}>
          <Text text={`Welcome, ${user.email}`} />
          <Button
            text="Logout"
            style={$addButton}
            preset="reversed"
            onPress={UserStore.logout}
          />
        </View>
      )}
    </Screen>
  );
}

const $root: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
};

const $top: ViewStyle = {
  alignItems: "center",
  paddingBottom: spacing.lg,
};

const $heading: ViewStyle = {};

const $signTip: ViewStyle = {
  marginTop: spacing.lg,
};

const $addButton: ViewStyle = {
  marginTop: spacing.xl,
};
