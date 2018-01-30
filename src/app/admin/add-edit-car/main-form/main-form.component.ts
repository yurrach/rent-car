import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { CarFormParam } from '../../shared/models/car-form-param.model';
import { CarFormDataService } from '../../shared/services/car-form-data.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'crayf-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.scss'],
})
export class MainFormComponent implements OnInit, OnDestroy {
  loading = false;
  @Input() currentCar;
  @Output() onMainFormFilled = new EventEmitter<FormGroup>(true);
  public mainCarForm: FormGroup;
  public mainCarFormParams: Array<CarFormParam>;
  constructor(
    private fb: FormBuilder,
    private carFormDataService: CarFormDataService,
  ) {}

  ngOnDestroy(): void {
    console.log('onDestroy');
  }
  ngOnChanges(): void {
    console.log('onChanges', this.currentCar);
    if (this.currentCar === null) {
      console.log('null');
      this.onControlChange({ name: 'year' }, 0);
    }
  }
  ngOnInit() {
    /* this.currentCar = {
      year: 2005,
      make: 'Citroen',
      model: 'C5',
      trim: 'Break',
    }; */
    this.mainCarFormParams = this.carFormDataService.mainCarFormParams;
    this.createMainCarForm();
    if (this.currentCar) {
      this.mainCarForm.patchValue(this.currentCar);
      this.mainCarFormParams.forEach(param => {
        if (param.listName) {
          param.optionsList$ = this.getListFromApi(param.listName);
        }
      });
      // this.onMainFormFilled.emit(this.mainCarForm);
    }
  }

  createMainCarForm() {
    const mainConfig = this.carFormDataService.getFormControlConfig(
      this.mainCarFormParams,
    );
    this.mainCarForm = this.fb.group(mainConfig);
  }
  onControlChange({ name }, i) {
    if (i < this.mainCarFormParams.length - 1) {
      this.loading = true;
      const nextIndex = i + 1;
      const nextCarParam = this.mainCarFormParams[nextIndex];
      const nextControl = this.mainCarForm.controls[nextCarParam.name];
      if (nextControl.value) {
        for (
          let index = i + 1;
          index < this.mainCarFormParams.length;
          index++
        ) {
          const curParam = this.mainCarFormParams[index];
          this.resetForm(curParam.name);
          this.resetOptionsLists(index);
        }
      }

      if (this.mainCarForm.controls[name].valid) {
        nextCarParam.optionsList$ = this.getListFromApi(
          nextCarParam.listName,
        ).do(() => {
          this.loading = false;
        });
      }
    }
    this.onMainFormFilled.emit(this.mainCarForm);
  }
  resetForm(controlName) {
    this.mainCarForm.controls[controlName].reset('');
  }
  resetOptionsLists(index) {
    this.mainCarFormParams[index].optionsList$ = Observable.of(null);
  }

  getListFromApi(listName) {
    return this.carFormDataService.getCarParamsList$(
      this.mainCarForm.value,
      listName,
    );
  }
}