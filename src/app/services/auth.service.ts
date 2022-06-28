import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, tap } from 'rxjs';
import { User } from '../models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(
    null
  );
  public auth$: ReplaySubject<boolean> = new ReplaySubject(1);
  private token!: string | null;
  public helper = new JwtHelperService();
  public decodedToken: any;

  constructor(private http: HttpClient) {}

  getToken() {
    if (window.localStorage.getItem('userToken')) {
      return window.localStorage.getItem('userToken');
    } else {
      return this.token;
    }
  }

  getUserId() {
    if (window.localStorage.getItem('userToken')) {
      const isTokenExpired = this.helper.isTokenExpired(
        window.localStorage.getItem('userToken')!
      );
      if (!isTokenExpired) {
        this.decodedToken = this.helper.decodeToken(
          window.localStorage.getItem('userToken')!
        );
        return this.decodedToken.userId;
      }
    }
  }

  getAdminStatus() {
    if (window.localStorage.getItem('userToken')) {
      const isTokenExpired = this.helper.isTokenExpired(
        window.localStorage.getItem('userToken')!
      );
      if (!isTokenExpired) {
        this.decodedToken = this.helper.decodeToken(
          window.localStorage.getItem('userToken')!
        );
        return this.decodedToken.isAdmin;
      }
    }
  }

  getModStatus() {
    if (window.localStorage.getItem('userToken')) {
      const isTokenExpired = this.helper.isTokenExpired(
        window.localStorage.getItem('userToken')!
      );
      if (!isTokenExpired) {
        this.decodedToken = this.helper.decodeToken(
          window.localStorage.getItem('userToken')!
        );
        return this.decodedToken.isMod;
      }
    }
  }

  addUser(
    email: string,
    password: string,
    lastName: string,
    firstName: string
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
        token: string;
      }>('http://localhost:3000/api/auth/login', {
        email: email,
        password: password,
      })
      .pipe(
        tap(({ foundUser, token }) => {
          this.token = token;
          window.localStorage.setItem('userToken', this.token);
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
    this.token = '';
    window.localStorage.clear();
    this.auth$.next(false);
  }
}
