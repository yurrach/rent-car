import { Injectable } from '@angular/core';
import { CarsService } from '../../../shared/services/cars.service';
import { FirebaseApiService } from '../../../shared/core/firebase-api.service';
import { UploadService } from '../../../shared/core/upload.service';
import { Upload } from '../../../shared/models/upload.model';
import { Car1 } from '../../../shared/models/car.model';
import { Observable } from 'rxjs/Observable';
import { CarImage } from '../../../shared/models/car-image';
import { zip } from 'rxjs/observable/zip';

@Injectable()
export class AdminCarService extends CarsService {
  constructor(
    public fbs: FirebaseApiService,
    private uploadService: UploadService,
  ) {
    super(fbs);
  }
  uploadCarImage(carId, img: CarImage) {
    return this.uploadService
      .pushUpload('/cars-images/' + carId, img)
      .map(uplSnapshot => {
        return {
          src: uplSnapshot.downloadURL,
          name: img.name,
        };
      });
  }
  updateCar(car: Car1) {
    return this.fbs.updateDoc('cars', car, this.carQueryFn);
  }
  createCar(car: Car1, imgList: Array<CarImage>) {
    console.log(imgList);
    const defaultImgName = imgList.find(img => img.isDefault).name;
    let carId;
    const upload$: [Observable<any>] = [] as [Observable<any>];
    return this.fbs
      .createDoc('cars', car, this.carQueryFn)
      .mergeMap(carRef => {
        carId = carRef.id;
        imgList.forEach(img => {
          upload$.push(this.uploadCarImage(carId, img));
        });
        return zip(...upload$);
      })
      .mergeMap(images => {
        const data = {
          defaultImage: images.find(img => img.name === defaultImgName),
          images: images,
        };
        const carRef = this.fbs
          .getCollectionRef('cars', this.carQueryFn)
          .doc(carId);
        return Observable.fromPromise(carRef.update(data));
      });
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
