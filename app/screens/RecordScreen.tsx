import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ScrollView, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Header, ListView, ListItem } from "app/components"
import { spacing } from "app/theme"

interface RecordScreenProps extends AppStackScreenProps<"Record"> {}

const test = [
  {
    id: "1",
    name: "text",
    price: "15.00",
    type: "food",
    timestamp: 1500,
  },
  {
    id: "2",
    name: "text",
    price: "15.00",
    type: "food",
    timestamp: 1500,
  },
  {
    id: "3",
    name: "text",
    price: "15.00",
    type: "food",
    timestamp: 1500,
  },
  {
    id: "4",
    name: "text",
    price: "15.00",
    type: "food",
    timestamp: 1500,
  },
  {
    id: "5",
    name: "text",
    price: "15.00",
    type: "food",
    timestamp: 1500,
  },
  {
    id: "6",
    name: "text",
    price: "15.00",
    type: "food",
    timestamp: 1500,
  },
  {
    id: "7",
    name: "text",
    price: "15.00",
    type: "food",
    timestamp: 1500,
  },
  {
    id: "8",
    name: "text",
    price: "15.00",
    type: "food",
    timestamp: 1500,
  },
  {
    id: "9",
    name: "text",
    price: "15.00",
    type: "food",
    timestamp: 1500,
  },
  {
    id: "10",
    name: "text",
    price: "15.00",
    type: "food",
    timestamp: 1500,
  },
  {
    id: "11",
    name: "text",
    price: "15.00",
    type: "food",
    timestamp: 1500,
  },
  {
    id: "12",
    name: "text",
    price: "15.00",
    type: "food",
    timestamp: 1500,
  },
  {
    id: "13",
    name: "text",
    price: "15.00",
    type: "food",
    timestamp: 1500,
  },
  {
    id: "14",
    name: "text",
    price: "15.00",
    type: "food",
    timestamp: 1500,
  },
  {
    id: "15",
    name: "text",
    price: "15.00",
    type: "food",
    timestamp: 1500,
  },
  {
    id: "16",
    name: "text",
    price: "15.00",
    type: "food",
    timestamp: 1500,
  },
]

export const RecordScreen: FC<RecordScreenProps> = observer(function RecordScreen({ navigation }) {
  return (
    <Screen 
      preset="fixed" 
      contentContainerStyle={$root}
    >
      <Header
        leftIcon="back"
        onLeftPress={() => {
          navigation.goBack()
        }}
        title="Records"
      />
      <ScrollView style={$listView}>
        <ListView
          data={test}
          renderItem={({ item }) => <ListItem text={item.name} key={item.id} />}
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
