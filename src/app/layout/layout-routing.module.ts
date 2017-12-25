import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LayoutComponent } from './layout.component';

const routes: Routes = [

  {
    path: '', component: LayoutComponent, children: [
      { path: '', component: HomePageComponent },
/*       { path: 'cars', component: CarsPageComponent },
      { path: 'info', component: InfoPageComponent },
      { path: 'contacts', component: ContactsPageComponent } */
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
