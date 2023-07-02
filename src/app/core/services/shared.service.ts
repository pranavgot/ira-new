import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private subject = new Subject<any>();
  private route = new Subject<any>();
  private colapse = new Subject<any>();
  private leftHov = new Subject<any>();
  constructor() { }

  sendClick(data: any) {
    // console.log(data);
    this.subject.next(data);
  }
  getClick(): Observable<any> {
    return this.subject.asObservable();
  }
  sendColap(data: any) {
    // console.log(data);
    this.colapse.next(data);
  }
  getColap(): Observable<boolean> {
    return this.colapse.asObservable();
  }
  sendLeftHov(data: any) {
    // console.log(data);
    this.leftHov.next(data);
  }
  getLeftHov(): Observable<boolean> {
    return this.leftHov.asObservable();
  }
  sendroute(data:any) {
    this.route.next(data);
  }
  getroute(): Observable<boolean> {
    return this.route.asObservable();
  }
}
