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

  public getCollectionRef<T>(
    path: string,
    queryFn: QueryFn,
  ): AngularFirestoreCollection<T> {
    return this.afs.collection(path, queryFn);
  }
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

  public createDoc<T>(path: string, data: T, queryFn: QueryFn) {
    const doc$ = Observable.fromPromise(
      this.getCollectionRef(path, queryFn).add(data),
    );
    return doc$;
  }
  public createEmptyDoc(path: string, queryFn: QueryFn) {
    return this.getCollectionRef(path, queryFn).doc(null);
  }
  public createDoc1<T>(path: string, data: T, queryFn: QueryFn) {
    const doc$ = Observable.fromPromise(
      this.getCollectionRef(path, queryFn).add(data),
    );
    return this.getCollectionRef(path, queryFn).add(data);
  }

  public updateDoc<T>(path: string, data: T) {
    return this.getDocRef(path, data).set(data as T);
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
