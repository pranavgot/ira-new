import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Admin1RoutingModule } from './admin1-routing.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { MatCardModule } from '@angular/material/card';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ApprovalsComponent } from './approvals/approvals.component';
import { MasterComponent } from './master/master.component';
import { MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule} from '@angular/material/icon';
import { MatListModule} from '@angular/material/list';
import { ExploreSolutionComponent } from './explore-solution/explore-solution.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectComponent } from './project/project.component';
import { SolutionBoardComponent } from './solution-board/solution-board.component';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { AddProcessComponent } from './add-process/add-process.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { SolutionBoardDashboardComponent } from './solution-board-dashboard/solution-board-dashboard.component';

import { CreateNewSolutionComponent } from './create-new-solution/create-new-solution.component';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';


import { ClientInfoComponent } from './client-info/client-info.component';
import { ClientInfo2Component } from './client-info2/client-info2.component';
import { ViewDownloadComponent } from './view-download/view-download.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ExecuteProcessComponent } from './execute-process/execute-process.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CustomDataComponent } from './custom-data/custom-data.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { AddAnnouncementsComponent } from './add-announcements/add-announcements.component';
import { CreateNewSolution2Component } from './create-new-solution2/create-new-solution2.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { NewSolutionComponent } from './new-solution/new-solution.component';
// import { NewDemoComponent } from './new-demo/new-demo.component';
//import {MatInputModule} from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { PowerBIEmbedModule } from 'powerbi-client-angular';
import { ToastrModule } from 'ngx-toastr';
import { DialogComponent } from './dialog/dialog.component';
import {NgApexchartsModule} from 'ng-apexcharts';
import { ViewApprovalComponent } from './view-approval/view-approval.component';
import { SolutionBoardDataModellingComponent } from './solution-board-data-modelling/solution-board-data-modelling.component';
import { CreateNewSolution4Component } from './create-new-solution4/create-new-solution4.component';
import { ViewDownload1Component } from './view-download1/view-download1.component';
import { SolutionBoardOverallComponent } from './solution-board-overall/solution-board-overall.component';
import { SearchPipe} from '../search.pipe';
import { MyProjectComponent } from './my-project/my-project.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { FileDragAndDropDirective } from './add-process/file-drag-and-drop.directive';


@NgModule({
  declarations: [
    UserManagementComponent,
    DashboardComponent,
    AddUserComponent,
    ApprovalsComponent,
    MasterComponent,
    ExploreSolutionComponent,
    SolutionBoardComponent,
    AddProcessComponent,
    ProjectComponent,
    CreateProjectComponent,
    SolutionBoardDashboardComponent,
    CreateNewSolutionComponent,
    ClientInfoComponent,
    ClientInfo2Component,
    ViewDownloadComponent,
    ScheduleComponent,
    ExecuteProcessComponent,
    ProjectOverviewComponent,
    CustomDataComponent,
    AnnouncementsComponent,
    AddAnnouncementsComponent,
    CreateNewSolution2Component,
    NotificationsComponent,
    NewSolutionComponent,
    DialogComponent,
    ViewApprovalComponent,
    SolutionBoardDataModellingComponent,
    CreateNewSolution4Component,
    ViewDownload1Component,
    SolutionBoardOverallComponent,
    MyProjectComponent,
    NewProjectComponent,
    SearchPipe,
    FileDragAndDropDirective,

  ],
  imports: [
    CommonModule,
    Admin1RoutingModule,
    MatCardModule, FormsModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatListModule,
    SharedModule,
    ReactiveFormsModule,
    MaterialModule, 
    MatProgressBarModule,
    MatSelectModule,
    DragDropModule,
    HttpClientModule,
    MatChipsModule,
    PowerBIEmbedModule,
    NgApexchartsModule
    
  ]
})
export class Admin1Module { }
