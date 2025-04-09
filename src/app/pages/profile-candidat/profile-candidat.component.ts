import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-candidat',
  templateUrl: './profile-candidat.component.html',
  styleUrls: ['./profile-candidat.component.css'],
})
export class ProfileCandidatComponent implements OnInit {
  menuOpen = false;

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
}
