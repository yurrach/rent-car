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
  createCar(car: Car1) {
    let carId;
    let defaultImgName;
    const imgList = car.images;
    const defaultImg = imgList.find(img => img.isDefault);
    if (defaultImg) {
      defaultImgName = defaultImg.name;
    }
    if (!defaultImg) {
      defaultImgName = imgList[0].name;
    }
    delete car.images;
    const upload$ = [] as [Observable<CarImage>];
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
  updateCar(car: Car1) {
    let upload$ = [] as [Observable<CarImage>];
    const uploaded = [] as [CarImage];
    const imgList = car.images;
    const defaultImgName = imgList.find(img => img.isDefault).name;
    imgList.forEach((img, index) => {
      if (img.file) {
        upload$.push(this.uploadCarImage(car.id, img));
      }
      if (!img.file) {
        uploaded.push(img);
      }
    });
    if (!upload$.length) {
      upload$ = [Observable.of(null)] as [Observable<CarImage>];
    }
    return zip(...upload$).mergeMap(images => {
      car.images = [...uploaded] as [CarImage];
      if (images[0]) {
        car.images = car.images.concat(images) as [CarImage];
      }
      car.defaultImage = car.images.find(img => img.name === defaultImgName);
      return Observable.fromPromise(this.fbs.updateDoc('cars', car));
    });
  }
  deleteCar(car: Car1) {
    const images = car.images;
    images.forEach(img => {
      this.deleteImage(car.id, img);
    });
    this.fbs.deleteDoc('cars', car);
  }
  deleteImage(carId: string, img: CarImage) {
    const imgPath = '/cars-images/' + carId;
    this.uploadService.deleteUpload(imgPath, img.name).then(() => {});
  }
}
