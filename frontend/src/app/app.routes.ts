
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'menu', loadComponent: () => import('./pages/menu/menu').then(m => m.Menu), title: 'Thực đơn - Ăn Húp Hội' },
  { path: 'search', loadComponent: () => import('./pages/search/search').then(m => m.Search), data: { search: true }, title: 'Tìm kiếm - Ăn Húp Hội' },
  { path: 'deals', loadComponent: () => import('./pages/deals/deals').then(m => m.Deals), title: 'Khuyến mãi - Ăn Húp Hội' },
  // Trang chủ
  {
    path: '',
    title: 'Trang chủ - Ăn Húp Hội',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.Home)
  },

  // Trang đăng nhập
  {
    path: 'login',
    title: 'Đăng nhập - Ăn Húp Hội',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.Login)
  },

  // Trang đăng ký
  {
    path: 'register',
    title: 'Đăng ký - Ăn Húp Hội',
    loadComponent: () =>
      import('./features/auth/register/register').then((m) => m.Register)
  },

  // Trang quên mật khẩu
  {
    path: 'forgot-password',
    title: 'Quên mật khẩu - Ăn Húp Hội',
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
