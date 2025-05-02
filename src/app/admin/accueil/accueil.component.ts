import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css'],
})
export class AccueilComponent implements OnInit {
  stats = [
    { label: 'Offres', count: 125, icon: 'fa-briefcase' },
    { label: 'Candidats', count: 340, icon: 'fa-user' },
    { label: 'Entreprises', count: 58, icon: 'fa-building' },
    { label: 'Chercheurs', count: 22, icon: 'fa-flask' },
    { label: 'Événements', count: 12, icon: 'fa-calendar-alt' },
    { label: "Appels d'offres", count: 7, icon: 'fa-file-contract' },
  ];
  constructor(private router: Router) {}

  ngOnInit(): void {
    if (!sessionStorage.getItem('reloaded')) {
      sessionStorage.setItem('reloaded', 'true');
      window.location.reload();
    } else {
      sessionStorage.removeItem('reloaded');
    }
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
