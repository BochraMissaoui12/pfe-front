import { Component, HostListener } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor() {
    AOS.init({
      duration: 1200,
      once: false,
      mirror: true,
      easing: 'ease-in-out',
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    AOS.refresh(); // Refresh AOS when scrolling
  }
}
