import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private firebaseAuth: AngularFireAuth) {}

  async login(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    return await this.firebaseAuth.auth.signInWithEmailAndPassword(
      email,
      password
    );
  }

  async logout(): Promise<void> {
    return await this.firebaseAuth.auth.signOut();
  }

  async isAuthenticated(): Promise<boolean> {
    const state = await this.firebaseAuth.authState.pipe(take(1)).toPromise();

    return state ? true : false;
  }

  async resetPassword(email: string): Promise<void> {
    return await this.firebaseAuth.auth.sendPasswordResetEmail(email);
  }
}
