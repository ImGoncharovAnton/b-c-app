import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Observer, Subject, takeUntil} from "rxjs";
import { DataService } from 'src/app/shared/service/data.service';

// Example tabs
export interface ExampleTab {
  label: string;
  content: string;
}

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  asyncTabs: Observable<ExampleTab[]>;
  userKey: string | null
  @Input() username: string

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.userKey$
      .pipe(takeUntil(this.destroy$))
      .subscribe(key => {
        this.userKey = key
        console.log(this.userKey)
      })

    this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
      setTimeout(() => {
        observer.next([
          {label: 'First', content: 'Content 1'},
          {label: 'Second', content: 'Content 2'},
          {label: 'Third', content: 'Content 3'},
        ]);
      }, 1000);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
