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
  imageList: File[] = [];
  uploadProgress = [];
  currentUpload: Upload[] = [];
  @Output() onCustomFormFilled = new EventEmitter<FormGroup>(true);

  constructor(
    private fb: FormBuilder,
    private elementRef: ElementRef,
    private uplService: UploadService,
  ) {}

  ngOnInit() {
    this.createCustomCarForm();
    this.customCarForm.valueChanges.subscribe(() => {
      this.onCustomFormFilled.emit(this.customCarForm);
    });
    if (this.customCar) {
      this.customCarForm.patchValue(this.customCar);
    }
  }

  createCustomCarForm() {
    this.customCarForm = this.fb.group({
      isNew: [true],
      isAirConditioning: [false],
      isSale: [false],
      saleAmount: [null],
      rentPrice: this.fb.array([]),
      images: this.fb.array([]),
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

  onImagesAdd(event) {
    const files: Array<File> = Array.prototype.slice.call(event.target.files);
    files.forEach((file: File) => {
      this.addImageToPreview(file);
      this.addImageToFormArray(file);

      this.imageList.push(file);
    });
  }
  addImageToPreview(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.previewImageSrc.push(reader.result);
    };
  }
  addImageToFormArray(file) {
    const name = file.name;
  }
  deleteImage(i) {
    this.previewImageSrc.splice(i, 1);
  }
  setAsDefaultImage(currentIndex) {
    this.previewImageSrc.forEach((src, i) => {
      const previewImagesElem = this.elementRef.nativeElement.querySelectorAll(
        '.car-images__img',
      );
      if (i === currentIndex) {
        previewImagesElem[i].classList.toggle('default');
        return;
      }
      previewImagesElem[i].classList.remove('default');
    });
  }
  onAddToStore() {
    this.imageList.forEach((file: File, index) => {
      // console.log(file);
      this.currentUpload[index] = new Upload(file);
      // console.log(upload);

      this.uplService
        .pushUpload('/cars', this.currentUpload[index])
        .subscribe((snapshot: firebase.storage.UploadTaskSnapshot) => {
          this.currentUpload[index].url = snapshot.downloadURL;
          console.log(this.currentUpload[index]);
        });
    });
  }
}
