import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    handler: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.auth.getToken();
    if (authToken) {
      req = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + authToken),
      });
    }
    return handler.handle(req);
  }
}
