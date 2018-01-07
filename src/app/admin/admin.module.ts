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
import { MainCarFormComponent } from './add-edit-car/main-car-form/main-car-form.component';
import { ApiCarFormComponent } from './add-edit-car/api-car-form/api-car-form.component';
import { CustomCarFormComponent } from './add-edit-car/custom-car-form/custom-car-form.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    AdminSharedModule
  ],
  declarations: [AdminComponent, HeaderComponent, SidebarComponent, CarsComponent, AddEditCarComponent, MainCarFormComponent, ApiCarFormComponent, CustomCarFormComponent]
})
export class AdminModule { }
