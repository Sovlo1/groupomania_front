import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  users$ = new Subject<User>();

  constructor(private http: HttpClient) {}

  getUserInfos(id: string) {
    return this.http
      .get<User>('http://localhost:3000/api/auth/about/' + id)
      .pipe(
        tap((user: User) => {
          this.users$.next(user);
          console.log(user);
        })
      )
      .subscribe();
  }
}
