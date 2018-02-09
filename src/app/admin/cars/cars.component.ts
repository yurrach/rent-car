import { Component, OnInit } from '@angular/core';
import { AdminCarService } from '../shared/services/admin-car.service';
import { Car1 } from '../../shared/models/car.model';

@Component({
  selector: 'crayf-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss'],
})
export class CarsComponent implements OnInit {
  carsList: Car1[];
  constructor(private adminCarService: AdminCarService) {}

  ngOnInit() {
    this.adminCarService.getCars$().subscribe((cars: [Car1]) => {
      this.carsList = cars;
    });
  }
  deleteCar(car: Car1) {
    this.adminCarService.deleteCar(car);
  }
}
