
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  mobileMenuOpen = false;

  constructor(private router: Router) {}

//   reloadHome(): void {
//   window.location.href = '/';
// }

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
}
