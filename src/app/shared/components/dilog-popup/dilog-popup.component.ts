import { Component, HostListener, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PopupService } from 'src/app/core/services/popup.service';
import { PopUpState } from '../../models/loader';

@Component({
  selector: 'app-dilog-popup',
  templateUrl: './dilog-popup.component.html',
  styleUrls: ['./dilog-popup.component.scss']
})
export class DilogPopupComponent implements OnInit {

  height = window.innerHeight;
  Open = false;
  message: any;
  success: boolean = false
  private subscription: Subscription;

  constructor(private popup: PopupService) {
    this.subscription = this.popup.popUpState
      .subscribe((state: PopUpState) => {
        this.Open = state.Open;
        this.success = state.Success;
        this.message = state.Message;
      });
  }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {

    this.height = event.target.innerHeight;
  }
  closepopup() {
    this.popup.close();
  }

}
