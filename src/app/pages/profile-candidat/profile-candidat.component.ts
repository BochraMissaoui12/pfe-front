import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { SkillService } from 'src/app/services/SkillService';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { UtilisateurService } from 'src/app/services/UtilisateurService';
import { CandidatService } from 'src/app/services/CandidatService';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CvService } from 'src/app/services/CvService';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-candidat',
  templateUrl: './profile-candidat.component.html',
  styleUrls: ['./profile-candidat.component.css'],
})
export class ProfileCandidatComponent implements OnInit {
  menuOpen = false;
  educations: any[] = [];
  educationForm: FormGroup;
  experienceForm: FormGroup;
  experiences: any[] = [];
  skills: string[] = [];
  candidatForm: FormGroup;
  suggestions: string[] = [];
  years: number[] = [];
  user: any;
  isModalOpen = false;
  isCandidat = false;
  isConnected = false;
  templates = [
    { id: 1, name: 'Template Moderne' },
    { id: 2, name: 'Template Classique' },
    { id: 3, name: 'Template Coloré' },
  ];
  selectedTemplate: number | null = null;
  constructor(
    private cvService: CvService,
    private fb: FormBuilder,
    private router: Router,
    private skillService: SkillService,
    private utilisateurService: UtilisateurService,
    private candidatService: CandidatService
  ) {
    this.candidatForm = this.fb.group({
      skillInput: [''],
    });
    this.educationForm = this.fb.group({
      universite: ['', Validators.required],
      diplome: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [''],
      domaineEtude: ['', Validators.required],
    });

    this.experienceForm = this.fb.group({
      entreprise: ['', Validators.required],
      poste: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [''],
    });
  }

  ngOnInit(): void {
    if (!sessionStorage.getItem('reloaded')) {
      sessionStorage.setItem('reloaded', 'true');
      window.location.reload();
    } else {
      sessionStorage.removeItem('reloaded');
    }
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1950; year--) {
      this.years.push(year);
    }
    // Récupérer le token du localStorage
    const token = localStorage.getItem('token'); // Remplacez par la clé exacte où votre token est stocké

    if (token) {
      const decodedToken = this.decodeToken(token);
      const id = decodedToken.id; // Assurez-vous que l'ID est dans le token
      const role = decodedToken.role; // Assurez-vous que le rôle est dans le token

      this.utilisateurService
        .getUtilisateurByIdAndRole(id, role)
        .subscribe((data) => {
          this.user = data;
          this.educations = data.education || [];
          this.experiences = data.experience || [];
          this.skills = data.skills || [];
          console.log('Utilisateur chargé', data);
        });
    } else {
      console.error('Token non trouvé dans le localStorage');
    }

