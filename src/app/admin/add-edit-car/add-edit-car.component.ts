import { Component, OnInit, ContentChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';

import { AdminCarService } from '../shared/services/admin-car.service';
import { CarFormDataService } from '../shared/services/car-form-data.service';

import { Car1 } from '../../shared/models/car.model';
import { CarImage } from '../../shared/models/car-image';
import { CarFormParam } from '../shared/models/car-form-param.model';
import { mainCarFormParams } from '../shared/data/main-form';
import { apiCarFormParams } from '../shared/data/api-form';

@Component({
  selector: 'crayf-add-edit-car',
  templateUrl: './add-edit-car.component.html',
  styleUrls: ['./add-edit-car.component.scss'],
})
export class AddEditCarComponent implements OnInit {
  carImgList: Array<CarImage>;
  // carImgFileList: Array<File>;
  // carImgSrcList: Array<CarImage>;
  defaultCarImg: CarImage;
  isShowSelectLoader = false;
  isShowPageLoader = false;
  carForm: FormGroup;
  mainCarForm: FormGroup;
  apiCarForm: FormGroup;
  customCarForm: FormGroup;
  mainCarFormParams: Array<CarFormParam>;
  apiCarFormParams: Array<CarFormParam>;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private formService: CarFormDataService,
    private adminCarService: AdminCarService,
  ) {}

  ngOnInit() {
    this.isShowPageLoader = true;
    this.route.params
      .mergeMap((params: Params) => {
        if (params.id) {
          return this.adminCarService.getCarById$(params.id).delay(1000);
        } else {
          return Observable.of(null);
        }
      })
      .subscribe((car: Car1) => {
        this.createCarForm(car);
        if (car) {
          this.initCarImgList(car);
          // this.carImgList = car.images;
          // this.defaultCarImg = car.defaultImage;
          this.mainCarFormParams.forEach(param => {
            param.value = car[param.name];
            this.getOptionsList(param);
          });
        }
        if (!car) {
          const param = this.mainCarFormParams[0];
          this.getOptionsList(param);
        }
        this.isShowPageLoader = false;
      });
  }
  initCarImgList(car: Car1) {
    let defaultCarName = null;
    if (car.defaultImage) {
      defaultCarName = car.defaultImage.name;
    }
    this.carImgList = car.images.map(img => {
      img.isDefault = img.name === defaultCarName;
      return img;
    });
  }
  ngOnDestroy() {
    this.mainCarFormParams.forEach(param => {
      this.resetOptionsList(param);
    });
  }

  createCarForm(car?: Car1) {
    this.createMainCarForm(car);
    this.createApiCarForm(car);
    this.createCustomCarForm(car);
    this.carForm = this.fb.group({
      main: this.mainCarForm,
      api: this.apiCarForm,
      custom: this.customCarForm,
    });
  }
  createMainCarForm(car?: Car1) {
    this.mainCarFormParams = mainCarFormParams;
    const mainConfig = this.formService.getFormControlConfig(
      this.mainCarFormParams,
    );
    this.mainCarForm = this.fb.group(mainConfig);
    if (car) {
      this.mainCarForm.patchValue(car);
    }
  }
  createApiCarForm(car?: Car1) {
    this.apiCarFormParams = apiCarFormParams;
    const apiConfig = this.formService.getFormControlConfig(
      this.apiCarFormParams,
    );
    this.apiCarForm = this.fb.group(apiConfig);
    if (car) {
      this.apiCarForm.patchValue(car);
    }
  }
  createCustomCarForm(car?: Car1) {
    this.customCarForm = this.fb.group({
      isAirConditioning: false,
      isSale: false,
      saleAmount: null,
      rentPrice: this.fb.array([]),
      additionalInfo: [null, Validators.required],
    });
    if (car) {
      this.customCarForm.patchValue(car);
    }
  }
  onMainFormChange(param: CarFormParam) {
    param.value = this.mainCarForm.controls[param.name].value;
    if (param.name === 'trim') {
      return this.fillApiFormByTrim(param.value);
    }
    const currentIndex = this.mainCarFormParams.indexOf(param);
    const nextIndex = currentIndex + 1;
    const nextParam = this.mainCarFormParams[nextIndex];
    const nextControl = this.mainCarForm.controls[nextParam.name];
    if (nextControl.value) {
      this.mainCarFormParams
        .filter((param, i) => i >= nextIndex)
        .forEach(param => {
          this.resetMainFormControl(param);
          this.resetOptionsList(param);
        });
    }
    this.getOptionsList(nextParam);
  }
  getOptionsList(param: CarFormParam) {
    this.isShowSelectLoader = true;
    if (param.name === 'year') {
      param.optionsList = this.formService.getYearsList(2000);
      this.isShowSelectLoader = false;
    } else {
      this.getOptionsList$(param).subscribe(res => {
        param.optionsList = res;
        this.isShowSelectLoader = false;
      });
    }
  }
  getOptionsList$(param: CarFormParam) {
    const queryParams = {
      year: this.mainCarForm.controls['year'].value,
      make: this.mainCarForm.controls['make'].value,
      model: this.mainCarForm.controls['model'].value,
    };
    return this.formService.getSelectOptionsList$(queryParams, param.listName);
  }
  resetMainFormControl(param: CarFormParam) {
    this.mainCarForm.controls[param.name].reset(null);
  }
  resetOptionsList(param: CarFormParam) {
    param.value = null;
    param.optionsList = null;
  }

  fillApiFormByTrim(trim: string) {
    const apiCar = this.formService.getCarParamsByTrim(trim);
    this.apiCarForm.patchValue(apiCar);
  }

  onSubmit() {
    // this.isShowPageLoader = true;
    this.createCar();
    // this.onReset();
  }
  onReset() {
    this.carForm.reset();
    this.mainCarFormParams.forEach(param => {
      if (param.name !== 'year') {
        this.resetOptionsList(param);
      }
    });
  }

  addImages(target: HTMLInputElement) {
    const files: Array<File> = Array.prototype.slice.call(target.files);
    const fileNameObj = {};
    if (!this.carImgList) {
      this.carImgList = [];
    }
    if (this.carImgList) {
      this.carImgList.forEach(file => {
        fileNameObj[file.name] = true;
      });
    }
    files.forEach(file => {
      if (fileNameObj[file.name]) {
        return;
      }
      const img: CarImage = {
        name: file.name,
        file: file,
        progress: 0,
      };
      /// WTF!!!!!!!!
      this.carImgList = [...this.carImgList, img];
      // this.carImgList.push(img);
    });
  }
  deleteImage(deletedImg: CarImage) {
    this.carImgList = this.carImgList.filter(
      img => img.name !== deletedImg.name,
    );
    /* const index = this.carImgSrcList.indexOf(img);
    this.carImgSrcList.splice(index, 1);
    if (this.carImgFileList) {
      this.carImgFileList.splice(index, 1);
    } */
  }
  /* setDefaultImage(img: CarImage) {
    this.customCarForm.controls['defaultImg'].patchValue(img);
  } */
  createCar() {
    const car: Car1 = {
      ...new Car1(),
      ...this.mainCarForm.value,
      ...this.apiCarForm.value,
      ...this.customCarForm.value,
    };
    this.adminCarService.createCar(car, this.carImgList).subscribe(res => {
      this.carImgList = null;
      this.isShowPageLoader = false;
      this.onReset();
    });
  }
}
