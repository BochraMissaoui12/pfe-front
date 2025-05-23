import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppelOffreService } from 'src/app/services/AppelOffreService';
import { ReponseAppelService } from 'src/app/services/ResponseAppelService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appeld-offres',
  templateUrl: './appeld-offres.component.html',
  styleUrls: ['./appeld-offres.component.css'],
})
export class AppeldOffresComponent implements OnInit {
  role: string | null = null;
  isConnected: boolean = false;
  isVerificationMode: boolean = false;
  menuOpen: boolean = false;
  reponseForm!: FormGroup;
  appelOffres: any[] = [];
  selectedAppel: any = null;
  constructor(
    private router: Router,
    private reponseAppelService: ReponseAppelService,
    private fb: FormBuilder,
    private appelOffreService: AppelOffreService
  ) {}

  ngOnInit(): void {
    this.loadAppelsOffres();
    this.checkRole();
    this.initForm();
  }

  checkRole(): void {
    const token = localStorage.getItem('token');
    this.role = token ? this.decodeToken(token)?.role : null;
  }

  loadAppelsOffres(): void {
    this.appelOffreService.getAll().subscribe({
      next: (data) => (this.appelOffres = data),
      error: (err) => console.error('Erreur de chargement', err),
    });
  }

  showDetails(id: string): void {
    if (this.role === 'ENTREPRISE') {
      this.appelOffreService.getById(id).subscribe({
        next: (data) => {
          this.selectedAppel = data;
          const modal = document.getElementById('detailsModal');
          (window as any).bootstrap.Modal.getOrCreateInstance(modal).show();
        },
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Accès restreint',
        text: "Veuillez vous connecter en tant qu'entreprise pour voir les détails complets",
        confirmButtonText: 'Se connecter',
      }).then(() => {
        this.openSignupModal();
      });
    }
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  openSignupModal(): void {
    const modal = document.getElementById('signupModal');
    if (modal) {
      (window as any).bootstrap.Modal.getOrCreateInstance(modal).show();
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    const navLinks = document.querySelector('.nav-links') as HTMLElement;
    if (navLinks) {
      if (this.menuOpen) {
        navLinks.classList.add('active');
        navLinks.style.display = 'flex';
      } else {
        navLinks.classList.remove('active');
        navLinks.style.display = '';
      }
    }
  }
  openReponseModal(appelId: string | undefined): void {
    if (this.role !== 'ENTREPRISE') {
      Swal.fire({
        icon: 'warning',
        title: 'Accès restreint',
        text: "Veuillez vous connecter en tant qu'entreprise pour répondre à cet appel d'offre",
        confirmButtonText: 'Se connecter',
      }).then(() => {
        this.openSignupModal();
      });
      return;
    }

    if (!appelId) {
      Swal.fire('Erreur', "Aucun appel d'offre sélectionné", 'error');
      return;
    }

    this.selectedAppel = this.appelOffres.find((a) => a.id === appelId);
    this.reponseForm.reset();
    const modal = document.getElementById('reponseModal');
    (window as any).bootstrap.Modal.getOrCreateInstance(modal).show();
  }

  initForm(): void {
    this.reponseForm = this.fb.group({
      nomEntreprise: ['', Validators.required],
      emailEntreprsie: ['', [Validators.required, Validators.email]],
      messages: ['', Validators.required],
    });
  }

  submitReponse(): void {
    if (this.reponseForm.invalid) {
      this.reponseForm.markAllAsTouched();
      return;
    }

    const reponse: any = {
      appelId: this.selectedAppel.id,
      nomEntreprise: this.reponseForm.value.nomEntreprise,
      emailEntreprsie: this.reponseForm.value.emailEntreprsie,
      messages: this.reponseForm.value.messages,
    };

    this.reponseAppelService.envoyerReponse(reponse).subscribe({
      next: () => {
        Swal.fire(
          'Succès',
          'Votre réponse a été envoyée avec succès.',
          'success'
        );
        const modal = document.getElementById('reponseModal');
        (window as any).bootstrap.Modal.getInstance(modal).hide();
      },
      error: () => {
        Swal.fire(
          'Erreur',
          "Une erreur est survenue lors de l'envoi.",
          'error'
        );
      },
    });
  }
}
