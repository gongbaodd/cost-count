import React, { FC, useSyncExternalStore } from "react"
import { observer } from "mobx-react-lite"
import { ScrollView, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Header, ListView, ListItem, Text, EmptyState } from "app/components"
import { colors, spacing } from "app/theme"
import dayjs from "dayjs"
import { ItemStore } from "app/models"

interface RecordScreenProps extends AppStackScreenProps<"Record"> {}

export const RecordScreen: FC<RecordScreenProps> = observer(function RecordScreen({ navigation }) {
  const records = useSyncExternalStore(ItemStore.subscribe, ItemStore.getSnapshot)
  const list = recordsToList(records)

  return (
    <Screen preset="fixed" contentContainerStyle={$root}>
      <Header
        leftIcon="back"
        onLeftPress={() => {
          navigation.goBack()
        }}
        rightIcon="community"
        onRightPress={() => {
          navigation.navigate("User")
        }}
        title="Records"
      />
      {records.length > 0 && <ScrollView style={$listView}>
        <ListView
          data={list}
          estimatedItemSize={list.length * 50}
          renderItem={({ item, index }) => {
            if (item.list_type === "record") {
              return (
                <ListItem
                  style={[$listItem, $recordItem]}
                  text={item.name}
                  key={`item_${index}`}
                  LeftComponent={<Text style={$typeBadge} text={item.type} size="xxs" />}
                  RightComponent={<Text text={item.price.toFixed(2)} />}
                  bottomSeparator
                  onPress={() => { navigation.navigate("Detail", {id: item.id}) }}
                />
              )
            } else {
              return (
                <ListItem
                  style={$listItem}
                  text={item.name}
                  key={`item_${index}`}
                  RightComponent={<Text text={item.price.toFixed(2)} />}
                  bottomSeparator
                />
              )
            }
          }}
        />
      </ScrollView>}
      {records.length === 0 && <EmptyState style={$empty} buttonOnPress={() => navigation.goBack()}/>}
    </Screen>
  )

  type recordItem = (typeof records)[0] & { list_type: "record" }
  type dayItem = {
    list_type: "day"
    name: string
    price: number
  }
  type monthItem = { list_type: "month"; name: string; price: number }
  type yearItem = { list_type: "year"; name: string; price: number }
  type listItem = recordItem | dayItem | monthItem | yearItem

  function recordsToList(record: typeof records) {
    const list: listItem[] = []
    const reversed = [...record]

    let lastDay = null
    let lastMonth = null
    let lastYear = null
    
    let yearSum = 0
    let monthSum = 0
    let daySum = 0

    let lastDayItem: null | dayItem = null
    let lastMonthItem: null | monthItem = null
    let lastYearItem: null | yearItem = null

    while (reversed.length) {
      const item = reversed.pop() as recordItem
      const date = dayjs(item.date)

      const year = date.year()
      const month = date.month()
      const day = date.date()

      if (year !== lastYear) {
        const currYearItem: yearItem = { list_type: "year", name: year.toString(), price: -1 }
        list.push(currYearItem)

        lastYearItem && (lastYearItem.price = yearSum)
        lastYearItem = currYearItem

        lastYear = year
        yearSum = 0
      }

      if (month !== lastMonth) {
        const currMonthItem: monthItem = { list_type: "month", name: dayjs().month(month).format("MMM"), price: -1 }
        list.push(currMonthItem)

        lastMonthItem && (lastMonthItem.price = monthSum)
        lastMonthItem = currMonthItem

        lastMonth = month
        monthSum = 0
      }

      if (day !== lastDay) {
        const currDayItem: dayItem = { list_type: "day", name: dayjs().date(day).format("DD"), price: -1 }
        list.push(currDayItem)

        lastDayItem && (lastDayItem.price = daySum)
        lastDayItem = currDayItem

        lastDay = day
        daySum = 0
      }

      list.push({ ...item, list_type: "record" })
      yearSum += item.price
      monthSum += item.price
      daySum += item.price
    }

    lastDayItem && (lastDayItem.price = daySum)
    lastMonthItem && (lastMonthItem.price = monthSum)
    lastYearItem && (lastYearItem.price = yearSum)

    return list
  }
})

const $root: ViewStyle = {
  height: "100%",
  display: "flex",
  overflow: "hidden",
}

const $listView: ViewStyle = {
  height: "100%",
  width: "100%",
  flex: 1,
}

const $typeBadge: ViewStyle = {
  width: spacing.xxl
}

const $listItem: ViewStyle = {
  paddingLeft: spacing.lg,
  paddingRight: spacing.lg
}

const $recordItem: ViewStyle = {
  backgroundColor: colors.palette.neutral100
}

const $empty: ViewStyle = {
  flex: 1,
  paddingLeft: spacing.lg,
  paddingRight: spacing.lg,
  paddingTop: spacing.xxxl
}