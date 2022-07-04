import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, Subject, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  users$ = new Subject<User>();
  loggedUser$ = new ReplaySubject<User>(1);

  constructor(private http: HttpClient) {}

  getUserInfos(id: string) {
    return this.http
      .get<User>('http://localhost:3000/api/auth/about/' + id)
      .pipe(
        tap((user: User) => {
          this.users$.next(user);
        })
      );
  }

  getLoggedUserInfos(id: string) {
    return this.http
      .get<User>('http://localhost:3000/api/auth/about/' + id)
      .pipe(
        tap((user: User) => {
          this.loggedUser$.next(user);
        })
      );
  }

  removeUser(id: string, password: string) {
    const options = {
      body: {
        userId: id,
        password: password,
      },
    };
    return this.http.delete<User>(
      'http://localhost:3000/api/auth/delete',
      options
    );
  }

  modifyUser(user: User, file: File, id: string) {
    const formData = new FormData();
    formData.append('user', JSON.stringify(user));
    formData.append('file', file);
    formData.append('userId', id);
    return this.http.put<User>(
      'http://localhost:3000/api/auth/updateuser',
      formData
    );
  }

  changePassword(user: User, id: string) {
    const userInfos = { ...user, userId: id };
    return this.http.put<User>(
      'http://localhost:3000/api/auth/modifypassword',
      userInfos
    );
  }
}
