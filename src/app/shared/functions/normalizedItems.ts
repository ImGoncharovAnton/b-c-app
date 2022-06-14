import {LiteResponseItem} from "../model/lite-response-item.model";

export function normalizedItems(items: LiteResponseItem[]) {
  let total: number
  total = items.map(item => {
    return item.value
  }).reduce((a, b) => {
    return a + b
  })
  return total
}
