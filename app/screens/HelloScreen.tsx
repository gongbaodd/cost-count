import React, { FC, useState, useSyncExternalStore } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Screen, Text, TextField } from "app/components"
import { spacing } from "app/theme"
import { ItemStore } from "app/models"

interface HelloScreenProps extends AppStackScreenProps<"Hello"> {}

export const HelloScreen: FC<HelloScreenProps> = observer(function HelloScreen(_props) {
  const [content, setContent] = useState("")
  const [worth, setWorth] = useState(0)
  const [worthContent, setWorthContent] = useState("0.00")
  const [worthFocused, setWorthFocused] = useState(false)

  // const items = useSyncExternalStore(ItemStore.subscribe, ItemStore.getSnapshot)

  return (
    <Screen preset="auto" contentContainerStyle={$root} safeAreaEdges={["top", "bottom"]}>
      <Text text="hello" preset="heading" />
      <TextField
        value={content}
        autoCorrect={false}
        autoCapitalize="none"
        label="itemName"
        placeholder="itemName"
        onChangeText={setContent}
      />
      <TextField
        value={worthContent}
        autoCorrect={false}
        autoCapitalize="none"
        label="itemWorth"
        placeholder="itemWorth"
        keyboardType="numeric"
        onFocus={onNumbericWorthFocus}
        onBlur={onNumbericWorthBlur}
        onChangeText={setNumbericWorth}
      />
      <Button
        text="Add"
        style={$addButton}
        onPress={() => {
          console.log(content)
          console.log(worth)
        }}
      />
    </Screen>
  )

  function onNumbericWorthFocus() {
    setWorthFocused(true)
    setWorthContent("")
  }

  function onNumbericWorthBlur() {
    let newWorth = worth.toFixed(2)

    if (worthContent !== "") {
      const parsedWorth = parseFloat(worthContent || "0").toFixed(2)
      if (parsedWorth !== "NaN") {
        newWorth = parsedWorth
      }
    }
    
    setWorthFocused(false)
    setWorthContent(newWorth)
    setWorth(Number(newWorth))
  }

  function setNumbericWorth(worth: string) {
    if (worthFocused) {
      setWorthContent(worth)
    }
  }
})

const $root: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $addButton: ViewStyle = {
  marginTop: spacing.xl,
}