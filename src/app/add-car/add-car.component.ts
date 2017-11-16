import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CarApiService } from '../shared/services/car-api.service';
import { CarParam } from '../shared/models/car-param';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss']
})
export class AddCarComponent implements OnInit {

  currentCar: any;
  arrObj: any;
  carParams: CarParam[] = [
    new CarParam('year', ''),
    new CarParam('make', 'make_display'),
    new CarParam('model', 'model_name'),
    new CarParam('trim', 'model_trim'),
  ];

  myForm: FormGroup;
    year: FormControl;
    make: FormControl;
    model: FormControl;
    trim: FormControl;


  constructor(private fb: FormBuilder, private carApi: CarApiService) { }


  ngOnInit() {
    this.createFormGroup();
    this.getYears(12);
    this.myForm.valueChanges.subscribe(val => console.log(val));
  }


  createFormGroup() {
    this.myForm = this.fb.group({
      year: ['', Validators.required],
      make: ['', Validators.required],
      model: ['', Validators.required],
      trim: ['', Validators.required]
    });
  }
  isValid(control) {
    return {
      'is-valid': this.myForm.get(control).valid && this.myForm.get(control).dirty,
      'is-invalid': this.myForm.get(control).invalid && this.myForm.get(control).touched
    };
  }

  getYears(length) {
    const maxYear = (new Date()).getFullYear();
    const minYear = maxYear - length;
    for (let i = minYear; i <= maxYear; i++) {
      this.carParams[0].list.push(i);
    }
  }


  getNextList({ name }, i) {


    if (this.myForm.get(name).valid && (i + 1) < this.carParams.length) {
      const params = {
        cmd: this.carParams[i + 1].cmd,
        year: this.myForm.get('year').value,
        make: this.myForm.get('make').value,
        model: this.myForm.get('model').value
      };
      this.carApi.getList(params).subscribe(obj => {
        const queryName = this.carParams[i + 1].queryName;
        this.arrObj = obj[Object.keys(obj)[0]];
        this.carParams[i + 1].list = this.arrObj.map((v) => v[queryName]);
        this.currentCar = {};
      });
    } else {
      this.currentCar = this.arrObj.find((item) => item['model_trim'] === this.myForm.get('trim').value);
    }

    this.carParams.forEach((item, j) => {
      if (j > i && this.myForm.get(item.name).value !== '') {
        this.myForm.get(item.name).reset('');
        item.list = [];
      }
    });
  }

}


