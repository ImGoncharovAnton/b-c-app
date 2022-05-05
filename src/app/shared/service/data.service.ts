import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {User} from "../model/user.model";
import {MonthItem} from "../model/month-item.model";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  baseUrl: string = 'https://budget-calc-a-default-rtdb.europe-west1.firebasedatabase.app/'
  userData: User
  userName: string
  month: MonthItem
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

  storeData() {
    const testData = this.testData
    this.http.put(this.baseUrl + 'users.json', testData)
      .subscribe(resData => {
        console.log(resData)
      })
  }

  fetchData() {
    return this.http.get<any>(this.baseUrl + 'users.json')
      .subscribe(resData => {
        console.log(resData)
      })
  }

  getUserData(user: User) {
    this.userData = user;

  }

  setUserData() {
    return this.userData
  }

  getUsername(username: string) {
    this.userName = username
  }

  getMonthData(month: MonthItem) {
    this.month = month;
  }

  setMonthData() {
    return this.month
  }

  dataUser() {
    const userId = this.userData.id
    const userName = this.userName
    const userRole = this.userData.role
    const month = this.month
    const dataObj = {
      userId: {
        userName,
        userRole,
        month
      }
    }
  }
}
