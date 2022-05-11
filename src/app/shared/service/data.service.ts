import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MonthItem} from "../model/month-item.model";
import {map, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  baseUrl: string = 'https://budget-calc-a-default-rtdb.europe-west1.firebasedatabase.app/'
  monthsChanged$ = new Subject<MonthItem[]>()
  storeUserData: any
  userName: string
  month: MonthItem
  userId: string
  monthStore = {
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

  deleteMonths(key: string | undefined) {
    const userId: string = this.setUserId()
    return this.http.delete(this.baseUrl + `users/${userId}/months/${key}.json`)
  }

  updateUserMonths(months: MonthItem) {
    const userId: string = this.setUserId()
    return this.http.post(this.baseUrl + `users/${userId}/months.json`, months)
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
  }

  fetchUserMonths() {
    const userId: string = this.setUserId()
    return this.http.get<any>(this.baseUrl + `users/${userId}/months.json`)
      .pipe(
        map(response => {
          let months = []
          for (let key in response) {
            months.push({...response[key], key})

          }
          return months
        })
      )
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
