import { Injectable } from '@angular/core';
import { FirebaseApiService } from '../core/firebase-api.service';
import { Car } from '../models/car.model';

@Injectable()
export class CarsService {

  constructor(private fbs: FirebaseApiService) { }

  getCars$() {
    return this.fbs.getCollection$<Car>('cars', 'model_year', 'asc');
  }

  getCarById$(id) {
    return this.fbs.getDocById$('cars', id);
  }
}
