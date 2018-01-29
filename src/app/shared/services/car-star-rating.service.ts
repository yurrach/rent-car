import { Injectable } from '@angular/core';
import { FirebaseApiService } from '../core/firebase-api.service';
import { CarStar } from '../models/car-star.model';
import * as firebase from 'firebase/app';

@Injectable()
export class CarStarRatingService {
  constructor(private fbs: FirebaseApiService) {}

  getUserStars(userId) {
    /*     function userQueryFn(ref: firebase.firestore.CollectionReference) {
      return ref.where('userId', '==', userId);
    } */
    const queryFn = this.fbs.queryFn('where', ['userId', '==', userId]);
    const starsRef = this.fbs.getCollectionRef('car-stars', queryFn);
    return starsRef.valueChanges();
  }

  getCarStars(carId) {
    const starsRef = this.fbs.getCollectionRef(
      'car-stars',
      this.carIdQueryFn(carId),
    );
    return starsRef.valueChanges();
  }
  carIdQueryFn(carId) {
    return (ref: firebase.firestore.CollectionReference) => {
      return ref.where('carId', '==', carId);
    };
  }

  setStar(userId, carId, value) {
    const star: CarStar = { userId, carId, value };
    star['id'] = `${star.userId}_${star.carId}`;
    return this.fbs.updateDoc('car-stars', star);
  }

  getAvgCarRating(carId: string) {
    return this.getCarStars(carId).map((stars: CarStar[]) => {
      const ratings = stars.map((star: CarStar) => star.value);
      const avgRating = ratings.length
        ? ratings.reduce((total, val) => total + val) / stars.length
        : 'not reviewed';
      const votes = ratings.length ? ratings.length : null;
      return {
        avgRating,
        votes,
      };
    });
  }
}
