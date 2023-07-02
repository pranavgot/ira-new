import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionBoardOverallComponent } from './solution-board-overall.component';

describe('SolutionBoardOverallComponent', () => {
  let component: SolutionBoardOverallComponent;
  let fixture: ComponentFixture<SolutionBoardOverallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolutionBoardOverallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionBoardOverallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
