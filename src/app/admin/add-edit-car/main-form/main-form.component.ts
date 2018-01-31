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
    this.reset();
  }
  ngOnChanges(): void {
    if (this.currentCar) {
      this.loading = true;
      this.mainCarForm.patchValue(this.currentCar);
      this.mainCarFormParams.forEach(param => {
        if (param.listName) {
          param.optionsList$ = this.getListFromApi(param.listName);
          param.isShow = true;
        }
      });
      this.loading = false;
    }
  }

  ngOnInit() {
    this.mainCarFormParams = this.carFormDataService.mainCarFormParams;
    this.createMainCarForm();
  }

  createMainCarForm() {
    const mainConfig = this.carFormDataService.getFormControlConfig(
      this.mainCarFormParams,
    );
    this.mainCarForm = this.fb.group(mainConfig);
  }

  getListFromApi(listName) {
    return this.carFormDataService.getCarParamsList$(
      this.mainCarForm.value,
      listName,
    );
  }
  onChange(target: HTMLSelectElement) {
    const controlName = target.name;
    if (controlName === 'trim') {
      console.log('getParamsByTrim');
      return;
    }
    const param = this.mainCarFormParams.find(el => {
      return el.name === controlName;
    });
    const control = this.mainCarForm.controls[param.name];
    const index = this.mainCarFormParams.indexOf(param);
    const nextIndex = index + 1;
    const nextParam = this.mainCarFormParams[nextIndex];
    const nextControl = this.mainCarForm.controls[nextParam.name];
    if (nextControl.value) {
      this.reset(nextIndex);
    }
    this.loading = true;
    nextParam.isShow = control.value ? true : false;
    nextParam.optionsList$ = this.getListFromApi(nextParam.listName).do(() => {
      this.loading = false;
    });
  }
  showAllSelect() {
    this.mainCarFormParams.forEach(elem => {
      elem.isShow = true;
    });
  }
  reset(i = 0) {
    for (let index = i; index < this.mainCarFormParams.length; index++) {
      const element = this.mainCarFormParams[index];
      const control = this.mainCarForm.controls[element.name];
      if (index !== 0) {
        element.optionsList$ = Observable.of(null);
        element.isShow = false;
      }
      control.reset('');
    }
  }
}
