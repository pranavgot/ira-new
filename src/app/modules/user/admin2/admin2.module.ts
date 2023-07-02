import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Admin2RoutingModule } from './admin2-routing.module';
import { LeadComponent } from './lead/lead.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';

import { MatCardModule } from '@angular/material/card';
import { ViewLeadsComponent } from './view-leads/view-leads.component';
import { ServiceRequestComponent } from './service-request/service-request.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { SubscriptionComponent } from './subscription/subscription.component';
import { ViewSubscriptionComponent } from './view-subscription/view-subscription.component';
import { ViewUserManagementComponent } from './view-user-management/view-user-management.component';
import { AddUserComponent } from './add-user/add-user.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { NotificationsComponent } from './notifications/notifications.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import {MatPaginatorModule} from '@angular/material/paginator';

import{NgApexchartsModule} from 'ng-apexcharts';
import { InternalUserManagementComponent } from './internal-user-management/internal-user-management.component';
import { AddInternalUserComponent } from './add-internal-user/add-internal-user.component';

@NgModule({
  declarations: [
    LeadComponent,
    DashboardComponent,
    UserManagementComponent,
    ViewLeadsComponent,
    ServiceRequestComponent,
    SubscriptionComponent,
    ViewSubscriptionComponent,
    ViewUserManagementComponent,
    AddUserComponent,
    NotificationsComponent,
    InternalUserManagementComponent,
    AddInternalUserComponent,

  ],
  imports: [
    CommonModule,
    Admin2RoutingModule,
    MatCardModule,
    MaterialModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,NgApexchartsModule
    
  ]
})
export class Admin2Module { }
