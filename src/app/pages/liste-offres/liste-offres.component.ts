import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import * as bootstrap from 'bootstrap';
import { forkJoin, of } from 'rxjs';
import { CandidatureService } from 'src/app/services/CandidatureService';
import { EntrepriseService } from 'src/app/services/EntrepriseService';
import { OffreService } from 'src/app/services/OffreService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-liste-offres',
  templateUrl: './liste-offres.component.html',
  styleUrls: ['./liste-offres.component.css'],
})
export class ListeOffresComponent implements OnInit {
  menuOpen = false;
  pageSize = 6; // Number of items per page
  currentPage = 1; // Current page number
  offers: any[] = [];
  isVerificationMode = false;
  showMotivationModal = false;
  motivationText = '';
  candidatureLoading = false;
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
  acceptCommission = false;
  isCandidat = false;
  role!: any;
  isConnected = false;
  budgetPropose: number | null = null;
  @ViewChildren('offerDescription') offerDescriptions!: QueryList<ElementRef>;
  constructor(
    private offreService: OffreService,
    private candidatureService: CandidatureService,
    private entrepriseService: EntrepriseService
  ) {}

  ngOnInit(): void {
    this.loadOffresValidees();
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
  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (e) {
      return null;
    }
  }
  loadOffresValidees(): void {
    this.offreService.getOffresValidees().subscribe({
      next: (data) => {
        // Mappe les offres
        this.offers = data.map((offre) => ({
          id: offre.id,
          title: offre.titre,
          description: offre.description,
          responsibilities: offre.responsabilites || [],
          advantages: offre.avantages || [],
          date: offre.datePublication,
          dateExpiration: offre.dateExpiration,
          positions: offre.postsVacants,
          specilite: offre.specilite,
          experience: offre.experience,
          niveauEtudes: offre.niveauEtudes,
          location: offre.localisation,
          typeTemps: offre.typeTemps,
          validee: offre.validee,
          contract: offre.typeOffre,
          requirements: offre.exigances || [],
          entrepriseId: offre.entrepriseId,
          company: '', // sera rempli après
          logo: '', // sera rempli après
        }));

        const entrepriseRequests = this.offers.map((offer) =>
          offer.entrepriseId
            ? this.entrepriseService.getEntrepriseById(offer.entrepriseId)
            : of(null)
        );

        forkJoin(entrepriseRequests).subscribe((entreprises) => {
          entreprises.forEach((entreprise, i) => {
            if (entreprise) {
              this.offers[i].company = entreprise.nom || 'Entreprise inconnue';
              this.offers[i].logo =
                entreprise.logoUrl || 'assets/images/entreprise.png';
            } else {
              this.offers[i].company = 'Entreprise inconnue';
              this.offers[i].logo = 'assets/images/entreprise.png';
            }
          });
          this.filteredOffers = [...this.offers];
          this.selectedOffer =
            this.filteredOffers.length > 0 ? this.filteredOffers[0] : null;
        });
      },
      error: () => {
        // Gérer l'erreur
      },
    });
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
  suggestPositions() {
    if (!this.positionFilter.trim()) {
      this.positionSuggestions = [];
      this.showPositionSuggestions = false;
      return;
    }
    const term = this.positionFilter.toLowerCase();
    const positions = this.offers
      .map((o) => o.title)
      .filter((pos) => pos.toLowerCase().includes(term));
    this.positionSuggestions = Array.from(new Set(positions)).slice(0, 10);
    this.showPositionSuggestions = this.positionSuggestions.length > 0;
  }

  filterOffers() {
    console.log(this.offers);
    this.suggestPositions();
    this.filteredOffers = this.offers.filter((offer) => {
      const positionMatch =
        !this.positionFilter ||
        offer.title.toLowerCase().includes(this.positionFilter.toLowerCase());
      const locationMatch =
        !this.locationFilter ||
        offer.location
          .toLowerCase()
          .includes(this.locationFilter.toLowerCase());
      const typeMatch = !this.offerType || offer.contract === this.offerType;
      return positionMatch && locationMatch && typeMatch;
    });
    this.showPositionSuggestions = false;
    this.selectedOfferIndex = 0;
    this.selectedOffer =
      this.filteredOffers.length > 0 ? this.filteredOffers[0] : null;
    this.currentPage = 1; // Revenir à la première page après filtre
  }

  setOfferType(type: string) {
    this.offerType = type;
    this.filterOffers();
  }
  getAll() {
    this.offerType = '';
    this.loadOffresValidees();
  }
  selectPositionSuggestion(suggestion: string) {
    this.positionFilter = suggestion;
    this.showPositionSuggestions = false;
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
    if (!this.locationFilter.trim()) {
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

  selectLocationSuggestion(suggestion: string) {
    this.locationFilter = suggestion;
    this.showLocationSuggestions = false;
    this.filterOffers();
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
      .map((_, i) => i + 1);
  }
  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const decoded: any = this.decodeToken(token);
    return decoded.role || null;
  }

  getUserId(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const decoded: any = this.decodeToken(token);
    return decoded.id || null;
  }

  onApplyClick() {
    const role = this.getUserRole();
    if (!role) {
      Swal.fire({
        icon: 'info',
        title: 'Connexion requise',
        text: 'Veuillez vous connecter pour postuler.',
        confirmButtonText: 'Se connecter',
      }).then(() => {
        this.openSignupModal();
      });
      return;
    }
    if (role !== 'CANDIDAT') {
      Swal.fire({
        icon: 'warning',
        title: 'Accès refusé',
        text: 'Seuls les candidats peuvent postuler à une offre.',
        confirmButtonText: 'OK',
      });
      return;
    }
    this.showMotivationModal = true;
    this.motivationText = '';
  }
  isCandidatureInvalid(): boolean {
    if (!this.motivationText || !this.motivationText.trim()) return true;

    if (this.selectedOffer?.contract === 'freelance') {
      if (!this.budgetPropose || this.budgetPropose <= 0) return true;
      if (!this.acceptCommission) return true;
    }

    return false;
  }

  submitCandidature() {
    if (!this.motivationText.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Motivation requise',
        text: 'Merci de renseigner votre motivation.',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (this.selectedOffer.contract === 'freelance') {
      if (this.budgetPropose === null || this.budgetPropose <= 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Budget requis',
          text: 'Merci d’indiquer votre budget proposé pour ce projet freelance.',
          confirmButtonText: 'OK',
        });
        return;
      }

      if (!this.acceptCommission) {
        Swal.fire({
          icon: 'warning',
          title: 'Commission obligatoire',
          text: 'Vous devez accepter la commission de 10% du site pour postuler à cette offre freelance.',
          confirmButtonText: 'OK',
        });
        return;
      }
    }

    this.candidatureLoading = true;
    const candidature: any = {
      utilisateurId: this.getUserId()!,
      offreId: this.selectedOffer.id,
      motivation: this.motivationText,
      entrepriseId: this.selectedOffer.entrepriseId,
    };

    if (this.selectedOffer.contract === 'freelance') {
      candidature.budgetPropose = this.budgetPropose;
    }

    this.candidatureService.postuler(candidature).subscribe({
      next: () => {
        this.showMotivationModal = false;
        this.motivationText = '';
        this.budgetPropose = null;
        this.acceptCommission = false; // reset checkbox
        this.candidatureLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Candidature envoyée',
          text: 'Votre candidature a été envoyée avec succès !',
          confirmButtonText: 'OK',
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de la soumission de la candidature.',
          confirmButtonText: 'OK',
        });
        this.candidatureLoading = false;
      },
    });
  }
}
