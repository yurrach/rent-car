import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AdminCarService } from '../../shared/services/admin-car.service';
import { CarSelectFormControl } from '../../shared/models/car-form-control';
import { CarFormDataService } from '../../shared/services/car-form-data.service';

@Component({
  selector: 'crayf-main-car-form',
  templateUrl: './main-car-form.component.html',
  styleUrls: ['./main-car-form.component.scss'],
})
export class MainCarFormComponent implements OnInit {
  mainCarForm: FormGroup;
  @Output() onMainCarFormValid = new EventEmitter<FormGroup>();
  carMainParams: Array<CarSelectFormControl>;

  constructor(
    private adminCarService: AdminCarService,
    private fb: FormBuilder,
    private carFormDataService: CarFormDataService,
  ) {}

  ngOnInit() {
    this.carMainParams = this.carFormDataService.carMainFormControls;
    this.carMainParams[0].optionsList$ = this.getYearsList(2000);
    this.createMainCarForm();
  }
  ngOnDestroy() {}

  onControlChange({ name }, i) {
    this.onMainCarFormValid.emit(this.mainCarForm);

    if (name === 'trim') {
      if (this.mainCarForm.valid) {
      }
      return;
    }
    const nextCarParam = this.carMainParams[i + 1];
    if (this.mainCarForm.controls[nextCarParam.name].value) {
      for (let index = i + 1; index < this.carMainParams.length; index++) {
        const curParam = this.carMainParams[index];
        this.mainCarForm.controls[curParam.name].reset('');
        this.carMainParams[index].optionsList$ = Observable.of(null);
      }
    }
    if (this.mainCarForm.controls[name].valid) {
      const listName = {
        year: 'make_display',
        make: 'model_name',
        model: 'model_trim',
      };
      nextCarParam.optionsList$ = this.getListFromApi(listName[name]);
    }
  }

  getListFromApi(listName) {
    return this.adminCarService.getCarParamsList$(
      this.mainCarForm.value,
      listName,
    );
  }

  getYearsList(startYear): Observable<number[]> {
    const yearsList = [];
    const endYear = new Date().getFullYear();
    for (let i = startYear; i <= endYear; i++) {
      yearsList.push(i);
    }
    return Observable.of(yearsList);
  }

  isInvalid(name) {
    const control = this.mainCarForm.controls[name];
    return control.touched && control.invalid;
  }
  createMainCarForm() {
    this.mainCarForm = this.fb.group({
      year: ['', Validators.required],
      make: ['', Validators.required],
      model: ['', Validators.required],
      trim: ['', Validators.required],
    });
  }
}
