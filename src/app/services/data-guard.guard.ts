import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { first, map, Observable, of, switchMap } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataGuardGuard implements CanActivate {
  public token: string | null = window.localStorage.getItem('userToken');

  constructor(private auth: AuthService) {}

  canActivate(): Observable<true> {
    return this.auth.user$.pipe(
      first(),
      switchMap((user: User | null): Observable<true> => {
        if (!user) {
          return this.auth.fetchCurrentUser(this.token).pipe(map(() => true));
        } else {
          return of(true);
        }
      })
    );
  }
}
