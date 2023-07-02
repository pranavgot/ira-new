import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeadComponent } from './lead/lead.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewLeadsComponent } from './view-leads/view-leads.component';
import { ServiceRequestComponent } from './service-request/service-request.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { ViewSubscriptionComponent } from './view-subscription/view-subscription.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ViewUserManagementComponent } from './view-user-management/view-user-management.component';
import { AddUserComponent } from './add-user/add-user.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AddInternalUserComponent } from './add-internal-user/add-internal-user.component';
import { InternalUserManagementComponent } from './internal-user-management/internal-user-management.component';


const routes: Routes = [
  {
		path:"",
		children: [
			{ path: '', redirectTo:"dashboard", pathMatch: 'full'  },
			{ path: 'dashboard', component: DashboardComponent},
      { path: 'lead', component: LeadComponent},
      { path: 'view-leads', component: ViewLeadsComponent},
      { path: 'service-request', component: ServiceRequestComponent},
      { path: 'subscription', component:  SubscriptionComponent},
      { path: 'view-subscription', component: ViewSubscriptionComponent},
      { path: 'user-management', component: UserManagementComponent},
      { path: 'view-user-management', component:  ViewUserManagementComponent},
      { path: 'add-user', component: AddUserComponent},
      { path: 'notifications', component: NotificationsComponent},
      { path: 'add-internal-user',component: AddInternalUserComponent},
      { path: 'internal-user-management', component: InternalUserManagementComponent}
		  ] 
	}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Admin2RoutingModule { }
