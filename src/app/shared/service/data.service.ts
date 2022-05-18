import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MonthItem} from "../model/month-item.model";
import {BehaviorSubject, map, Subject, takeUntil} from "rxjs";
import {BudgetItem} from "../model/budget-item.model";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private destroy$: Subject<boolean> = new Subject<boolean>();
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
  monthStoreExample = {
    '-Nslksldf-sdfkkk;l': {
      monthId: 4,
      month: 'May',
      incomesArr: [
        {amount: 1, description: 'qwe'},
        {amount: 2, description: 'ewq'}
      ],
      income: 30,
      expensesArr: [
        {amount: 3, description: 'rew'},
        {amount: 4, description: 'fasd'}
      ],
      expense: 10
    }
  }

  constructor(private http: HttpClient) {
    console.log('DataService Works!')
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  // test

  createPost(data: any) {
    return this.http.post(this.baseUrl + `test.json`, data)
  }

  fetchPost() {
    return this.http.get<any>(this.baseUrl + `test.json`).pipe(
      map(response => {
        let posts = []
        for (let key in response) {
          posts.push({...response[key], key})
        }
        return posts
      })
    )
  }

  // end test

  _getLocalStoreData() {
    let jsonData = localStorage.getItem('MonthKey')
    return jsonData !== null ? JSON.parse(jsonData) : []
  }

  _fetchNormalizedIncomesArr(userId?: string | null, monthId?: string | null) {
    let totalIncomes: number = 0;
    this.fetchNormalizedIncomesArr(userId, monthId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(incomesArr => {
        for (let item of incomesArr) {
          totalIncomes = totalIncomes + item.amount
        }
        this.itemsChangedInc$.next(incomesArr)
        this.totalCounterInc$.next(totalIncomes)
        this._updateIncomeValue(totalIncomes)
      })
  }

  _fetchNormalizedExpensesArr(userId?: string | null, monthId?: string | null) {
    let totalExpenses: number = 0;
    this.fetchNormalizedExpensesArr(userId, monthId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(expensesArr => {
        for (let item of expensesArr) {
          totalExpenses = totalExpenses + item.amount
        }
        this.itemsChangedExp$.next(expensesArr)
        this.totalCounterExp$.next(totalExpenses)
        this._updateExpenseValue(totalExpenses)
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

  addIncomeItem(incomeItem: BudgetItem) {
    let key = this._getLocalStoreData()
    const userId: string = this.setUserId()
    this.http.post(this.baseUrl + `users/${userId}/months/${key}/incomesArr.json`, incomeItem).subscribe(data => {
      this._fetchNormalizedIncomesArr()
    })
  }

  addExpenseItem(expenseItem: BudgetItem) {
    let key = this._getLocalStoreData()
    const userId: string = this.setUserId()
    this.http.post(this.baseUrl + `users/${userId}/months/${key}/expensesArr.json`, expenseItem).subscribe(data => {
      this._fetchNormalizedExpensesArr()
    })
  }

  _updateIncomeValue(value: number) {
    let pageId: number = this.pageId
    let userId: string = this.setUserId()
    let key = this._getLocalStoreData()
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
    if (this.userKeyId && this.monthKeyId) {
      key = this.monthKeyId
      userId = this.userKeyId
    }
    this.http.put(this.baseUrl + `users/${userId}/months/${key}/income.json`, value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.fetchUserMonths(this.userKeyId)
          .subscribe(months => {
              let month = months[pageId]
              totalBudget = month.income - month.expense
              this.totalBudgetCounter$.next(totalBudget)
            }
          )
      })
  }

  _updateExpenseValue(value: number) {
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
    this.http.put(this.baseUrl + `users/${userId}/months/${key}/expense.json`, value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.fetchUserMonths(this.userKeyId)
          .subscribe(months => {
              let month = months[pageId]
              totalBudget = month.income - month.expense
              this.totalBudgetCounter$.next(totalBudget)
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

  updateIncomeItem(item: BudgetItem, userIdKey?: string | null, monthKeyId?: string | null) {
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

  updateExpenseItem(item: BudgetItem, userIdKey?: string | null, monthKeyId?: string | null) {
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


  // get userData by key from database
  fetchUser() {
    const userId: string = this.setUserId()
    return this.http.get<any>(this.baseUrl + `users/${userId}.json`)
      .pipe(map(resData => {
          return {
            ...resData,
            months: resData.months ? resData.months : []
          }
        }
      ))
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
  getUserId(id: string) {
    this.userId = id
  }

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
