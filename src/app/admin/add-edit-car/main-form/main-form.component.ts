import { Component, OnInit, Input, OnDestroy } from '@angular/core';
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
  isSpinnerShow = false;
  @Input() currentCar;
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
      this.isSpinnerShow = true;
      this.showAllSelect(false);
      let counter = 1;
      this.mainCarForm.patchValue(this.currentCar);
      this.mainCarFormParams.forEach(param => {
        if (param.listName) {
          param.optionsList$ = this.getListFromApi(param.listName);
          this.getListFromApi(param.listName).subscribe(res => {
            param.optionsList = res;
            counter += 1;
            if (counter === this.mainCarFormParams.length) {
              this.showAllSelect(true);
              this.isSpinnerShow = false;
            }
          });
        }
      });
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
    this.isSpinnerShow = true;
    /* nextParam.optionsList$ = this.getListFromApi(nextParam.listName).do(() => {
      this.isSpinnerShow = false;
    }); */

    this.getListFromApi(nextParam.listName)
      .do(() => {
        nextParam.isShow = true;
        this.isSpinnerShow = false;
      })
      .subscribe(res => {
        nextParam.optionsList = res;
      });
  }
  showAllSelect(isShow: Boolean) {
    this.mainCarFormParams.forEach(elem => {
      elem.isShow = isShow;
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
