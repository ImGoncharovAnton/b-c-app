import {ResponseItem} from "../model/response-item.model";

export function normalizedItems(items: ResponseItem[]) {
  let total: number
  total = items.map(item => {
    return item.value
  }).reduce((a, b) => {
    return a + b
  })
  return total
}
