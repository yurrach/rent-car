import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { CarsComponent } from './cars/cars.component';
import { AddEditCarComponent } from './add-edit-car/add-edit-car.component';


const routes: Routes = [
  {
    path: '', component: AdminComponent, children: [
      { path: '', redirectTo: 'cars', pathMatch: 'full' },
      { path: 'add-car', component: AddEditCarComponent },
      { path: 'cars', component: CarsComponent },
      { path: 'cars/:id', component: AddEditCarComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
