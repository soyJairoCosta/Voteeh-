import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class AuthProvider {

  constructor() {
  }
  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }
  signupUser(email: string, password: string, name: string, surname: string): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(newUser => {
        firebase
          .database()
          .ref(`/users/`+this.correctedEmail(email)+`/`)
          .set({
            id: newUser.uid,
            name: name,
            surname: surname,
            email: email,
            voteFollowed : {},
            voteCreated: {}
          });
      })
      .catch(error => console.error(error));
  }
  correctedEmail(email:string): string{
    return email.replace(".", "-").toLowerCase();
  }

  logoutUser(): Promise<void> {
    const emailOff: string = this.correctedEmail(firebase.auth().currentUser.email);
    firebase
      .database()
      .ref(`/users/${emailOff}`)
      .off();
    return firebase.auth().signOut();
  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }


}
