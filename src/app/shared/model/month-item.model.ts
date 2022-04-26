import {BudgetItem} from "./budget-item.model";

export class MonthItem {
  constructor(public monthId: number,
              public month: string,
              public income: number,
              public expense: number,
              public incomeArr: BudgetItem[],
              public expenseArr: BudgetItem[]) {
  }
}
