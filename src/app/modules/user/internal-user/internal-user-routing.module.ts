import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccessComponent } from './access/access.component';
import { ServiceRequestComponent } from './service-request/service-request.component';
import { ServiceRequest2Component } from './service-request2/service-request2.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { ViewServiceComponent } from './view-service/view-service.component';


const routes: Routes = [
  { path: '', redirectTo:"dashboard", pathMatch: 'full'  },
			{ path: 'dashboard', component: DashboardComponent},
      { path: 'access', component: AccessComponent},
      { path: 'service-request', component: ServiceRequestComponent},
      { path: 'service-request2', component: ServiceRequest2Component},
      { path: 'notifications', component: NotificationsComponent},
      { path: 'add-service', component: AddServiceComponent},
      { path: 'view-service', component: ViewServiceComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternalUserRoutingModule { }
