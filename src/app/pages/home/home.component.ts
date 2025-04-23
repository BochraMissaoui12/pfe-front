import {
  Component,
  ElementRef,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, AfterViewInit {
  menuOpen = false;
  isVerificationMode = false;

  @ViewChild('sponsorsContainer') sponsorsContainer!: ElementRef;

  sponsors = [
    { name: 'Sponsor 1', imageUrl: 'assets/images/Rectangle 37.png' },
    { name: 'Sponsor 2', imageUrl: 'assets/images/Rectangle 38.png' },
    { name: 'Sponsor 3', imageUrl: 'assets/images/Rectangle 39.png' },
    { name: 'Sponsor 4', imageUrl: 'assets/images/Rectangle 40.png' },
    { name: 'Sponsor 5', imageUrl: 'assets/images/Rectangle 41.png' },
    { name: 'Sponsor 6', imageUrl: 'assets/images/Rectangle 42.png' },
    { name: 'Sponsor 1', imageUrl: 'assets/images/Rectangle 37.png' },
    { name: 'Sponsor 2', imageUrl: 'assets/images/Rectangle 38.png' },
    { name: 'Sponsor 3', imageUrl: 'assets/images/Rectangle 39.png' },
    { name: 'Sponsor 4', imageUrl: 'assets/images/Rectangle 40.png' },
    { name: 'Sponsor 5', imageUrl: 'assets/images/Rectangle 41.png' },
    { name: 'Sponsor 6', imageUrl: 'assets/images/Rectangle 42.png' },
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.sponsorsContainer) {
        this.startScrolling();
      }
    }, 100);
  }
  startScrolling() {
    const container = this.sponsorsContainer.nativeElement;
    const scrollSpeed = 0.5; // 👉 Adjust this for speed

    const scroll = () => {
      container.scrollLeft += scrollSpeed;

      // When it reaches the halfway point (since items are duplicated), reset to start
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      }

      requestAnimationFrame(scroll);
    };

    requestAnimationFrame(scroll);
  }

  openSignupModal() {
    const modalElement = document.getElementById('signupModal');
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
