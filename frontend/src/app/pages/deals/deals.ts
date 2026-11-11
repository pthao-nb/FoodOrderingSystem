import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-deals', standalone: true, imports: [RouterLink],
  templateUrl: './deals.html', styleUrl: './deals.css'
})
export class Deals {}
