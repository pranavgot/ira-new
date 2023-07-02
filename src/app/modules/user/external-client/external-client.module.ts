import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ExternalClientRoutingModule } from './external-client-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExtendedWorkspaceComponent } from './extended-workspace/extended-workspace.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ServiceRequestComponent } from './service-request/service-request.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ExploreSolutionComponent } from './explore-solution/explore-solution.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AddUserComponent } from './add-user/add-user.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ExtendedWorkspaceComponent,
    SubscriptionComponent,
    NotificationsComponent,
    ServiceRequestComponent,
    UserManagementComponent,
    ExploreSolutionComponent,
    AddUserComponent
  ],
  imports: [
    CommonModule,
    ExternalClientRoutingModule,
    MatCardModule,
    MatSlideToggleModule
  ]
})
export class ExternalClientModule { }
