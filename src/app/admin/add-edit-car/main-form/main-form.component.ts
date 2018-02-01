import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { CarFormParam } from '../../shared/models/car-form-param.model';
import { CarFormDataService } from '../../shared/services/car-form-data.service';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'crayf-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.scss'],
})
export class MainFormComponent implements OnInit, OnDestroy {
  isSpinnerShow = false;
  sub1: Subscription;
  @Input() currentCar;
  @Output() onMainCarFormChange: EventEmitter<FormGroup> = new EventEmitter();
  public mainCarForm: FormGroup;
  public mainCarFormParams: Array<CarFormParam>;
  constructor(
    private fb: FormBuilder,
    private carFormDataService: CarFormDataService,
  ) {}

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
    this.reset();
  }
  ngOnChanges(): void {
    console.log(this.currentCar);
    if (this.currentCar === null) {
      console.log('in if', this.currentCar);
      this.reset();
    }
    if (this.currentCar) {
      this.showAllSelect(false);
      this.isSpinnerShow = true;
      this.mainCarForm.patchValue(this.currentCar);
      const optionsListArray$ = this.mainCarFormParams
        .filter(param => {
          return param.listName;
        })
        .map(param => {
          return this.getListFromApi$(param);
        });
      zip(...optionsListArray$).subscribe(result => {
        this.mainCarFormParams
          .filter(param => {
            return param.listName;
          })
          .forEach((param, i) => {
            param.optionsList = result[i];
            this.isSpinnerShow = false;
            this.showAllSelect(true);
          });
      });
    }
  }

  ngOnInit() {
    this.mainCarFormParams = this.carFormDataService.mainCarFormParams;
    this.createMainCarForm();
    this.sub1 = this.mainCarForm.valueChanges.subscribe(() => {
      this.onMainCarFormChange.emit(this.mainCarForm);
    });
  }

  createMainCarForm() {
    const mainConfig = this.carFormDataService.getFormControlConfig(
      this.mainCarFormParams,
    );
    this.mainCarForm = this.fb.group(mainConfig);
  }

  getListFromApi$(param: CarFormParam) {
    return this.carFormDataService.getCarParamsList$(
      this.mainCarForm.value,
      param.listName,
    );
  }

  onChange(target: HTMLSelectElement) {
    const controlName = target.name;

    if (controlName === 'trim') {
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
    this.getListFromApi$(nextParam).subscribe(res => {
      nextParam.optionsList = res;
      nextParam.isShow = true;
      this.isSpinnerShow = false;
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
