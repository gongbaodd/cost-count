import React, { FC, useState, useSyncExternalStore } from "react"
import { observer } from "mobx-react-lite"
import { Modal, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Icon, ListItem, ListView, Screen, Text, TextField } from "app/components"
import { colors, spacing } from "app/theme"
import { ItemStore, TypeStore } from "app/models"

interface HelloScreenProps extends AppStackScreenProps<"Hello"> {}

export const HelloScreen: FC<HelloScreenProps> = observer(function HelloScreen(_props) {
  const [content, setContent] = useState("")
  const [worth, setWorth] = useState(0)
  const [worthContent, setWorthContent] = useState("0.00")
  const [worthFocused, setWorthFocused] = useState(false)
  const [showTypeModal, setShowTypeModal] = useState(false)

  useSyncExternalStore(ItemStore.subscribe, ItemStore.getSnapshot)
  const categories = useSyncExternalStore(TypeStore.subscribe, TypeStore.getSnapshot)

  return (
    <Screen preset="auto" contentContainerStyle={$root} safeAreaEdges={["top", "bottom"]}>
      <Text text="Expanse Tracker" preset="heading" />
      <TextField
        value={content}
        autoCorrect={false}
        autoCapitalize="none"
        label="Name"
        placeholder="name"
        onChangeText={setContent}
      />
      <TextField
        value={worthContent}
        autoCorrect={false}
        autoCapitalize="none"
        label="Expanse"
        placeholder="0.00"
        keyboardType="numeric"
        onFocus={onNumbericWorthFocus}
        onBlur={onNumbericWorthBlur}
        onChangeText={setNumbericWorth}
      />
      <Text
        text="Category"
        preset="formLabel"
      ></Text>
      <Button
        text="idle"
        onPress={() => {
          setShowTypeModal(true)
        }}
        style={$typeButton}
      ></Button>
      
      <Button
        text="Add"
        style={$addButton}
        preset="filled"
        onPress={() => {
          ItemStore.addItem({
            name: content,
            price: worth,
            type: "idle",
            id: "1",
          })
        }}
      />
      <Modal 
        animationType="slide" 
        transparent={true} 
        visible={showTypeModal}
        onRequestClose={() => {
          setShowTypeModal(false)
        }}
      >
        <View style={$modal}>
          <ListView<typeof categories[0]>
            ListHeaderComponent={() => (
              <View style={$modalTitle}>
                <Text text="Category" preset="bold" />
                <Icon icon="x" onPress={() => setShowTypeModal(false)} />
              </View>
            )}
            renderItem={({item}) => {
              return (
                  <ListItem text={item.name} key={item.id} />
              )
            }} 
            data={categories}          
          />
        </View>
      </Modal>
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

const $modal: ViewStyle = {
  height: "50%",
  width: "100%",
  backgroundColor: colors.background,
  borderTopRightRadius: 20,
  borderTopLeftRadius: 20,
  position: "absolute",
  bottom: 0,
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.xl,
}

const $modalTitle: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing.xl,
}

const $typeButton: ViewStyle = {
  marginTop: spacing.xs,
  justifyContent: "flex-start",
}