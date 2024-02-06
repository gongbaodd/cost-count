import { AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"
import React, { FC, useCallback, useState, useSyncExternalStore } from "react"
import { Button, Header, Screen, Text, TextField } from "app/components"
import { View, ViewStyle } from "react-native"
import { spacing } from "app/theme"
import { UserStore } from "app/models"

interface UserScreenProps extends AppStackScreenProps<"User"> {}

export const UserScreen: FC<UserScreenProps> = observer(function UserScreen({ navigation }) {
  const user = useSyncExternalStore(UserStore.subscribe, UserStore.getSnapshot)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onLoginPress = useCallback(async () => {
    try {
      await UserStore.login({ email, password })
    } catch (error) {}
  }, [])

  return (
    <Screen preset="auto">
      <Header leftIcon="back" onLeftPress={() => navigation.goBack()} />
      {!user && (
        <View style={$root}>
          <View style={$top}>
            <Text preset="heading" text="Login" style={$heading} />
            <Text text={"No registration, now"} style={$signTip} />
          </View>
          <TextField label="Email" placeholder="email" value={email} onChangeText={setEmail} />
          <TextField
            label="Password"
            placeholder="password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button text="Login" style={$addButton} preset="reversed" onPress={onLoginPress} />
        </View>
      )}
      {user && (
        <View style={$root}>
          <Text text={`Welcome, ${user.email}`} />
          <Button text="Logout" style={$addButton} preset="reversed" onPress={UserStore.logout} />
        </View>
      )}
    </Screen>
  )
})

const $root: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $top: ViewStyle = {
  alignItems: "center",
  paddingBottom: spacing.lg,
}

const $heading: ViewStyle = {}

const $signTip: ViewStyle = {
  marginTop: spacing.lg,
}

const $addButton: ViewStyle = {
  marginTop: spacing.xl,
}
