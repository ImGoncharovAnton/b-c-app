import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserInfo} from "../../admin.component";
import {map, Observable, Subject, takeUntil} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../../../shared/service/data.service";
import {MatStepper, StepperOrientation} from "@angular/material/stepper";
import {BreakpointObserver} from "@angular/cdk/layout";
import {BudgetItem} from "../../../shared/model/budget-item.model";

export interface DataForSend {
  userKey: string
  months: [{ monthKey: string, monthIndex: number }]
}

export interface NormalizedDataForSend {
  userKey: string
  monthKey: string
  monthIndex: number
  expenseItem?: BudgetItem
  incomesItem?: BudgetItem
}

@Component({
  selector: 'app-admin-stepper',
  templateUrl: './admin-stepper.component.html',
  styleUrls: ['./admin-stepper.component.scss']
})
export class AdminStepperComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>()
  stepperOrientation$: Observable<StepperOrientation>;
  selectedValue: UserInfo[]
  trueProperty: boolean = false
  usersArray: UserInfo[] = []
  form: FormGroup
  resultValue: number | null
  buttonData: string
  showSteps: boolean


  @ViewChild(MatStepper) stepper: MatStepper;

  constructor(private dataService: DataService,
              private breakpointObserver: BreakpointObserver) {
    this.stepperOrientation$ = breakpointObserver
      .observe('(min-width: 500px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.getAllUsers()
    this.getCalcResultValue()
    this.initForm()
    this.dataService.showSteps$
      .pipe(takeUntil(this.destroy$))
      .subscribe(showSteps => {
        this.showSteps = showSteps
      })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
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

  getCalcResultValue() {
    this.dataService.calcResult$
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.resultValue = val
      })
  }

  onSelectValueUser(selectedValue: UserInfo[]) {
    this.selectedValue = selectedValue
    if (this.selectedValue) {
      this.selectedValue.map(item => {
        let months: any = []
        for (let key in item.months) {
          months.push({...item.months[key], key})
        }
        item.beautyMonths = months
      })
    }
    if (this.selectedValue && this.selectedValue.length > 0) {
      this.stepper.selected!.completed = true
    }
  }

  onNextStep1() {
    if (this.selectedValue && this.selectedValue.length > 0) {
      this.stepper.selected!.completed = true
      this.stepper.next()
    } else {
      alert('Please select at least one value!')
    }
  }

  checkValue(p?: any) {
    this.trueProperty = this.selectedValue.every(item => item.editedMonths && item.editedMonths.length > 0)
  }

  onIncomeButton() {
    this.buttonData = 'income'
    if (this.trueProperty) {
      this.stepper.selected!.completed = true
    }
    this.form.setValue({
      amount: this.resultValue,
      description: ''
    })
  }

  onExpenseButton() {
    this.buttonData = 'expense'
    if (this.trueProperty) {
      this.stepper.selected!.completed = true
    }
    this.form.setValue({
      amount: this.resultValue,
      description: ''
    })
  }

  onNextStep2() {
    if (this.trueProperty && this.buttonData) {
      this.stepper.selected!.completed = true
      this.stepper.next()
    } else {
      alert('Please select at least one value for each user and operation type.')
      this.stepper.selected!.completed = false
    }
    this.form.setValue({
      amount: this.resultValue,
      description: ''
    })
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

  onSubmit() {
    const selectedValue: UserInfo[] = this.selectedValue
    const arrForSend: DataForSend[] = []
    const arrForSendNormalized: NormalizedDataForSend[] = []
    let changed: boolean = true

    for (let item of selectedValue) {
      const userObj: any = {}
      const months: any = []
      userObj.userKey = item.key
      userObj.months = months
      for (let monthItem of item.editedMonths) {
        let monthObj: any = {}
        monthObj.monthKey = monthItem[0].key
        monthObj.monthIndex = monthItem[1]
        months.push(monthObj)
      }
      arrForSend.push(userObj)
    }

    for (let item of arrForSend) {
      for (let monthItem of item.months) {
        let userObj: any = {}
        userObj.userKey = item.userKey
        userObj.monthKey = monthItem.monthKey
        userObj.monthIndex = monthItem.monthIndex
        arrForSendNormalized.push(userObj)
      }
    }
    if (this.buttonData === 'income') {
      for (let item of arrForSendNormalized) {
        this.dataService.setPageId(item.monthIndex)
        this.dataService.addIncomeItem(this.form.value, item.userKey, item.monthKey, item.monthIndex, changed)
      }
    }

    if (this.buttonData === 'expense') {
      for (let item of arrForSendNormalized) {
        this.dataService.setPageId(item.monthIndex)
        this.dataService.addExpenseItem(this.form.value, item.userKey, item.monthKey, item.monthIndex, changed)
      }
    }
    alert('Successfully added!')
    this.stepper.reset()
    this.showSteps = false
  }

  onBack() {
    // this.trueProperty = false
  }


}
