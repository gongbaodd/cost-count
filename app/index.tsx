import { ImageStyle, ViewStyle, Image } from "react-native";
import { Button, Screen } from "@/packages/ignite";
import { spacing } from "@/packages/theme";
import { TextField } from "@/packages/ignite/TextField";
import { useCallback, useState } from "react";
import { PriceTextField, CategoryModal } from "@/packages/components";
import { ItemStore } from "@/packages/models";
import { router } from "expo-router"
import { CategoryButton } from "./category";

const logo = require("../assets/images/logo.png");

export default function Home() {

  const [content, setContent] = useState("")
  const [price, setPrice] = useState(0)
  const [categoryUUID, setCategoryUUID] = useState("")

  const onAddPressed = useCallback(async () => {
    if (!content) return 

    const newItem = {
      name: content,
      price,
      type: categoryUUID,
      date: +(new Date()),
    }

    if (!categoryUUID) {
      delete (newItem as any).type
    }

    const {id} = await ItemStore.addItem(newItem)

    router.push(`/record/${id}`)
  }, [content, price, categoryUUID])

  const onRecordPressed = useCallback(() => {
    router.push("/record/")
  }, [])


  return (
    <Screen
      preset="auto"
      contentContainerStyle={$root}
      safeAreaEdges={["top", "bottom"]}
    >
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

      {/* <CategoryModal value={categoryUUID} setValue={setCategoryUUID} />
       */}

      <CategoryButton />

      <Button
        text="Add"
        style={$addButton}
        preset="reversed"
        onPress={onAddPressed}
      />

      <Button
        text="Record"
        style={$addButton}
        preset="filled"
        onPress={onRecordPressed}
      />
    </Screen>
  );
}


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

