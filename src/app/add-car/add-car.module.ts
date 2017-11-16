import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

import { JsonpModule } from '@angular/http';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { AddCarRoutingModule } from './add-car-routing.module';
import { AddCarComponent } from './add-car.component';



@NgModule({
  imports: [
    CommonModule,
    AddCarRoutingModule,
    MatSelectModule,
    MatCardModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ReactiveFormsModule
  ],
  declarations: [AddCarComponent],
  exports: [
    MatSelectModule
  ]
})
export class AddCarModule { }
