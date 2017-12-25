import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';



import { DropdownDirective } from './directives/crayf-dropdown.directive';
import { FirebaseApiService } from './services/firebase-api.service';




@NgModule({
  declarations: [DropdownDirective],
  imports: [
    ReactiveFormsModule,
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  exports: [
    ReactiveFormsModule,
    DropdownDirective,
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [FirebaseApiService],
})
export class SharedModule { }
