import { ImageStyle, ViewStyle, Image } from "react-native";
import { Button, Screen } from "@/packages/ignite";
import { spacing } from "@/packages/theme";
import { TextField } from "@/packages/ignite/TextField";
import { useCallback, useState } from "react";
import { PriceTextField } from "@/packages/components";
import { CategoryModal } from "@/packages/components/CategoryModal";

const logo = require("../assets/images/logo.png");

export default function Page() {

  const [content, setContent] = useState("")
  const [price, setPrice] = useState(0)
  const [category, setCategory] = useState("")

  const onAddPressed = useCallback(async () => {
    if (!content) return 

    // const {id} = await ItemStore.addItem({
    //   name: content,
    //   price,
    //   type: category,
    //   date: +(new Date()),
    // })

    // navigation.navigate("Detail", { id })
  }, [content, price, category])

  const onRecordPressed = useCallback(() => {
    // navigation.navigate("Record")
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

      <CategoryModal value={category} setValue={setCategory} />

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

