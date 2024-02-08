import { CategoryStore, ItemStore } from "@/packages/models";
import { Suspense, useState, useSyncExternalStore } from "react";
import {
  Button,
  EmptyState,
  Header,
  Screen,
  Text,
  TextField,
} from "@/packages/ignite";
import { router, useLocalSearchParams } from "expo-router";
import { View, ViewStyle } from "react-native";
import { spacing } from "@/packages/theme";
import { DateTimePicker } from "@/packages/components";
import { CategoryButton } from "../category";
import { SelectedCategoryStore } from "@/packages/models/SelectedCategory";

const running = require("../../assets/images/running.png");

export default function Detail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = ItemStore.findItem(id);
  const categories = useSyncExternalStore(
    CategoryStore.subscribe,
    CategoryStore.getSnapshot
  );
  if (item) {
    const category = categories.find((c) => c.name === item.type);

    if (category) {
      SelectedCategoryStore.select(category);
    }
  }

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
        <Suspense fallback={<Loading />}>
          <Info />
        </Suspense>
      </View>
    </Screen>
  );

  function Info() {
    const [date, setDate] = useState(
      item?.date ? new Date(item.date) : new Date()
    );

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

    function modifyDate(value: Date) {
      if (!item) return;

      const newItem = { ...item, date: +value, id: undefined };
      delete newItem.id;

      setDate(value);
      ItemStore.remote.modifyItem(item.id, newItem);
    }
  }

  async function deleteItem() {
    if (!item) return;

    await ItemStore.remote.deleteItem(item.id);
    router.back();
  }

  function modifyCategory(value: string) {
    if (!item) return;

    const newItem = { ...item, type: value, id: undefined };
    delete newItem.id;

    ItemStore.remote.modifyItem(item.id, newItem);
  }
}

function Loading() {
  return (
    <EmptyState
      imageSource={running}
      heading="Please wait"
      content="loading..."
      button="go back"
      buttonOnPress={() => {
        router.back();
      }}
      style={$loading}
    />
  );
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

const $loading: ViewStyle = {
  flex: 1,
  justifyContent: "center",
};
