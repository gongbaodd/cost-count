import { CategoryStore, ItemStore, UserStore } from "@/packages/models";
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

const running = require("../../assets/images/running.png");

export default function Detail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = ItemStore.findItem(id)!;

  if (!item) {
    router.back();
    return null;
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
      item.date ? new Date(item.date) : new Date()
    );
    const [category, setCategory] = useState(item.type);

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

          <CategoryButton value={category} setValue={setCategory} />

          <DateTimePicker value={date} setValue={setDate} />

          <Button
            text="Modify"
            preset="reversed"
            style={$delete}
            onPress={modifyItem}
          />

          <Button
            text="Delete"
            preset="filled"
            style={$delete}
            onPress={deleteItem}
          />
        </View>
      </>
    );

    async function modifyItem() {
      if (!item) return;

      const newItem = { ...item, date: +date, type: category.id };

      const user = UserStore.getSnapshot();

      if (user) {
        ItemStore.remote.modifyItem(item.id, newItem);
      } else {
        ItemStore.storage.modifyItem(item.id, newItem);
      }
    }

    async function deleteItem() {
      if (!item) return;

      const user = UserStore.getSnapshot();

      if (user) {
        await ItemStore.remote.deleteItem(item.id);
      } else {
        await ItemStore.storage.deleteItem(item.id);
      }

      router.back();
    }
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
