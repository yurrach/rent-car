import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { CarsComponent } from './cars/cars.component';
import { AddEditCarComponent } from './add-edit-car/add-edit-car.component';
import { SharedModule } from '../shared/shared.module';
import { AdminSharedModule } from './shared/admin-shared.module';
import { PreviewImagesComponent } from './add-edit-car/preview-images/preview-images.component';

@NgModule({
  imports: [CommonModule, AdminRoutingModule, SharedModule, AdminSharedModule],
  declarations: [
    AdminComponent,
    HeaderComponent,
    SidebarComponent,
    CarsComponent,
    AddEditCarComponent,
    PreviewImagesComponent,
  ],
})
export class AdminModule {}
