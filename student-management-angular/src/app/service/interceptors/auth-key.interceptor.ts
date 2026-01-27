import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthStorageService } from '../storage/auth-storage.service';

@Injectable()
export class authKeyInterceptor implements HttpInterceptor{
  
  constructor(private storage: AuthStorageService){}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
      const token = this.storage.getTokenStorage();

      console.log("Authentication key:"+token);

      if (token) {
      req = req.clone({
        url:  req.url,
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req);
  }
};
