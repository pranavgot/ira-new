import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExtendedWorkspaceComponent } from './extended-workspace/extended-workspace.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ServiceRequestComponent } from './service-request/service-request.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ExploreSolutionComponent } from './explore-solution/explore-solution.component';
import { AddUserComponent } from './add-user/add-user.component';


const routes: Routes = [
  { path: '', redirectTo:"dashboard", pathMatch: 'full'  },
			{ path: 'dashboard', component: DashboardComponent},
      { path: 'extended-workspace', component: ExtendedWorkspaceComponent},
      { path: 'subscription', component: SubscriptionComponent},
      { path: 'notifications', component: NotificationsComponent},
      { path: 'service-request', component: ServiceRequestComponent},
      { path: 'user-management', component: UserManagementComponent},
      { path: 'explore-solution', component: ExploreSolutionComponent},
      { path: 'add-user', component: AddUserComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalClientRoutingModule { }
