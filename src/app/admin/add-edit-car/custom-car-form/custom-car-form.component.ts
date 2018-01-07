import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'crayf-custom-car-form',
  templateUrl: './custom-car-form.component.html',
  styleUrls: ['./custom-car-form.component.scss'],
})
export class CustomCarFormComponent implements OnInit {
  customCarForm: FormGroup;
  @Output() onCustomCarFormValid = new EventEmitter<FormGroup>();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    console.log('onInit customForm');
    this.createCustomCarForm();
    this.onCustomCarFormValid.emit(this.customCarForm);
    /*     this.customCarForm.valueChanges.subscribe(() => {
      this.onCustomCarFormValid.emit(this.customCarForm);
    }) */
  }
  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log('onDestroy custom form');
  }

  createCustomCarForm() {
    this.customCarForm = this.fb.group({
      isNew: [null],
      isSale: [null],
      saleAmount: [null],
      isAirConditioning: [null],
      carImages: [null],
      pricing: [null, Validators.required],
      additionalInfo: [null, Validators.required],
    });
  }
}
