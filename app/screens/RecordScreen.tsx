import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ScrollView, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Header, ListView, ListItem, Text } from "app/components"
import { spacing } from "app/theme"
import dayjs from "dayjs"

import testRecord from "../../test/records.json"

interface RecordScreenProps extends AppStackScreenProps<"Record"> {}

const data = rawToData(testRecord)

export const RecordScreen: FC<RecordScreenProps> = observer(function RecordScreen({ navigation }) {
  return (
    <Screen preset="fixed" contentContainerStyle={$root}>
      <Header
        leftIcon="back"
        onLeftPress={() => {
          navigation.goBack()
        }}
        title="Records"
      />
      <ScrollView style={$listView}>
        <ListView
          data={Object.keys(data)}
          renderItem={({ item: year, index }) => {
            return (
              <>
                <ListItem text={year} key={`year_${index}`} bottomSeparator />
                <ListView
                  data={Object.keys(data[year])}
                  renderItem={({ item: month, index }) => {
                    return (
                      <>
                        <ListItem
                          text={dayjs().month(Number(month)).format("MMM")}
                          key={`month_${index}`}
                          bottomSeparator
                        />
                        <ListView
                          data={Object.keys(data[year][month])}
                          renderItem={({item: day, index}) => {
                            return (
                            <>
                              <ListItem
                                text={day}
                                key={`day_${index}`}
                                bottomSeparator
                              />
                              <ListView 
                                data={data[year][month][day]}
                                renderItem={({item, index}) => {
                                  return (
                                    <ListItem
                                      text={item.name}
                                      key={`item_${index}`}
                                      LeftComponent={<Text text={item.type} size="xxs" />}
                                      RightComponent={<Text text={item.price} />}
                                      bottomSeparator
                                    />
                                  )
                                }}
                              />
                            </>
                            )
                          }}
                        />
                      </>
                    )
                  }}
                />
              </>
            )
          }}
        />
      </ScrollView>
    </Screen>
  )
})

const $root: ViewStyle = {
  height: "100%",
  display: "flex",
  overflow: "hidden",
}

const $listView: ViewStyle = {
  paddingHorizontal: spacing.lg,
  height: "100%",
  width: "100%",
  flex: 1,
}

interface Item {
  id: string;
  name: string;
  price: string;
  type: string;
  timestamp: number;
}

function rawToData(_data: { date: number; name: string; type: string; price: string }[]) {
  const data: Record<string, Record<string, Record<string, Item[]>>> = {}

  _data.forEach((d, i) => {
    const date = dayjs(d.date)
    const item = { 
      ...d, 
      id: i.toString(),
      date, 
      timestamp: d.date, 
      price: Number(d.price).toFixed(2)
    }

    const year = date.year()
    const month = date.month()
    const day = date.date()

    if (!data[year]) data[year] = {}
    if (!data[year][month]) data[year][month] = {}
    if (!data[year][month][day]) data[year][month][day] = []

    data[year][month][day].push(item)
  })

  return data
}
