import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appels-offres',
  templateUrl: './appels-offres.component.html',
  styleUrls: ['./appels-offres.component.css'],
})
export class AppelsOffresComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
