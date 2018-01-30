import { Injectable } from '@angular/core';
import { FirebaseApiService } from '../core/firebase-api.service';
import { Car, Car1 } from '../models/car.model';
import * as firebase from 'firebase/app';

@Injectable()
export class CarsService {
  constructor(public fbs: FirebaseApiService) {}

  getCars$() {
    return this.fbs.getCollection$<Car1>('cars', this.carQueryFn);
  }

  getCarById$(id) {
    return this.fbs.getDocById$('cars', id);
  }
  carQueryFn(ref: firebase.firestore.CollectionReference) {
    return ref.orderBy('year', 'desc');
  }
}
