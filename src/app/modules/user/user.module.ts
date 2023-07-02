import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { MaterialModule } from 'src/app/shared/material.module';
// import { UserComponent } from './user/user.component';


@NgModule({
  declarations: [
    // UserComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: "toast-top-right",
      preventDuplicates: true,
      closeButton: true
    }),
  ]
})
export class UserModule { }
