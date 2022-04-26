import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OverviewCreateComponent} from './overview-create.component';

describe('OverviewCreateComponent', () => {
  let component: OverviewCreateComponent;
  let fixture: ComponentFixture<OverviewCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OverviewCreateComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
