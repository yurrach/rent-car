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
    console.log('ngOnDestroy mainForm');
  }
  ngOnChanges(): void {
    console.log('ngOnChanges mainForm');
    if (this.currentCar === null) {
      console.log('ngOnChanges mainForm null');
      this.onControlChange({ name: 'year' }, 0);
    }
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
  /*   ngAfterViewInit() {
    console.log('ngAfterViewInit mainForm');
  }
  ngAfterViewChecked() {
    console.log('ngAfterViewChecked mainForm');
  }
  ngAfterContentInit() {
    console.log('ngAfterContentInit mainForm');
  }
  ngAfterContentChecked() {
    console.log('ngAfterContentChecked mainForm');
  } */
  ngOnInit() {
    console.log('ngOnInit mainForm');
    this.mainCarFormParams = this.carFormDataService.mainCarFormParams;
    this.createMainCarForm();
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
