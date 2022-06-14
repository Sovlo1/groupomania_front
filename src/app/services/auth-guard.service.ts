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
  constructor(
    private auth: AuthService,
    private router: Router,
    private user: UsersService
  ) {}

  canActivate(): Observable<boolean> {
    return this.auth.auth$.pipe(
      first(),
      tap((isLoggedin: boolean) => {
        console.log(isLoggedin);
        if (!isLoggedin) {
          this.router.navigateByUrl('/login');
        }
      })
    );
  }
}
