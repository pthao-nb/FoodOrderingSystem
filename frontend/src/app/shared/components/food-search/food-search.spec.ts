import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { vi } from 'vitest';
import { FoodSearch } from './food-search';
import { Food, FoodService } from '../../../core/services/food.service';

const food = { foodId: 1, foodName: 'Phở bò tái', price: 40000, originalPrice: null, description: '', imageUrl: '', categoryId: 1, categoryName: '' };
const result: Food[] = [food];

describe('Header food suggestions', () => {
  let events: Subject<unknown>;
  let response: Subject<Food[]>;
  let api: { getSuggestions: ReturnType<typeof vi.fn> };
  let router: { events: Subject<unknown>; navigate: ReturnType<typeof vi.fn> };
  beforeEach(() => {
    vi.useFakeTimers();
    events = new Subject(); response = new Subject<Food[]>();
    api = { getSuggestions: vi.fn(() => response) };
    router = { events, navigate: vi.fn(() => Promise.resolve(true)) };
    TestBed.configureTestingModule({ imports: [FoodSearch], providers: [
      { provide: FoodService, useValue: api }, { provide: Router, useValue: router }
    ] });
  });
  afterEach(() => vi.useRealTimers());

  it('clears the input after Enter while keeping the submitted keyword in navigation', () => {
    const fixture = TestBed.createComponent(FoodSearch);
    fixture.detectChanges();
    fixture.componentInstance.keyword = ' phở ';
    const input = fixture.nativeElement.querySelector('input');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/search'], { queryParams: { keyword: 'phở' } });
    expect(fixture.componentInstance.keyword).toBe('');
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('debounces typing, renders matching names and prices and selects a suggestion', async () => {
    const fixture = TestBed.createComponent(FoodSearch); fixture.detectChanges();
    const c = fixture.componentInstance;
    c.keyword = 'p'; c.changed(); await vi.advanceTimersByTimeAsync(100);
    c.keyword = 'pho'; c.changed(); await vi.advanceTimersByTimeAsync(249);
    expect(api.getSuggestions).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1); response.next(result); fixture.detectChanges();
    expect(api.getSuggestions).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.querySelector('[role="listbox"]').textContent).toContain(food.foodName);
    expect(fixture.nativeElement.querySelector('[role="listbox"]').textContent).toContain('40.000');
    fixture.nativeElement.querySelector('[role="option"] button').click();
    expect(router.navigate).toHaveBeenCalledWith(['/search'], { queryParams: { keyword: food.foodName } });
    expect(c.keyword).toBe('');
  });

  it('cancels stale results immediately when typing changes or input is cleared', async () => {
    const fixture = TestBed.createComponent(FoodSearch); const c = fixture.componentInstance;
    c.keyword = 'pho'; c.changed(); await vi.advanceTimersByTimeAsync(250);
    c.keyword = 'com'; c.changed(); response.next(result);
    expect(c.suggestions()).toEqual([]);
    c.keyword = ''; c.changed(); await vi.advanceTimersByTimeAsync(300);
    expect(c.open()).toBe(false);
    expect(api.getSuggestions).toHaveBeenCalledTimes(1);
  });

  it('keeps all matching dishes in the scrollable list instead of truncating to five', async () => {
    const fixture = TestBed.createComponent(FoodSearch); fixture.detectChanges();
    const c = fixture.componentInstance;
    c.keyword = 't'; c.changed(); await vi.advanceTimersByTimeAsync(250);
    const matches = Array.from({ length: 12 }, (_, i) => ({ ...food, foodId: i + 1, foodName: i === 11 ? 'Trà sữa' : `Món t ${i}` }));
    response.next(matches); fixture.detectChanges();
    expect(api.getSuggestions).toHaveBeenCalledWith('t');
    expect(fixture.nativeElement.querySelectorAll('[role="option"]').length).toBe(12);
    expect(fixture.nativeElement.querySelector('[role="listbox"]').textContent).toContain('Trà sữa');
  });

  it('supports arrow selection and Escape', async () => {
    const fixture = TestBed.createComponent(FoodSearch); const c = fixture.componentInstance;
    c.keyword = 'pho'; c.changed(); await vi.advanceTimersByTimeAsync(250); response.next(result);
    c.keydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(c.activeIndex()).toBe(0);
    c.submit();
    expect(router.navigate).toHaveBeenCalledWith(['/search'], { queryParams: { keyword: food.foodName } });
    c.keyword = 'pho'; c.changed(); c.keydown(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(c.open()).toBe(false);
  });

  it('clears draft text on navigation back to home', () => {
    const fixture = TestBed.createComponent(FoodSearch); const c = fixture.componentInstance;
    c.keyword = 'pho'; c.changed(); events.next(new NavigationEnd(1, '/', '/'));
    expect(c.keyword).toBe(''); expect(c.open()).toBe(false);
  });
});
