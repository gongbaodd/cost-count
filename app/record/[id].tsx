import { ItemStore } from "@/packages/models";
import { Suspense, useState } from "react";
import { Button, Header, Screen, Text, TextField } from "@/packages/ignite";
import { router, useLocalSearchParams } from "expo-router";
import { View, ViewStyle } from "react-native";
import { spacing } from "@/packages/theme";
import { DateTimePicker, CategoryModal } from "@/packages/components";
import { CategoryButton } from "../category";

export default function Detail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const item = ItemStore.findItem(id);

  const [category, setCategory] = useState(item?.type || "");

  const [date, setDate] = useState(
    item?.date ? new Date(item.date) : new Date()
  );

  return (
    <Screen preset="auto">
      <Header
        leftIcon="back"
        onLeftPress={() => {
          router.back();
        }}
        title="Detail"
      />
      <View style={$root}>
        <Suspense fallback={<Text text="loading" />}>
          <Info />
        </Suspense>
      </View>
    </Screen>
  );

  function Info() {
    return (
      <>
        <Text style={$price} text={item?.price.toFixed(2)} preset="heading" />

        <View style={$content}>
          <TextField
            value={item?.name}
            autoCorrect={false}
            autoCapitalize="none"
            label="Name"
            placeholder="name"
          />

          <CategoryButton />

          <DateTimePicker value={date} setValue={modifyDate} />

          <Button
            text="Delete"
            preset="reversed"
            style={$delete}
            onPress={deleteItem}
          />
        </View>
      </>
    );
  }

  async function deleteItem() {
    if (!item) return;

    await ItemStore.deleteItem(item.id);
    router.back();
  }

  function modifyDate(value: Date) {
    if (!item) return;

    const newItem = { ...item, date: +value, id: undefined };
    delete newItem.id;

    setDate(value);
    ItemStore.modifyItem(item.id, newItem);
  }

  function modifyCategory(value: string) {
    if (!item) return;

    const newItem = { ...item, type: value, id: undefined };
    delete newItem.id;

    setCategory(value);
    ItemStore.modifyItem(item.id, newItem);
  }
}

const $root: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
};

const $price: ViewStyle = {
  alignSelf: "center",
};

const $content: ViewStyle = {
  marginTop: spacing.xxl,
};

const $delete: ViewStyle = {
  marginTop: spacing.xl,
};
