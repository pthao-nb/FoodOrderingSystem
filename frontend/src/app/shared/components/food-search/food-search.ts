import { Component, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, filter, map, of, switchMap, timer } from 'rxjs';
import { Food, FoodService } from '../../../core/services/food.service';

@Component({
  selector: 'app-food-search', standalone: true, imports: [FormsModule],
  templateUrl: './food-search.html', styleUrl: './food-search.css'
})
export class FoodSearch {
  readonly idPrefix = input('header');
  readonly searched = output<void>();
  private api = inject(FoodService);
  private router = inject(Router);
  private element: ElementRef<HTMLElement> = inject(ElementRef);
  private terms = new Subject<string>();
  keyword = '';
  suggestions = signal<Food[]>([]);
  open = signal(false);
  loading = signal(false);
  failed = signal(false);
  activeIndex = signal(-1);

  constructor() {
    // A new keystroke cancels both the delay and any older HTTP request.
    this.terms.pipe(
      switchMap(term => term ? timer(250).pipe(
        switchMap(() => this.api.getSuggestions(term)),
        map(items => ({ items, failed: false })),
        catchError(() => of({ items: [] as Food[], failed: true }))
      ) : of({ items: [] as Food[], failed: false })),
      takeUntilDestroyed()
    ).subscribe(result => {
      this.suggestions.set(result.items);
      this.failed.set(result.failed);
      this.loading.set(false);
    });
    this.router.events.pipe(filter(event => event instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => this.clear());
  }

  changed(): void {
    const term = this.keyword.trim().slice(0, 150);
    this.suggestions.set([]);
    this.activeIndex.set(-1);
    this.failed.set(false);
    this.open.set(!!term);
    this.loading.set(!!term);
    this.terms.next(term);
  }

  submit(): void {
    const selected = this.open() ? this.suggestions()[this.activeIndex()] : undefined;
    this.search(selected?.foodName ?? this.keyword);
  }

  search(value: string): void {
    const keyword = value.trim().slice(0, 150);
    if (!keyword) return;
    this.clear();
    this.router.navigate(['/search'], { queryParams: { keyword } });
    this.searched.emit();
  }

  clear(): void { this.keyword = ''; this.dismiss(); }
  dismiss(): void {
    this.open.set(false);
    this.activeIndex.set(-1);
    this.terms.next('');
  }
  keydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') { event.preventDefault(); this.dismiss(); return; }
    if (!this.open() || !this.suggestions().length) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const count = this.suggestions().length;
      const next = event.key === 'ArrowDown' ? this.activeIndex() + 1 : this.activeIndex() < 0 ? count - 1 : this.activeIndex() - 1;
      const index = (next + count) % count;
      this.activeIndex.set(index);
      const option = this.element.nativeElement.querySelector<HTMLElement>(`[id="${this.idPrefix()}-option-${index}"]`);
      option?.scrollIntoView?.({ block: 'nearest' });
    }
  }
  focusout(event: FocusEvent): void {
    if (!this.element.nativeElement.contains(event.relatedTarget as Node | null)) this.dismiss();
  }
  @HostListener('document:pointerdown', ['$event'])
  outside(event: PointerEvent): void {
    if (!this.element.nativeElement.contains(event.target as Node)) this.dismiss();
  }
  price(value: number): string { return new Intl.NumberFormat('vi-VN').format(value) + ' đ'; }
}

