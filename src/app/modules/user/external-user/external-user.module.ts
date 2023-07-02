import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ExternalUserRoutingModule } from './external-user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ServiceRequestComponent } from './service-request/service-request.component';
import { ExploreSolutionsComponent } from './explore-solutions/explore-solutions.component';
import { AssignedSolutionsComponent } from './assigned-solutions/assigned-solutions.component';
import { ExtendedWorkspaceComponent } from './extended-workspace/extended-workspace.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import{ NgApexchartsModule} from 'ng-apexcharts';
import { ViewServiceComponent } from './view-service/view-service.component';


@NgModule({
  declarations: [
    DashboardComponent,
    NotificationsComponent,
    ServiceRequestComponent,
    ExploreSolutionsComponent,
    AssignedSolutionsComponent,
    ExtendedWorkspaceComponent,
    AddServiceComponent,
    ViewServiceComponent
  ],
  imports: [
    CommonModule,
    ExternalUserRoutingModule,
    MatCardModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    MaterialModule, NgApexchartsModule
    
    
  ]
})
export class ExternalUserModule { }
