import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  add(foodId: number) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    return this.http.post('http://localhost:7008/api/Cart/items', { foodId }, { headers });
  }
}
