import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '../app/shared/components/layout/default/default.component';
import { MsalGuard } from '@azure/msal-angular';
import { PowerbiReportComponent } from './shared/components/powerbi-report/powerbi-report.component';

const routes: Routes = [
  { path: '', redirectTo: "auth", pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  {
    path: '', component: DefaultComponent, 
    canActivate: [MsalGuard],
    children: [
      { path: 'user', loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule) },
    ]
  },
  {
    path: 'powerbireport', component: PowerbiReportComponent,
    canActivate: [MsalGuard],
  }
];

const isIframe = window !== window.parent && !window.opener;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
