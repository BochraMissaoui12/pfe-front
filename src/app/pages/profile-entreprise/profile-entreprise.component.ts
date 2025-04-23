import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-entreprise',
  templateUrl: './profile-entreprise.component.html',
  styleUrls: ['./profile-entreprise.component.css'],
})
export class ProfileEntrepriseComponent implements OnInit {
  menuOpen = false;
  step = 1;
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

  goToStep2() {
    this.step = 2;
  }

  goToStep1() {
    this.step = 1;
  }
  goToStep3() {
    this.step = 3;
  }
}
