import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionBoardDataModellingComponent } from './solution-board-data-modelling.component';

describe('SolutionBoardDataModellingComponent', () => {
  let component: SolutionBoardDataModellingComponent;
  let fixture: ComponentFixture<SolutionBoardDataModellingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolutionBoardDataModellingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionBoardDataModellingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
