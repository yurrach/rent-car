import { Component, OnInit, Output, EventEmitter } from '@angular/core';

// import { mainCarFormParams } from '../../shared/data/main-form';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CarFormParam } from '../../shared/models/car-form-param.model';
import { AdminCarService } from '../../shared/services/admin-car.service';
import { CarFormDataService } from '../../shared/services/car-form-data.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'crayf-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.scss'],
})
export class MainFormComponent implements OnInit {
  loading = false;
  @Output() onMainFormFilled = new EventEmitter<FormGroup>();
  @Output() onMainFormChanged = new EventEmitter<Boolean>();
  public mainCarForm: FormGroup;
  public mainCarFormParams: Array<CarFormParam>;
  constructor(
    private fb: FormBuilder,
    private adminCarService: AdminCarService,
    private carFormDataService: CarFormDataService,
  ) {}

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
  onControlChange({ name }, i) {
    /*     if (name === 'trim') {
      return this.onMainFormFilled.emit(this.mainCarForm);
    } */
    if (i < this.mainCarFormParams.length - 1) {
      this.loading = true;
      const nextIndex = i + 1;
      const nextCarParam = this.mainCarFormParams[nextIndex];
      const nextControl = this.mainCarForm.controls[nextCarParam.name];
      if (nextControl.value) {
        this.onMainFormChanged.emit(true);
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
    return this.adminCarService.getCarParamsList$(
      this.adminCarService.getQueryUrl(this.mainCarForm.value),
      listName,
    );
  }
}
