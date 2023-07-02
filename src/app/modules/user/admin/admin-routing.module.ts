import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAnnouncementsComponent } from '../admin1/add-announcements/add-announcements.component';
import { AnnouncementsComponent } from '../admin1/announcements/announcements.component';
import { ApprovalsComponent } from '../admin1/approvals/approvals.component';
import { ClientInfoComponent } from '../admin1/client-info/client-info.component';
import { DashboardComponent } from '../admin1/dashboard/dashboard.component';
import { ExploreSolutionComponent } from '../admin1/explore-solution/explore-solution.component';
import { MasterComponent } from '../admin1/master/master.component';
import { NotificationsComponent } from '../admin1/notifications/notifications.component';
import { ProjectOverviewComponent } from '../admin1/project-overview/project-overview.component';
import { ProjectComponent } from '../admin1/project/project.component';
import { SolutionBoardDashboardComponent } from '../admin1/solution-board-dashboard/solution-board-dashboard.component';
// import { UserManagementComponent } from '../admin1/user-management/user-management.component';
import { LeadComponent } from '../admin2/lead/lead.component';
import { SubscriptionComponent } from '../admin2/subscription/subscription.component';
import { UserManagementComponent } from '../admin2/user-management/user-management.component';

const routes: Routes = [
	{
		path: "",
		children: [
			{ path: '', redirectTo: "dashboard", pathMatch: 'full' },
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'user-management', component: UserManagementComponent },
			// { path: 'add-user', component: AddUserComponent },
			{ path: 'lead', component: LeadComponent },
			{ path: 'subscription', component: SubscriptionComponent },

			{ path: 'approvals', component: ApprovalsComponent },
			{ path: 'master', component: MasterComponent },
			{ path: 'project', component: ProjectComponent },
			// { path: 'create-project', component: CreateProjectComponent },
			// { path: 'view-download', component: ViewDownloadComponent },
			// { path: 'execute-process', component: ExecuteProcessComponent },
			// { path: 'custom-data', component: CustomDataComponent },
			{ path: 'project-overview', component: ProjectOverviewComponent },
			{ path: 'explore-solution', component: ExploreSolutionComponent },
			// { path: 'solution-board', component: SolutionBoardComponent },
			// { path: 'add-process', component: AddProcessComponent },
			{ path: 'solution-board-dashboard', component: SolutionBoardDashboardComponent },
			// { path: 'create-new-solution', component: CreateNewSolutionComponent },
			// { path: 'solution_data_modeling', component: CreateNewSolution2Component },
			// { path: 'solution-board-dashboard', component: SolutionBoardDashboardComponent },
			{ path: 'client-info', component: ClientInfoComponent },
			// { path: 'client-info2', component: ClientInfo2Component },
			// { path: 'schedule', component: ScheduleComponent },
			{ path: 'announcements', component: AnnouncementsComponent },
			{ path: 'add-announcements', component: AddAnnouncementsComponent },
			{ path: 'notifications', component: NotificationsComponent },
			// { path: 'powerbi-interface', component: NewSolutionComponent },


		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdminRoutingModule { }
