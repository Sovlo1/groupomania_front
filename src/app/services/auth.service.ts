import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth$ = new BehaviorSubject<boolean>(false);
  private token!: string;
  private userId!: string;
  private isMod!: boolean;
  private isAdmin!: boolean;

  constructor(private http: HttpClient) {}

  getToken() {
    console.log(this.token);
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
          this.auth$.next(true);
        })
      );
  }

  logout() {
    this.userId = '';
    this.token = '';
    this.isAdmin = false;
    this.isMod = false;
    this.auth$.next(false);
  }
}
