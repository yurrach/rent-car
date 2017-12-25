import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from './shared/components/auth/auth.component';



@NgModule({
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule
  ],
  declarations: [
    LayoutComponent,
    HomePageComponent,
    HeaderComponent,
    AuthComponent
  ],
  providers: [
  ]
})
export class LayoutModule { }
