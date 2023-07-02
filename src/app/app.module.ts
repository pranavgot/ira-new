import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './shared/material.module';
import { SharedModule } from './shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PowerBIEmbedModule } from 'powerbi-client-angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { AuthGuard } from './core/guards/auth.guard';
import { ToastComponent } from './modules/user/all-common/toast/toast.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { LoaderService } from './core/services/loader.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
  BrowserCacheLocation,
  LogLevel,
} from '@azure/msal-browser';
import {
  MsalGuard,
  MsalInterceptor,
  MsalBroadcastService,
  MsalInterceptorConfiguration,
  MsalModule,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalGuardConfiguration,
  MsalRedirectComponent,
} from '@azure/msal-angular';
import { environment } from 'src/environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { DilogPopupComponent } from './shared/components/dilog-popup/dilog-popup.component';
import { PowerbiReportComponent } from './shared/components/powerbi-report/powerbi-report.component';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
const uri=`${environment.redirect_URL}/user`
@NgModule({
  declarations: [AppComponent, LoaderComponent, DilogPopupComponent, PowerbiReportComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    AppRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MaterialModule,
    MatMenuModule,
    MatIconModule,
    MsalModule.forRoot( new PublicClientApplication({
      auth: {
        clientId: '84ef5c2d-0f08-4914-8e5e-7b1047a5dc68',
        authority: 'https://login.microsoftonline.com/32bc7af4-cc70-4aaa-b2bb-01cedf479aae',
        redirectUri: uri,
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE,
      }
    }), {
      interactionType: InteractionType.Redirect,
      authRequest: {
        scopes: ['user.read']
        }
    }, {
      interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
      protectedResourceMap: new Map([ 
          ['https://graph.microsoft-ppe.com/v1.0/me', ['user.read']],
          [`${environment.devUrl}/ria/userManagement/login`, [
            'api://84ef5c2d-0f08-4914-8e5e-7b1047a5dc68/auth',
          ]]
      ])
    }),
    HttpClientModule,
    PowerBIEmbedModule,
    NgApexchartsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
    }),
  ],
  exports: [],
  providers: [
    ToastComponent,
    AuthGuard,
    DatePipe,
    LoaderService,
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
  bootstrap: [AppComponent,MsalRedirectComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class AppModule {}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read'],
    },
    loginFailedRoute: '/login',
  };
}
