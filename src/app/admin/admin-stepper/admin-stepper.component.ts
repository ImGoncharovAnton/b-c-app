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
  selectedMonths: any
  usersArray: UserInfo[] = []
  form: FormGroup
  resultValue: number
  buttonData: string

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
    console.log(selectedValue)
    this.selectedValue = selectedValue
    let techArr: string[] = []
    let months: any = []
    if (this.selectedValue) {
      for (let item of this.selectedValue) {
        techArr.push(item.key)
      }
      this.selectedValue.map(item => {
        months = Object.entries(item.months)
        item.beautyMonths = months
      })
    }


    console.log('techArr', techArr)
    console.log('this.selectedValue after map', this.selectedValue)
  }

  onSelectValueMonths(data: any) {

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
