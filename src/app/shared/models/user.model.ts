export class User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
  roles?: {
    admin?: boolean,
    editor?: boolean,
    subscriber?: boolean
  };
}
