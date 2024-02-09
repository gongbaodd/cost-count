import {
  Button,
  EmptyState,
  Header,
  Screen,
  Text,
  TextField,
} from "@/packages/ignite";
import { UserStore } from "@/packages/models";
import { spacing } from "@/packages/theme";
import { router } from "expo-router";
import { Suspense, useCallback, useState, useSyncExternalStore } from "react";
import { View, ViewStyle } from "react-native";

const running = require("../../assets/images/running.png");

export default function User() {
  let fetchUser: Promise<void> | null = null;

  fetchUser = UserStore.load().finally(() => {
    fetchUser = null;
  });

  return (
    <Screen preset="auto">
      <Header leftIcon="back" onLeftPress={() => router.back()} />
      <Suspense fallback={<Loading />}>
        <Info />
      </Suspense>
    </Screen>
  );

  function Info() {
    if (fetchUser) {
      throw fetchUser;
    }

    const user = useSyncExternalStore(
      UserStore.subscribe,
      UserStore.getSnapshot
    );

    if (!user) {
      return <Login />;
    }

    return <Logout />;

    function Logout() {
      return (
        <View style={$root}>
          <Text text={`Welcome, ${user?.email}`} />
          <Button
            text="Logout"
            style={$addButton}
            preset="reversed"
            onPress={UserStore.logout}
          />
        </View>
      );
    }
  }

  function Login() {
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
    );
  }

  function Loading() {
    return (
      <EmptyState
        style={$empty}
        imageSource={running}
        content="Loading user information"
        heading="Please wait"
        button="Go back"
        buttonOnPress={goBack}
      />
    );
  }
}

function goBack() {
  router.back();
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

const $empty: ViewStyle = {
  flex: 1,
  paddingLeft: spacing.lg,
  paddingRight: spacing.lg,
  paddingTop: spacing.xxxl,
};
