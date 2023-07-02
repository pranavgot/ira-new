import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreSolutionsComponent } from './explore-solutions.component';

describe('ExploreSolutionsComponent', () => {
  let component: ExploreSolutionsComponent;
  let fixture: ComponentFixture<ExploreSolutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExploreSolutionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreSolutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
