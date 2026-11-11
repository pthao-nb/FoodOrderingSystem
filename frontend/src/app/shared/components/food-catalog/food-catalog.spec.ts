import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { Menu } from '../../../pages/menu/menu';
import { Search } from '../../../pages/search/search';
import { FoodService } from '../../../core/services/food.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

const food = { foodId: 1, foodName: 'Phở bò tái', price: 40000, originalPrice: null,
  description: 'Phở truyền thống với thịt bò tái mềm', imageUrl: 'assets/img/phobo.jpg', categoryId: 1, categoryName: 'Món nước' };

describe('Menu and header search views', () => {
  let api: { getCategories: ReturnType<typeof vi.fn>; getMenu: ReturnType<typeof vi.fn> };
  let cart: { add: ReturnType<typeof vi.fn> };
  beforeEach(() => {
    api = { getCategories: vi.fn(() => of([])), getMenu: vi.fn(() => of({ items: [food], totalCount: 1, page: 1, pageSize: 8 })) };
    cart = { add: vi.fn(() => of({})) };
    TestBed.configureTestingModule({ providers: [
      provideRouter([{ path: 'menu', component: Menu }, { path: 'search', component: Search, data: { search: true } }]),
      { provide: FoodService, useValue: api }, { provide: CartService, useValue: cart },
      { provide: AuthService, useValue: { isLoggedIn: () => true } }
    ] });
  });

  it('keeps menu filters and only shows name, price and add action on cards', async () => {
    const harness = await RouterTestingHarness.create('/menu?keyword=pho');
    const view = harness.routeNativeElement!;
    expect(view.querySelector('.filter-container')).toBeTruthy();
    expect(api.getMenu).toHaveBeenCalledWith(expect.objectContaining({ searchInDescription: false }));
    const card = view.querySelector('.food-item')!;
    expect(card.textContent).toContain(food.foodName);
    expect(card.textContent).toContain('40.000');
    expect(card.textContent).not.toContain(food.description);
    expect(card.textContent).not.toContain(food.categoryName);
    expect(card.querySelector('button')!.textContent!.trim()).toBe('Thêm');
  });

  it('renders header search with descriptions and a full width cart action, without menu filters', async () => {
    const harness = await RouterTestingHarness.create('/search?keyword=pho');
    const view = harness.routeNativeElement!;
    expect(view.querySelector('h1')!.textContent).toContain('Kết quả tìm kiếm cho: pho');
    expect(view.querySelector('.filter-container')).toBeNull();
    expect(view.querySelector('select')).toBeNull();
    expect(view.querySelector('.product-card')!.textContent).toContain(food.description);
    expect(view.querySelector('.add-to-cart')!.textContent!.trim()).toBe('Thêm vào giỏ');
    expect(api.getCategories).not.toHaveBeenCalled();
  });

  it('does not inherit menu filters in header search URLs', async () => {
    await RouterTestingHarness.create('/search?keyword=pho&categoryId=2&priceRange=under-30000&sort=price-desc');
    expect(api.getMenu).toHaveBeenCalledWith(expect.objectContaining({ keyword: 'pho', searchInDescription: false, categoryId: '', priceRange: 'all', sort: 'default' }));
  });

  it('clears every menu filter and returns to page one', async () => {
    const harness = await RouterTestingHarness.create('/menu?keyword=pho&categoryId=2&priceRange=under-30000&sort=price-desc&page=3');
    (harness.routeNativeElement!.querySelector('.reset-filters') as HTMLButtonElement).click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/menu');
    expect(api.getMenu).toHaveBeenLastCalledWith(expect.objectContaining({ keyword: '', categoryId: '', priceRange: 'all', sort: 'default', page: 1 }));
    expect((harness.routeNativeElement!.querySelector('#menu-keyword') as HTMLInputElement).value).toBe('');
  });

  it('adds the chosen food from either view', async () => {
    const harness = await RouterTestingHarness.create('/menu?keyword=pho');
    (harness.routeNativeElement!.querySelector('.food-footer button') as HTMLButtonElement).click();
    expect(cart.add).toHaveBeenCalledWith(1);
    await harness.navigateByUrl('/search?keyword=pho');
    (harness.routeNativeElement!.querySelector('.add-to-cart') as HTMLButtonElement).click();
    expect(cart.add).toHaveBeenCalledTimes(2);
  });
});
