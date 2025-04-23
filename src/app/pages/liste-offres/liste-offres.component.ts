import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-liste-offres',
  templateUrl: './liste-offres.component.html',
  styleUrls: ['./liste-offres.component.css'],
})
export class ListeOffresComponent implements OnInit {
  menuOpen = false;
  pageSize = 6; // Number of items per page
  currentPage = 1; // Current page number
  offers = [
    {
      title: 'Customer Solutions Engineer',
      position: 'Solutions Engineer',
      location: 'New York',
      positions: 2,
      experience: '+2',
      contract: 'CDI',
      description:
        'Nous recherchons un designer UI/UX senior Réaliser des études Nous recherchons un designer UI/UX senior Réaliser des études utilisateurs et tests d’utilisabilité Collaborer avec les développeurs et l’équipe marketing des études utilisateurs et tests d’utilisabilité Collaborer avec les développeurs et l’équipe marketing',
      responsibilities: [
        'Concevoir des interfaces conviviales',
        'Créer des wireframes, prototypes et composants d’interface utilisateur',
        'Collaborer avec les développeurs et l’équipe marketing',
        'Réaliser des études utilisateurs et tests d’utilisabilité',
      ],
      requirements: [
        'Plus de 3 ans d’expérience en conception UI/UX',
        'Maîtrise de Figma, Adobe XD ou Sketch',
        'Vaste portefeuille de projets de design',
        'Bonnes compétences en communication et travail d’équipe',
      ],
      advantages: [
        'Télétravail possible',
        'Horaires flexibles',
        'Opportunités d’évolution professionnelle',
        'Environnement créatif',
      ],
      company: 'Metz - Lockman',
      date: 'Sun Apr 06',
      logo: 'assets/images/entreprise.png',
      type: 'offre',
    },
    {
      title: 'Corporate Creative Administrator',
      position: 'Creative Administrator',
      location: 'Indiana',
      positions: 3,
      experience: '+1',
      contract: 'CDD',
      description: 'Nous recherchons un administrateur créatif...',
      responsibilities: [
        'Gérer les projets créatifs',
        'Coordonner les équipes',
        'Assurer le suivi des budgets',
      ],
      requirements: [
        'Expérience en gestion de projet',
        'Bonne communication',
        'Sens de l’organisation',
      ],
      advantages: ['Formation continue', 'Primes de performance'],
      company: 'Kihn Group',
      date: 'Sun Apr 06',
      logo: 'assets/images/entreprise.png',
      type: 'offre',
    },
    {
      title: 'Direct Directives Orchestrator',
      position: 'Directives Orchestrator',
      location: 'Georgia',
      positions: 1,
      experience: '+5',
      contract: 'Freelance',
      description: 'Nous recherchons un orchestrateur de directives...',
      responsibilities: [
        'Orchestrer les directives',
        'Gérer les priorités',
        'Assurer la qualité',
      ],
      requirements: [
        'Expérience en orchestration',
        'Leadership',
        'Gestion du temps',
      ],
      advantages: ['Rémunération attractive', 'Flexibilité'],
      company: 'Wunsch Inc',
      date: 'Sun Apr 06',
      logo: 'assets/images/entreprise.png',
      type: 'freelance',
    },
    {
      title: 'Human Group Analyst',
      position: 'Group Analyst',
      location: 'Maryland',
      positions: 5,
      experience: '+2',
      contract: 'CDI',
      description: 'Nous recherchons un analyste de groupe humain...',
      responsibilities: [
        'Analyser les données',
        'Rédiger des rapports',
        'Présenter les résultats',
      ],
      requirements: [
        'Expérience en analyse',
        'Maîtrise des outils statistiques',
        'Esprit critique',
      ],
      advantages: ['Mutuelle santé', 'Tickets restaurant'],
      company: 'Spencer - Rowe',
      date: 'Sun Apr 06',
      logo: 'assets/images/entreprise.png',
      type: 'offre',
    },
    {
      title: 'Principal Directives Facilitator',
      position: 'Directives Facilitator',
      location: 'Tennessee',
      positions: 2,
      experience: '+3',
      contract: 'CDD',
      description: 'Nous recherchons un facilitateur de directives...',
      responsibilities: [
        'Faciliter les réunions',
        'Animer les ateliers',
        'Rédiger les comptes rendus',
      ],
      requirements: [
        'Expérience en facilitation',
        'Bonne communication',
        'Sens de l’écoute',
      ],
      advantages: ['Formations', 'Événements d’équipe'],
      company: 'Blick - Von',
      date: 'Sun Apr 06',
      logo: 'assets/images/entreprise.png',
      type: 'stage',
    },
    {
      title: 'Principal Directives Facilitator',
      position: 'Directives Facilitator',
      location: 'Tennessee',
      positions: 2,
      experience: '+3',
      contract: 'CDD',
      description: 'Nous recherchons un facilitateur de directives...',
      responsibilities: [
        'Faciliter les réunions',
        'Animer les ateliers',
        'Rédiger les comptes rendus',
      ],
      requirements: [
        'Expérience en facilitation',
        'Bonne communication',
        'Sens de l’écoute',
      ],
      advantages: ['Formations', 'Événements d’équipe'],
      company: 'Blick - Von',
      date: 'Sun Apr 06',
      logo: 'assets/images/entreprise.png',
      type: 'stage',
    },
    {
      title: 'Principal Directives Facilitator',
      position: 'Directives Facilitator',
      location: 'Tennessee',
      positions: 2,
      experience: '+3',
      contract: 'CDD',
      description: 'Nous recherchons un facilitateur de directives...',
      responsibilities: [
        'Faciliter les réunions',
        'Animer les ateliers',
        'Rédiger les comptes rendus',
      ],
      requirements: [
        'Expérience en facilitation',
        'Bonne communication',
        'Sens de l’écoute',
      ],
      advantages: ['Formations', 'Événements d’équipe'],
      company: 'Blick - Von',
      date: 'Sun Apr 06',
      logo: 'assets/images/entreprise.png',
      type: 'stage',
    },
    {
      title: 'Principal Directives Facilitator',
      position: 'Directives Facilitator',
      location: 'Tennessee',
      positions: 2,
      experience: '+3',
      contract: 'CDD',
      description: 'Nous recherchons un facilitateur de directives...',
      responsibilities: [
        'Faciliter les réunions',
        'Animer les ateliers',
        'Rédiger les comptes rendus',
      ],
      requirements: [
        'Expérience en facilitation',
        'Bonne communication',
        'Sens de l’écoute',
      ],
      advantages: ['Formations', 'Événements d’équipe'],
      company: 'Blick - Von',
      date: 'Sun Apr 06',
      logo: 'assets/images/entreprise.png',
      type: 'stage',
    },
  ];
  filteredOffers: any[] = [];
  positionFilter: string = '';
  locationFilter: string = '';
  offerType: string = '';
  positionSuggestions: string[] = [];
  showPositionSuggestions = false;
  selectedOfferIndex = 0;
  selectedOffer: any;
  showModal = false;
  locationSuggestions: string[] = [];
  showLocationSuggestions = false;
  preventBlurLocation = false;
  preventBlur = false;
  @ViewChildren('offerDescription') offerDescriptions!: QueryList<ElementRef>;

