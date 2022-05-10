import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {User} from "../model/user.model";
import {MonthItem} from "../model/month-item.model";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  baseUrl: string = 'https://budget-calc-a-default-rtdb.europe-west1.firebasedatabase.app/'
  userData: User
  storeUserData: any
  userName: string
  month: MonthItem
  userId: string
  testData = {
    'uid': {
      name: 'John',
      role: 'mortal',
      monthStore: {
        "0": {
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
    }


  }

  constructor(private http: HttpClient) {
  }

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

  updateUserMonths(months: any) {
    let _months = months
    const userId: string = this.setUserId()
    this.http.put(this.baseUrl + `users/${userId}/months.json`, _months)
      .subscribe(resData => {
        console.log('response Data from storeDataUser',
          resData
        )
      })
  }

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
    // .subscribe(resData => {
    //   console.log(resData)
    // })
  }

  fetchData() {
    return this.http.get<any>(this.baseUrl + 'users.json')
      .subscribe(resData => {
        console.log(resData)
      })
  }

  getStoreUserData() {
    return this.storeUserData
  }


  // true

  getUserId(id: string) {
    this.userId = id
  }

  setUserId() {
    if (this.userId == undefined) {
      let jsonData = localStorage.getItem('userData')
      const userData = jsonData !== null ? JSON.parse(jsonData) : [];
      this.userId = userData.id
    }
    return this.userId
  }
}
