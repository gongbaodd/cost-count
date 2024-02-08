import { ImageStyle, ViewStyle, Image } from "react-native";
import { Button, Screen } from "@/packages/ignite";
import { spacing } from "@/packages/theme";
import { TextField } from "@/packages/ignite/TextField";
import { useCallback, useState, useSyncExternalStore } from "react";
import { PriceTextField } from "@/packages/components";
import { ItemStore } from "@/packages/models";
import { router } from "expo-router"
import { CategoryButton } from "./category";
import { SelectedCategoryStore } from "@/packages/models/SelectedCategory";

const logo = require("../assets/images/logo.png");

export default function Home() {

  const [content, setContent] = useState("")
  const [price, setPrice] = useState(0)

  const category = useSyncExternalStore(SelectedCategoryStore.subscribe, SelectedCategoryStore.getSnapshot)

  const onAddPressed = useCallback(async () => {
    if (!content) return 
    if (!("id" in category)) return

    const newItem = {
      name: content,
      price,
      date: +(new Date()),
      type: category.id
    }

    const {id} = await ItemStore.remote.addItem(newItem)

    router.push(`/record/${id}`)
  }, [content, price, category])

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

