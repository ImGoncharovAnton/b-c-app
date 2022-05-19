import {BudgetItem} from "./budget-item.model";

export class MonthItem {
  constructor(public monthId: number,
              public month: string,
              public income: number,
              public expense: number,
              public incomesArr: BudgetItem[],
              public expensesArr: BudgetItem[],
              public key?: string,
              public changedAdmin?: boolean) {
  }
}
