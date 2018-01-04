import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LayoutComponent } from './layout.component';
import { CarsPageComponent } from './cars-page/cars-page.component';
import { CarItemDetailsComponent } from './cars-page/car-item-details/car-item-details.component';

const routes: Routes = [

  {
    path: '', component: LayoutComponent, children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomePageComponent, pathMatch: 'full' },
      { path: 'cars', component: CarsPageComponent},
      { path: 'cars/:id', component: CarItemDetailsComponent },
/*    { path: 'info', component: InfoPageComponent },
      { path: 'contacts', component: ContactsPageComponent } */
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
