import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'crayf-preview-images',
  templateUrl: './preview-images.component.html',
  styleUrls: ['./preview-images.component.scss'],
})
export class PreviewImagesComponent implements OnInit {
  @Input() carImgFiles: [{ url: string; name: string }];
  @Output() onDeleteImage = new EventEmitter<number>();
  constructor() {}
  carImg: [any];

  ngOnInit() {
    // console.log('ngOnInit', this.carImgFiles);
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges', this.carImgFiles);
    // console.log(changes.carImgFiles);
  }

  deleteImage(i: number) {
    this.onDeleteImage.emit(i);
  }
  setDefaultImage(i) {}
}
