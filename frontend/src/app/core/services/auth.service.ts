
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

  constructor(private http: HttpClient) {
    // Discard persistent credentials from the previous login implementation.
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

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
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('user', JSON.stringify({
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

  // The session belongs to this browser tab; reloads keep it until JWT expiry.
  getToken(): string | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid token');
      const encoded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(encoded.padEnd(Math.ceil(encoded.length / 4) * 4, '=')));
      if (typeof payload.exp !== 'number' || !Number.isFinite(payload.exp) || payload.exp * 1000 <= Date.now()) {
        throw new Error('Expired token');
      }
      return token;
    } catch {
      this.logout();
      return null;
    }
  }

  getCurrentUser(): Omit<AuthResponse, 'token'> | null {
    if (!this.getToken()) return null;
    try {
      const user = JSON.parse(sessionStorage.getItem('user') || 'null');
      if (!user || !Number.isInteger(user.uid) || typeof user.hoten !== 'string' ||
          typeof user.taikhoan !== 'string' || typeof user.role !== 'string') {
        throw new Error('Invalid user');
      }
      return user;
    } catch {
      this.logout();
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
