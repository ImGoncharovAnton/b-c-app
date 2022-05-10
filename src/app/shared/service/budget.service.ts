import {Injectable} from '@angular/core';
import {MonthItem} from '../model/month-item.model';
import {Subject} from "rxjs";
import {BudgetItem} from "../model/budget-item.model";
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  idPage: number;
  monthsChanged$ = new Subject<MonthItem[]>();
  idEditIncomeItem: number;
  idEditExpenseItem: number;
  itemsChangedInc$ = new Subject<BudgetItem[]>();
  itemsChangedExp$ = new Subject<BudgetItem[]>();
  totalCounterInc$ = new Subject<number>();
  totalCounterExp$ = new Subject<number>();
  totalBudgetCounter$ = new Subject<number>();
  monthsArr: MonthItem[] = [];

  data: any

  constructor(private dataService: DataService) {
    console.log('BudgetService Works!')
    this.dataService.fetchUser().subscribe(data => this.data = data)
  }

  _getDataMonths() {
    this.dataService.fetchUser().subscribe(data => this.data = data)
  }

  _getLocalStoreData() {
    let jsonData = localStorage.getItem('monthsStore')
    return jsonData !== null ? JSON.parse(jsonData) : [];
  }

  setPageId(id: number) {
    this.idPage = id;
  }

  getPageId() {
    return this.idPage;
  }

  getMonths() {
    // return this._getLocalStoreData()
    return this.monthsArr
  }

  getMonth(index: number) {
    // let months = this._getLocalStoreData()
    // return months[index]
    return this.monthsArr[index]
  }

  addMonths(newMonths: MonthItem) {
    // const storeUserData = this._getDataMonths()
    console.log(this.data)

    this.monthsArr.push(newMonths)
    console.log('addMonths monthsArr', this.monthsArr)

    // let months = this._getLocalStoreData()
    // months.push(newMonths)

    // localStorage.setItem('monthsStore', JSON.stringify(months));
    // this.monthsChanged$.next(months.slice())
  }

  deleteMonths(index: number) {
    let months = this._getLocalStoreData()
    months.splice(index, 1);
    localStorage.setItem('monthsStore', JSON.stringify(months));
    this.monthsChanged$.next(months.slice())
  }

  addIncomeItem(pageId: number, incomeItem: BudgetItem) {
    let totalIncomes: number = 0;
    let totalBudget: number;
    let months = this._getLocalStoreData()
    let thisMonth = months[pageId];
    let incomesArr = thisMonth.incomeArr;
    incomesArr.push(incomeItem)

    for (let item of incomesArr) {
      totalIncomes = totalIncomes + item.amount
    }
    thisMonth.income = totalIncomes;
    totalBudget = thisMonth.income - thisMonth.expense

    localStorage.setItem('monthsStore', JSON.stringify(months));
    this.itemsChangedInc$.next(incomesArr.slice())
    this.totalCounterInc$.next(totalIncomes)
    this.totalBudgetCounter$.next(totalBudget)
  }

  addExpenseItem(pageId: number, expenseItem: BudgetItem) {
    let totalExpenses: number = 0;
    let totalBudget: number;
    let months = this._getLocalStoreData()
    let thisMonth = months[pageId]
    let expensesArr = thisMonth.expenseArr;
    expensesArr.push(expenseItem)

    for (let item of expensesArr) {
      totalExpenses = totalExpenses + item.amount
    }
    thisMonth.expense = totalExpenses;
    totalBudget = thisMonth.income - thisMonth.expense

    localStorage.setItem('monthsStore', JSON.stringify(months));
    this.itemsChangedExp$.next(expensesArr.slice())
    this.totalCounterExp$.next(totalExpenses)
    this.totalBudgetCounter$.next(totalBudget)
  }

  getIncomeItem(pageId: number, index: number,) {
    let months = this._getLocalStoreData()
    let thisMonth = months[pageId]
    let incomesArr = thisMonth.incomeArr;
    return incomesArr[index];
  }

  getExpenseItem(pageId: number, index: number) {
    let months = this._getLocalStoreData()
    let thisMonth = months[pageId]
    let expensesArr = thisMonth.expenseArr;
    return expensesArr[index];
  }

  getIncomeItems(pageId: number) {
    let months = this._getLocalStoreData()
    let thisMonth = months[pageId]
    return thisMonth.incomeArr
  }

  getExpenseItems(pageId: number) {
    let months = this._getLocalStoreData()
    let thisMonth = months[pageId]
    return thisMonth.expenseArr
  }

  updateIncomeItem(pageId: number, index: number, newIncomeItem: BudgetItem) {
    let totalIncomes: number = 0;
    let totalBudget: number;
    let months = this._getLocalStoreData()
    let thisMonth = months[pageId]
    let incomesArr = thisMonth.incomeArr;
    incomesArr[index] = newIncomeItem;

    for (let item of incomesArr) {
      totalIncomes = totalIncomes + item.amount
    }
    thisMonth.income = totalIncomes;
    totalBudget = thisMonth.income - thisMonth.expense

    localStorage.setItem('monthsStore', JSON.stringify(months));
    this.itemsChangedInc$.next(incomesArr.slice())
    this.totalCounterInc$.next(totalIncomes)
    this.totalBudgetCounter$.next(totalBudget)
  }

  updateExpenseItem(pageId: number, index: number, newExpenseItem: BudgetItem) {
    let totalExpenses: number = 0;
    let totalBudget: number;
    let months = this._getLocalStoreData()
    let thisMonth = months[pageId]
    let expensesArr = thisMonth.expenseArr;
    expensesArr[index] = newExpenseItem;

    for (let item of expensesArr) {
      totalExpenses = totalExpenses + item.amount
    }
    thisMonth.expense = totalExpenses;
    totalBudget = thisMonth.income - thisMonth.expense

    localStorage.setItem('monthsStore', JSON.stringify(months));
    this.itemsChangedExp$.next(expensesArr.slice())
    this.totalCounterExp$.next(totalExpenses)
    this.totalBudgetCounter$.next(totalBudget)
  }

  deleteIncomeItem(pageId: number, index: number) {
    let totalIncomes: number = 0;
    let totalBudget: number;
    let months = this._getLocalStoreData()
    let thisMonth = months[pageId]
    let incomesArr = thisMonth.incomeArr;
    incomesArr.splice(index, 1);

    for (let item of incomesArr) {
      totalIncomes = totalIncomes + item.amount
    }
    thisMonth.income = totalIncomes;
    totalBudget = thisMonth.income - thisMonth.expense

    localStorage.setItem('monthsStore', JSON.stringify(months));
    this.itemsChangedInc$.next(incomesArr.slice());
    this.totalCounterInc$.next(totalIncomes)
    this.totalBudgetCounter$.next(totalBudget)
  }

  deleteExpenseItem(pageId: number, index: number) {
    let totalExpenses: number = 0;
    let totalBudget: number;
    let months = this._getLocalStoreData()
    let thisMonth = months[pageId]
    let expensesArr = thisMonth.expenseArr;
    expensesArr.splice(index, 1);

    for (let item of expensesArr) {
      totalExpenses = totalExpenses + item.amount
    }
    thisMonth.expense = totalExpenses;
    totalBudget = thisMonth.income - thisMonth.expense

    localStorage.setItem('monthsStore', JSON.stringify(months));
    this.itemsChangedExp$.next(expensesArr.slice())
    this.totalCounterExp$.next(totalExpenses)
    this.totalBudgetCounter$.next(totalBudget)
  }

  setIdEditIncomeItem(idEditIncomeItem: number) {
    this.idEditIncomeItem = idEditIncomeItem
  }

  setIdEditExpenseItem(idEditExpenseItem: number) {
    this.idEditExpenseItem = idEditExpenseItem
  }

  getIdEditIncomeItem() {
    return this.idEditIncomeItem
  }

  getIdEditExpenseItem() {
    return this.idEditExpenseItem
  }


}
