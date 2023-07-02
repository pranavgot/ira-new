import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreSolutionComponent } from './explore-solution.component';

describe('ExploreSolutionComponent', () => {
  let component: ExploreSolutionComponent;
  let fixture: ComponentFixture<ExploreSolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExploreSolutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreSolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
