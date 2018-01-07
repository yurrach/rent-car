import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AdminCarService } from '../shared/services/admin-car.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'crayf-add-edit-car',
  templateUrl: './add-edit-car.component.html',
  styleUrls: ['./add-edit-car.component.scss'],
})
export class AddEditCarComponent implements OnInit {
  carForm: FormGroup;
  mainCarForm: FormGroup;
  apiCarForm: FormGroup;
  customCarForm: FormGroup;

  carImages: FormArray;
  carApiParams;

  constructor(
    private fb: FormBuilder,
    private adminCarService: AdminCarService,
  ) {}

  ngOnInit() {
    console.log('onInit add-edit');
    this.createCarForm();
  }
  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log('onDestroy add-edit');
  }

  isInvalid(name) {
    const control = this.carForm.controls[name];
    return control.touched && control.invalid;
  }

  onSubmit() {
    console.log('форма успешно сохранена');
  }
  onReset() {
    console.log('форма сброшена');
  }

  createCarForm() {
    this.carForm = this.fb.group({});
  }
  onMainCarFormValid(e) {
    this.mainCarForm = e;
    this.carForm.addControl('mainCarForm', e);
    if (this.mainCarForm.valid) {
      this.carApiParams = this.adminCarService.getCarParamsByTrim(
        e.controls.trim.value,
      );
    }
  }
  onApiCarFormValid(e) {
    this.apiCarForm = e;
    this.carForm.addControl('apiCarForm', this.apiCarForm);
  }
  onCustomCarFormValid(e) {
    this.customCarForm = e;
    this.carForm.addControl('customCarForm', this.customCarForm);
  }
}
