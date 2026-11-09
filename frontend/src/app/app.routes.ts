
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Trang chủ
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.Home)
  },

  // Trang đăng nhập
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.Login)
  },

  // Trang đăng ký
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register').then((m) => m.Register)
  },

  // Trang quên mật khẩu
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password')
        .then((m) => m.ForgotPassword)
  },

  // Đường dẫn không tồn tại
  {
    path: '**',
    redirectTo: ''
  }
];
