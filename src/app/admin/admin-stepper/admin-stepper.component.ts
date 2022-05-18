import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserInfo} from "../admin.component";
import {Subject, takeUntil} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../../shared/service/data.service";
import {MatStepper} from "@angular/material/stepper";

@Component({
  selector: 'app-admin-stepper',
  templateUrl: './admin-stepper.component.html',
  styleUrls: ['./admin-stepper.component.scss']
})
export class AdminStepperComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>()
  selectedValue: UserInfo[]
  trueProperty: boolean = false
  usersArray: UserInfo[] = []
  form: FormGroup
  resultValue: number
  buttonData: string

  @ViewChild(MatStepper) stepper: MatStepper;

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
    console.log('this.selectedValue after map', this.selectedValue)
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
    console.log(p)
    this.trueProperty = this.selectedValue.every(item => item.editedMonths && item.editedMonths.length > 0)
    console.log('this.selectedValue from checkValue', this.selectedValue)
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
    if (this.buttonData === 'income') {
      console.log('click onSubmit income')
      // this.dataService.addIncomeItem(this.form.value)
    }

    if (this.buttonData === 'expense') {
      console.log('click onSubmit expense')
      // this.dataService.addExpenseItem(this.form.value)
    }
  }

  onBack() {
    // this.trueProperty = false
  }


}
