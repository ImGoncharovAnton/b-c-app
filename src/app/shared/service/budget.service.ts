import {Injectable} from '@angular/core';
import {MonthItem} from '../model/month-item.model';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  idPage: number;
  monthsChanged$ = new Subject<MonthItem[]>();

  constructor() {
    console.log('BudgetService Works!')
  }

  getMonths() {
    return localStorage.getItem('monthsStore')
  }

  addMonths(newMonths: MonthItem) {
    let jsonData = localStorage.getItem('monthsStore')
    let months = jsonData !== null ? JSON.parse(jsonData) : [];
    months.push(newMonths)
    localStorage.setItem('monthsStore', JSON.stringify(months));
    console.log(months)
    this.monthsChanged$.next(months.slice())
    console.log(this.monthsChanged$)
  }

  setPageId(id: number) {
    this.idPage = id;
  }

  getPageId() {
    return this.idPage
  }

}
