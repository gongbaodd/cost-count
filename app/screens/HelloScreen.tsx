import React, { FC, useState, useSyncExternalStore } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, Image, ImageStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Screen, TextField } from "app/components"
import { spacing } from "app/theme"
import { ItemStore } from "app/models"
import { CategoryModal, PriceTextField } from "app/custom"

const logo = require("../../assets/images/logo.png")

interface HelloScreenProps extends AppStackScreenProps<"Hello"> {}

export const HelloScreen: FC<HelloScreenProps> = observer(function HelloScreen({ navigation }) {
  const [content, setContent] = useState("")
  const [price, setPrice] = useState(0)
  const [category, setCategory] = useState("")

  useSyncExternalStore(ItemStore.subscribe, ItemStore.getSnapshot)

  return (
    <Screen preset="auto" contentContainerStyle={$root} safeAreaEdges={["top", "bottom"]}>
      <Image source={logo} resizeMode="contain" style={$logo} />
      <TextField
        value={content}
        autoCorrect={false}
        autoCapitalize="none"
        label="Name"
        placeholder="name"
        onChangeText={setContent}
      />

      <PriceTextField price={price} setPrice={setPrice} />

      <CategoryModal value={category} setValue={setCategory} />

      <Button
        text="Add"
        style={$addButton}
        preset="reversed"
        onPress={() => {
          ItemStore.addItem({
            name: content,
            price,
            type: category,
            date: +(new Date()),
          })
        }}
      />

      <Button
        text="Record"
        style={$addButton}
        preset="filled"
        onPress={() => {
          navigation.navigate("Record")
        }}
      />
    </Screen>
  )

})

const $root: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $addButton: ViewStyle = {
  marginTop: spacing.xl,
}

const $logo: ImageStyle = {
  height: 128,
  width: "100%",
  marginBottom: spacing.xxl,
}

