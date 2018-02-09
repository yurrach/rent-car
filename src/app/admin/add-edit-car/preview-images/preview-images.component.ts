import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { CarImage } from '../../../shared/models/car-image';

@Component({
  selector: 'crayf-preview-images',
  templateUrl: './preview-images.component.html',
  styleUrls: ['./preview-images.component.scss'],
})
export class PreviewImagesComponent implements OnInit {
  @Input() carImgList: [CarImage];
  constructor(private elementRef: ElementRef) {}
  carImg: [any];

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    this.carImgList.forEach(img => {
      if (img.file) {
        this.transformToDataUrl(img);
      }
    });
  }
  ngAfterViewInit() {
    this.carImgList.forEach(img => {
      if (img.isDefault) {
        const elem: HTMLImageElement = this.elementRef.nativeElement.querySelector(
          "[src='" + img.src + "']",
        );
        elem.classList.add('default');
      }
    });
  }

  deleteImage(img: CarImage) {
    const ind = this.carImgList.indexOf(img);
    this.carImgList.splice(ind, 1);
  }
  setDefaultImage(targetImage: CarImage) {
    this.carImgList.forEach(img => {
      const elem: HTMLImageElement = this.elementRef.nativeElement.querySelector(
        "[src='" + img.src + "']",
      );
      if (targetImage.src === img.src) {
        elem.classList.add('default');
        img.isDefault = true;
        return;
      }
      elem.classList.remove('default');
      img.isDefault = false;
    });
  }

  transformToDataUrl(img: CarImage) {
    const index = this.carImgList.indexOf(img);
    const reader = new FileReader();
    reader.readAsDataURL(img.file);
    reader.onload = () => {
      this.carImgList[index].src = reader.result;
    };
  }
}