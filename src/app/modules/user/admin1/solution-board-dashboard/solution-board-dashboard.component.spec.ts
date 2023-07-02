import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionBoardDashboardComponent } from './solution-board-dashboard.component';

describe('SolutionBoardDashboardComponent', () => {
  let component: SolutionBoardDashboardComponent;
  let fixture: ComponentFixture<SolutionBoardDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolutionBoardDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionBoardDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
