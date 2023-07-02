import { Subscription } from 'rxjs';
import { LoaderService } from '../../../core/services/loader.service';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { LoaderState } from '../../../shared/models/loader';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {

  height = window.innerHeight;
  loading = false;
  private subscription: Subscription;
  constructor(private loaderService: LoaderService) {
    this.subscription = this.loaderService.loaderState
    .subscribe((state: LoaderState) => {
      this.loading = state.loading;
    });
   }

  ngOnInit() {
   
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
   
    this.height = event.target.innerHeight;
  }

}
