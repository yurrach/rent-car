import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AdminCarService } from '../shared/services/admin-car.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'crayf-add-edit-car',
  templateUrl: './add-edit-car.component.html',
  styleUrls: ['./add-edit-car.component.scss']
})
export class AddEditCarComponent implements OnInit {

  carForm: FormGroup;
  carImages: FormArray;
  yearsList: number[];
  makesList$: Observable<string[]>;
  modelsList$: Observable<string[]>;
  trimsList$: Observable<string[]>;
  isTrimSelected = false;
  optionsListObj = {
    year: this.yearsList,
    make: this.makesList$,
    model: this.modelsList$,
    trim: this.trimsList$
  };

  constructor(
    private fb: FormBuilder,
    private adminCarService: AdminCarService
  ) { }

  ngOnInit() {
    this.yearsList = this.getYearsList(2000);
    this.createCarForm();
  }
  isInvalid(name) {
    const control = this.carForm.controls[name];
    return control.touched && control.invalid;
   }
  resetForm(ctrlArr, index) {
    const resetValue = {};
    ctrlArr.forEach((ctrl, i) => {
      if (i <= index) {
        resetValue[ctrl] = this.carForm.controls[ctrl].value;
      }
    })
    this.carForm.reset(resetValue);
  }

  resetOptionsList(index) {
    const optArr = Object.keys(this.optionsListObj);
    optArr.forEach((opt, i) => {
      if (i > index) {
        this[`${opt}sList$`] = Observable.of(null);
      }
    })
  }

  onControlChange({ name }) {
    const ctrlArr = Object.keys(this.carForm.controls);
    const index = ctrlArr.indexOf(name);
    if (name === 'trim') {
      return;
    }
    if (this.carForm.controls[ctrlArr[index + 1]].value) {
      this.resetForm(ctrlArr, index);
      this.resetOptionsList(index);
    }
    if (this.carForm.controls[name].valid) {
      
      const listName = {
        year: 'make_display',
        make: 'model_name',
        model: 'model_trim',
      };
      const observableListName = ctrlArr[index + 1] + 'sList$';
      this[observableListName] = this.getListFromApi(listName[name]);
    }
    }

  onSubmit() {

  }
  getYearsList(startYear): number[] {
    const yearsList = [];
    const endYear = (new Date()).getFullYear();
    for (let i = startYear; i <= endYear; i++) {
      yearsList.push(i);
    }
    return yearsList;
  }
  
/*   getMakesList() {
    const listName = 'make_display';
    this.makesList$ = this.getListFromApi(listName);
  }
  getModelsList() {
    const listName = 'model_name';
    this.modelsList$ = this.getListFromApi(listName);
  }
  getTrimsList() {
    const listName = 'model_trim';
    this.trimsList$ = this.getListFromApi(listName);
  } */

  getListFromApi(listName) {
    return this.adminCarService.getCarParamsList$(this.carForm.value, listName);
  }

  createCarForm() {
    this.carForm = this.fb.group({
      year: ['', Validators.required],
      make: ['', Validators.required],
      model: ['', Validators.required],
      trim: ['', Validators.required],
      isSale: [null],
      carImages: this.fb.array([this.fb.control(null)])
    });
    this.carImages = this.carForm.get('carImages') as FormArray;
  }

}
