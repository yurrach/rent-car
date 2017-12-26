import { Component, OnInit } from '@angular/core';
import { CarsService } from '../../../shared/services/cars.service';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/mergeMap';
import { Car } from '../../../shared/models/car.model';

@Component({
  selector: 'crayf-car-item-details',
  templateUrl: './car-item-details.component.html',
  styleUrls: ['./car-item-details.component.scss']
})
export class CarItemDetailsComponent implements OnInit {

  car: Car;

  constructor(
    private carsService: CarsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.mergeMap((params: Params) => {
      const id = params['id'];
      return this.carsService.getCarById$(id);
    }).subscribe((car: Car) => this.car = car);
  }

}
