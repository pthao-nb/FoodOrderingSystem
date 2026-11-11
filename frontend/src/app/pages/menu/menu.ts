import { Component } from '@angular/core';
import { FoodCatalog } from '../../shared/components/food-catalog/food-catalog';

@Component({
  selector: 'app-menu', standalone: true, imports: [FoodCatalog],
  templateUrl: './menu.html', styleUrl: './menu.css'
})
export class Menu {}
