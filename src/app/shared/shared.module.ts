import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';



import { DropdownDirective } from './directives/crayf-dropdown.directive';
import { FirebaseApiService } from './core/firebase-api.service';
import { AuthService } from './core/auth.service';
import { CarsService } from './services/cars.service';
import { CarStarRatingService } from './services/car-star-rating.service';
import { UploadService } from './core/upload.service';







@NgModule({
  declarations: [DropdownDirective],
  imports: [
    ReactiveFormsModule,
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    DropdownDirective,
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [
    FirebaseApiService,
    AuthService,
    CarsService,
    CarStarRatingService,
    UploadService
  ]
})
export class SharedModule { }
