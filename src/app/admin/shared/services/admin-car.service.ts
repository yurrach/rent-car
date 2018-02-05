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
  uploadCarImage(path, file: File) {
    const upload = new Upload(file);
    upload.name = file.name;
    return this.uploadService
      .pushUpload('/cars-images/' + path, upload)
      .map(uplSnapshot => {
        return {
          url: uplSnapshot.downloadURL,
          name: upload.name,
        };
      });
  }
  getRef(path) {
    return this.fbs.getCollectionRef(path, this.carQueryFn);
  }
  updateCar(car: Car1) {
    return this.fbs.updateDoc('cars', car, this.carQueryFn);
  }
  createCar(car) {
    return this.fbs.createDoc('cars', car, this.carQueryFn);
  }
  createImage(image, id) {
    const path = 'cars/' + id + '/images';

    return this.fbs.createDoc(path, image, this.carQueryFn).map(ref => {
      return ref;
    });
  }
  deleteCar(car: Car1) {
    console.log(car);
    const images = car.images;
    const path = '/cars-images/' + car.id;
    images.forEach(image => {
      this.uploadService.deleteUpload(path, image.name).then(() => {
        console.log('delete', image.name);
      });
    });
    this.fbs.deleteDoc('cars', car);
  }
}
