
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

// Thông tin trả về sau khi đăng nhập
export interface AuthResponse {
  uid: number;
  hoten: string;
  taikhoan: string;
  role: string;
  token: string;
}

// Dữ liệu gửi lên khi đăng ký
export interface RegisterData {
  hoten: string;
  taikhoan: string;
  matkhau: string;
  email?: string;
  dienthoaiKH?: string;
  diachiKH?: string;
  ngaysinh?: string;
}

// Dữ liệu gửi lên khi đăng nhập
export interface LoginData {
  taikhoan: string;
  matkhau: string;
}

// Dữ liệu xác nhận tài khoản khi quên mật khẩu
export interface VerifyForgotPasswordData {
  taikhoan: string;
  dienthoaiKH: string;
}

// Dữ liệu đặt lại mật khẩu
export interface ResetForgotPasswordData {
  taikhoan: string;
  dienthoaiKH: string;
  matkhauMoi: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:7008/api/Auth';

  constructor(private http: HttpClient) {}

  // Đăng ký tài khoản
  register(data: RegisterData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // Đăng nhập và lưu JWT Token
  login(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      data
    ).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
          uid: response.uid,
          hoten: response.hoten,
          taikhoan: response.taikhoan,
          role: response.role
        }));
      })
    );
  }

  // Xác nhận tài khoản khi quên mật khẩu
  verifyForgotPassword(data: VerifyForgotPasswordData): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/forgot-password/verify`,
      data
    );
  }

  // Đặt lại mật khẩu
  resetForgotPassword(data: ResetForgotPasswordData): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/forgot-password/reset`,
      data
    );
  }

  // Lấy JWT Token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Lấy thông tin người dùng đang đăng nhập
  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Kiểm tra trạng thái đăng nhập
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // Đăng xuất
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
