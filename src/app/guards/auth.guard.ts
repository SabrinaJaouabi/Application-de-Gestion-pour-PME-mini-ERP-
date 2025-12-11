import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRole = route.data['role'] as string;
    if (!requiredRole) {
      return true; // Pas de rôle requis → accès autorisé
    }

    const userRoles = this.authService.getRole();

    let hasRequiredRole = false;
    if (Array.isArray(userRoles)) {
      hasRequiredRole = userRoles.some(role => role === requiredRole || role.includes(requiredRole.split('_')[1]));
    } else if (typeof userRoles === 'string') {
      hasRequiredRole = userRoles === requiredRole || userRoles.includes(requiredRole.split('_')[1]);
    }

    if (!hasRequiredRole) {
      // Redirection selon le rôle réel
      const hasAdmin = Array.isArray(userRoles)
        ? userRoles.some(r => r.includes('ADMIN'))
        : userRoles?.includes('ADMIN');

      if (hasAdmin) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/products']);
      }
      return false;
    }

    return true;
  }
}