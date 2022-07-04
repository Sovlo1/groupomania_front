import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { first, map, Observable, of, switchMap } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class DataGuardGuard implements CanActivate {
  public token: string | null = window.localStorage.getItem('userToken');
  public helper = new JwtHelperService();

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<true> {
    return this.auth.user$.pipe(
      first(),
      switchMap((user: User | null): Observable<true> => {
        if (!user) {
          const isTokenExpired = this.helper.isTokenExpired(
            window.localStorage.getItem('userToken')!
          );
          if (!isTokenExpired) {
            return this.auth.fetchCurrentUser(this.token).pipe(map(() => true));
          } else {
            this.router.navigateByUrl('/');
            return of(true);
          }
        } else {
          return of(true);
        }
      })
    );
  }
}
