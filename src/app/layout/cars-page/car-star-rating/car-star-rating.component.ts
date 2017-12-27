import { Component, OnInit, Input } from '@angular/core';
import { CarStarRatingService } from '../../../shared/services/car-star-rating.service';
import { AuthService } from '../../../shared/core/auth.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'crayf-car-star-rating',
  templateUrl: './car-star-rating.component.html',
  styleUrls: ['./car-star-rating.component.scss']
})
export class CarStarRatingComponent implements OnInit {
  avgRating;
  votes;
  constructor(
    private carRatingService: CarStarRatingService,
    private authService: AuthService
  ) { }

  @Input() carId: string;


  ngOnInit() {
    this.carRatingService
      .getAvgCarRating(this.carId)
      .subscribe(obj => {
        this.avgRating = obj.avgRating;
        this.votes = obj.votes;
      });
  }

  get userId() {
    return this.authService.userId;
  }

  starHandler(value) {
    this.carRatingService.setStar(this.userId, this.carId, value);
  }

}
