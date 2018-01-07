import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCarService } from './services/admin-car.service';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { CarFormDataService } from './services/car-form-data.service';


@NgModule({
  imports: [
    CommonModule,
    HttpClientJsonpModule,
    HttpClientModule
  ],
  declarations: [],
  providers: [
    AdminCarService,
    CarFormDataService
  ]
})
export class AdminSharedModule { }
