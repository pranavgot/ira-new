import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionBoardComponent } from './solution-board.component';

describe('SolutionBoardComponent', () => {
  let component: SolutionBoardComponent;
  let fixture: ComponentFixture<SolutionBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolutionBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
