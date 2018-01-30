import { Component, OnInit, Input } from '@angular/core';
import { Car1 } from '../../../shared/models/car.model';

@Component({
  selector: 'crayf-cars-list',
  templateUrl: './cars-list.component.html',
  styleUrls: ['./cars-list.component.scss'],
})
export class CarsListComponent implements OnInit {
  constructor() {}

  @Input() carsList: Car1[];

  ngOnInit() {}
}
