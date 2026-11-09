
import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
  NavigationEnd
} from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  mobileMenuOpen = false;
  accountMenuOpen = false;

  isLoggedIn = false;
  userName = '';
  userRole = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.updateAuthState();

    // Cập nhật Header khi chuyển trang
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateAuthState();
      });
  }

  // Lấy thông tin người dùng đã đăng nhập
  updateAuthState(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    const user = this.authService.getCurrentUser();

    this.userName = user?.hoten || '';
    this.userRole = user?.role || '';
  }

  goHome(): void {
    this.router.navigate(['/']).then(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  toggleAccountMenu(): void {
    this.accountMenuOpen = !this.accountMenuOpen;
  }

  logout(): void {
    this.authService.logout();

    this.isLoggedIn = false;
    this.userName = '';
    this.userRole = '';
    this.accountMenuOpen = false;
    this.mobileMenuOpen = false;

    this.router.navigate(['/']);
  }
}
