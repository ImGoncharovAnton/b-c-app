import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MonthItem} from "../model/month-item.model";
import {StoreDataUserModel} from "../model/storeDataUser.model";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  baseUrl: string = 'https://budget-calc-a-default-rtdb.europe-west1.firebasedatabase.app/'
  userId: string
  month: MonthItem
  userData: any
  data$ = new Subject<any>();
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
    // this._checkUserId()
  }

  storeUser(email: string, userId: string) {
    const lockData = {
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

  storeDataUser(userData: StoreDataUserModel) {
    let userId = this.userId
    this.http.put(this.baseUrl + `users/${userId}.json`, userData)
      .subscribe(resData => {
        console.log('response Data from storeDataUser',
          resData
        )
      })
  }

  fetchUsers() {
    return this.http.get<any>(this.baseUrl + 'users.json')
      .subscribe(resData => {
        console.log(resData)
      })
  }

  fetchUser() {
    if (this.userId === undefined) {
      console.log('2222222222222222222222222222222222222')
      const jsonData = localStorage.getItem('userData')
      const dataUser = jsonData !== null ? JSON.parse(jsonData) : [];
      console.log('LOCALStorage DATAUSER', dataUser)
      console.log('23432werf', dataUser.id)

      return this.http.get<any>(this.baseUrl + `users/${dataUser.id}.json`)
        .subscribe(response => {
          console.log(response)
          this.userData = response
          this.data$.next(response)
        })
    } else {
      console.log('11111111111111111111111111111111111')
      return this.http.get<any>(this.baseUrl + `users/${this.userId}.json`)
        .subscribe(response => {
          console.log(response)
          this.userData = response
          console.log(this.userData)
        })
    }

  }

  getUserId(userId: string) {
    this.userId = userId
    console.log('UID from auth', this.userId)
  }

  getUserDataFromStore() {
    console.log(this.userData)
    return this.userData
  }

  _checkUserId() {
    console.log('userID', this.userId)
    if (this.userId === undefined) {
      const jsonData = localStorage.getItem('userData')
      const dataUser = jsonData !== null ? JSON.parse(jsonData) : [];
      console.log('LOCALStorage DATAUSER', dataUser)
      console.log('23432werf', dataUser.id)
      this.userId = dataUser.id
    }
  }


  // getUserData() {
  //   const jsonData = localStorage.getItem('userData')
  //   const dataUser = jsonData !== null ? JSON.parse(jsonData) : [];
  //   return {
  //     userId: dataUser.id,
  //     userEmail: dataUser.email,
  //     userRole: dataUser.role
  //   }
  // }

}
