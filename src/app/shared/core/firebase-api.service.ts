import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  QueryFn,
} from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FirebaseApiService {
  constructor(public afs: AngularFirestore) {}

  // old version
  /*   public getCollectionRef1<T>(
    path: string,
    orderName: string,
    orderDirection?: firebase.firestore.OrderByDirection,
  ): AngularFirestoreCollection<T> {
    return this.afs.collection(path, ref =>
      ref.orderBy(orderName, orderDirection || 'desc'),
    );
  } */
  //new ver
  public getCollectionRef<T>(
    path: string,
    queryFn: QueryFn,
  ): AngularFirestoreCollection<T> {
    return this.afs.collection(path, queryFn);
  }
  // old
  /*   public getCollection$1<T>(
    path: string,
    orderName: string,
    orderDirection = 'asc' as any,
  ): Observable<T[]> {
    const collection = this.getCollectionRef1(path, orderName, orderDirection);
    return collection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data: T = a.payload.doc.data() as T;
        data['id'] = a.payload.doc.id;
        return data;
      });
    });
  } */
  //new
  public getCollection$<T>(path: string, queryFn: QueryFn): Observable<T[]> {
    return this.getCollectionRef(path, queryFn)
      .snapshotChanges()
      .map(changes => {
        return changes.map(a => {
          const data: T = a.payload.doc.data() as T;
          data['id'] = a.payload.doc.id;
          return data;
        });
      });
  }
  /* public getCollectionRef<T>(
    path: string,
    orderName: string,
    orderDirection?: firebase.firestore.OrderByDirection,
  ): AngularFirestoreCollection<T> {
    return this.afs.collection(path, ref =>
      ref.orderBy(orderName, orderDirection || 'desc'),
    );
  }
  public getCollectionRef1<T>(
    path: string,
    queryFn: QueryFn,
  ): AngularFirestoreCollection<T> {
    return this.afs.collection(path, queryFn);
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
  public getCollection1$<T>(path: string, queryFn: QueryFn): Observable<T[]> {
    return this.getCollectionRef1(path, queryFn)
      .snapshotChanges()
      .map(changes => {
        return changes.map(a => {
          const data: T = a.payload.doc.data() as T;
          data['id'] = a.payload.doc.id;
          return data;
        });
      });
  } */

  public getDocRef<T>(path: string, data: T): AngularFirestoreDocument<T> {
    return this.afs.doc(`${path}/${data['uid'] || data['id']}`);
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
  // old
  /*   public createDoc1<T>(
    path: string,
    orderName: string,
    orderDirection,
    data: T,
  ) {
    return this.getCollectionRef1(path, orderName, orderDirection).add(data);
  } */
  // new
  public createDoc<T>(path: string, data: T, queryFn: QueryFn) {
    const doc$ = Observable.fromPromise(
      this.getCollectionRef(path, queryFn).add(data),
    );
    return doc$;
  }
  public createDoc1<T>(path: string, data: T, queryFn: QueryFn) {
    const doc$ = Observable.fromPromise(
      this.getCollectionRef(path, queryFn).add(data),
    );
    return this.getCollectionRef(path, queryFn).add(data);
  }
  /*   public createDoc<T>(
    path: string,
    orderName: string,
    orderDirection,
    data: T,
  ) {
    return this.getCollectionRef(path, orderName, orderDirection).add(data);
  }
  public createDoc1<T>(path: string, queryFn: QueryFn, data: T) {
    return this.getCollectionRef1(path, queryFn).add(data);
  } */

  public updateDoc<T>(path: string, data: T, options?) {
    return this.getDocRef(path, data).set(
      data as T,
      options || { merge: true },
    );
  }
  public deleteDoc<T>(path: string, data: T) {
    return this.getDocRef(path, data).delete();
  }

  queryFn(fn, args) {
    return (ref: firebase.firestore.CollectionReference) => {
      return ref[fn](...args);
    };
  }
}
