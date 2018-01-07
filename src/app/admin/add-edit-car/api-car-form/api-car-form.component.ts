import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'crayf-api-car-form',
  templateUrl: './api-car-form.component.html',
  styleUrls: ['./api-car-form.component.scss'],
})
export class ApiCarFormComponent implements OnInit {
  public apiCarForm: FormGroup;
  @Output() onApiCarFormValid = new EventEmitter<FormGroup>();
  @Input() carApiParams;
  carApiFormControlObj = {};

  carApiParamsArr: [
    {
      name: string;
      placeholder: string;
      label: string;
      value: string;
    }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    console.log('onInit apiForm');
    this.carApiParamsArr = [
      {
        name: 'drive',
        placeholder: 'Тип привода',
        label: 'Привод:',
        value: this.carApiParams.model_drive,
      },
      {
        name: 'engineCc',
        placeholder: 'Объём двигателя (см3)',
        label: 'Объем двигателя:',
        value: this.carApiParams.model_engine_cc,
      },
      {
        name: 'engineFuel',
        placeholder: 'Тип топлива',
        label: 'Топливо:',
        value: this.carApiParams.model_engine_fuel,
      },
      {
        name: 'lkmMixed',
        placeholder: 'Расход в смешанном цикле',
        label: 'Расход в смешанном цикле:',
        value: this.carApiParams.model_lkm_mixed,
      },
      {
        name: 'body',
        placeholder: 'Тип кузова',
        label: 'Кузов:',
        value: this.carApiParams.model_body,
      },
      {
        name: 'seats',
        placeholder: 'Количество мест',
        label: 'Количество мест:',
        value: this.carApiParams.model_seats,
      },
    ];

    this.createApiCarForm();
    this.onApiCarFormValid.emit(this.apiCarForm);
    /*     this.apiCarForm.valueChanges.subscribe(() => {
      this.onApiCarFormValid.emit(this.apiCarForm);
    }) */
  }
  ngOnDestroy() {
    console.log('onDestroy apiForm');
  }

  createApiCarForm() {
    this.carApiParamsArr.forEach(param => {
      this.carApiFormControlObj[param.name] = [
        param.value,
        Validators.required,
      ];
    });
    this.apiCarForm = this.fb.group(this.carApiFormControlObj);
  }
}
