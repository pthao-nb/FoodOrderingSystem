
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import {
  AuthService,
  LoginData
} from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginData: LoginData = {
    taikhoan: '',
    matkhau: ''
  };

  errorMessage = '';
  successMessage = '';
  isLoading = false;
  showPassword = false;
  
  togglePassword(): void {
  this.showPassword = !this.showPassword;
}

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.loginData.taikhoan || !this.loginData.matkhau) {
      this.errorMessage = 'Vui lòng nhập đầy đủ tài khoản và mật khẩu!';
      return;
    }

    this.isLoading = true;

    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Đăng nhập thành công!';


        // Chuyển về trang chủ sau khi đăng nhập thành công
        this.router.navigate(['/']);
      },

      error: (error) => {
        this.isLoading = false;

        this.errorMessage =
          error.error?.message ||
          'Tài khoản hoặc mật khẩu không chính xác!';

        console.error('Lỗi đăng nhập:', error);
      }
    });
  }
}
