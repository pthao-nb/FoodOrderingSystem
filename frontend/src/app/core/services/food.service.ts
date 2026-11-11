
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Food {
  foodId: number;
  foodName: string;
  price: number;
  originalPrice: number | null;
  description: string;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
}

export interface Category { categoryId: number; categoryName: string; }
export interface MenuResult { items: Food[]; totalCount: number; page: number; pageSize: number; }
export interface MenuQuery { searchInDescription?: boolean; keyword: string; categoryId: string; priceRange: string; sort: string; page: number; }

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private readonly apiUrl = 'http://localhost:7008/api/Food';

  constructor(private http: HttpClient) {}

  getSuggestions(keyword: string): Observable<Food[]> {
    return this.http.get<Food[]>(`${this.apiUrl}/suggestions`, { params: { keyword } });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('http://localhost:7008/api/Category');
  }

  getMenu(query: MenuQuery): Observable<MenuResult> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== '') params = params.set(key, value);
    }
    return this.http.get<MenuResult>(`${this.apiUrl}/menu`, { params });
  }

  getAllFoods(): Observable<Food[]> {
    return this.http.get<Food[]>(this.apiUrl);
  }
}
