import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private readonly apiUrl = 'https://localhost:7008/api/Food';

  constructor(private http: HttpClient) {}

  getAllFoods(): Observable<Food[]> {
    return this.http.get<Food[]>(this.apiUrl);
  }
}