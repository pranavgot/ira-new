import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
// import { SignInComponent } from './sign-in/sign-in.component';
// import { SignUpComponent } from './sign-up/sign-up.component';
import { ExploreComponent } from './explore/explore.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';


const routes: Routes = [
  {
		path:"",
		children: [
			{ path: '', redirectTo:"landing", pathMatch: 'full'  },
			{ path: 'landing', component: LandingComponent},
			{ path: 'sign-in', component: SignInComponent},
			{ path: 'sign-up', component: SignUpComponent},
			{ path: 'explore', component: ExploreComponent},
			{ path: 'contact-us', component: ContactUsComponent},
		  ] 
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
