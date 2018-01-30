import { Injectable } from '@angular/core';
import { CarsService } from '../../../shared/services/cars.service';
import { FirebaseApiService } from '../../../shared/core/firebase-api.service';
import { UploadService } from '../../../shared/core/upload.service';
import { Upload } from '../../../shared/models/upload.model';
import { Car1 } from '../../../shared/models/car.model';

@Injectable()
export class AdminCarService extends CarsService {
  constructor(
    public fbs: FirebaseApiService,
    private uploadService: UploadService,
  ) {
    super(fbs);
  }
  uploadCarImage(file: File) {
    const upload = new Upload(file);
    return this.uploadService.pushUpload('/cars-images', upload);
  }
  updateCar(car: Car1) {
    return this.fbs.updateDoc('cars', car, this.carQueryFn);
  }
  createCar(car) {
    return this.fbs.createDoc('cars', car, this.carQueryFn);
  }
}
