import { Component, OnInit } from '@angular/core';
import { CarsService } from '../../shared/services/cars.service';
import { Car } from '../../shared/models/car.model';

@Component({
  selector: 'crayf-cars-page',
  templateUrl: './cars-page.component.html',
  styleUrls: ['./cars-page.component.scss']
})
export class CarsPageComponent implements OnInit {
  carsList: Car[];
  isLoader = true;

  constructor(private carsService: CarsService) { }

  ngOnInit() {
    console.log(this.isLoader);
    this.carsService.getCars$()
      .subscribe(cars => this.carsList = cars);
  }


}
