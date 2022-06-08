import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MonthItem} from "../model/month-item.model";
import {BehaviorSubject, map, Observable, Subject, takeUntil} from "rxjs";
import {BudgetItem} from "../model/budget-item.model";
import {DataForAdminPanel} from "../../admin/admin.component";
import {environment} from "../../../environments/environment";
import {RequestMonth} from "../model/request-month.model";
import {ResponseMonth} from "../model/response-month.model";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _itemsPath: string = environment.apiItemsUrl // "https://localhost:7206/api/items/"
  private _monthsPath: string = environment.apiMonthsUrl // "https://localhost:7206/api/months/"
  private destroy$: Subject<boolean> = new Subject<boolean>()
  userId1: string
  // monthsChanged1$ = new Subject<ResponseMonth[]>()
  monthsChanged1$ = new BehaviorSubject<ResponseMonth | null>(null)

  ////////////// == old version =======================================

  baseUrl: string = 'https://budget-calc-a-default-rtdb.europe-west1.firebasedatabase.app/'
  monthsChanged$ = new Subject<MonthItem[]>()
  totalBudgetCounter$ = new Subject<number>()
  itemsChangedInc$ = new Subject<BudgetItem[]>()
  itemsChangedExp$ = new Subject<BudgetItem[]>()
  totalCounterInc$ = new Subject<number>()
  totalCounterExp$ = new Subject<number>()
  userKey$ = new BehaviorSubject<string | null>(null)
  calcResult$ = new BehaviorSubject<number>(0)
  monthKeyId$ = new BehaviorSubject<string | null>(null)
  changedState$ = new BehaviorSubject<boolean>(false)
  showSteps$ = new BehaviorSubject<boolean>(false)
  userChanged$ = new BehaviorSubject<DataForAdminPanel | null>(null)
  pageId: number
  idEditIncomeItem: number
  idEditExpenseItem: number
  keyEditIncomeItem: string | undefined
  keyEditExpenseItem: string | undefined
  userKeyId: string | null
  monthKeyId: string | null
  userName: string
  month: MonthItem
  userId: string


  constructor(private http: HttpClient) {
    console.log('DataService Works!')
  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
  }

  /////////// ---------------------------- new version

  getItems() {
    return this.http.get(this._itemsPath + 'GetItems')
  }

  getUserMonths() {
    let userId: string = this.getLocalUserId();
    // return this.http.get<any>(this._monthsPath + 'getMonthForUser/a00c441e-59b0-4162-a1d7-597d45772a53')
    return this.http.get<ResponseMonth[]>(this._monthsPath + 'getMonthForUser/' + userId)
  }

  getLocalUserId() {
    let jsonData = localStorage.getItem('userData')
    const userData = jsonData !== null ? JSON.parse(jsonData) : []
    return userData.userId
  }

  addUserMonth(month: RequestMonth) {
    return this.http.post(this._monthsPath + 'createMonth', month)
  }

  deleteUserMonth(id: number) {
    return this.http.delete(this._monthsPath + 'deleteMonth/' + id)
  }


  // --------------------------------------------------------------------------------- old version---------



  _getLocalStoreData() {
    let jsonData = localStorage.getItem('MonthKey')
    return jsonData !== null ? JSON.parse(jsonData) : []
  }

  _fetchNormalizedIncomesArr(userId?: string | null, monthId?: string | null, monthIndex?: number, incomeItem?: BudgetItem) {
    let totalIncomes: number = 0;
    this.fetchNormalizedIncomesArr(userId, monthId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(incomesArr => {
        for (let item of incomesArr) {
          totalIncomes = totalIncomes + item.amount
        }
        this.itemsChangedInc$.next(incomesArr)
        this.totalCounterInc$.next(totalIncomes)
        this._updateIncomeValue(totalIncomes, monthIndex, userId, monthId, incomeItem)
      })
  }

  _fetchNormalizedExpensesArr(userId?: string | null, monthId?: string | null, monthIndex?: number, expenseItem?: BudgetItem) {
    let totalExpenses: number = 0;
    this.fetchNormalizedExpensesArr(userId, monthId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(expensesArr => {
        for (let item of expensesArr) {
          totalExpenses = totalExpenses + item.amount
        }
        this.itemsChangedExp$.next(expensesArr)
        this.totalCounterExp$.next(totalExpenses)

        this._updateExpenseValue(totalExpenses, monthIndex, userId, monthId, expenseItem)
      })
  }
  // Create userData in Database
  storeUser(username: string, email: string, userId: string) {
    const lockData = {
      username: username,
      email: email,
      role: 'mortal'
    }
    this.http.put(this.baseUrl + `users/${userId}.json`, lockData)
      .subscribe(resData => {
        console.log('response Data from storeUserLock',
          resData
        )
      })
  }

  // delete item by key from database
  deleteMonths(key: string | undefined) {
    const userId: string = this.setUserId()
    return this.http.delete(this.baseUrl + `users/${userId}/months/${key}.json`)
  }

  addUserMonths(month: MonthItem) {
    const userId: string = this.setUserId()
    return this.http.post(this.baseUrl + `users/${userId}/months.json`, month)
  }

  addIncomeItem(incomeItem: BudgetItem, userKey?: string, monthKey?: string, monthIndex?: number, changed?: boolean) {
    incomeItem.adminChanged = !!changed;
    let key = this._getLocalStoreData()
    let userId: string = this.setUserId()
    if (userKey && monthKey) {
      userId = userKey
      key = monthKey
    }
    this.http.post(this.baseUrl + `users/${userId}/months/${key}/incomesArr.json`, incomeItem).subscribe(data => {
      this._fetchNormalizedIncomesArr(userKey, monthKey, monthIndex, incomeItem)
    })
  }

  addExpenseItem(expenseItem: BudgetItem, userKey?: string, monthKey?: string, monthIndex?: number, changed?: boolean) {
    expenseItem.adminChanged = !!changed;
    let key = this._getLocalStoreData()
    let userId: string = this.setUserId()
    if (userKey && monthKey) {
      userId = userKey
      key = monthKey
    }
    this.http.post(this.baseUrl + `users/${userId}/months/${key}/expensesArr.json`, expenseItem).subscribe(data => {
      this._fetchNormalizedExpensesArr(userKey, monthKey, monthIndex, expenseItem)
    })
  }

  _updateIncomeValue(value: number, monthIndex?: number, userKey?: string | null, monthKey?: string | null, incomeItem?: BudgetItem) {
    let pageId: number = this.pageId
    let userId: string = this.setUserId()
    let key = this._getLocalStoreData()
    if (monthIndex) {
      pageId = monthIndex
    }
    this.userKey$
      .pipe(takeUntil(this.destroy$))
      .subscribe(userKey => {
        this.userKeyId = userKey
      })
    this.monthKeyId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(monthKey => {
        this.monthKeyId = monthKey
      })
    let totalBudget: number;
    if (userKey && monthKey) {
      userId = userKey
      key = monthKey
    }
    if (this.userKeyId && this.monthKeyId) {
      key = this.monthKeyId
      userId = this.userKeyId
    }
    let techObjInc: any = {}
    techObjInc.userKey = userId
    techObjInc.monthKey = key
    techObjInc.monthIndex = pageId
    if (incomeItem) {
      techObjInc.incomeItem = incomeItem
    }
    this.http.put(this.baseUrl + `users/${userId}/months/${key}/income.json`, value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.fetchUserMonths(userId)
          .subscribe(months => {
              let month = months[pageId]
              techObjInc.expense = month.expense
              techObjInc.income = month.income
              totalBudget = month.income - month.expense
              this.totalBudgetCounter$.next(totalBudget)
              this.userChanged$.next(techObjInc)
            }
          )
      })
  }

  _updateExpenseValue(value: number, monthIndex?: number, userKey?: string | null, monthKey?: string | null, expenseItem?: BudgetItem) {
    let totalBudget: number;
    let key = this._getLocalStoreData()
    let userId: string = this.setUserId()
    let pageId: number = this.pageId
    this.userKey$
      .pipe(takeUntil(this.destroy$))
      .subscribe(userKey => {
        this.userKeyId = userKey
      })
    this.monthKeyId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(monthKey => {
        this.monthKeyId = monthKey
      })
    if (this.userKeyId && this.monthKeyId) {
      key = this.monthKeyId
      userId = this.userKeyId
    }
    if (monthIndex) {
      pageId = monthIndex
    }
    if (userKey && monthKey) {
      userId = userKey
      key = monthKey
    }

    let techObjExp: any = {}
    techObjExp.userKey = userId
    techObjExp.monthKey = key
    techObjExp.monthIndex = pageId
    if (expenseItem) {
      techObjExp.expenseItem = expenseItem
    }

    this.http.put(this.baseUrl + `users/${userId}/months/${key}/expense.json`, value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.fetchUserMonths(userId)
          .subscribe(months => {
              let month = months[pageId]
              techObjExp.expense = month.expense
              techObjExp.income = month.income
              totalBudget = month.income - month.expense
              this.totalBudgetCounter$.next(totalBudget)
              this.userChanged$.next(techObjExp)
            }
          )
      })
  }

  fetchNormalizedIncomesArr(userIdKey?: string | null, monthKeyId?: string | null) {
    let userId: string = this.setUserId()
    let key = this._getLocalStoreData()
    if (userIdKey && monthKeyId) {
      userId = userIdKey
      key = monthKeyId
    }
    return this.http.get<any>(this.baseUrl + `users/${userId}/months/${key}/incomesArr.json`)
      .pipe(map(resData => {
        let incomesArr = []
        for (let key in resData) {
          incomesArr.push({...resData[key], key})
        }
        return incomesArr;
      }))
  }

  fetchNormalizedExpensesArr(userIdKey?: string | null, monthKeyId?: string | null) {
    let userId: string = this.setUserId()
    let key = this._getLocalStoreData()
    if (userIdKey && monthKeyId) {
      userId = userIdKey
      key = monthKeyId
    }
    return this.http.get<any>(this.baseUrl + `users/${userId}/months/${key}/expensesArr.json`)
      .pipe(map(resData => {
        let expensesArr = []
        for (let key in resData) {
          expensesArr.push({...resData[key], key})
        }
        return expensesArr;
      }))
  }

  deleteIncomeItem(keyId: string | undefined) {
    const userId: string = this.setUserId()
    let key = this._getLocalStoreData()
    this.http.delete(this.baseUrl + `users/${userId}/months/${key}/incomesArr/${keyId}.json`)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this._fetchNormalizedIncomesArr()
      })
  }

  deleteExpenseItem(keyId: string | undefined) {
    const userId: string = this.setUserId()
    let key = this._getLocalStoreData()
    this.http.delete(this.baseUrl + `users/${userId}/months/${key}/expensesArr/${keyId}.json`)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this._fetchNormalizedExpensesArr()
      })
  }

  updateIncomeItem(item: BudgetItem, userIdKey?: string | null, monthKeyId?: string | null, changed?: boolean) {
    item.adminChanged = !!changed;
    let keyEditItem = this.keyEditIncomeItem
    let userId: string = this.setUserId()
    let key = this._getLocalStoreData()
    if (userIdKey && monthKeyId) {
      userId = userIdKey
      key = monthKeyId
    }
    this.http.put(this.baseUrl + `users/${userId}/months/${key}/incomesArr/${keyEditItem}.json`, item)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this._fetchNormalizedIncomesArr(userId, key)
      })
  }

  updateExpenseItem(item: BudgetItem, userIdKey?: string | null, monthKeyId?: string | null, changed?: boolean) {
    item.adminChanged = !!changed;
    let keyEditItem = this.keyEditExpenseItem
    let userId: string = this.setUserId()
    let key = this._getLocalStoreData()
    if (userIdKey && monthKeyId) {
      userId = userIdKey
      key = monthKeyId
    }
    this.http.put(this.baseUrl + `users/${userId}/months/${key}/expensesArr/${keyEditItem}.json`, item)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this._fetchNormalizedExpensesArr(userId, key)
      })
  }


  // get userData by key months from database
  fetchUserMonths(idUser?: string | null) {
    let userId: string = this.setUserId()
    if (idUser) {
      userId = idUser
    }
    return this.http.get<any>(this.baseUrl + `users/${userId}/months.json`)
      .pipe(
        map(response => {
          let months = []
          for (let key in response) {
            months.push({...response[key], key})
          }
          return months.map(data => {
            return {
              ...data,
              incomesArr: data.incomesArr ? data.incomesArr : [],
              expensesArr: data.expensesArr ? data.expensesArr : [],
            }
          })
        })
      )
  }

  fetchData() {
    return this.http.get<any>(this.baseUrl + 'users.json')
      .pipe(
        map(response => {
          let usersArr = []
          for (let key in response) {
            usersArr.push({...response[key], key})
          }
          return usersArr
        })
      )
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

  setKeyEditIncomeItem(idKey: string | undefined) {
    this.keyEditIncomeItem = idKey
  }

  setKeyEditExpenseItem(idKey: string | undefined) {
    this.keyEditExpenseItem = idKey
  }

  setPageId(id: number) {
    this.pageId = id
  }

  getPageId() {
    return this.pageId
  }

  // get localId from auth service
  // getUserId(id: string) {
  //   this.userId = id
  // }

  // set userId from local storage and return value
  setUserId() {
    if (this.userId == undefined) {
      let jsonData = localStorage.getItem('userData')
      const userData = jsonData !== null ? JSON.parse(jsonData) : [];
      this.userId = userData.id
    }
    return this.userId
  }
}
