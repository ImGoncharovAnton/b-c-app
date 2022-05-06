import {MonthItem} from "./month-item.model";

export class StoreDataUserModel {
  constructor(public email: string,
              public role: string,
              public months: MonthItem[]) {
  }
}
