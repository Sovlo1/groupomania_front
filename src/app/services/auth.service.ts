import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(
    null
  );
  public auth$ = new BehaviorSubject<boolean>(false);
  private token!: string | null;
  private userId!: string;
  private isMod!: boolean;
  private isAdmin!: boolean;

  constructor(private http: HttpClient) {}

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
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
        userId: string;
        token: string;
        isAdmin: boolean;
        isMod: boolean;
      }>('http://localhost:3000/api/auth/login', {
        email: email,
        password: password,
      })
      .pipe(
        tap(({ userId, token, isAdmin, isMod }) => {
          this.userId = userId;
          this.token = token;
          this.isAdmin = isAdmin;
          this.isMod = isMod;
          window.localStorage.setItem('userToken', this.token);
          this.auth$.next(true);
        })
      );
  }

  fetchCurrentUser(token: string | null) {
    return this.http
      .post<User>(`http://localhost:3000/api/auth/loggeduser`, { token: token })
      .pipe(
        tap((user: User) => {
          if (user) {
            this.auth$.next(true);
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
