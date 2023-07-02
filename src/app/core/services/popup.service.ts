import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PopUpState } from '../../shared/models/loader';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private popUpSubject = new Subject<PopUpState>();
  popUpState = this.popUpSubject.asObservable();
  constructor() { }
  open(success: boolean, message: any) {
    this.popUpSubject.next(<PopUpState>{ Open: true, Success: success, Message: message });
    document.body.style.overflow = 'hidden';
    if(success==true){
      setTimeout(() => this.close(), 1500);
    }
  }
  close() {
    this.popUpSubject.next(<PopUpState>{ Open: false });
    document.body.style.overflow = 'auto';
  }
}
