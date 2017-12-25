import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FirebaseApiService {

  constructor(public afs: AngularFirestore) { }

  public getCollectionRef<T>(path: string, orderName: string, orderDirection): AngularFirestoreCollection<T> {
    return this.afs.collection(path, ref => ref.orderBy(orderName, orderDirection));
  }

  public getCollection$<T>(path: string, orderName: string, orderDirection): Observable<T[]> {
    const collection = this.getCollectionRef(path, orderName, orderDirection);
    return collection.snapshotChanges()
      .map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data();
          data.id = a.payload.doc.id;
          return data as T;
        });
      });
  }

  public getDocRef<T>(path: string, data: any): AngularFirestoreDocument<T> {
    return this.afs.doc(`${path}/${data.id}`);
  }

  public getDocById$<T>(path: string, id: any): Observable<T> {
    return this.afs.doc(`${path}/${id}`).snapshotChanges()
      .map(changes => {
        const data = changes.payload.data();
        data.id = changes.payload.id;
        return data as T;
      });
  }

  public createDoc(path: string, orderName: string, orderDirection, data: any) {
    return this.getCollectionRef(path, orderName, orderDirection).add(data);
  }

  public updateDoc<T>(path: string, data: T) {
    return this.getDocRef(path, data).set(data as T);
  }
  public deleteDoc<T>(path: string, data: T) {
    return this.getDocRef(path, data).delete();
  }

}

