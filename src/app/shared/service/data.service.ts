import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {allUsersForAdmin} from "../../admin/admin.component";
import {environment} from "../../../environments/environment";
import {RequestMonth} from "../model/request-month.model";
import {ResponseMonth} from "../model/response-month.model";
import {RequestCreateItem} from "../model/request-item.model";
import {RequestUpdateItem} from "../model/request-update-item.model";
import {ResponseItem} from "../model/response-item.model";
import {ResponseMonthsForUser} from "../model/response-months-for-user";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _itemsPath: string = environment.apiItemsUrl // "https://localhost:7206/api/items/"
  private _monthsPath: string = environment.apiMonthsUrl // "https://localhost:7206/api/months/"
  private _setupPath: string = environment.apiSetupUrl // "https://localhost:7206/api/setup/"
  monthsChanged$ = new Subject<ResponseMonthsForUser[]>()
  itemsChangesIncome$ = new BehaviorSubject<ResponseItem[] | null>(null)
  itemsChangesExpense$ = new BehaviorSubject<ResponseItem[] | null>(null)
  idUser$ = new BehaviorSubject<string | null>(null)
  idMonth$ = new BehaviorSubject<number | null>(null)
  IdEditItemIncome: number
  IdEditItemExpense: number
  userId: string
  showSteps$ = new BehaviorSubject<boolean>(false)
  calcResult$ = new BehaviorSubject<number>(0)

  constructor(private http: HttpClient) {
    console.log('DataService Works!')
  }

  getLocalUserId() {
    let jsonData = localStorage.getItem('userData')
    const userData = jsonData !== null ? JSON.parse(jsonData) : []
    return userData.userId
  }

  setIdEditItemIncome(IdEditItemIncome: number) {
    this.IdEditItemIncome = IdEditItemIncome
  }

  setIdEditItemExpense(IdEditItemExpense: number) {
    this.IdEditItemExpense = IdEditItemExpense
  }

  getIdEditItemIncome() {
    return this.IdEditItemIncome
  }

  getIdEditItemExpense() {
    return this.IdEditItemExpense
  }

  // -------------------Months start---------------------------------------------

  getUserMonths() {
    let userId: string = this.getLocalUserId();
    return this.http.get<ResponseMonthsForUser[]>(this._monthsPath + 'getMonthForUser/' + userId)
  }

  getMonth(id: number) {
    return this.http.get<ResponseMonth>(this._monthsPath + 'getMonth/' + id)
  }

  addUserMonth(month: RequestMonth) {
    return this.http.post(this._monthsPath + 'createMonth', month)
  }

  deleteUserMonth(id: number) {
    return this.http.delete(this._monthsPath + 'deleteMonth/' + id)
  }

  // -------------------------Months end --------------------------------------

  // --------------------------Items start-------------------------------------

  // test request
  getItems() {
    return this.http.get(this._itemsPath + 'GetItems')
  }

  getItem(id: number) {
    return this.http.get<ResponseItem>(this._itemsPath + 'GetItem/' + id)
  }

  getIncomeItemsForMonth(monthId: number) {
    return this.http.get<ResponseItem[]>(this._itemsPath + 'getIncomeItemsForMonth/' + monthId)
  }

  getExpenseItemsForMonth(monthId: number) {
    return this.http.get<ResponseItem[]>(this._itemsPath + 'getExpenseItemsForMonth/' + monthId)
  }

  createItem(item:RequestCreateItem) {
    return this.http.post(this._itemsPath + 'createItem', item)
  }

  updateItem(id: number, item: RequestUpdateItem) {
    return this.http.put<ResponseItem>(this._itemsPath + 'updateItem/' + id, item)
  }

  deleteItem(id: number) {
    return this.http.delete(this._itemsPath + 'deleteItem/' + id)
  }

  // --------------------------Items end-------------------------------------

  // ------------------------------Admin panel start -----------------------------------

  getAllUsers() {
    return this.http.get<allUsersForAdmin[]>(this._setupPath + 'getAllUsers')
  }

  getUser(id: string) {
    return this.http.get(this._setupPath + 'GetUser/' + id)
  }

  // ------------------------------Admin panel end -----------------------------------

}
