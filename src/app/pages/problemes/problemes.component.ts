import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { EntrepriseService } from 'src/app/services/EntrepriseService';
import { ProblemeTechniqueService } from 'src/app/services/ProblemeTechniqueService';
import { ReponseProblemeService } from 'src/app/services/ReponseProblemeService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-problemes',
  templateUrl: './problemes.component.html',
  styleUrls: ['./problemes.component.css'],
})
export class ProblemesComponent implements OnInit {
  menuOpen = false;
  isVerificationMode = false;
  role!: any;
  entreprises: any;
  isConnected = false;
  problemes: any[] = [];
  loading = false;
  envoiEnCours: { [problemeId: string]: boolean } = {};
  reponses: {
    [problemeId: string]: {
      nomUtilisateur?: string;
      emailUtilisateur?: string;
      solution: string;
      file?: File;
    };
  } = {};

  constructor(
    private cdr: ChangeDetectorRef,
    private entrepriseService: EntrepriseService,
    private problemeService: ProblemeTechniqueService,
    private reponseService: ReponseProblemeService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.entrepriseService.getAllEntreprises().subscribe({
      next: (data) => (this.entreprises = data),
      error: () => (this.entreprises = []),
    });
    this.problemeService.getProblemesPublies().subscribe({
      next: (data) => {
        this.problemes = data;
        // Initialisation des objets reponses pour éviter undefined
        this.problemes.forEach((p) => {
          if (!this.reponses[p.id]) {
            this.reponses[p.id] = {
              nomUtilisateur: '',
              emailUtilisateur: '',
              solution: '',
            };
          }
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire(
          'Erreur',
          'Impossible de charger les problèmes techniques.',
          'error'
        );
      },
    });

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
  getEntreprise(p: any) {
    return this.entreprises.find((e: any) => e.id === p.entrepriseId);
  }

  onFileSelected(problemeId: string, event: any) {
    if (!this.reponses[problemeId]) {
      this.reponses[problemeId] = {
        nomUtilisateur: '',
        emailUtilisateur: '',
        solution: '',
      };
    }
    if (event.target.files.length > 0) {
      this.reponses[problemeId].file = event.target.files[0];
    }
  }

  envoyerReponse(probleme: any) {
    const reponse = this.reponses[probleme.id];
    if (
      !reponse ||
      !reponse.solution.trim() ||
      !reponse.nomUtilisateur?.trim() ||
      !reponse.emailUtilisateur?.trim()
    ) {
      Swal.fire(
        'Erreur',
        'Veuillez remplir tous les champs obligatoires.',
        'error'
      );
      return;
    }
    this.envoiEnCours[probleme.id] = true;
    const payload = {
      problemeId: probleme.id,
      nomUtilisateur: reponse.nomUtilisateur,
      emailUtilisateur: reponse.emailUtilisateur,
      solution: reponse.solution,
      fichiersUrls: [],
    };
    this.reponseService.createReponseWithFile(payload, reponse.file).subscribe({
      next: () => {
        Swal.fire('Merci !', 'Votre solution a bien été envoyée.', 'success');
        this.reponses[probleme.id] = {
          solution: '',
          nomUtilisateur: '',
          emailUtilisateur: '',
        };
        this.envoiEnCours[probleme.id] = false;
      },
      error: () => {
        Swal.fire('Erreur', "Erreur lors de l'envoi de la solution.", 'error');
        this.envoiEnCours[probleme.id] = false;
      },
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
