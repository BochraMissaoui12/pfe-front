import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProblemeTechniqueService } from 'src/app/services/ProblemeTechniqueService';
import { ReponseProblemeService } from 'src/app/services/ReponseProblemeService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eproblemes',
  templateUrl: './eproblemes.component.html',
  styleUrls: ['./eproblemes.component.css'],
})
export class EproblemesComponent implements OnInit {
  menuOpen = false;
  entrepriseId: string = '';
  problemes: any[] = [];

  // Modal réponses
  showReponsesModal = false;
  reponses: any[] = [];
  selectedProbleme: any = null;

  constructor(
    private router: Router,
    private problemeService: ProblemeTechniqueService,
    private reponseService: ReponseProblemeService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeToken(token);
      this.entrepriseId = decodedToken?.id;
      if (this.entrepriseId) {
        this.loadProblemes();
      }
    } else {
      this.router.navigate(['/']);
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

  loadProblemes() {
    this.problemeService.getByEntreprise(this.entrepriseId).subscribe({
      next: (data) => {
        this.problemes = data;
      },
      error: (err) => {
        console.error('Erreur chargement problèmes', err);
        Swal.fire('Erreur', 'Impossible de charger les problèmes.', 'error');
      },
    });
  }

  supprimerProbleme(id: string) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.problemeService.deleteProbleme(id).subscribe({
          next: () => {
            Swal.fire('Supprimé', 'Le problème a été supprimé.', 'success');
            this.loadProblemes();
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

  voirReponses(probleme: any) {
    this.selectedProbleme = probleme;
    this.reponseService.getByProbleme(probleme.id).subscribe({
      next: (data) => {
        this.reponses = data;
        this.showReponsesModal = true;
      },
      error: () => {
        Swal.fire(
          'Erreur',
          'Impossible de charger les réponses pour ce problème.',
          'error'
        );
      },
    });
  }

  closeReponsesModal() {
    this.showReponsesModal = false;
    this.reponses = [];
    this.selectedProbleme = null;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    const navLinks = document.querySelector('.nav-links') as HTMLElement;
    if (this.menuOpen) {
      navLinks.classList.add('active');
      navLinks.style.display = 'flex';
    } else {
      navLinks.classList.remove('active');
      navLinks.style.display = '';
    }
  }
}
