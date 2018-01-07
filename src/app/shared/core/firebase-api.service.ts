import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FirebaseApiService {
  constructor(public afs: AngularFirestore) {}

  // tslint:disable-next-line:max-line-length
  public getCollectionRef<T>(
    path: string,
    orderName: string,
    orderDirection?: firebase.firestore.OrderByDirection,
  ): AngularFirestoreCollection<T> {
    return this.afs.collection(path, ref =>
      ref.orderBy(orderName, orderDirection),
    );
  }

  public getCollection$<T>(
    path: string,
    orderName: string,
    orderDirection = 'asc' as any,
  ): Observable<T[]> {
    const collection = this.getCollectionRef(path, orderName, orderDirection);
    return collection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data: T = a.payload.doc.data() as T;
        data['id'] = a.payload.doc.id;
        return data;
      });
    });
  }

  public getDocRef<T>(path: string, data: T): AngularFirestoreDocument<T> {
    return this.afs.doc(`${path}/${data['uid']}`);
  }

  public getDocById$<T>(path: string, id: string): Observable<T> {
    return this.afs
      .doc(`${path}/${id}`)
      .snapshotChanges()
      .map(changes => {
        const data: T = changes.payload.data() as T;
        data['id'] = changes.payload.id;
        return data;
      });
  }

  public createDoc<T>(
    path: string,
    orderName: string,
    orderDirection,
    data: T,
  ) {
    return this.getCollectionRef(path, orderName, orderDirection).add(data);
  }

  public updateDoc<T>(path: string, data: T) {
    return this.getDocRef(path, data).set(data as T, { merge: true });
  }
  public deleteDoc<T>(path: string, data: T) {
    return this.getDocRef(path, data).delete();
  }

  public whereSearchInCollection<T>(path, searchParam, sign, currentParam) {
    return this.afs.collection<T>(path, ref =>
      ref.where(searchParam, sign, currentParam),
    );
  }
}
