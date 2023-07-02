import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewSolutionComponent } from './create-new-solution.component';

describe('CreateNewSolutionComponent', () => {
  let component: CreateNewSolutionComponent;
  let fixture: ComponentFixture<CreateNewSolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewSolutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewSolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
