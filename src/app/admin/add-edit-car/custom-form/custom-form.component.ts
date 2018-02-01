import {
  Component,
  OnInit,
  Input,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AdminCarService } from '../../shared/services/admin-car.service';
import { CarFormDataService } from '../../shared/services/car-form-data.service';
import { CarFormParam } from '../../shared/models/car-form-param.model';
import { UploadService } from '../../../shared/core/upload.service';
import { Upload } from '../../../shared/models/upload.model';
import * as firebase from 'firebase';
import { Car1 } from '../../../shared/models/car.model';

@Component({
  selector: 'crayf-custom-form',
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.scss'],
})
export class CustomFormComponent implements OnInit {
  @Input() customCar;
  customCarForm: FormGroup;
  previewImageSrc = [];
  imageFileList: File[] = [];
  uploadProgress = [];
  currentUpload: Upload[] = [];
  @Output() onCustomCarFormChange = new EventEmitter<FormGroup>(true);

  constructor(
    private fb: FormBuilder,
    private elementRef: ElementRef,
    private uplService: UploadService,
  ) {}

  ngOnInit() {
    this.createCustomCarForm();
    this.customCarForm.valueChanges.subscribe(() => {
      this.onCustomCarFormChange.emit(this.customCarForm);
    });
    if (this.customCar) {
      this.customCarForm.patchValue(this.customCar);
      this.customCar.images.forEach(image => {
        this.previewImageSrc.push(image.url);
      });
    }
  }

  createCustomCarForm() {
    this.customCarForm = this.fb.group({
      isAirConditioning: [false],
      isSale: [false],
      saleAmount: [null],
      rentPrice: this.fb.array([]),
      images: this.fb.array([]),
      fileImages: this.fb.array([]),
      additionalInfo: [null],
    });
    this.getDefaultRentPrice();
  }

  // Create RentPrice FormArray
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
  addImageFormArrayElem(file: File) {
    const control = <FormArray>this.customCarForm.controls['fileImages'];
    control.push(
      this.fb.group({
        file,
        isDefault: false,
      }),
    );
  }

  onImagesAdd(event) {
    const files: Array<File> = Array.prototype.slice.call(event.target.files);
    files.forEach((file: File) => {
      this.addImageToPreview(file);
      this.addImageFormArrayElem(file);
    });
  }
  addImageToPreview(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.previewImageSrc.push(reader.result);
    };
  }
  deleteImage(i) {
    this.previewImageSrc.splice(i, 1);
    const control = <FormArray>this.customCarForm.controls['fileImages'];
    control.removeAt(i);
  }
  setAsDefaultImage(currentIndex) {
    this.previewImageSrc.forEach((src, i) => {
      const previewImagesElem = this.elementRef.nativeElement.querySelectorAll(
        '.car-images__img',
      );
      const control = <FormArray>this.customCarForm.controls['fileImages'];
      const isDefault = control.controls[i].get('isDefault').value;
      if (i === currentIndex) {
        control.controls[i].get('isDefault').setValue(!isDefault);
        // previewImagesElem[i].classList.toggle('default');
        return;
      }
      control.controls[i].get('isDefault').setValue(false);
    });
  }
}
