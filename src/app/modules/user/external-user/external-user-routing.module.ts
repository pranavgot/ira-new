import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ServiceRequestComponent } from './service-request/service-request.component';
import { ExploreSolutionsComponent } from './explore-solutions/explore-solutions.component';
import { AssignedSolutionsComponent } from './assigned-solutions/assigned-solutions.component';
import { ExtendedWorkspaceComponent } from './extended-workspace/extended-workspace.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { ViewServiceComponent } from './view-service/view-service.component';


const routes: Routes = [
  { path: '', redirectTo:"dashboard", pathMatch: 'full'  },
			{ path: 'dashboard', component: DashboardComponent},
      { path: 'notifications', component: NotificationsComponent},
      { path: 'service-request', component: ServiceRequestComponent},
      { path: 'explore-solutions', component: ExploreSolutionsComponent},
      { path: 'assigned-solutions', component: AssignedSolutionsComponent},
      { path: 'extended-workspace', component: ExtendedWorkspaceComponent},
      { path: 'add-service', component: AddServiceComponent},
      { path: 'view-service', component: ViewServiceComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalUserRoutingModule { }
