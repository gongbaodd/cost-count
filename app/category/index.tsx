import {
  Button,
  EmptyState,
  ListItem,
  ListView,
  Text,
  Screen,
  Header,
  TextField,
} from "@/packages/ignite";
import { CategoryStore } from "@/packages/models";
import { SelectedCategoryStore } from "@/packages/models/SelectedCategory";
import { colors, spacing } from "@/packages/theme";
import { router, useFocusEffect } from "expo-router";
import { Suspense, useCallback, useState, useSyncExternalStore } from "react";
import { View, ViewStyle } from "react-native";

const running = require("../../assets/images/running.png");

export default function Categories() {
  let fetchCategories: null | Promise<any> =
    CategoryStore.remote.loadCategories().then(() => {
      fetchCategories = null;
    });

  const [newCategory, setNewCategory] = useState("");

  return (
    <Screen contentContainerStyle={$modal} preset="fixed">
      <Header
        title="Category"
        rightIcon="x"
        onRightPress={() => router.back()}
        style={$modalTitle}
      />
      <Suspense fallback={<Loading />}>
        <Categories />
      </Suspense>
      <View style={$addCategory}>
        <TextField
          placeholder="Add Category"
          value={newCategory}
          onChangeText={setNewCategory}
          RightAccessory={() => {
            return (
              <Button
                text="Add"
                style={$addCategoryButton}
                onPress={onAddCategoryPress}
                disabled={!newCategory}
              />
            );

            function onAddCategoryPress() {
              CategoryStore.remote.addCategory({ name: newCategory });
              setNewCategory("");
            }
          }}
        ></TextField>
      </View>
    </Screen>
  );

  function Categories() {
    if (fetchCategories) {
      throw fetchCategories;
    }

    const categories = useSyncExternalStore(
      CategoryStore.subscribe,
      CategoryStore.getSnapshot
    );

    return (
      <ListView
        renderItem={({ item }) => {
          return (
            <ListItem
              text={item.name}
              key={item.id}
              bottomSeparator
              onPress={() => {
                SelectedCategoryStore.select(item);
                router.back()
              }}
            />
          );
        }}
        data={categories}
        estimatedItemSize={50}
      />
    );
  }
}

export function CategoryButton() {
  const selected = useSyncExternalStore(
    SelectedCategoryStore.subscribe,
    SelectedCategoryStore.getSnapshot
  );
  return (
    <>
      <Text text="Category" preset="formLabel"></Text>
      <Button
        text={selected.name}
        onPress={() => {
          router.push("/category/");
        }}
        style={$typeButton}
      ></Button>
    </>
  );
}

function Loading() {
  return (
    <EmptyState
      imageSource={running}
      heading="Please wait"
      content="loading..."
      button=""
      style={$loading}
    />
  );
}

const $typeButton: ViewStyle = {
  marginTop: spacing.xs,
  justifyContent: "flex-start",
  minHeight: spacing.lg,
};

const $list: ViewStyle = {
  flex: 1,
};

const $loading: ViewStyle = {
  flex: 1,
  justifyContent: "center",
};

const $modal: ViewStyle = {
  width: "100%",
  height: "100%",
  backgroundColor: colors.background,
  paddingHorizontal: spacing.md,
  paddingBottom: spacing.md,
};

const $addCategoryButton: ViewStyle = {
  minHeight: spacing.lg,
};

const $addCategory: ViewStyle = {};

const $modalTitle: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing.xl,
};
