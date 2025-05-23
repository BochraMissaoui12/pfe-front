import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChercheurService } from 'src/app/services/ChercheurService';
import { ProjetService } from 'src/app/services/ProjetService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profil-chercheur',
  templateUrl: './profil-chercheur.component.html',
  styleUrls: ['./profil-chercheur.component.css'],
})
export class ProfilChercheurComponent implements OnInit {
  menuOpen: boolean = false;
  projetForm: FormGroup;
  chercheur: any = {
    universite: '',
    bio: '',
    titre: '',
    domaine: '',
    nom: '',
    prenom: '',
    email: '',
    confirm: false,
    tel: '',
    role: '',
    gouvernement: '',
    adresse: '',
  };
  editingField: string | null = null;
  id: string = '';
  constructor(
    private router: Router,
    private projetService: ProjetService,
    private fb: FormBuilder,
    private chercheurService: ChercheurService
  ) {
    this.projetForm = this.fb.group({
      titre: ['', Validators.required],
      lieu: ['', Validators.required],
      annee: ['', Validators.required],
      cible: ['', Validators.required],
      description: ['', Validators.required],
      specialite: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    if (!sessionStorage.getItem('reloaded')) {
      sessionStorage.setItem('reloaded', 'true');
      window.location.reload();
    } else {
      sessionStorage.removeItem('reloaded');
    }
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
    this.id = decoded.id;

    this.chercheurService.getChercheurById(this.id).subscribe({
      next: (data) => (this.chercheur = data),
    });
  }
  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
  closeBootstrapModal(modalId: string) {
    const modal = document.getElementById(modalId);
    if (modal) {
      const modalInstance = (window as any).bootstrap.Modal.getInstance(modal);
      if (modalInstance) modalInstance.hide();
    }
    const backdrops = document.getElementsByClassName('modal-backdrop');
    while (backdrops.length > 0) {
      backdrops[0].parentNode?.removeChild(backdrops[0]);
    }
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('padding-right');
  }

  onSubmitProjet() {
    if (this.projetForm.valid) {
      const projet: any = {
        ...this.projetForm.value,
        chercheurId: this.id,
        statut: 'publié',
      };
      this.projetService.createProjet(projet).subscribe({
        next: () => {
          // Use your helper to fully close the modal and clean up
          this.closeBootstrapModal('addProjetModal');

          this.projetForm.reset({ statut: 'En attente' });

          Swal.fire({
            icon: 'success',
            title: 'Projet ajouté',
            text: 'Votre projet de thèse a bien été ajouté.',
            timer: 2500,
            showConfirmButton: false,
          });

          // Rafraîchir la liste des projets si besoin
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: "Une erreur est survenue lors de l'ajout du projet.",
            confirmButtonText: 'Réessayer',
          });
        },
      });
    }
  }

  startEdit(field: string) {
    this.editingField = field;
  }
  saveEdit(field: string) {
    if (!this.id) return;

    const updateData: { [key: string]: any } = {};
    updateData[field] = this.chercheur[field];

    this.chercheurService.updateChercheur(this.id, updateData).subscribe({
      next: (updated) => {
        this.chercheur = { ...this.chercheur, ...updated };
        this.editingField = null;
      },
      error: () => alert('Erreur lors de la mise à jour'),
    });
  }

  cancelEdit() {
    this.editingField = null;
    this.chercheurService
      .getChercheurById(this.id)
      .subscribe((data) => (this.chercheur = data));
  }
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    const navLinks = document.querySelector('.nav-links') as HTMLElement;
    const icons = document.querySelector('.icons') as HTMLElement;
    if (navLinks) {
      if (this.menuOpen) {
        navLinks.classList.add('active');
      } else {
        navLinks.classList.remove('active');
      }
    }
    if (icons) {
      if (this.menuOpen) {
        icons.classList.add('active');
      } else {
        icons.classList.remove('active');
      }
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
