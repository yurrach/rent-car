import { Injectable } from '@angular/core';
import { CarsService } from '../../../shared/services/cars.service';
import { FirebaseApiService } from '../../../shared/core/firebase-api.service';

@Injectable()
export class AdminCarService extends CarsService {
  constructor(public fbs: FirebaseApiService) {
    super(fbs);
  }
}
