import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodCatalog } from '../../shared/components/food-catalog/food-catalog';

@Component({
  selector: 'app-search', standalone: true, imports: [CommonModule],
  templateUrl: './search.html', styleUrl: './search.css'
})
export class Search extends FoodCatalog {}
