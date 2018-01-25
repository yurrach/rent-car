import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AdminCarService } from '../../shared/services/admin-car.service';
import { CarFormDataService } from '../../shared/services/car-form-data.service';
import { CarFormParam } from '../../shared/models/car-form-param.model';

@Component({
  selector: 'crayf-custom-form',
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.scss'],
})
export class CustomFormComponent implements OnInit {
  customCarForm: FormGroup;
  customCarFormParams: Array<CarFormParam>;
  previewImageSrc = [];

  constructor(
    private fb: FormBuilder,
    private adminCarService: AdminCarService,
    private carFormDataService: CarFormDataService,
  ) {}

  ngOnInit() {
    this.customCarFormParams = this.carFormDataService.customCarFormParams;
    this.createCustomCarForm();
  }

  createCustomCarForm() {
    const customConfig = this.carFormDataService.getFormControlConfig(
      this.customCarFormParams,
    );
    this.customCarForm = this.fb.group({
      isNew: [true],
      isAirConditioning: [false],
      isSale: [false],
      saleAmount: [null],
      rentPrice: this.fb.array([]),
      additionalInfo: [null],
    });
    this.getDefaultRentPrice();
  }
  initRentPriceRow(duration?, price?) {
    return this.fb.group({
      duration: duration || null,
      price: price || null,
    });
  }
  getDefaultRentPrice() {
    const defaultPrice = [
      {
        duration: '1-2 суток',
        price: '60.0 р.',
      },
      {
        duration: '3-5 суток',
        price: '56.0 р.',
      },
      {
        duration: '6-10 суток',
        price: '50.0 р.',
      },
      {
        duration: '11 и более суток',
        price: '44.0 р.',
      },
    ];
    defaultPrice.forEach(row => {
      const control = <FormArray>this.customCarForm.controls['rentPrice'];
      control.push(this.initRentPriceRow(row.duration, row.price));
    });
  }
  deleteRentPriceRow(i) {
    const control = <FormArray>this.customCarForm.controls['rentPrice'];
    control.removeAt(i);
  }
  addNewRentPriceRow(i) {
    const control = <FormArray>this.customCarForm.controls['rentPrice'];
    control.insert(i, this.initRentPriceRow());
  }
  onFileAdd(event) {
    const files: Array<File> = Array.prototype.slice.call(event.target.files);
    files.forEach((file: File) => {
      this.addFileToPreview(file);
    });
  }
  addFileToPreview(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.previewImageSrc.push(reader.result);
    };
  }
  deleteImage(i) {
    this.previewImageSrc.splice(i, 1);
  }
  setAsDefault(event) {
    this.previewImageSrc.forEach((src, i) => {
      event.target.parentNode.parentNode.children[
        i
      ].children[0].classList.remove('default');
    });
    console.log(event);
    event.target.parentNode.children[0].classList.add('default');
  }
}