  ngAfterViewInit() {
    this.offerDescriptions.forEach((element: ElementRef, index: number) => {
      const description = this.offers[index].description;
      const maxLength = 100; // Adjust as needed
      if (description.length > maxLength) {
        element.nativeElement.textContent =
          description.substring(0, maxLength) + '...';
      } else {
        element.nativeElement.textContent = description;
      }
    });
  }
  ngOnInit() {
    this.filteredOffers = [...this.offers];
    this.selectedOffer = this.filteredOffers[0];
  }
  suggestPositions() {
    if (this.positionFilter == '') {
      this.positionSuggestions = [];
      this.showPositionSuggestions = false;
      return;
    }
    const term = this.positionFilter.toLowerCase();
    if (!term) {
      this.positionSuggestions = [];
      this.showPositionSuggestions = false;
      return;
    }
    const positions = this.offers
      .map((o) => o.position)
      .filter((pos) => pos.toLowerCase().includes(term));
    this.positionSuggestions = Array.from(new Set(positions)).slice(0, 10);
    this.showPositionSuggestions = this.positionSuggestions.length > 0;
  }
  selectPositionSuggestion(suggestion: string) {
    this.positionFilter = suggestion;
    this.showPositionSuggestions = false;
  }
  filterOffers() {
    this.suggestPositions();
    this.filteredOffers = this.offers.filter((offer) => {
      const positionMatch =
        !this.positionFilter ||
        offer.position
          .toLowerCase()
          .includes(this.positionFilter.toLowerCase());
      const locationMatch =
        !this.locationFilter ||
        offer.location
          .toLowerCase()
          .includes(this.locationFilter.toLowerCase());
      const typeMatch = !this.offerType || offer.type === this.offerType;
      return positionMatch && locationMatch && typeMatch;
    });
    this.showPositionSuggestions = false;
    this.selectedOfferIndex = 0;
    this.selectedOffer =
      this.filteredOffers.length > 0 ? this.filteredOffers[0] : null;
  }
  setOfferType(type: string) {
    this.showPositionSuggestions = false;

    this.offerType = type;
    this.filterOffers();
  }
  selectOffer(index: number) {
    this.selectedOfferIndex = index;
    this.selectedOffer = this.filteredOffers[index];
    if (window.innerWidth < 1200) {
      this.showModal = true;
    }
  }
  closeModal() {
    this.showModal = false;
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
  hidePositionSuggestionsDelayed() {
    if (this.preventBlur) {
      return;
    }
    setTimeout(() => {
      this.showPositionSuggestions = false;
    }, 200);
  }
  suggestLocations() {
    if (this.locationFilter === '') {
      this.locationSuggestions = [];
      this.showLocationSuggestions = false;
      return;
    }

    const term = this.locationFilter.toLowerCase();
    const locations = this.offers
      .map((o) => o.location)
      .filter((loc) => loc.toLowerCase().includes(term));

    this.locationSuggestions = Array.from(new Set(locations)).slice(0, 10);
    this.showLocationSuggestions = this.locationSuggestions.length > 0;
  }

  // Add this method
  selectLocationSuggestion(suggestion: string) {
    this.locationFilter = suggestion;
    this.showLocationSuggestions = false;
  }

  // Update the existing blur handler
  hideLocationSuggestionsDelayed() {
    setTimeout(() => {
      if (!this.preventBlurLocation) {
        this.showLocationSuggestions = false;
      }
    }, 200);
  }
  get pagedOffers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredOffers.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOffers.length / this.pageSize);
  }

  changePage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
    }
  }

  getPagesArray(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }
}
