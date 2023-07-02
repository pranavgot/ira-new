import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSolutionComponent } from './new-solution.component';

describe('NewSolutionComponent', () => {
  let component: NewSolutionComponent;
  let fixture: ComponentFixture<NewSolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSolutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
