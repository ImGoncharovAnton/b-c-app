import {ResponseItem} from "../model/response-item.model";
import {ResponseMonth} from "../model/response-month.model";

export function normalizedMonth(item: ResponseMonth) {
  const monthLocalizedString = function (year: number, month: number, locale: string) {
    return new Date(year, month - 1).toLocaleString(locale, {month: "long"});
  };
  let dataItems = []
  item.monthName = monthLocalizedString(item.year, item.monthNum, 'en')
  let income: number = 0
  let expense: number = 0
  if (item.items.length > 0) {
    dataItems = item.items
    income = dataItems.map((i: ResponseItem) => {
      if (i.type === 0){
        return i.value
      } else {
        return 0
      }
    }).reduce((a, b) => {
      return a + b
    });
    expense = dataItems.map((i: ResponseItem) => {
      if (i.type === 1){
        return i.value
      } else {
        return 0
      }
    }).reduce((a, b) => {
      return a + b
    })
  }
  item.income = income
  item.expense = expense

  return item
}
