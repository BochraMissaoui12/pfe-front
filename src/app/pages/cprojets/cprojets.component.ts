import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjetService } from 'src/app/services/ProjetService';
import { ReponseProjetService } from 'src/app/services/ReponseProjetService';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-cprojets',
  templateUrl: './cprojets.component.html',
  styleUrls: ['./cprojets.component.css'],
})
export class CprojetsComponent implements OnInit {
  menuOpen: boolean = false;
  showUpdateModal: boolean = false;
  selectedProjet: any = null;
  updatedProjet: any = {};

  projets: any[] = [];
  responsesMap: { [projetId: string]: any[] } = {};

  showResponsesModal: boolean = false;
  selectedProjetResponses: any[] = [];
  selectedProjetTitre: string = '';

  chercheurId: string = '';

  constructor(
    private router: Router,
    private projetService: ProjetService,
    private reponseProjetService: ReponseProjetService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.id) {
      this.router.navigate(['/login']);
      return;
    }
    this.chercheurId = decoded.id;

    this.loadProjets();
  }

  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  loadProjets() {
    this.projetService.getProjetsByChercheurId(this.chercheurId).subscribe({
      next: (data) => {
        this.projets = data;
        // Charger les réponses pour chaque projet
        this.projets.forEach((projet) => {
          this.loadResponses(projet.id!);
        });
      },
      error: () => {
        this.projets = [];
      },
    });
  }
  deleteProjet(projetId: string) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action supprimera définitivement ce projet.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.projetService.deleteProjet(projetId).subscribe({
          next: () => {
            Swal.fire('Supprimé !', 'Le projet a été supprimé.', 'success');
            this.loadProjets(); // Recharge la liste après suppression
          },
          error: () => {
            Swal.fire('Erreur', 'Impossible de supprimer le projet.', 'error');
          },
        });
      }
    });
  }
  loadResponses(projetId: string) {
    this.reponseProjetService.getReponsesByProjetId(projetId).subscribe({
      next: (responses) => {
        this.responsesMap[projetId] = responses;
      },
      error: () => {
        this.responsesMap[projetId] = [];
      },
    });
  }
  openUpdateModal(projet: any) {
    this.selectedProjet = projet;
    // Clone pour éviter modification directe avant validation
    this.updatedProjet = { ...projet };
    this.showUpdateModal = true;
  }

  closeUpdateModal() {
    this.showUpdateModal = false;
    this.selectedProjet = null;
    this.updatedProjet = {};
  }

  submitUpdate(form: any) {
    if (form.invalid) return;

    this.projetService
      .updateProjet(this.selectedProjet.id, this.updatedProjet)
      .subscribe({
        next: () => {
          Swal.fire('Succès', 'Le projet a été mis à jour.', 'success');
          this.closeUpdateModal();
          this.loadProjets(); // Recharge la liste pour voir les changements
        },
        error: () => {
          Swal.fire(
            'Erreur',
            'Impossible de mettre à jour le projet.',
            'error'
          );
        },
      });
  }
  openResponsesModal(projet: any) {
    this.selectedProjetTitre = projet.titre;
    this.selectedProjetResponses = this.responsesMap[projet.id!] || [];
    this.showResponsesModal = true;
  }

  closeResponsesModal() {
    this.showResponsesModal = false;
    this.selectedProjetResponses = [];
    this.selectedProjetTitre = '';
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    const navLinks = document.querySelector('.nav-links') as HTMLElement;
    const icons = document.querySelector('.icons') as HTMLElement;
    if (navLinks) {
      this.menuOpen
        ? navLinks.classList.add('active')
        : navLinks.classList.remove('active');
    }
    if (icons) {
      this.menuOpen
        ? icons.classList.add('active')
        : icons.classList.remove('active');
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
