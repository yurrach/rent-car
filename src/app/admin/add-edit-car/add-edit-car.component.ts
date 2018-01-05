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
    

    if (this.carForm.controls[ctrlArr[index + 1]].value) {
      this.resetForm(ctrlArr, index);
      this.resetOptionsList(index);

    }
    if (name === 'trim') {
      return;
    }
    const listName = {
      year: 'make_display',
      make: 'model_name',
      model: 'model_trim',
    };
    const observableListName = ctrlArr[index + 1] + 'sList$';
    this[observableListName] = this.getListFromApi(listName[name]);
  }

  onSubmit() {

  }

  onYearChange() {
    if (this.carForm.controls.make.value) {
      // this.carForm.reset({ year: this.carForm.controls.year.value });
      // this.makesList$ = Observable.of(null);
      // this.modelsList$ = Observable.of(null);
      // this.trimsList$ = Observable.of(null);
      
    }
    // this.getMakesList();
  }
  onMakeChange() {
    if (this.carForm.controls.model.value) {
      // this.modelsList$ = Observable.of(null);
      // this.trimsList$ = Observable.of(null);
/*       this.carForm.reset({
        year: this.carForm.controls.year.value,
        make: this.carForm.controls.make.value
      }); */

    }
    // this.getModelsList();
  }
  onModelChange() {
    if (this.carForm.controls.trim.value) {
      // this.trimsList$ = Observable.of(null);

    }

  }

  onTrimChange() {

      // this.carForm.reset({
      //   year: this.carForm.controls.year.value,
      //   make: this.carForm.controls.make.value,
      //   model: this.carForm.controls.model.value,
      //   trim: this.carForm.controls.trim.value
      // });
      this.isTrimSelected = true;

  }

  getYearsList(startYear): number[] {
    const yearsList = [];
    const endYear = (new Date()).getFullYear();
    for (let i = startYear; i <= endYear; i++) {
      yearsList.push(i);
    }
    return yearsList;
  }
  
  getMakesList() {
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
  }
  getListFromApi(listName) {
    return this.adminCarService.getCarParamsList$(this.carForm.value, listName);
  }

  createCarForm() {
    this.carForm = this.fb.group({
      year: [null, Validators.required],
      make: [null, Validators.required],
      model: [null, Validators.required],
      trim: [null, Validators.required],
      isSale: [null],
      carImages: this.fb.array([this.fb.control(null)])
    });
    this.carImages = this.carForm.get('carImages') as FormArray;
  }

}
