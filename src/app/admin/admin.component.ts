import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DataService} from '../shared/service/data.service';
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-test',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  usersArr: any = []
  /**
   * Tab group where the tab content is loaded lazily (when activated)
   */
  tabLoadTimes: Date[] = [];

  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
  }

  /* Table started*/

  displayedColumns: string[] = [
    'name',
    'email',
    'role',
    'income',
    'expense',
    'action',
  ];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dataService: DataService) {

  }

  ngOnInit() {
    this.getAllUsers()
    let arr = [{name: "name1", phoneNumbers: [5551111, 5552222]}, {name: "name2", phoneNumbers: [5553333]}];
    let arr1 = arr.map(p => {
      return p.phoneNumbers;
    })
      .reduce((a, b) => {
        return a.concat(b);
      }, [])
    console.log(arr1)

  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  getAllUsers() {
    this.dataService.fetchData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log(res)
          let dataArr: never[] = []
          let dataMonths = []
          let newData = []
          let tech: any[] = []

          res.map(data => {
            // data['income'] = 25;

            console.log('DATA', data)
            // dataArr = Object.values(data)
            // console.log('dataarr', dataArr)
            // console.log('DATA MONTHS', data.months)


            if (data.months) {
              dataMonths = Object.values(data.months)
              console.log('dataMonths', dataMonths)

              // let tech = dataMonths.map((item: any) => {
              //   console.log(item.income)
              // })
              console.log('tech', tech)
              newData = {...data, ...dataMonths}
              console.log('NEWDATA', newData)
              // for (let key in data.months) {
              //   console.log('DATA.MONTHS[KEY]', data.months[key])
              //   if (data.months.hasOwnProperty(key)) {
              //     // складывает все месяцы в один массив...
              //     tech.push({...data.months[key], key})
              //   }
              //   // techItem = data.months[month]
              //   // console.log(techItem)
              // }
              // console.log(tech)
            }
            // arr.flatMap(a => a.phoneNumbers);

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
}


// const data = [
//   {
//     id: 1,
//     name: 'Dummy Data1',
//     details: [{id: 1, name: 'Dummy Data1 Details'}, {id: 1, name: 'Dummy Data1 Details2'}]
//   },
//   {
//     id: 2,
//     name: 'Dummy Data2',
//     details: [{id: 2, name: 'Dummy Data2 Details'}, {id: 1, name: 'Dummy Data2 Details2'}]
//   },
//   {
//     id: 3,
//     name: 'Dummy Data3',
//     details: [{id: 3, name: 'Dummy Data3 Details'}, {id: 1, name: 'Dummy Data3 Details2'}]
//   },
// ]
//
// const result = data.flatMap(a => a.details); // or data.map(a => a.details).flat(1);
// console.log(result)
