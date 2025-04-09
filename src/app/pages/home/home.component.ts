import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  menuOpen = false;
  constructor() {}

  ngOnInit(): void {}

  openSignupModal() {
    const modalElement = document.getElementById('signupModal');

    // Vérifiez si l'élément existe avant de créer l'instance du modal
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Élément modal non trouvé');
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    const navLinks = document.querySelector('.nav-links') as HTMLElement;
    if (this.menuOpen) {
      navLinks.classList.add('active');
    } else {
      navLinks.classList.remove('active');
    }
  }
}
