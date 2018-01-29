import { Injectable } from '@angular/core';
import { FirebaseApiService } from './firebase-api.service';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { Upload } from '../models/upload.model';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UploadService {
  constructor(private fbs: FirebaseApiService) {}
  uploads: AngularFirestoreCollection<Upload[]>;
  pushUpload(basePath: string, upload: Upload) {
    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef
      .child(`${basePath}/${upload.name}`)
      .put(upload.file);
    // return Observable.fromPromise(uploadTask);

    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: firebase.storage.UploadTaskSnapshot) => {
        // upload in progress
        upload.progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
        // console.log(upload.progress);
      },
      /* error => {
        // upload failed
        console.log(error);
      },
      () => {
        // upload success
        upload.url = uploadTask.snapshot.downloadURL;
        upload.name = upload.file.name;
        // this.saveFileData(upload);
        // console.log(upload);
      }, */
    );
    return Observable.fromPromise(uploadTask);
  }
}
