import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { DefaultComponent } from './components/layout/default/default.component';
import { LeftmenuComponent } from './components/layout/leftmenu/leftmenu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { LoaderComponent } from './components/loader/loader.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    DefaultComponent,
    LeftmenuComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
  ]
})
export class SharedModule { }
