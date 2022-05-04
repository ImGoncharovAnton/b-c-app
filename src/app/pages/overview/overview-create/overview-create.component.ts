import {Component, OnInit} from '@angular/core';
import {MonthItem} from "../../../shared/model/month-item.model";
import {BudgetService} from "../../../shared/service/budget.service";

@Component({
  selector: 'app-overview-create',
  templateUrl: './overview-create.component.html',
  styleUrls: ['./overview-create.component.scss']
})
export class OverviewCreateComponent implements OnInit {
  private monthDate: string = new Date().toLocaleString('en', {month: "long"})

  constructor(private budgetService: BudgetService) {
  }

  ngOnInit(): void {

  }

  onCreate() {
    const monthLocalizedString = function (month: number, locale: string) {
      return new Date(new Date().getFullYear(), month).toLocaleString(locale, {month: "long"});
    };
    let monthsArr = this.budgetService.getMonths();

    if (monthsArr.length > 0) {
      let prevMonth = monthsArr[monthsArr.length - 1];
      let prevMonthId = prevMonth.monthId
      const newMonthItem = new MonthItem(prevMonthId + 1, monthLocalizedString(prevMonthId + 1, 'en'), 0, 0, [], []);
      this.budgetService.addMonths(newMonthItem)
    } else {
      const newMonthItem = new MonthItem(new Date().getMonth(), this.monthDate, 0, 0, [], [])
      this.budgetService.addMonths(newMonthItem)
    }
  }
}
