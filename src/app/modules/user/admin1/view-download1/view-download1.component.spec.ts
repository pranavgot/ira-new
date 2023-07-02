import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDownload1Component } from './view-download1.component';

describe('ViewDownload1Component', () => {
  let component: ViewDownload1Component;
  let fixture: ComponentFixture<ViewDownload1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDownload1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDownload1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
