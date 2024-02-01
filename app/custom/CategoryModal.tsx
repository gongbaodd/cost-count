import React, { FC, useState, useSyncExternalStore } from "react"
import { Modal, View, ViewStyle } from "react-native"
import { ListView } from "../components/ListView"
import { colors, spacing } from "app/theme"
import { Icon } from "../components/Icon"
import { ListItem } from "../components/ListItem"
import { TextField } from "../components/TextField"
import { Button } from "../components/Button"
import { Text } from "../components/Text"
import { CategoryStore } from "app/models"

export const CategoryModal: FC<{
  value: string
  setValue: (s: string) => void
}> = ({ value, setValue }) => {
  const categories = useSyncExternalStore(CategoryStore.subscribe, CategoryStore.getSnapshot)
  const [showTypeModal, setShowTypeModal] = useState(false)
  const [newCategory, setNewCategory] = useState("")

  return (
    <>
      <Text text="Category" preset="formLabel"></Text>
      <Button
        text={value || "idle"}
        onPress={() => {
          setShowTypeModal(true)
        }}
        style={$typeButton}
      ></Button>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTypeModal}
        onRequestClose={() => {
          setShowTypeModal(false)
        }}
      >
        <View style={$modal}>
          <ListView
            ListHeaderComponent={() => (
              <View style={$modalTitle}>
                <Text text="Category" preset="bold" />
                <Icon icon="x" onPress={() => setShowTypeModal(false)} />
              </View>
            )}
            renderItem={({ item }) => {
              return <ListItem text={item.name} key={item.id} bottomSeparator onPress={onCategoryPress} />

              function onCategoryPress() {
                setValue(item.name)
                setShowTypeModal(false)
              }
            }}
            data={categories}
          />
          <TextField
            placeholder="Add Category"
            value={newCategory}
            onChangeText={setNewCategory}
            RightAccessory={() => {
             return <Button text="Add" style={$addCategoryButton} onPress={onAddCategoryPress} disabled={!value} />
            
              function onAddCategoryPress() {
                CategoryStore.addCategory({ id: "3", name: newCategory })
                setNewCategory("")
              }
            }}
          />
        </View>
      </Modal>
    </>
  )
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

const $addCategoryButton: ViewStyle = {
  minHeight: spacing.lg,
}

const $typeButton: ViewStyle = {
  marginTop: spacing.xs,
  justifyContent: "flex-start",
  minHeight: spacing.lg,
}