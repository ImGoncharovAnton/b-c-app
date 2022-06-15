import {LiteResponseItem} from "../model/response/lite-response-item.model";

export function normalizedItems(items: LiteResponseItem[]) {
  let total: number
  total = items.map(item => {
    return item.value
  }).reduce((a, b) => {
    return a + b
  })
  return total
}
