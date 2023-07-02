import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDownloadComponent } from './view-download.component';

describe('ViewDownloadComponent', () => {
  let component: ViewDownloadComponent;
  let fixture: ComponentFixture<ViewDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
