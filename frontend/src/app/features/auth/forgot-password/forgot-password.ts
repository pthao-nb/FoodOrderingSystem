
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  step = 1;

  taikhoan = '';
  dienthoaiKH = '';

  matkhauMoi = '';
  xacNhanMatKhau = '';

  showPassword = false;
  showConfirmPassword = false;

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  verifyAccount(): void {
  this.errorMessage = '';
  this.successMessage = '';

  if (!this.taikhoan.trim() || !this.dienthoaiKH.trim()) {
    this.errorMessage = 'Vui lòng nhập đầy đủ thông tin.';
    return;
  }

  this.isLoading = true;

  this.authService.verifyForgotPassword({
    taikhoan: this.taikhoan.trim(),
    dienthoaiKH: this.dienthoaiKH.trim()
  }).subscribe({
    next: (response) => {
      console.log('Xác nhận thành công:', response);

      this.step = 2;
      this.isLoading = false;

      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Lỗi xác nhận:', error);

      this.errorMessage =
        error.error?.message ||
        'Tài khoản hoặc số điện thoại không chính xác.';

      this.isLoading = false;
      this.cdr.detectChanges();
    }
  });
}

  resetPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.matkhauMoi || !this.xacNhanMatKhau) {
      this.errorMessage = 'Vui lòng nhập đầy đủ mật khẩu.';
      return;
    }

    if (this.matkhauMoi.length < 6) {
      this.errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự.';
      return;
    }

    if (this.matkhauMoi !== this.xacNhanMatKhau) {
      this.errorMessage = 'Mật khẩu xác nhận không khớp.';
      return;
    }

    this.isLoading = true;

    this.authService.resetForgotPassword({
      taikhoan: this.taikhoan.trim(),
      dienthoaiKH: this.dienthoaiKH.trim(),
      matkhauMoi: this.matkhauMoi
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Đổi mật khẩu thành công! Đang chuyển về trang đăng nhập...';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1800);
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Không thể đổi mật khẩu. Vui lòng thử lại.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.step = 1;
    this.errorMessage = '';
    this.successMessage = '';
    this.matkhauMoi = '';
    this.xacNhanMatKhau = '';
  }
}
