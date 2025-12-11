import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private authService: AuthService, private router: Router) {}

  isLoggedIn() { return this.authService.isLoggedIn(); }
  getRole() { return this.authService.getRole(); }

getUsername() { 
  return this.authService.getUsername(); 
}
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}