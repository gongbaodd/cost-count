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
import { colors, spacing } from "@/packages/theme";
import { router } from "expo-router";
import { Suspense, useState, useSyncExternalStore } from "react";
import { View, ViewStyle } from "react-native";

const running = require("../../assets/images/running.png");

export default function Categories() {
  let fetchCategories: null | Promise<any> =
    CategoryStore.loadCategories().then(() => {
      fetchCategories = null;
    });

  const [newCategory, setNewCategory] = useState("");

  return (
    <Screen contentContainerStyle={$modal} preset="fixed" >
      <Suspense fallback={<Loading />}>
        <Categories onPress={() => {}} />
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
              console.log("newCategory", newCategory);
              CategoryStore.addCategory({ name: newCategory });
              setNewCategory("");
            }
          }}
        ></TextField>
      </View>
    </Screen>
  );

  function Categories({ onPress }: { onPress: (item: any) => void }) {
    if (fetchCategories) {
      throw fetchCategories;
    }

    const [newCategory, setNewCategory] = useState("");
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
              onPress={() => onPress(item)}
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
  return (
    <>
      <Text text="Category" preset="formLabel"></Text>
      <Button
        text={"idle"}
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
      heading=""
      content=""
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
