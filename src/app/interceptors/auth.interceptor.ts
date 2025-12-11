// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('Interceptor appelé pour :', req.url); // ← Ajoute cette ligne
  console.log('Token présent ?', !!token); // ← Ajoute cette ligne

  if (token) {
    console.log('Ajout du header Authorization'); // ← Ajoute cette ligne
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req);
};