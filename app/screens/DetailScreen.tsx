import { Header, Screen, Text, TextField } from "app/components"
import { CategoryModal, DateTimePicker } from "app/custom"
import { ItemStore } from "app/models"
import { AppStackScreenProps } from "app/navigators"
import { spacing } from "app/theme"
import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { View, ViewStyle } from "react-native"


interface DetailScreenProps extends AppStackScreenProps<"Detail"> {}

export const DetailScreen: FC<DetailScreenProps> = observer(function DetailScreen({
  navigation,
  route,
}) {
  const item = ItemStore.findItem(route.params.id)

  const [category, setCategory] = useState(item?.type || "")

  const [date, setDate] = useState(item?.date? new Date(item.date) :(new Date()))

  return (
    <Screen preset="auto">
      <Header
        leftIcon="back"
        onLeftPress={() => {
          navigation.goBack()
        }}
        title="Detail"
      />
      <View style={$root}>
        <Text style={$price} text={item?.price.toFixed(2)} preset="heading" />

        <View style={$content}>
          <TextField
            value={item?.name}
            autoCorrect={false}
            autoCapitalize="none"
            label="Name"
            placeholder="name"
          />

          <CategoryModal value={category} setValue={setCategory} />

          <DateTimePicker value={date} setValue={modifyDate}/>
        </View>
      </View>
    </Screen>
  )

  function modifyDate(value: Date) {
    if (!item) return

    const newItem = { ...item, date: +value, id: undefined}
    delete newItem.id

    setDate(value)
    ItemStore.modifyItem(item.id, newItem)
  }
})

const $root: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $price: ViewStyle = {
  alignSelf: "center",
}

const $content: ViewStyle = {
  marginTop: spacing.xxl,
}