    // Logic pour gérer la recherche et l'affichage des suggestions de compétences
    this.candidatForm
      .get('skillInput')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value: string) => {
        if (value?.length >= 2) {
          this.skillService.searchSkills(value).subscribe((res) => {
            this.suggestions = res;
          });
        } else {
          this.suggestions = [];
        }
      });
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    this.uploadCv(file);
  }
  uploadCv(file: File) {
    const formData = new FormData();
    formData.append('cv', file);
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = this.decodeToken(token);
      const role = decodedToken.role;

      this.candidatService.updateCv(this.user.id, formData).subscribe(
        (response) => {
          this.utilisateurService
            .getUtilisateurByIdAndRole(this.user.id, role)
            .subscribe(
              (data) => {
                this.user = data;
                Swal.fire({
                  icon: 'success',
                  title: 'Succès',
                  text: 'cv changé avec succes',
                });
              },
              (error) => {
                console.error(
                  'Erreur lors de la récupération des données utilisateur',
                  error
                );
                Swal.fire({
                  icon: 'error',
                  title: 'Erreur',
                  text: "Erreur lors de la récupération des données de l'utilisateur",
                });
              }
            );
        },
        (error) => {
          console.error("Erreur lors de l'upload du CV", error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: "Erreur lors de l'upload du CV",
          });
        }
      );
    }
  }

  closeModall() {
    this.isModalOpen = false;
  }
  generateCv() {
    if (!this.selectedTemplate) return;

    this.cvService.generateCv(this.user.id, this.selectedTemplate).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cv_${this.user.nom}_template${this.selectedTemplate}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        this.closeModall(); // fermer la modale après téléchargement
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'CV généré et téléchargé avec succès!',
        });
      },
      (error) => {
        console.error('Erreur lors de la génération du CV', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de la génération du CV.',
        });
      }
    );
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
  openEducationModal() {
    const modalElement = document.getElementById('educationModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  updateExperience() {
    if (this.experienceForm.invalid) {
      return;
    }
    const newExperience = this.experienceForm.value;
    this.user.experience = this.user.experience || [];
    this.user.experience.push(newExperience);
    const updatedUser = {
      experience: this.user.experience,
    };
    this.candidatService
      .updateCandidatPartial(this.user.id, updatedUser)
      .subscribe({
        next: (response) => {
          console.log('Expérience mise à jour avec succès');
          this.closeModal('experienceModal');
          this.experienceForm.reset();
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Expérience mise à jour avec succès!',
          });
        },
        error: (error) => {
          console.error("Erreur lors de la mise à jour de l'expérience", error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: "Erreur lors de la mise à jour de l'expérience.",
          });
        },
      });
  }

  deleteEducation(index: number) {
    if (index < 0 || index >= this.user.education.length) return;
    this.user.education.splice(index, 1);
    const updatedUser = {
      education: this.user.education,
    };
    this.candidatService
      .updateCandidatPartial(this.user.id, updatedUser)
      .subscribe({
        next: () => {
          console.log('Formation supprimée et liste mise à jour');
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Formation supprimée avec succès!',
          });
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la formation', error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors de la suppression de la formation.',
          });
        },
      });
  }

  openSkillsModal() {
    const modalElement = document.getElementById('skillsModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  addSkill(skill?: string): void {
    const inputValue = this.candidatForm.get('skillInput')?.value?.trim();
    const value = skill || inputValue;

    if (!value) {
      return; // Ne rien faire si valeur vide ou null
    }

    if (!skill && this.suggestions.length > 0) {
      return; // Si suggestions affichées, n'ajoute que depuis suggestions
    }

    if (!this.skills.includes(value) && this.skills.length < 15) {
      this.skills.push(value);
    }

    this.candidatForm.get('skillInput')?.reset();
    this.suggestions = [];
  }

  removeSkill(index: number): void {
    if (index < 0 || index >= this.user.competance.length) {
      console.warn('Index de compétence invalide');
      return;
    }
    this.user.competance.splice(index, 1);
    const updatedUser = {
      competance: this.user.competance,
    };
    this.candidatService
      .updateCandidatPartial(this.user.id, updatedUser)
      .subscribe({
        next: () => {
          console.log('Compétence supprimée et liste mise à jour avec succès');
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Compétence supprimée avec succès!',
          });
        },
        error: (error) => {
          console.error(
            'Erreur lors de la suppression de la compétence',
            error
          );
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors de la suppression de la compétence.',
          });
        },
      });
  }

  openModal() {
    const modalElement = document.getElementById('editModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  openModall() {
    const modalElement = document.getElementById('Modal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  openExperienceModal() {
    const modalElement = document.getElementById('experienceModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  updateEducation() {
    if (this.educationForm.invalid) {
      return;
    }

    const newEducation = this.educationForm.value;

    this.user.education = this.user.education || [];

    this.user.education.push(newEducation);

    const updatedUser = {
      education: this.user.education,
    };

    this.candidatService
      .updateCandidatPartial(this.user.id, updatedUser)
      .subscribe({
        next: (response) => {
          console.log('Formation mise à jour avec succès');

          this.closeModal('educationModal');

          this.educationForm.reset();
          this.ngOnInit();
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Formation mise à jour avec succès!',
          });
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de la formation', error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors de la mise à jour de la formation.',
          });
        },
      });
  }

  deleteExperience(index: number) {
    if (index < 0 || index >= this.user.experience.length) return;
    this.user.experience.splice(index, 1);
    const updatedUser = {
      experience: this.user.experience,
    };
    this.candidatService
      .updateCandidatPartial(this.user.id, updatedUser)
      .subscribe({
        next: () => {
          console.log('Expérience supprimée et liste mise à jour');
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Expérience supprimée avec succès!',
          });
        },
        error: (error) => {
          console.error("Erreur lors de la suppression de l'expérience", error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: "Erreur lors de la suppression de l'expérience.",
          });
        },
      });
  }

  updateUserInfo() {
    const updatedUser = {
      bio: this.user.bio,
    };

    this.candidatService
      .updateCandidatPartial(this.user.id, updatedUser)
      .subscribe(
        (response) => {
          console.log('Utilisateur mis à jour avec succès');

          const modalElement = document.getElementById('editModal');
          if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
              modalInstance.hide();
            }
          }
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: "Informations de l'utilisateur mises à jour avec succès!",
          });
        },
        (error) => {
          console.error('Erreur lors de la mise à jour', error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: "Erreur lors de la mise à jour des informations de l'utilisateur.",
          });
        }
      );
  }
  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }

  updateSkills() {
    const combined = [...(this.user.competance || []), ...this.skills].filter(
      (s, i, arr) => s && s.trim().length > 0 && arr.indexOf(s) === i
    );
    this.user.competance = combined;
    this.candidatService
      .updateCandidatPartial(this.user.id, { competance: this.user.competance })
      .subscribe(
        (response) => {
          console.log('Compétences mises à jour avec succès');
          const modalElement = document.getElementById('skillsModal');
          if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
              modalInstance.hide();
            }
          }
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Compétences mises à jour avec succès!',
          });
        },
        (error) => {
          console.error('Erreur lors de la mise à jour des compétences', error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors de la mise à jour des compétences.',
          });
        }
      );
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
