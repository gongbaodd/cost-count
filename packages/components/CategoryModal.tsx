import React, { FC, Suspense, useState, useSyncExternalStore } from "react";
import { Modal, View, ViewStyle } from "react-native";
import { colors, spacing } from "@/packages/theme";
import { CategoryStore } from "../models";
import {
  Text,
  Button,
  ListView,
  ListItem,
  TextField,
  Header,
} from "@/packages/ignite";

export const CategoryModal: FC<{
  value: string;
  setValue: (s: string) => void;
}> = ({ value, setValue }) => {
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const categories = useSyncExternalStore(
    CategoryStore.subscribe,
    CategoryStore.getSnapshot
  );
  let fetchCategories: null | Promise<any> = null;

  const content = CategoryStore.findCategory(value) ?? { name: "idle" };

  return (
    <>
      <Text text="Category" preset="formLabel"></Text>
      <Button
        text={content.name}
        onPress={() => {
          setShowTypeModal(true);
          fetchCategories = CategoryStore.loadCategories().then(() => {
            fetchCategories = null;
          });
        }}
        style={$typeButton}
      ></Button>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTypeModal}
        onRequestClose={() => {
          setShowTypeModal(false);
        }}
      >
        <View style={$modal}>
          <Header
            title="Category"
            rightIcon="x"
            onRightPress={() => setShowTypeModal(false)}
            style={$modalTitle}
          />
          <Suspense fallback={<Text text="Loading" />}>
            <Categories
              onPress={(item) => {
                setValue(item.id);

                setShowTypeModal(false);
              }}
            />
          </Suspense>

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
          />
        </View>
      </Modal>
    </>
  );

  function Categories({
    onPress,
  }: {
    onPress: (item: (typeof categories)[0]) => void;
  }) {
    if (fetchCategories) {
      throw fetchCategories;
    }

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
};

const $modal: ViewStyle = {
  height: "50%",
  width: "100%",
  backgroundColor: colors.background,
  borderTopRightRadius: 20,
  borderTopLeftRadius: 20,
  position: "absolute",
  bottom: 0,
  paddingHorizontal: spacing.md,
  paddingBottom: spacing.md,
};

const $modalTitle: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing.xl,
};

const $addCategoryButton: ViewStyle = {
  minHeight: spacing.lg,
};

const $typeButton: ViewStyle = {
  marginTop: spacing.xs,
  justifyContent: "flex-start",
  minHeight: spacing.lg,
};
