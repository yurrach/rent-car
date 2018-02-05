import { Component, OnInit, ContentChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CarFormDataService } from '../shared/services/car-form-data.service';
import { CarFormParam } from '../shared/models/car-form-param.model';
import { mainCarFormParams } from '../shared/data/main-form';
import { apiCarFormParams } from '../shared/data/api-form';
import { ActivatedRoute, Params } from '@angular/router';
import { AdminCarService } from '../shared/services/admin-car.service';
import { Observable } from 'rxjs/Observable';
import { Car1 } from '../../shared/models/car.model';
import { PreviewImagesComponent } from './preview-images/preview-images.component';
import { zip } from 'rxjs/observable/zip';
import { FirebaseApiService } from '../../shared/core/firebase-api.service';

@Component({
  selector: 'crayf-add-edit-car',
  templateUrl: './add-edit-car.component.html',
  styleUrls: ['./add-edit-car.component.scss'],
})
export class AddEditCarComponent implements OnInit {
  @ContentChild(PreviewImagesComponent) previewImg: PreviewImagesComponent;
  carImgFiles: Array<File>;
  previewImgs: [
    {
      url: string;
      name: string;
    }
  ];
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
    public fbs: FirebaseApiService,
  ) {}
  ngOnInit() {
    this.isShowPageLoader = true;
    this.createCarForm();
    this.route.params
      .mergeMap((params: Params) => {
        if (params.id) {
          return this.adminCarService.getCarById$(params.id).delay(1000);
        } else {
          return Observable.of(null);
        }
      })
      .subscribe((car: Car1) => {
        if (car) {
          console.log(car);
          this.mainCarForm.patchValue(car);
          this.apiCarForm.patchValue(car);
          this.customCarForm.patchValue(car);
          this.previewImgs = car.images;
          this.mainCarFormParams.forEach(param => {
            if (param.name !== 'year') {
              this.getOptionsList(param);
            }
          });
        }
        this.mainCarFormParams[0].isShow = true;
        this.isShowPageLoader = false;
      });
  }
  ngOnDestroy() {
    this.mainCarFormParams.forEach(param => {
      this.resetOptionsList(param);
    });
  }

  createCarForm() {
    this.createMainCarForm();
    this.createApiCarForm();
    this.createCustomCarForm();
    this.carForm = this.fb.group({
      main: this.mainCarForm,
      api: this.apiCarForm,
      custom: this.customCarForm,
    });
  }
  createMainCarForm() {
    this.mainCarFormParams = mainCarFormParams;
    this.mainCarFormParams[0].optionsList = this.formService.getYearsList(2000);
    const mainConfig = this.formService.getFormControlConfig(
      this.mainCarFormParams,
    );
    this.mainCarForm = this.fb.group(mainConfig);
  }
  createApiCarForm() {
    this.apiCarFormParams = apiCarFormParams;
    const apiConfig = this.formService.getFormControlConfig(
      this.apiCarFormParams,
    );
    this.apiCarForm = this.fb.group(apiConfig);
  }
  createCustomCarForm() {
    this.customCarForm = this.fb.group({
      isAirConditioning: [false],
      isSale: [false],
      saleAmount: [null],
      rentPrice: this.fb.array([]),
      images: this.fb.array([]),
      fileImages: this.fb.array([]),
      additionalInfo: [null],
    });
  }
  onMainFormChange(param: CarFormParam) {
    param.value = this.mainCarForm.controls[param.name].value;
    if (param.name === 'trim') {
      this.fillApiFormFromApi(param.value);

      return;
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
    this.getOptionsList$(param).subscribe(res => {
      param.optionsList = res;
      param.isShow = true;
      this.isShowSelectLoader = false;
    });
  }

  resetMainFormControl(param: CarFormParam) {
    this.mainCarForm.controls[param.name].reset('');
  }
  resetOptionsList(param: CarFormParam) {
    param.optionsList = null;
    param.isShow = false;
  }

  getOptionsList$(param: CarFormParam) {
    return this.formService.getCarParamsList$(
      this.mainCarForm.value,
      param.listName,
    );
  }

  fillApiFormFromApi(trim) {
    const apiCar = this.formService.getCarParamsByTrim(trim);
    this.apiCarForm.patchValue(apiCar);
  }

  onSubmit() {
    console.log('submit form');
    this.createCar();
    this.onReset();
  }
  onReset() {
    console.log('reset form');
    this.apiCarForm.reset();
    this.customCarForm.reset();
    this.mainCarFormParams.forEach(param => {
      this.resetMainFormControl(param);
      this.resetOptionsList(param);
    });
    this.mainCarFormParams[0].isShow = true;
    this.mainCarFormParams[0].optionsList = this.formService.getYearsList(2000);
  }

  addImages(target: HTMLInputElement) {
    const files: Array<File> = Array.prototype.slice.call(target.files);
    const imgFileNameObj = {};
    if (!this.carImgFiles) {
      this.carImgFiles = [];
    }
    if (this.carImgFiles) {
      this.carImgFiles.forEach(file => {
        imgFileNameObj[file.name] = true;
      });
    }
    files.forEach(file => {
      if (imgFileNameObj[file.name]) {
        return;
      }
      this.carImgFiles.push(file);
      this.transformToDataUrl(file);
    });
  }
  transformToDataUrl(file: File) {
    const index = this.carImgFiles.indexOf(file);
    if (!this.previewImgs) {
      this.previewImgs = [] as [{ url: string; name: string }];
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = {
        url: reader.result,
        name: file.name,
      };
      this.previewImgs[index] = img;
    };
  }
  deleteImage(i: number) {
    this.previewImgs.splice(i, 1);
    if (this.carImgFiles) {
      this.carImgFiles.splice(i, 1);
    }
  }
  createCar() {
    const car: Car1 = {
      ...new Car1(),
      ...this.mainCarForm.value,
      ...this.apiCarForm.value,
      ...this.customCarForm.value,
    };
    const upload$: [Observable<any>] = [] as [Observable<any>];
    this.adminCarService
      .createCar(car)
      .mergeMap(carRef => {
        console.log(carRef);
        car.id = carRef.id;
        this.carImgFiles.forEach(file => {
          upload$.push(this.adminCarService.uploadCarImage(car.id, file));
        });
        return zip(...upload$);
      })
      .subscribe(res => {
        car.images = res as [{ name: string; url: string; isDefault: string }];
        console.log(res);

        this.adminCarService.updateCar(car);
        this.carImgFiles = null;
        this.previewImgs = null;
      });
  }

  /*   isEditMode = false;
  isShowApiForm = false;
  isShowCustomForm = false;
  isCarFormValid = false;
  editCar: Car1;
  public carForm: FormGroup;
  mainCar;
  apiCar;
  customCar;

  private carImages: FormArray;

  constructor(
    private fb: FormBuilder,
    private adminCarService: AdminCarService,
    private carFormDataService: CarFormDataService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.params
      .mergeMap((params: Params) => {
        if (params.id) {
          return this.adminCarService.getCarById$(params.id);
        } else {
          return Observable.of(null);
        }
      })
      .subscribe((car: Car1) => {
        if (car) {
          this.isEditMode = true;
          this.mainCar = {
            year: car.year,
            make: car.make,
            model: car.model,
            trim: car.trim,
          };
          this.apiCar = {
            drive: car.drive,
            transmissionType: car.transmissionType,
            engineCc: car.engineCc,
            engineFuel: car.engineFuel,
            lkmMixed: car.lkmMixed,
            body: car.body,
            seats: car.seats,
          };
          this.customCar = {
            isSale: car.isSale,
            isAirConditioning: car.isAirConditioning,
            saleAmount: car.saleAmount,
            rentPrice: car.rentPrice,
            images: car.images,
            additionalInfo: car.additionalInfo,
          };
        }
      });
  }

  onReset() {}
  onSubmit() {
    console.log('submit start');
    const upload$ = [null];
    this.editCar['fileImages'].forEach((image, i) => {
      image.name =
        this.editCar.make + '_' + this.editCar.model + '_0' + i + '.jpg';
      upload$[i] = this.adminCarService
        .uploadCarImage(image)
        .map(uploadTask => {
          return {
            name: uploadTask.metadata.name,
            url: uploadTask.downloadURL,
            isDefault: image.isDefault,
          };
        });
    });
    const imagesLinks = zip(...upload$);
    console.log('submit 2');

    imagesLinks.subscribe(res => {
      delete this.editCar['fileImages'];
      this.editCar['images'] = res as [
        {
          id?: string;
          name: string;
          url: string;
          isDefault: string;
        }
      ];
      console.log('submit', this.editCar);

      this.adminCarService.createCar(this.editCar).then(() => {
        this.editCar = null;
        this.mainCar = null;
        this.isShowApiForm = false;
        this.isShowCustomForm = false;
        this.isCarFormValid = false;
      });
    });
  }
  onMainCarFormChange(mainForm: FormGroup) {
    this.isShowApiForm = mainForm.valid;
    if (!this.isEditMode && mainForm.valid) {
      this.apiCar = this.carFormDataService.getCarParamsByTrim(
        mainForm.controls['trim'].value,
      );
      this.editCar = {
        ...new Car1(),
        ...mainForm.value,
      };
      console.log('mainForm filled', this.editCar);
    }
    this.isEditMode = false;
  }
  onApiCarFormChange(apiForm: FormGroup) {
    this.isShowCustomForm = apiForm.valid;
    if (apiForm.valid) {
      this.editCar = { ...this.editCar, ...apiForm.value };
      console.log('apiForm filled', this.editCar);
    }
  }
  onCustomCarFormChange(customForm: FormGroup) {
    this.isCarFormValid = customForm.valid;
    if (customForm.valid) {
      this.editCar = { ...this.editCar, ...customForm.value };
      console.log('customform filled', this.editCar);
    }
  } */
}
