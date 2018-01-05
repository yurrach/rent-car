import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCarService } from './services/admin-car.service';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';


@NgModule({
  imports: [
    CommonModule,
    HttpClientJsonpModule,
    HttpClientModule
  ],
  declarations: [],
  providers: [
    AdminCarService
  ]
})
export class AdminSharedModule { }
