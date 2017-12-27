import { Injectable } from '@angular/core';
import { FirebaseApiService } from '../core/firebase-api.service';
import { CarStar } from '../models/car-star.model';

@Injectable()
export class CarStarRatingService {

  constructor(private fbs: FirebaseApiService) { }

  getUserStars(userId) {
    const starsRef = this.fbs.whereSearchInCollection('car-stars', 'userId', '==', userId);
    return starsRef.valueChanges();
  }

  getCarStars(carId) {
    const starsRef = this.fbs.whereSearchInCollection('car-stars', 'carId', '==', carId);
    return starsRef.valueChanges();
  }

  setStar(userId, carId, value) {
    const star: CarStar = { userId, carId, value };
    star['id'] = `${star.userId}_${star.carId}`;
    return this.fbs.updateDoc('car-stars', star);
  }

  getAvgCarRating(carId: string) {
    return this.getCarStars(carId).map((stars: CarStar[]) => {
      const ratings = stars.map((star: CarStar) => star.value);
      const avgRating = ratings.length ? ratings.reduce((total, val) => total + val) / stars.length : 'not reviewed';
      const votes = ratings.length ? ratings.length : null;
      return {
        avgRating,
        votes
      };
    });
  }

}
