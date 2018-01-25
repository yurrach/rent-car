import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AdminCarService } from '../shared/services/admin-car.service';
import { Observable } from 'rxjs/Observable';
import { CarFormDataService } from '../shared/services/car-form-data.service';
import { CarFormParam } from '../shared/models/car-form-param.model';
import 'rxjs/add/operator/do';

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
  isApiCarFormValid;

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
      this.apiCarParams = this.getApiCarParams(
        mainFormGroup.controls['trim'].value,
      );
    }
  }
  getApiCarParams(trim) {
    return this.adminCarService.getCarParamsByTrim(trim);
  }
  onApiFormChanged(apiFormGroup: FormGroup) {
    this.isApiCarFormValid = apiFormGroup.valid;
  }
  onReset() {
    console.log('reset form');
  }
}
