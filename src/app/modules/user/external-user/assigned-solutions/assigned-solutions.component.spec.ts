import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedSolutionsComponent } from './assigned-solutions.component';

describe('AssignedSolutionsComponent', () => {
  let component: AssignedSolutionsComponent;
  let fixture: ComponentFixture<AssignedSolutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedSolutionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedSolutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
