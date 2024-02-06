import { AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { Button, Header, Screen, Text, TextField } from "app/components"
import { View, ViewStyle } from "react-native"
import { spacing } from "app/theme"

interface UserScreenProps extends AppStackScreenProps<"User"> {}

export const UserScreen: FC<UserScreenProps> = observer(function UserScreen({ navigation }) {
  return (
    <Screen preset="auto">
      <Header leftIcon="back" onLeftPress={() => navigation.goBack()} />
      <View style={$root}>
        <View style={$top}>
          <Text preset="heading" text="Login" style={$heading} />
          <Text text={"No registration, now"} style={$signTip} />
        </View>
        <TextField label="Email" placeholder="email" />
        <TextField label="Password" placeholder="password" secureTextEntry />
        <Button text="Login" style={$addButton} preset="reversed" />
      </View>
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
