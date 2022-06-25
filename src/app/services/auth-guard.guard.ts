import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { first, Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.auth.auth$.pipe(
      first(),
      tap((isLoggedin: boolean) => {
        if (!isLoggedin) {
          this.router.navigateByUrl('/login');
        }
      })
    );
  }
}
