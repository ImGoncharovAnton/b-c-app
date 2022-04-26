import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MyCalcEditComponent} from './my-calc-edit.component';

describe('MyCalcEditComponent', () => {
  let component: MyCalcEditComponent;
  let fixture: ComponentFixture<MyCalcEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyCalcEditComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCalcEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
