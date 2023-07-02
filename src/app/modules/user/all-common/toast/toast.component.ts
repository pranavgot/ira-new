import { Component, OnInit } from '@angular/core';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  constructor(private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.toastrService.clear();
  }

  success(data:any) {
    this.toastrService.success('' + data.message, '' + data.title);
  }
  error(data:any) {
    this.toastrService.error('' + data.message, '' + data.title);
  }
  warning(data:any) {
    this.toastrService.warning('' + data.message, '' + data.title);
  }
  info(data:any) {
    this.toastrService.info('' + data.message, '' + data.title);
  }



}
