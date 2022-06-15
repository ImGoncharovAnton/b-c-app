import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DataService} from '../shared/service/data.service';
import {Subject, takeUntil} from "rxjs";

export interface allUsersForAdmin {
  email: string;
  id: string;
  months: allUsersForAdminMonth[];
  role: string;
  username: string;
  income?: number;
  expense?: number;
  selectedMonth?: allUsersForAdminMonth[];
}

export interface allUsersForAdminMonth {
  monthId: number;
  monthNum: number;
  year: number;
  income: number;
  expense: number;
  monthName: string;
}

@Component({
  selector: 'app-test',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  username: string
  isOpenTab: boolean = false;

  displayedColumns: string[] = [
    'username',
    'email',
    'role',
    'income',
    'expense',
    'action',
  ];
  dataSource: MatTableDataSource<allUsersForAdmin>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dataService: DataService) {
  }


  ngOnInit() {
    this.dataService.createItemFromAdmin$
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        if (val) {
          this.gelAllData()
        } else {
          this.gelAllData()
        }
      })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  gelAllData() {
    this.dataService.getAllUsers().subscribe({
        next: (res: allUsersForAdmin[]) => {
          res.map((item: allUsersForAdmin) => {
            let monthIdIncome: number
            let monthIdExpense: number
            let incomeValue: number
            let expenseValue: number
            this.dataService.itemsChangesIncome$
              .pipe(takeUntil(this.destroy$))
              .subscribe(incomeArr => {
                incomeValue = incomeArr.map(incomeItem => {
                  monthIdIncome = incomeItem.monthId
                  return incomeItem.value
                }).reduce((a: number, b: number) => {
                  return a + b
                })
                if (item.months.length > 0) {
                  for (let month of item.months) {
                    if (monthIdIncome === month.monthId) {
                      month.income = incomeValue
                    }
                  }
                  this._getSumMonths(item)
                }
              })
            this.dataService.itemsChangesExpense$
              .pipe(takeUntil(this.destroy$))
              .subscribe(expenseArr => {
                expenseValue = expenseArr.map(expenseArr => {
                  monthIdExpense = expenseArr.monthId
                  return expenseArr.value
                }).reduce((a: number, b: number) => {
                  return a + b
                })
                if (item.months.length > 0) {
                  for (let month of item.months) {
                    if (monthIdExpense === month.monthId) {
                      month.expense = expenseValue
                    }
                  }
                  this._getSumMonths(item)
                }
              })
            if (item.months.length > 0) {
              this._getSumMonths(item)
            }
          })
          this.dataSource = new MatTableDataSource<allUsersForAdmin>(res)
          this.dataSource.paginator = this.paginator
          this.dataSource.sort = this.sort
        },
        error: (err) => {
          alert('error while fetching the records')
        }
      }
    )
  }

  _getSumMonths(item: allUsersForAdmin) {
    item.income = item.months.map((p: any) => {
      return p.income
    }).reduce((a: number, b: number) => {
      return a + b
    });
    item.expense = item.months.map((p: any) => {
      return p.expense
    }).reduce((a: number, b: number) => {
      return a + b
    });
    return item
  }

  /*getAllUsers() {
    this.dataService.fetchData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.dataService.userChanged$
            .pipe(takeUntil(this.destroy$))
            .subscribe(techData => {
              let dataMonths: MonthItem[] = []
              let income: number
              let expense: number

              res.map(data => {
                if (data.months) {
                  dataMonths = Object.values(data.months)
                  if (techData && data.key === techData.userKey) {
                    for (let key in data.months) {
                      if (key === techData.monthKey) {
                        console.log(data.months[key])
                        data.months[key].income = techData.income
                        data.months[key].expense = techData.expense
                      }
                    }
                  }
                  income = dataMonths.map((p: MonthItem) => {
                    return p.income
                  }).reduce((a, b) => {
                    return a + b;
                  })
                  expense = dataMonths.map((p: MonthItem) => {
                    return p.expense
                  }).reduce((a, b) => {
                    return a + b;
                  })
                  data.expense = expense
                  data.income = income
                }
              })
              this.dataSource = new MatTableDataSource<any>(res)
              this.dataSource.paginator = this.paginator
              this.dataSource.sort = this.sort
            })
        },
        error: (err) => {
          alert('error while fetching the records')
        }
      })
  }*/

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onOpenUser(row: allUsersForAdmin) {
    this.username = row.username
    this.isOpenTab = true
    this.dataService.userIdFromAdmin$.next(row.id)
  }
}
