import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(
    null
  );
  public auth$: ReplaySubject<boolean> = new ReplaySubject(1);
  private token!: string | null;
  private userId!: string;
  private isMod!: boolean;
  private isAdmin!: boolean;

  constructor(private http: HttpClient) {}

  getToken() {
    if (window.localStorage.getItem('userToken')) {
      return window.localStorage.getItem('userToken');
    } else {
      return this.token;
    }
  }

  getUserId() {
    if (window.localStorage.getItem('userId')) {
      return window.localStorage.getItem('userId');
    } else {
      return this.userId;
    }
  }

  getAdminStatus() {
    return this.isAdmin;
  }

  getModStatus() {
    return this.isMod;
  }

  addUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    return this.http.post<{ message: string }>(
      'http://localhost:3000/api/auth/signup',
      {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      }
    );
  }

  logUser(email: string, password: string) {
    return this.http
      .post<{
        foundUser: User;
        userId: string;
        token: string;
        isAdmin: boolean;
        isMod: boolean;
      }>('http://localhost:3000/api/auth/login', {
        email: email,
        password: password,
      })
      .pipe(
        tap(({ foundUser, userId, token, isAdmin, isMod }) => {
          console.log(foundUser);
          this.userId = userId;
          this.token = token;
          this.isAdmin = isAdmin;
          this.isMod = isMod;
          window.localStorage.setItem('userToken', this.token);
          window.localStorage.setItem('userId', this.userId);
          this.user$.next(foundUser);
          this.auth$.next(true);
        })
      );
  }

  fetchCurrentUser(token: string | null) {
    return this.http
      .post<User>(`http://localhost:3000/api/auth/loggeduser`, { token: token })
      .pipe(
        tap((user: User) => {
          console.log(user);
          this.user$.next(user);
          if (user) {
            this.auth$.next(true);
          } else {
            this.auth$.next(false);
          }
        })
      );
  }

  logout() {
    this.userId = '';
    this.token = '';
    this.isAdmin = false;
    this.isMod = false;
    window.localStorage.clear();
    this.auth$.next(false);
  }
}
