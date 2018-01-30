import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AdminCarService } from '../shared/services/admin-car.service';
import { Observable } from 'rxjs/Observable';
import { CarFormDataService } from '../shared/services/car-form-data.service';
import { CarFormParam } from '../shared/models/car-form-param.model';
import 'rxjs/add/operator/do';
import { Car1 } from '../../shared/models/car.model';
import * as firebase from 'firebase';
import { zip } from 'rxjs/observable/zip';

@Component({
  selector: 'crayf-add-edit-car',
  templateUrl: './add-edit-car.component.html',
  styleUrls: ['./add-edit-car.component.scss'],
})
export class AddEditCarComponent implements OnInit {
  loading = false;
  apiCarParams;
  public carForm: FormGroup;
  isMainCarFormValid = false;
  isApiCarFormValid = false;
  isCustomCarFormValid = false;
  isMainFormVisible = true;
  currentTrim;
  mainCar;
  apiCar;
  customCar;
  upload$: [Observable<any>] = [null];

  private carImages: FormArray;

  constructor(
    private fb: FormBuilder,
    private adminCarService: AdminCarService,
    private carFormDataService: CarFormDataService,
  ) {}

  ngOnInit() {}
  onMainFormChanged(mainFormGroup: FormGroup) {
    this.isMainCarFormValid = mainFormGroup.valid;
    if (mainFormGroup.valid) {
      this.currentTrim = mainFormGroup.controls['trim'].value;
      this.mainCar = mainFormGroup.value;
      /* this.apiCarParams = this.getApiCarParams(
        mainFormGroup.controls['trim'].value,
      ); */
    }
  }
  getApiCarParams(trim) {
    return this.carFormDataService.getCarParamsByTrim(trim);
  }
  onApiFormChanged(apiFormGroup: FormGroup) {
    this.isApiCarFormValid = apiFormGroup.valid;
    this.apiCar = apiFormGroup.value;
  }
  onCustomFormChanged(customFormGroup: FormGroup) {
    this.isCustomCarFormValid = customFormGroup.valid;
    if (customFormGroup.valid) {
      this.customCar = customFormGroup.value;
      console.log(this.customCar);
    }
  }
  onReset() {
    console.log('reset form');
  }
  onSubmit() {
    this.customCar.fileImages.forEach((image, i) => {
      this.upload$[i] = this.adminCarService
        .uploadCarImage(image.file)
        .map(uploadTask => {
          return {
            name: uploadTask.metadata.name,
            url: uploadTask.downloadURL,
            isDefault: image.isDefault,
          };
        });
    });
    const imagesLinks = zip(...this.upload$);
    imagesLinks.subscribe(res => {
      delete this.customCar.fileImages;
      const currentCar: Car1 = {
        ...new Car1(),
        ...this.mainCar,
        ...this.apiCar,
        ...this.customCar,
        images: res,
        // uid: '11234 MP-7',
      };
      // this.adminCarService.updateCar(currentCar);
      this.adminCarService.createCar(currentCar).then(res => {
        console.log('carAdded');
        this.mainCar = null;
        this.apiCar = null;
        this.customCar = null;
      });
    });
  }
}
