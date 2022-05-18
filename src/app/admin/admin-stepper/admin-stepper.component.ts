import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserInfo} from "../admin.component";
import {Subject, takeUntil} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../../shared/service/data.service";

@Component({
  selector: 'app-admin-stepper',
  templateUrl: './admin-stepper.component.html',
  styleUrls: ['./admin-stepper.component.scss']
})
export class AdminStepperComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>()
  selectedValue: UserInfo[]
  selectedMonths: any = [];
  usersArray: UserInfo[] = []
  form: FormGroup
  resultValue: number
  buttonData: string
  isCompleted: boolean = false

  // isLinear = false

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.getAllUsers()
    this.initForm()
    this.getCalcResultValue()
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  getCalcResultValue() {
    this.dataService.calcResult$
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.resultValue = val
      })
  }

  onSelectValueUser(selectedValue: UserInfo[]) {
    this.selectedValue = selectedValue
    // months = Object.entries(item.months)
    if (this.selectedValue) {
      this.isCompleted = true

      this.selectedValue.map(item => {
        let months: any = []
        for (let key in item.months) {
          months.push({...item.months[key], key})
        }
        item.beautyMonths = months
      })
      for (let item of this.selectedValue) {

      }
    }
    console.log('this.selectedValue after map', this.selectedValue)
  }


  checkValue(p: any) {
    console.log(p)
    console.log('this.selectedValue from checkValue', this.selectedValue)
  }

  onSelectValueMonths(data: any, userKey: string) {
    let techArr = this.selectedValue
    techArr.map(item => {

    })

    let editedUser = this.selectedValue.find(x => x.key === userKey)

    if (editedUser) {
      editedUser.editedMonths = [];
      editedUser.editedMonths.push(data);
    }

    this.selectedMonths.push(data);

    console.log(this.selectedValue);

    // this.selectedValue.map((item: any) => {
    //   item.selectedMonths = data
    // })

    let selectedMonths: any = []
    selectedMonths.push([data, userKey])
    // мб использовать фильтр входящих значений...
    console.log(this.selectedMonths)
  }

  getAllUsers() {
    this.dataService.fetchData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: UserInfo[]) => {
        let usersArr: UserInfo[] = []
        data.map(item => {
          if (item.months) {
            usersArr.push(item)
          }
        })
        this.usersArray = usersArr
      })
  }


  onNext() {
  }

  onIncomeButton() {
    this.buttonData = 'income'
    console.log('onIncomeButton', this.buttonData)
    this.form.setValue({
      amount: this.resultValue,
      description: ''
    })
  }

  onExpenseButton() {
    this.buttonData = 'expense'
    console.log('onExpenseButton', this.buttonData)
    this.form.setValue({
      amount: this.resultValue,
      description: ''
    })
  }

  onSubmit() {
    if (this.buttonData === 'income') {
      console.log('click onSubmit income')
      // this.dataService.addIncomeItem(this.form.value)
    }

    if (this.buttonData === 'expense') {
      console.log('click onSubmit expense')
      // this.dataService.addExpenseItem(this.form.value)
    }
  }

  initForm() {
    let myAmount: number = 0;
    let myDesc: string = '';
    this.form = new FormGroup({
      'amount': new FormControl(myAmount, [
        Validators.required,
        Validators.pattern(/^[1-9]+\d*$/)
      ]),
      'description': new FormControl(myDesc, Validators.required)
    })
  }

}
