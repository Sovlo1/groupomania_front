import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { first, map, mapTo, Observable, of, switchMap, take, tap } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public token: string | null = window.localStorage.getItem('userToken');

  constructor(
    private auth: AuthService,
    private router: Router,
    private user: UsersService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.auth.auth$.pipe(
      tap(() => {
        console.log(this.token);
        this.auth.fetchCurrentUser(this.token).subscribe((user) => {
          if (user) {
            console.log(user);
            console.log(this.auth.auth$);
            this.auth.auth$.next(true);
            this.user.users$.next(user);
            console.log(this.auth.auth$);
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/login']);
          }
        });
      })
    );
  }

  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ): Observable<boolean> {
  //   return this.auth.auth$.pipe(
  //     tap((auth) => {
  //       console.log(auth);
  //       if (!auth) {
  //         this.auth.fetchCurrentUser(this.token).pipe(
  //           tap(() => {
  //             this.auth.auth$;
  //           })
  //         );
  //       }
  //     })
  //   );
  // }

  // canActivate(): Observable<true> {
  //   return this.auth.user$.pipe(
  //     first(),
  //     switchMap((user: User | null): Observable<true> => {
  //       if (!user) {
  //         return this.auth.fetchCurrentUser(this.token).pipe(map(() => true));
  //       } else {
  //         return of(true);
  //       }
  //     })
  //   );
  // }

  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ): Observable<true> {
  //   return this.auth.user$.pipe(
  //     first(),
  //     switchMap((user: User | null): Observable<true> => {
  //       if (!user) {
  //         return this.auth.fetchCurrentUser().pipe(map(() => true));
  //       } else {
  //         return of(true);
  //       }
  //     })
  //   );
  // }
}
