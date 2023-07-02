import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllCommonRoutingModule } from './all-common-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ToastComponent } from './toast/toast.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ToastComponent
  ],
  imports: [
    CommonModule,
    AllCommonRoutingModule
  ]
})
export class AllCommonModule { }
