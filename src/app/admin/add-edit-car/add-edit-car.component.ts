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
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'crayf-add-edit-car',
  templateUrl: './add-edit-car.component.html',
  styleUrls: ['./add-edit-car.component.scss'],
})
export class AddEditCarComponent implements OnInit {
  isEditMode = false;
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
  }
}
