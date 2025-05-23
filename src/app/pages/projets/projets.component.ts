import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { map, forkJoin } from 'rxjs';
import { ChercheurService } from 'src/app/services/ChercheurService';
import { ProjetService } from 'src/app/services/ProjetService';
import { ReponseProjetService } from 'src/app/services/ReponseProjetService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-projets',
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.css'],
})
export class ProjetsComponent implements OnInit {
  menuOpen = false;
  isVerificationMode = false;
  role!: any;
  isConnected = false;
  projets: any[] = [];
  selectedProjetResponses: any[] = [];
  showResponsesModal = false;
  showAddResponseModal = false;
  selectedProjet: any = null;

  // Formulaire réponse
  newResponse = {
    nom: '',
    email: '',
    message: '',
  };
  constructor(
    private projetService: ProjetService,
    private reponseProjetService: ReponseProjetService,
    private chercheurService: ChercheurService
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
    this.loadProjets();
  }
  loadProjets() {
    this.projetService.getProjetsByStatut('publié').subscribe({
      next: (projetsData) => {
        const projetsWithChercheur$ = projetsData.map((projet) =>
          this.chercheurService.getChercheurById(projet.chercheurId).pipe(
            map((chercheur) => ({
              ...projet,
              chercheurNom: chercheur
                ? `${chercheur.prenom} ${chercheur.nom}`
                : 'Inconnu',
            }))
          )
        );
        forkJoin(projetsWithChercheur$).subscribe({
          next: (projetsAvecNom) => (this.projets = projetsAvecNom),
          error: () => (this.projets = projetsData),
        });
      },
      error: () => (this.projets = []),
    });
  }

  openAddResponseModal(projet: any) {
    this.selectedProjet = projet;
    this.newResponse = { nom: '', email: '', message: '' };
    this.showAddResponseModal = true;
  }

  closeAddResponseModal() {
    this.showAddResponseModal = false;
    this.selectedProjet = null;
  }

  submitResponse() {
    if (
      !this.newResponse.nom ||
      !this.newResponse.email ||
      !this.newResponse.message
    ) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs.', 'warning');
      return;
    }
    const responseToSend = {
      ...this.newResponse,
      projetId: this.selectedProjet.id,
    };
    this.reponseProjetService.createReponse(responseToSend).subscribe({
      next: () => {
        Swal.fire('Merci', 'Votre réponse a été envoyée.', 'success');
        this.closeAddResponseModal();
      },
      error: () => {
        Swal.fire('Erreur', "Impossible d'envoyer la réponse.", 'error');
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
