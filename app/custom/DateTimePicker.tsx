import { Button, Text } from "app/components"
import React, { FC, useState } from "react"
import Dtp, { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import dayjs from "dayjs"
import { spacing } from "app/theme"
import { ViewStyle } from "react-native"

interface DateTimePickerProps {
  value: Date
  setValue: (value: Date) => void
}

export const DateTimePicker: FC<DateTimePickerProps> = ({ value, setValue }) => {
  const [visible, setVisible] = useState(false)
  const date = dayjs(value).format("YYYY-MM-DD")
  return (
    <>
      <Text text="Date" preset="formLabel" />
      <Button text={date} style={$dateButton} onPress={onDateButtonPress} />
      {visible && <Dtp value={new Date(value)} onChange={onChange} onTouchCancel={onTouchCancel} />}
    </>
  )

  function onDateButtonPress() {
    setVisible(true)
  }

  function onChange(event: DateTimePickerEvent, date?: Date) {
    setVisible(false)
    if (date) {
        setValue(date)
    }
  }

  function onTouchCancel() {
    setVisible(false)
  }
}

const $dateButton: ViewStyle = {
    marginTop: spacing.xs,
    justifyContent: "flex-start",
    minHeight: spacing.lg,
  }
  