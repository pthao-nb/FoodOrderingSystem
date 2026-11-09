
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import {
  AuthService,
  RegisterData
} from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  registerData: RegisterData = {
    hoten: '',
    taikhoan: '',
    matkhau: '',
    email: '',
    dienthoaiKH: '',
    diachiKH: '',
    ngaysinh: ''
  };

  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.registerData.hoten ||
      !this.registerData.taikhoan ||
      !this.registerData.matkhau
    ) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin bắt buộc!';
      return;
    }

    if (this.registerData.matkhau.length < 6) {
      this.errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự!';
      return;
    }

    if (this.registerData.matkhau !== this.confirmPassword) {
      this.errorMessage = 'Mật khẩu xác nhận không khớp!';
      return;
    }

    this.isLoading = true;

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message || 'Đăng ký thành công!';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;

        this.errorMessage =
          error.error?.message ||
          'Đăng ký thất bại! Vui lòng thử lại.';
      }
    });
  }
}
