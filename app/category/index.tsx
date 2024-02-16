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
import { CategoryStore, Type, UserStore } from "@/packages/models";
import { CreateCategoryStore } from "@/packages/models/CreateCategory";
import { SelectedCategoryStore } from "@/packages/models/SelectedCategory";
import { colors, spacing } from "@/packages/theme";
import { router, useFocusEffect } from "expo-router";
import {
  Suspense,
  useCallback,
  useState,
  useSyncExternalStore,
} from "react";
import { View, ViewStyle } from "react-native";

const running = require("../../assets/images/running.png");

export default function Categories() {
  return (
    <Screen
      contentContainerStyle={$modal}
      preset="fixed"
      safeAreaEdges={["bottom"]}
    >
      <Header
        title="Category"
        rightIcon="x"
        onRightPress={() => router.back()}
        style={$modalTitle}
      />
      <LoadCategories />
      <AddCategory />
    </Screen>
  );
}

function Empty() {
  return <EmptyState style={$empty} buttonOnPress={() => router.back()} />;
}

function LoadCategories() {
  let fetchCategories: null | Promise<void> = new Promise(async (resolve) => {
    await UserStore.load();
    const user = UserStore.getSnapshot();

    if (user) {
      CategoryStore.remote.loadCategories().finally(() => {
        fetchCategories = null;
        resolve();
      });
    } else {
      CategoryStore.storage.loadCategories().finally(() => {
        fetchCategories = null;
        resolve();
      });
    }
  });

  return (
    <Suspense fallback={<Loading />}>
      <List />
    </Suspense>
  );

  function List() {
    if (fetchCategories) {
      throw fetchCategories;
    }

    const categories = useSyncExternalStore(
      CategoryStore.subscribe,
      CategoryStore.getSnapshot
    );

    if (categories.length === 0) {
      return <Empty />;
    }

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
                router.back();
              }}
            />
          );
        }}
        data={categories}
        estimatedItemSize={57}
      />
    );
  }
}

function AddCategory() {
  const category = useSyncExternalStore(
    CreateCategoryStore.subscribe,
    CreateCategoryStore.getSnapshot
  );

  const onAddCategoryPress = useCallback(async () => {
    const user = UserStore.getSnapshot();

    if (user) {
      await CategoryStore.remote.addCategory({ name: category!.name });
    } else {
      await CategoryStore.storage.addCategory({ name: category!.name });
    }

    CreateCategoryStore.clear();
  }, [category]);

  return (
    <View style={$addCategory}>
      <TextField
        placeholder="Add Category"
        value={category?.name ?? ""}
        onChangeText={CreateCategoryStore.setName}
        RightAccessory={() => {
          return (
            <Button
              text="Add"
              style={$addCategoryButton}
              onPress={onAddCategoryPress}
              disabled={!CreateCategoryStore.isValid()}
            />
          );
        }}
      ></TextField>
    </View>
  );
}

export function CategoryButton({
  value,
  setValue,
}: {
  value: Type | null;
  setValue: (value: Type) => void;
}) {
  const [opened, setOpened] = useState(false);
  const selected = useSyncExternalStore(
    SelectedCategoryStore.subscribe,
    SelectedCategoryStore.getSnapshot
  );

  const onBack = useCallback(() => {
    if (opened) {
      setOpened(false);
      if ("id" in selected) {
        setValue(selected);
      }
    }
  }, [opened, selected]);
  useFocusEffect(onBack);

  return (
    <>
      <Text text="Category" preset="formLabel"></Text>
      <Button
        text={value ? value.name : "Select Category"}
        onPress={() => {
          router.push("/category/");
          setOpened(true);
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

const $empty: ViewStyle = {
  flex: 1,
  paddingLeft: spacing.lg,
  paddingRight: spacing.lg,
  paddingTop: spacing.xxxl,
};
