import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InternalUserRoutingModule } from './internal-user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccessComponent } from './access/access.component';

import { MatCardModule } from '@angular/material/card';
import { ServiceRequestComponent } from './service-request/service-request.component';
import { ServiceRequest2Component } from './service-request2/service-request2.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { MatRadioModule } from '@angular/material/radio';
import { MaterialModule } from 'src/app/shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import{NgApexchartsModule} from 'ng-apexcharts';
import { ViewServiceComponent } from './view-service/view-service.component';
@NgModule({
  declarations: [
    DashboardComponent,
    AccessComponent,
    ServiceRequestComponent,
    ServiceRequest2Component,
    NotificationsComponent,
    AddServiceComponent,
    ViewServiceComponent
  ],
  imports: [
    CommonModule,
    InternalUserRoutingModule,
    MatCardModule,MaterialModule,SharedModule,
    ReactiveFormsModule,
    MatRadioModule,NgApexchartsModule
  ]
})
export class InternalUserModule { }
