import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
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
    this.http.put('https://budget-calc-a-default-rtdb.europe-west1.firebasedatabase.app/data.json', testData)
      .subscribe(resData => {
        console.log(resData)
      })
  }

}
