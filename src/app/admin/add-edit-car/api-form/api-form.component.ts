import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CarFormParam } from '../../shared/models/car-form-param.model';
import { AdminCarService } from '../../shared/services/admin-car.service';
import { CarFormDataService } from '../../shared/services/car-form-data.service';

@Component({
  selector: 'crayf-api-form',
  templateUrl: './api-form.component.html',
  styleUrls: ['./api-form.component.scss'],
})
export class ApiFormComponent implements OnInit {
  currentCar;
  apiCarForm: FormGroup;
  apiCarFormParams: Array<CarFormParam>;
  @Input() apiCarParams;
  @Input() currentTrim;
  @Output() onApiFormFilled = new EventEmitter<FormGroup>(true);

  constructor(
    private fb: FormBuilder,
    private adminCarService: AdminCarService,
    private carFormDataService: CarFormDataService,
  ) {}

  ngOnInit() {
    /* this.currentCar = {
      drive: 'Front',
      engineCc: '1560',
      engineFuel: 'Front',
      lkmMixed: '5.4',
      body: 'Station Wagon',
      seats: '5',
    }; */
    this.apiCarFormParams = this.carFormDataService.apiCarFormParams;
    this.createApiCarForm();
    if (this.apiCarForm.valid) {
      this.onApiFormFilled.emit(this.apiCarForm);
    }
    this.apiCarForm.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        this.onApiFormFilled.emit(this.apiCarForm);
      }
    });
  }
  createApiCarForm() {
    const apiConfig = this.carFormDataService.getFormControlConfig(
      this.apiCarFormParams,
    );
    this.apiCarForm = this.fb.group(apiConfig);
    if (!this.currentCar) {
      this.currentCar = this.carFormDataService.getCarParamsByTrim(
        this.currentTrim,
      );
    }
    this.apiCarForm.patchValue(this.currentCar || {});
  }
  getApiValidParams() {
    let show = true;
    return this.carFormDataService.apiCarFormParams.filter(param => {
      if (this.apiCarForm.controls[param.name].invalid) {
        show = false;
        return true;
      }
      return show;
    });
  }
}
