import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DilogPopupComponent } from './dilog-popup.component';

describe('DilogPopupComponent', () => {
  let component: DilogPopupComponent;
  let fixture: ComponentFixture<DilogPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DilogPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DilogPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
