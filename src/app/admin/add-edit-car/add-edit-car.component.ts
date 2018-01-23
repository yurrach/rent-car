import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AdminCarService } from '../shared/services/admin-car.service';
import { Observable } from 'rxjs/Observable';
import { CarFormDataService } from '../shared/services/car-form-data.service';
import { CarFormParam } from '../shared/models/car-form-param.model';
import { mainCarFormParams } from '../shared/data/main-form';
import { apiCarFormParams } from '../shared/data/api-form';
import { customCarFormParams } from '../shared/data/custom-form';
import 'rxjs/add/operator/do';

@Component({
  selector: 'crayf-add-edit-car',
  templateUrl: './add-edit-car.component.html',
  styleUrls: ['./add-edit-car.component.scss'],
})
export class AddEditCarComponent implements OnInit {
  loading = false;
  public carForm: FormGroup;
  public mainCarForm: FormGroup;
  public apiCarForm: FormGroup;
  public customCarForm: FormGroup;

  private carImages: FormArray;
  public mainCarFormParams: Array<CarFormParam>;
  public apiCarFormParams: Array<CarFormParam>;
  private customCarFormParams: Array<CarFormParam>;

  constructor(
    private fb: FormBuilder,
    private adminCarService: AdminCarService,
    private carFormDataService: CarFormDataService,
  ) {}

  ngOnInit() {
    console.log('onInit add-edit');
    this.mainCarFormParams = mainCarFormParams;

    this.createCarForm();
  }
  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log('onDestroy add-edit');
  }
  onControlChange({ name }, i) {
    this.loading = true;
    if (name === 'trim') {
      this.addApiCarForm();
      return (this.loading = false);
    }
    const nextIndex = i + 1;
    const nextCarParam = this.mainCarFormParams[nextIndex];
    const nextControl = this.mainCarForm.controls[nextCarParam.name];
    if (nextControl.value) {
      for (let index = i + 1; index < this.mainCarFormParams.length; index++) {
        const curParam = this.mainCarFormParams[index];
        this.mainCarForm.controls[curParam.name].reset('');
        this.mainCarFormParams[index].optionsList$ = Observable.of(null);
      }
    }
    if (this.apiCarForm) {
      delete this.apiCarForm;
      this.carForm.removeControl('apiCarForm');
    }
    if (this.customCarForm) {
      delete this.customCarForm;
      this.carForm.removeControl('customCarForm');
    }
    if (this.mainCarForm.controls[name].valid) {
      nextCarParam.optionsList$ = this.getListFromApi(nextCarParam.listName).do(
        () => {
          this.loading = false;
        },
      );
    }
  }

  /*   isControlInvalid(name) {
    const control = this.carForm.controls[name];
    return control.touched && control.invalid;
  } */

  onSubmit() {
    console.log('форма успешно сохранена');
  }
  onReset() {
    console.log('форма сброшена');
    delete this.apiCarForm;
    delete this.customCarForm;
    this.carForm.removeControl('apiCarForm');
    this.carForm.removeControl('customCarForm');
    /*     delete this.apiCarForm;
    this.carForm.reset({
      year: '',
      make: '',
      model: '',
      trim: '',
    }); */
  }

  createCarForm() {
    this.createMainCarForm();
    this.carForm = this.fb.group({ mainCarForm: this.mainCarForm });
  }
  createMainCarForm() {
    const mainConfig = this.carFormDataService.getFormControlConfig(
      this.mainCarFormParams,
    );
    this.mainCarForm = this.fb.group(mainConfig);
  }
  addApiCarForm() {
    const apiParams = this.adminCarService.getCarParamsByTrim(
      this.mainCarForm.controls.trim.value,
    );
    const value = {
      drive: apiParams.model_drive,
      engineCc: apiParams.model_engine_cc,
      engineFuel: apiParams.model_engine_fuel,
      lkmMixed: apiParams.model_lkmMixed,
      body: apiParams.model_body,
      seats: apiParams.model_seats,
    };
    this.apiCarFormParams = apiCarFormParams;
    this.createApiCarForm();
    this.apiCarForm.patchValue(value);
    this.carForm.addControl('apiCarForm', this.apiCarForm);
  }
  createApiCarForm() {
    const apiConfig = this.carFormDataService.getFormControlConfig(
      this.apiCarFormParams,
    );
    this.apiCarForm = this.fb.group(apiConfig);
  }
  createCustomCarForm() {
    const customConfig = this.carFormDataService.getFormControlConfig(
      this.customCarFormParams,
    );
    this.customCarForm = this.fb.group(customConfig);
  }
  getListFromApi(listName) {
    return this.adminCarService.getCarParamsList$(
      this.adminCarService.getQueryUrl(this.mainCarForm.value),
      listName,
    );
  }
  onApiFormChange() {
    if (this.apiCarForm.valid) {
      this.addCustomCarForm();
    }
  }
  addCustomCarForm() {
    this.customCarFormParams = customCarFormParams;
    this.createCustomCarForm();
    this.carForm.addControl('customCarForm', this.customCarForm);
  }
  getValidApiList() {
    let show = true;
    return this.apiCarFormParams.filter((param, index, params) => {
      if (index !== 0) {
        const nexControlName = params[index - 1].name;
        if (this.apiCarForm.controls[nexControlName].invalid) {
          show = false;
        }
      }
      return show;
    });
  }
  getValidCustomList() {
    let show = true;
    return this.customCarFormParams.filter((param, index, params) => {
      if (index !== 0) {
        const nexControlName = params[index - 1].name;
        if (this.customCarForm.controls[nexControlName].invalid) {
          show = false;
        }
      }
      return show;
    });
  }
}
