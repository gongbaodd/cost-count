import { TextField } from "app/components"
import React, { FC, useState } from "react"

export const PriceTextField: FC<{
    price: number, 
    setPrice:(n: number) => void
}> = ({ price, setPrice }) => {
  const [worthContent, setWorthContent] = useState(price.toFixed(2))  
  const [worthFocused, setWorthFocused] = useState(false)

  return (
    <TextField
      value={worthContent}
      autoCorrect={false}
      autoCapitalize="none"
      label="Expense"
      placeholder="0.00"
      keyboardType="numeric"
      onFocus={onNumbericWorthFocus}
      onBlur={onNumbericWorthBlur}
      onChangeText={setNumbericWorth}
    />
  )

  function onNumbericWorthFocus() {
    setWorthFocused(true)
    setWorthContent("")
  }

  function onNumbericWorthBlur() {
    let newWorth = price.toFixed(2)

    if (worthContent !== "") {
      const parsedWorth = parseFloat(worthContent || "0").toFixed(2)
      if (parsedWorth !== "NaN") {
        newWorth = parsedWorth
      }
    }

    setWorthFocused(false)
    setWorthContent(newWorth)
    setPrice(Number(newWorth))
  }

  function setNumbericWorth(worth: string) {
    if (worthFocused) {
      setWorthContent(worth)
    }
  }
}
