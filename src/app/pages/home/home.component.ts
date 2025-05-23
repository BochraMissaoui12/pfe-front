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
import { EntrepriseService } from 'src/app/services/EntrepriseService';
import { OffreService } from 'src/app/services/OffreService';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { EvenementService } from 'src/app/services/EvenementService';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, AfterViewInit {
  menuOpen = false;
  isVerificationMode = false;
  isCandidat = false;
  offres: any;
  role!: any;
  isConnected = false;
  @ViewChild('sponsorsContainer') sponsorsContainer!: ElementRef;
  news_cards: any[] = [];

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

  constructor(
    private evenementService: EvenementService,
    private cdr: ChangeDetectorRef,
    private offreService: OffreService,
    private entrepriseService: EntrepriseService
  ) {}
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.role = payload.role;
        this.isConnected = true;
      } catch (e) {
        this.isConnected = false;
        this.role = null;
      }
    } else {
      this.isConnected = false;
      this.role = null;
    }
    this.loadEvenements();
    this.offreService.getOffresValidees().subscribe((offres) => {
      // Trier par date décroissante (supposons datePublication en ISO)
      offres.sort(
        (a, b) =>
          new Date(b.datePublication).getTime() -
          new Date(a.datePublication).getTime()
      );
      // Prendre les 6 dernières
      const lastSix = offres.slice(0, 6);

      // Pour chaque offre, récupérer l'entreprise associée
      const entrepriseRequests = lastSix.map((offre) =>
        this.entrepriseService.getEntrepriseById(offre.entrepriseId)
      );

      forkJoin(entrepriseRequests).subscribe((entreprises) => {
        this.offres = lastSix.map((offre, i) => ({
          ...offre,
          entreprise: entreprises[i],
        }));
      });
    });
  }
  loadEvenements(): void {
    this.evenementService
      .getAllEvenements()
      .pipe(
        map((evenements) =>
          // Filtrer valide=true
          evenements
            .filter((e) => e.valide === true)
            // Trier par date ou id décroissant (supposons qu'il y a un champ date)
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            // Prendre les 3 premiers
            .slice(0, 3)
        ),
        // Pour chaque événement, récupérer l'entreprise associée
        switchMap((filteredEvenements) => {
          const requests: Observable<any>[] = filteredEvenements.map((event) =>
            this.entrepriseService.getEntrepriseById(event.entrepriseId).pipe(
              map((entreprise) => ({
                titre: event.titre,
                description: this.truncateDescription(event.description, 12),
                image:
                  event.imgs && event.imgs.length > 0
                    ? event.imgs[0]
                    : 'assets/images/default.png',
                entrepriseNom: entreprise.nom,
                entrepriseLogo: entreprise.logoUrl,
              }))
            )
          );
          return forkJoin(requests);
        })
      )
      .subscribe(
        (results) => {
          this.news_cards = results;
        },
        (error) => {
          console.error(
            'Erreur lors du chargement des événements ou entreprises',
            error
          );
        }
      );
  }

  truncateDescription(desc: string, maxWords: number): string {
    if (!desc) return '';
    const words = desc.split(' ');
    if (words.length <= maxWords) return desc;
    return words.slice(0, maxWords).join(' ') + '...';
  }
  OnClick() {
    Swal.fire({
      icon: 'info',
      title: 'Connexion requise',
      text: 'Veuillez vous connecter en tant que entreprise pour publier votre offre.',
      confirmButtonText: 'Se connecter',
    }).then(() => {
      this.openSignupModal();
    });
  }
  getProfileRoute(): string {
    switch (this.role) {
      case 'CANDIDAT':
        return '/profil';
      case 'ENTREPRISE':
        return '/Eprofil';
      case 'CHERCHEUR':
        return '/Cprofil';
      default:
        return '/profil';
    }
  }

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
