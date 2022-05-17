import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DataService} from '../shared/service/data.service';
import {Subject, takeUntil} from "rxjs";
import {MonthItem} from "../shared/model/month-item.model";

export interface UserInfo {
  username: string
  email: string
  key: string
  role: string
  months?: any
  income?: number
  expense?: number
  beautyMonths?: any
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
  dataSource: MatTableDataSource<UserInfo>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dataService: DataService) {
  }


  ngOnInit() {
    this.getAllUsers()

  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  getAllUsers() {
    this.dataService.fetchData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          let dataMonths: MonthItem[] = []
          let income: number
          let expense: number

          res.map(data => {
            if (data.months) {
              dataMonths = Object.values(data.months)
              data.months = dataMonths
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
        },
        error: (err) => {
          alert('error while fetching the records')
        }
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onOpenUser(row: UserInfo) {
    console.log('ROW | ON_OPEN_USER', row)
    this.username = row.username
    this.isOpenTab = true
    this.dataService.userKey$.next(row.key)
  }
}
