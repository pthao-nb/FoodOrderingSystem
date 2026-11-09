import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Food, FoodService } from '../../core/services/food.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
    foods: Food[] = [];
    isLoading = true;
    errorMessage = '';

        constructor(
        private foodService: FoodService,
        private cdr: ChangeDetectorRef
        ) {}

    ngOnInit(): void {
    console.log('Home component đã khởi tạo');
    this.loadFoods();
    }

    loadFoods(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.foodService.getAllFoods().subscribe({
        next: (data) => {
        this.foods = data;
        this.isLoading = false;

        // Yêu cầu Angular cập nhật giao diện
        this.cdr.detectChanges();

        console.log('Đã cập nhật giao diện món ăn:', this.foods.length);
        },

        error: (error) => {
        console.error('Lỗi gọi API:', error);

        this.errorMessage = 'Không thể tải danh sách món ăn.';
        this.isLoading = false;

        this.cdr.detectChanges();
        }
    });
    }

    formatPrice(price: number): string {
        return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
    }

    getImageUrl(imageUrl: string | null | undefined): string {
        if (!imageUrl) {
        return '/assets/img/default-food.jpg';
        }

        // Nếu API trả về URL đầy đủ thì sử dụng trực tiếp.
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
        }

        // Nếu API trả về đường dẫn tương đối.
        return imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl;
    }

    onImageError(event: Event): void {
        const image = event.target as HTMLImageElement;
        image.onerror = null;
        image.src = '/assets/img/default-food.jpg';
    }
}