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
  @Input() carImgSrcList: [CarImage];
  @Output() onDeleteImage = new EventEmitter<CarImage>();
  @Output() onSetDefaultImg = new EventEmitter<CarImage>();
  constructor(private elementRef: ElementRef) {}
  carImg: [any];

  ngOnInit() {
    // console.log('ngOnInit', this.carImgFiles);
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges', this.carImgSrcList);
    // console.log(changes.carImgFiles);
  }

  deleteImage(img: CarImage) {
    this.onDeleteImage.emit(img);
  }
  setDefaultImage(targetImage: CarImage) {
    console.log('seta as default', targetImage.name);

    this.carImgSrcList.forEach(img => {
      const elem: HTMLImageElement = this.elementRef.nativeElement.querySelector(
        "[src='" + img.src + "']",
      );
      if (targetImage.src === img.src) {
        elem.classList.add('default');
        return;
      }
      elem.classList.remove('default');
    });

    this.onSetDefaultImg.emit(targetImage);
  }
}
