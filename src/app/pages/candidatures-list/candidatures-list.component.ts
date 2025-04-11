import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-candidatures-list',
  templateUrl: './candidatures-list.component.html',
  styleUrls: ['./candidatures-list.component.css'],
})
export class CandidaturesListComponent implements OnInit {
  menuOpen = false;
  candidatures = [
    {
      entreprise: 'Carter - Hirthe',
      poste: 'Chief Configuration Analyst',
      statut: 'Accepté',
      logo: 'assets/images/logoo.png',
    },
    {
      entreprise: 'Turcotte and Sons',
      poste: 'Dynamic Accounts Executive',
      statut: 'Présélectionné',
      logo: 'assets/images/logoo.png',
    },
    {
      entreprise: 'Gibson Group',
      poste: 'Corporate Brand Consultant',
      statut: 'En attente',
      logo: 'assets/images/logoo.png',
    },
    {
      entreprise: 'Haley and Sons',
      poste: 'Dynamic Solutions Officer',
      statut: 'En attente',
      logo: 'assets/images/logoo.png',
    },
    {
      entreprise: 'Bartoletti LLC',
      poste: 'Chief Branding Agent',
      statut: 'Refusé',
      logo: 'assets/images/logoo.png',
    },
  ];
  constructor() {}
  ngOnInit(): void {}
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    const navLinks = document.querySelector('.nav-links') as HTMLElement;
    if (this.menuOpen) {
      navLinks.classList.add('active');
    } else {
      navLinks.classList.remove('active');
    }
  }

  getStatusStyle(statut: string): any {
    switch (statut) {
      case 'Accepté':
        return { color: 'green' };
      case 'Présélectionné':
        return { color: 'rgba(227, 182, 5, 1)' };
      case 'Refusé':
        return { color: 'rgba(220, 38, 38, 1)' };
      case 'En attente':
        return { color: 'rgba(71, 85, 105, 1)' };
      default:
        return { color: 'black' };
    }
  }
}
