import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

const user = { uid: 1, hoten: 'Khách', taikhoan: 'khach', role: 'khach' };
function jwt(exp: number): string {
  return btoa(JSON.stringify({ alg: 'HS256' })) + '.' + btoa(JSON.stringify({ exp })) + '.signature';
}

describe('Tab-scoped login session', () => {
  let service: AuthService;
  let http: HttpTestingController;
  beforeEach(() => {
    localStorage.removeItem('token'); localStorage.removeItem('user');
    sessionStorage.removeItem('token'); sessionStorage.removeItem('user');
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => { http.verify(); service.logout(); });

  it('stores a successful login only in sessionStorage', () => {
    const token = jwt(Math.floor(Date.now() / 1000) + 3600);
    service.login({ taikhoan: 'khach', matkhau: 'password' }).subscribe();
    http.expectOne('http://localhost:7008/api/Auth/login').flush({ ...user, token });
    expect(sessionStorage.getItem('token')).toBe(token);
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(service.isLoggedIn()).toBe(true);
    expect(service.getCurrentUser()).toEqual(user);
  });

  it('drops old persistent logins instead of restoring them', () => {
    localStorage.setItem('token', jwt(Math.floor(Date.now() / 1000) + 3600));
    localStorage.setItem('user', JSON.stringify(user));
    const fresh = new AuthService(TestBed.inject(HttpClient));
    expect(fresh.isLoggedIn()).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('keeps a valid tab session when the app reloads', () => {
    sessionStorage.setItem('token', jwt(Math.floor(Date.now() / 1000) + 3600));
    sessionStorage.setItem('user', JSON.stringify(user));
    const reloaded = new AuthService(TestBed.inject(HttpClient));
    expect(reloaded.isLoggedIn()).toBe(true);
    expect(reloaded.getCurrentUser()).toEqual(user);
  });

  it('requires login when no tab session remains', () => {
    expect(service.isLoggedIn()).toBe(false);
    expect(service.getCurrentUser()).toBeNull();
  });

  it('clears expired credentials', () => {
    sessionStorage.setItem('token', jwt(Math.floor(Date.now() / 1000) - 1));
    sessionStorage.setItem('user', JSON.stringify(user));
    expect(service.isLoggedIn()).toBe(false);
    expect(sessionStorage.getItem('token')).toBeNull();
    expect(sessionStorage.getItem('user')).toBeNull();
  });

  it('rejects malformed tokens and broken user data without crashing', () => {
    sessionStorage.setItem('token', 'invalid');
    expect(service.getToken()).toBeNull();
    sessionStorage.setItem('token', jwt(Math.floor(Date.now() / 1000) + 3600));
    sessionStorage.setItem('user', '{broken');
    expect(service.getCurrentUser()).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
  });

  it('removes both tab and legacy credentials on logout', () => {
    for (const storage of [sessionStorage, localStorage]) {
      storage.setItem('token', 'token'); storage.setItem('user', JSON.stringify(user));
    }
    service.logout();
    for (const storage of [sessionStorage, localStorage]) {
      expect(storage.getItem('token')).toBeNull(); expect(storage.getItem('user')).toBeNull();
    }
  });
});
