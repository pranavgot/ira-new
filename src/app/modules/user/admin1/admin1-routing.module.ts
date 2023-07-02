import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ApprovalsComponent } from './approvals/approvals.component';
import { MasterComponent } from './master/master.component';
import { ExploreSolutionComponent } from './explore-solution/explore-solution.component';
import { AddProcessComponent } from './add-process/add-process.component';
import { ProjectComponent } from './project/project.component';
import { SolutionBoardComponent } from './solution-board/solution-board.component';
import { SolutionBoardDashboardComponent } from './solution-board-dashboard/solution-board-dashboard.component';
import { CreateProjectComponent } from './create-project/create-project.component';

import { CreateNewSolutionComponent } from './create-new-solution/create-new-solution.component';
import { CreateNewSolution2Component } from './create-new-solution2/create-new-solution2.component';
import { CreateNewSolution4Component } from './create-new-solution4/create-new-solution4.component';

import { ClientInfoComponent } from './client-info/client-info.component';
import { ClientInfo2Component } from './client-info2/client-info2.component';
import { ViewDownloadComponent } from './view-download/view-download.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ExecuteProcessComponent } from './execute-process/execute-process.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { CustomDataComponent } from './custom-data/custom-data.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { AddAnnouncementsComponent } from './add-announcements/add-announcements.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { NewSolutionComponent } from './new-solution/new-solution.component';
import { ViewApprovalComponent } from './view-approval/view-approval.component';
import { SolutionBoardDataModellingComponent } from './solution-board-data-modelling/solution-board-data-modelling.component';
import { ViewDownload1Component } from './view-download1/view-download1.component';
import { SolutionBoardOverallComponent } from './solution-board-overall/solution-board-overall.component';
import { MyProjectComponent } from './my-project/my-project.component';
import { NewProjectComponent } from './new-project/new-project.component';



// import { NewDemoComponent } from './new-demo/new-demo.component';




const routes: Routes = [
	{
		path: "",
		children: [
			{ path: '', redirectTo: "dashboard", pathMatch: 'full' },
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'user-management', component: UserManagementComponent },
			{ path: 'add-user', component: AddUserComponent },
			{ path: 'approvals', component: ApprovalsComponent },
			{ path: 'master', component: MasterComponent },
			{ path: 'project', component: ProjectComponent },
			{ path: 'create-project', component: CreateProjectComponent },
			{ path: 'view-download', component: ViewDownloadComponent },
			{ path: 'execute-process', component: ExecuteProcessComponent },
			{ path: 'custom-data', component: CustomDataComponent },
			{ path: 'project-overview', component: ProjectOverviewComponent },
			{ path: 'explore-solution', component: ExploreSolutionComponent },
			{ path: 'solution-board', component: SolutionBoardComponent },
			// { path: 'add-process', component: AddProcessComponent },
			{ path: 'solutionboard/:id', component: AddProcessComponent },
			{ path: 'solution-board-dashboard', component: SolutionBoardDashboardComponent },
			{ path: 'create-new-solution', component: CreateNewSolutionComponent },
			{ path: 'solution_data_modeling', component: CreateNewSolution2Component },
			{ path: 'solutiondatamodeling', component: CreateNewSolution4Component },
			{ path: 'solutionboard_data_modeling', component: SolutionBoardDataModellingComponent},
			// { path: 'solutionboard/:id', component: SolutionBoardOverallComponent},
			
			// { path: 'solution-board-dashboard', component: SolutionBoardDashboardComponent },
			{ path: 'client-info', component: ClientInfoComponent },
			{ path: 'client-info2', component: ClientInfo2Component },
			{ path: 'schedule', component: ScheduleComponent },
			{ path: 'announcements', component: AnnouncementsComponent },
			{ path: 'add-announcements', component: AddAnnouncementsComponent },
			{ path: 'notifications', component: NotificationsComponent },
			{ path: 'powerbi-interface', component: NewSolutionComponent },
			{ path: 'powerbi-approval', component: ViewApprovalComponent },
			{ path: 'view-download1', component: ViewDownload1Component },
			{ path: 'solution-board-overall', component: SolutionBoardOverallComponent },
			{ path: 'my-project', component: MyProjectComponent },
			{ path: 'new-project', component: NewProjectComponent },
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class Admin1RoutingModule { }
