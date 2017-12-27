import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from './shared/components/auth/auth.component';
import { CarsPageComponent } from './cars-page/cars-page.component';
import { CarsFilterComponent } from './cars-page/cars-filter/cars-filter.component';
import { CarsListComponent } from './cars-page/cars-list/cars-list.component';
import { CarItemComponent } from './cars-page/car-item/car-item.component';
import { CarItemDetailsComponent } from './cars-page/car-item-details/car-item-details.component';
import { CarStarRatingComponent } from './cars-page/car-star-rating/car-star-rating.component';




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
    AuthComponent,
    CarsPageComponent,
    CarsFilterComponent,
    CarsListComponent,
    CarItemComponent,
    CarItemDetailsComponent,
    CarStarRatingComponent
  ],
  providers: [
  ]
})
export class LayoutModule { }
