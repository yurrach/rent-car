import { Component, OnInit, Input } from '@angular/core';
import { Car } from '../../../shared/models/car.model';

@Component({
  selector: 'crayf-car-item',
  templateUrl: './car-item.component.html',
  styleUrls: ['./car-item.component.scss']
})
export class CarItemComponent implements OnInit {

  constructor() { }

  @Input() carItem: Car;

  ngOnInit() {
  }

}
