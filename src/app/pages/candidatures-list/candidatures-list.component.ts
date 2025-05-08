import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CandidatureService } from 'src/app/services/CandidatureService';
import { EntrepriseService } from 'src/app/services/EntrepriseService';
import { OffreService } from 'src/app/services/OffreService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-candidatures-list',
  templateUrl: './candidatures-list.component.html',
  styleUrls: ['./candidatures-list.component.css'],
})
export class CandidaturesListComponent implements OnInit {
  candidatures: any[] = [];
  loading = true;
  menuOpen = false;
  currentPage = 1;
  itemsPerPage = 4;
  pagedCandidatures: any[] = [];
  totalPages = 0;

  constructor(
    private candidatureService: CandidatureService,
    private entrepriseService: EntrepriseService,
    private offreService: OffreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;
      this.candidatureService.getCandidaturesParUtilisateur(userId).subscribe({
        next: (candidatures) => {
          if (!candidatures || candidatures.length === 0) {
            this.candidatures = [];
            this.loading = false;
          } else {
            this.enrichirCandidatures(candidatures);
          }
        },
        error: () => {
          this.loading = false;
        },
      });
    }
  }

  enrichirCandidatures(candidatures: any[]) {
    // Utilise catchError pour chaque requête
    const offreRequests = candidatures.map((c) =>
      this.offreService.getOffreById(c.offreId).pipe(catchError(() => of(null)))
    );
    const entrepriseRequests = candidatures.map((c) =>
      this.entrepriseService
        .getEntrepriseById(c.entrepriseId)
        .pipe(catchError(() => of(null)))
    );
    console.log(offreRequests);
    forkJoin([forkJoin(offreRequests), forkJoin(entrepriseRequests)]).subscribe(
      {
        next: ([offres, entreprises]) => {
          this.candidatures = candidatures.map((c, i) => ({
            ...c,
            offreTitre: offres[i]?.titre || 'Offre inconnue',
            entrepriseNom: entreprises[i]?.nom || 'Entreprise inconnue',
            entrepriseLogo:
              entreprises[i]?.logoUrl || 'assets/images/entreprise.png',
          }));
          this.updatePagination();

          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      }
    );
  }
  pageSuivante(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  pagePrecedente(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
  supprimerCandidature(id: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.candidatureService.supprimerCandidature(id).subscribe({
          next: () => {
            this.candidatures = this.candidatures.filter((c) => c.id !== id);
            this.updatePagination();
            Swal.fire(
              'Supprimé !',
              'La candidature a bien été supprimée.',
              'success'
            );
          },
          error: () => {
            Swal.fire(
              'Erreur',
              'Une erreur est survenue lors de la suppression.',
              'error'
            );
          },
        });
      }
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.candidatures.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedCandidatures = this.candidatures.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  getStatusClass(statut: string): string {
    switch (statut) {
      case 'Accepté':
        return 'statut-accepte';
      case 'Présélectionné':
        return 'statut-preselectionne';
      case 'Refusé':
        return 'statut-refuse';
      case 'En attente':
        return 'statut-attente';
      default:
        return '';
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
