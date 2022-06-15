import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {allUsersForAdmin} from "../../admin.component";
import {map, Observable, Subject, takeUntil} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../../../shared/service/data.service";
import {MatStepper, StepperOrientation} from "@angular/material/stepper";
import {BreakpointObserver} from "@angular/cdk/layout";
import {RequestCreateItem} from "../../../shared/model/request/request-item.model";
import {IHubMessage} from "../../../shared/model/IHubMessage";

@Component({
  selector: 'app-admin-stepper',
  templateUrl: './admin-stepper.component.html',
  styleUrls: ['./admin-stepper.component.scss']
})
export class AdminStepperComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>()
  stepperOrientation$: Observable<StepperOrientation>;
  form: FormGroup
  showSteps: boolean
  usersArray: allUsersForAdmin[] = []
  selectedValue: allUsersForAdmin[]
  resultValue: number | null
  trueProperty: boolean = false
  buttonData: string


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

  getCalcResultValue() {
    this.dataService.calcResult$
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.resultValue = val
      })
  }

  getAllUsers() {
    const monthLocalizedString = function (year: number, month: number, locale: string) {
      return new Date(year, month - 1).toLocaleString(locale, {month: "long"});
    };
    this.dataService.getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: allUsersForAdmin[]) => {
          let dataArr: allUsersForAdmin[] = []
          data.map(item => {
            if (item.months.length > 0) {
              item.months.map(month => {
                month.monthName = monthLocalizedString(month.year, month.monthNum, "en")
              })
              dataArr.push(item)
            }
          })
          this.usersArray = dataArr
        },
        error: err => alert('error while fetching the records')
      })
  }


  onSelectValueUser(selectedValue: allUsersForAdmin[]) {
    this.selectedValue = selectedValue
    console.log('this.selectedValue', this.selectedValue)
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
    this.trueProperty = this.selectedValue.every(item => item.months && item.months.length > 0)
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
    let selectedData = this.selectedValue;
    let arrForSend: RequestCreateItem[] = []
    let userIdArr: string[] = []
    let message: string = 'New items added by admin, please reload page!'

    for (let item of selectedData) {
      userIdArr.push(item.id)
      if (item.selectedMonth) {
        for (let monthItem of item.selectedMonth) {
          let objForSend: any = {}
          objForSend.createdBy = this.dataService.getLocalUserId()
          objForSend.value = this.form.value.amount
          objForSend.description = this.form.value.description
          objForSend.type = null
          objForSend.monthId = monthItem.monthId
          if (this.buttonData === 'income') {
            objForSend.type = 0
          }
          if (this.buttonData === 'expense') {
            objForSend.type = 1
          }
          arrForSend.push(objForSend)
        }
      }
    }


    try {
      arrForSend.forEach(item => {
        this.dataService.createItem(item)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            res => this.dataService.createItemFromAdmin$.next(true)
          )
      })
      alert('Successfully added!')
      userIdArr.forEach(el => {
        this.dataService.sendMessage(el, message)
          .subscribe({
            next: (res) => {},
            error: er => console.error(er)
          })
      })
    }
    catch (e) {
      alert('create item error')
    }
    this.stepper.reset()
    this.showSteps = false
  }

  onBack() {
    this.trueProperty = false
  }


}
