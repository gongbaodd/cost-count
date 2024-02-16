import { ImageStyle, ViewStyle, Image } from "react-native";
import { Button, Screen } from "@/packages/ignite";
import { spacing } from "@/packages/theme";
import { TextField } from "@/packages/ignite/TextField";
import { useCallback, useState, useSyncExternalStore } from "react";
import { PriceTextField } from "@/packages/components";
import { ItemStore, Type, UserStore } from "@/packages/models";
import { router } from "expo-router";
import { CategoryButton } from "./category";
import { CreateItemStore } from "@/packages/models/CreateItem";

const logo = require("../assets/images/logo.png");

export default function Home() {
  const item = useSyncExternalStore(
    CreateItemStore.subscribe,
    CreateItemStore.getSnapshot
  );

  const onAddPressed = useCallback(async () => {
    if (!CreateItemStore.isValid()) return;

    const newItem = {
      name: item!.name,
      price: item!.price,
      date: +new Date(),
      type: item!.type!.id,
    };

    let id = "";

    const user = UserStore.getSnapshot();

    if (user) {
      const added = await ItemStore.remote.addItem(newItem);
      id = added?.id ?? id;
    } else {
      const added = await ItemStore.storage.addItem(newItem);
      id = added?.id ?? id;
    }

    if (id) {
      CreateItemStore.clear();

      router.push(`/record/${id}`);
    }
  }, [item]);

  const onRecordPressed = useCallback(() => {
    router.push("/record/");
  }, []);

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$root}
      safeAreaEdges={["top", "bottom"]}
    >
      <Image source={logo} resizeMode="contain" style={$logo} />
      <TextField
        value={item?.name ?? ""}
        autoCorrect={false}
        autoCapitalize="none"
        label="Name"
        placeholder="name"
        onChangeText={CreateItemStore.setName}
      />

      <PriceTextField
        price={item?.price ?? 0}
        setPrice={CreateItemStore.setPrice}
      />

      <CategoryButton
        value={item?.type ?? null}
        setValue={CreateItemStore.setType}
      />

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
};

const $addButton: ViewStyle = {
  marginTop: spacing.xl,
};

const $logo: ImageStyle = {
  height: 128,
  width: "100%",
  marginBottom: spacing.xxl,
};
