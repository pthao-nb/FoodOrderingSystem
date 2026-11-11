import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
registerLocaleData(localeVi);
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap, tap } from 'rxjs';
import { Category, Food, FoodService, MenuQuery, MenuResult } from '../../../core/services/food.service';

@Component({
  selector: 'app-food-catalog', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './food-catalog.html', styleUrl: './food-catalog.css'
})
export class FoodCatalog {
  private api = inject(FoodService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  readonly isSearch = !!this.route.snapshot.data['search'];
  private cart = inject(CartService);
  private auth = inject(AuthService);
  adding = signal(new Set<number>());
  cartMessage = signal('');
  categories = signal<Category[]>([]);
  categoryError = signal(false);
  result = signal<MenuResult | null>(null);
  loading = signal(false);
  error = signal('');
  keyword = '';
  categoryId = '';
  priceRange = 'all';
  sort = 'default';
  private query: MenuQuery = { keyword: '', categoryId: '', priceRange: 'all', sort: 'default', page: 1 };

  constructor() {
    if (!this.isSearch) this.api.getCategories().pipe(takeUntilDestroyed()).subscribe({
      next: data => this.categories.set(data), error: () => this.categoryError.set(true)
    });
    this.route.queryParamMap.pipe(
      tap(params => {
        this.keyword = (params.get('keyword') || '').trim().slice(0, 150);
        const category = params.get('categoryId') || '';
        this.categoryId = /^[1-9]\d*$/.test(category) && Number(category) <= 2147483647 ? category : '';
        const price = params.get('priceRange') || 'all';
        this.priceRange = ['all', 'under-30000', '30000-50000', '50000-100000', 'over-100000'].includes(price) ? price : 'all';
        const sort = params.get('sort') || 'default';
        this.sort = ['default', 'name-asc', 'name-desc', 'price-asc', 'price-desc'].includes(sort) ? sort : 'default';
        const page = Number(params.get('page'));
        if (this.isSearch) { this.categoryId = ''; this.priceRange = 'all'; this.sort = 'default'; }
        this.query = { searchInDescription: false, keyword: this.keyword, categoryId: this.categoryId, priceRange: this.priceRange, sort: this.sort,
          page: Number.isInteger(page) && page > 0 && page <= 1000000 ? page : 1 };
      }),
      switchMap(() => this.fetch()),
      takeUntilDestroyed()
    ).subscribe(data => { this.result.set(data); this.loading.set(false); });
  }

  private fetch() {
    this.error.set('');
    this.loading.set(true);
    if (this.isSearch && !this.query.keyword) return of(null);
    return this.api.getMenu(this.query).pipe(catchError(() => {
      this.error.set('Không thể tải món ăn. Vui lòng kiểm tra kết nối và thử lại.');
      return of(null);
    }));
  }

  apply(page = 1): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: {
      keyword: this.keyword.trim() || null, categoryId: this.categoryId || null,
      priceRange: this.priceRange === 'all' ? null : this.priceRange,
      sort: this.sort === 'default' ? null : this.sort, page: page === 1 ? null : page
    }});
  }

  reset(): void { this.keyword = ''; this.categoryId = ''; this.priceRange = 'all'; this.sort = 'default'; this.apply(); }
  retry(): void {
    this.fetch().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => { this.result.set(data); this.loading.set(false); });
  }
  get totalPages(): number { const r = this.result(); return r ? Math.ceil(r.totalCount / r.pageSize) : 0; }
  get pages(): number[] {
    const start = Math.max(1, Math.min((this.result()?.page || 1) - 2, this.totalPages - 4));
    return Array.from({ length: Math.min(5, this.totalPages) }, (_, i) => start + i);
  }
  addToCart(food: Food): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.adding().has(food.foodId)) return;
    this.cartMessage.set('');
    this.adding.update(ids => new Set([...ids, food.foodId]));
    this.cart.add(food.foodId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.finishAdding(food.foodId); this.cartMessage.set(`Đã thêm ${food.foodName} vào giỏ hàng.`); },
      error: error => {
        this.finishAdding(food.foodId);
        if (error.status === 401) { this.router.navigate(['/login']); return; }
        this.cartMessage.set('Không thể thêm món. Vui lòng thử lại.');
      }
    });
  }
  private finishAdding(id: number): void {
    this.adding.update(ids => { const next = new Set(ids); next.delete(id); return next; });
  }
  imageUrl(value: string): string {
    if (!value) return '/assets/img/food-placeholder.svg';
    if (/^https?:\/\//i.test(value)) return value;
    const path = value.replace(/\\/g, '/').replace(/^(\.\.\/|\.\/|\/)+/, '');
    return path.includes('/') ? '/' + path : '/assets/img/' + path;
  }
  imageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    if (!img.src.endsWith('/food-placeholder.svg')) img.src = '/assets/img/food-placeholder.svg';
  }
}

