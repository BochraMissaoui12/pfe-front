import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EntrepriseService } from 'src/app/services/EntrepriseService';
import { UtilisateurService } from 'src/app/services/UtilisateurService';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { OffreService } from 'src/app/services/OffreService';

@Component({
  selector: 'app-profile-entreprise',
  templateUrl: './profile-entreprise.component.html',
  styleUrls: ['./profile-entreprise.component.css'],
})
export class ProfileEntrepriseComponent implements OnInit {
  menuOpen = false;
  step = 1;
  entreprise: any;
  loading = true;
  error = false;
  offreForm!: FormGroup;
  headerForm: FormGroup;
  bioForm: FormGroup;

  constructor(
    private utilisateurService: UtilisateurService,
    private route: ActivatedRoute,
    private entrepriseService: EntrepriseService,
    private fb: FormBuilder,
    private router: Router,
    private offreService: OffreService
  ) {
    // Formulaire header
    this.headerForm = this.fb.group({
      nom: ['', Validators.required],
      secteurActivite: ['', Validators.required],
      tel: ['', Validators.required],
      adresse: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gouvernement: [''],
      responsable: [''],
      logo: [null], // fichier
    });

    // Formulaire bio
    this.bioForm = this.fb.group({
      bio: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeToken(token);
      if (!decodedToken) {
        this.error = true;
        this.loading = false;
        return;
      }
      const id = decodedToken.id;
      const role = decodedToken.role;
      if (!sessionStorage.getItem('reloaded')) {
        sessionStorage.setItem('reloaded', 'true');
        window.location.reload();
        return;
      } else {
        sessionStorage.removeItem('reloaded');
      }
      this.utilisateurService.getUtilisateurByIdAndRole(id, role).subscribe({
        next: (data) => {
          this.entreprise = data;
          this.loading = false;
          this.fillForms();
          this.offreForm = new FormGroup({
            titre: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            dateExpiration: new FormControl('', Validators.required),
            postsVacants: new FormControl('', Validators.required),
            specilite: new FormControl('', Validators.required), // check spelling
            experience: new FormControl('', Validators.required),
            niveauEtudes: new FormControl('', Validators.required),
            localisation: new FormControl('', Validators.required),
            typeTemps: new FormControl('', Validators.required),
            typeOffre: new FormControl('', Validators.required),
            responsabilites: new FormArray([]),
            avantages: new FormArray([]),
            exigances: new FormArray([]),
            entrepriseId: new FormControl(this.entreprise.id),
          });
        },
        error: (err) => {
          this.error = true;
          this.loading = false;
        },
      });
    } else {
      this.error = true;
      this.loading = false;
    }
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
  fillForms() {
    if (!this.entreprise) return;
    this.headerForm.patchValue({
      nom: this.entreprise.nom,
      secteurActivite: this.entreprise.secteurActivite,
      tel: this.entreprise.tel,
      adresse: this.entreprise.adresse,
      email: this.entreprise.email,
      gouvernement: this.entreprise.gouvernement,
      responsable: this.entreprise.responsable,
    });
    this.bioForm.patchValue({
      bio: this.entreprise.bio,
    });
  }
  logoPreview: string | ArrayBuffer | null = null;

  onLogoSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.headerForm.patchValue({ logo: file });

      // Générer un preview du fichier image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.logoPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submitHeader() {
    if (this.headerForm.invalid) return;

    const formData = new FormData();
    Object.entries(this.headerForm.value).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        if (key === 'logo' && value instanceof File) {
          formData.append('logo', value);
        } else {
          formData.append(key, value as string);
        }
      }
    });

    this.entrepriseService
      .updateEntreprisePartial(this.entreprise.id, formData)
      .subscribe({
        next: (updated) => {
          this.entreprise = updated;
          this.fillForms();
          this.closeModal('editHeaderModal');
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Informations mises à jour avec succès',
            timer: 2000,
            showConfirmButton: false,
          });
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors de la mise à jour des informations',
          });
        },
      });
  }

  submitBio() {
    if (this.bioForm.invalid) return;

    const formData = new FormData();
    formData.append('bio', this.bioForm.value.bio);

    this.entrepriseService
      .updateEntreprisePartial(this.entreprise.id, formData)
      .subscribe({
        next: (updated) => {
          this.entreprise = updated;
          this.fillForms();
          this.closeModal('editBioModal');
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Description mise à jour avec succès',
            timer: 2000,
            showConfirmButton: false,
          });
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors de la mise à jour de la description',
          });
        },
      });
  }
  ngAfterViewInit() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) => {
      modal.addEventListener('hidden.bs.modal', () => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.parentNode?.removeChild(backdrop);
        }
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
      });
    });
  }

  closeModal(modalId: string) {
    const modalEl = document.getElementById(modalId);
    if (modalEl) {
      let modal = bootstrap.Modal.getInstance(modalEl);
      if (!modal) {
        modal = new bootstrap.Modal(modalEl);
      }
      modal.hide();

      // Nettoyage manuel du backdrop
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.parentNode?.removeChild(backdrop);
      }

      // Retirer la classe modal-open du body
      document.body.classList.remove('modal-open');

      // Rétablir le scroll vertical
      document.body.style.overflow = '';
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

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    const navLinks = document.querySelector('.nav-links') as HTMLElement;
    if (this.menuOpen) {
      navLinks.classList.add('active');
    } else {
      navLinks.classList.remove('active');
    }
  }
  get responsabilites() {
    return this.offreForm.get('responsabilites') as FormArray;
  }

  get avantages() {
    return this.offreForm.get('avantages') as FormArray;
  }

  get exigances() {
    return this.offreForm.get('exigances') as FormArray;
  }

  ajouterResponsabilite() {
    this.responsabilites.push(this.fb.control(''));
  }

  supprimerResponsabilite(index: number) {
    this.responsabilites.removeAt(index);
  }

  ajouterAvantage() {
    this.avantages.push(this.fb.control(''));
  }

  supprimerAvantage(index: number) {
    this.avantages.removeAt(index);
  }

  ajouterExigance() {
    this.exigances.push(this.fb.control(''));
  }

  supprimerExigance(index: number) {
    this.exigances.removeAt(index);
  }
  currentStep: number = 1;

  nextStep() {
    if (this.currentStep < 5) this.currentStep++;
  }

  previousStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  onSubmit() {
    console.log(this.offreForm.value);

    if (this.offreForm.invalid) {
      this.offreForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Champs invalides',
        text: 'Veuillez remplir tous les champs requis.',
      });
      return;
    }

    const formValue = this.offreForm.value;
    formValue.responsabilites = formValue.responsabilites.filter(
      (r: any) => r && r.trim() !== ''
    );
    formValue.avantages = formValue.avantages.filter(
      (a: any) => a && a.trim() !== ''
    );
    formValue.exigances = formValue.exigances.filter(
      (e: any) => e && e.trim() !== ''
    );

    this.offreService.creerOffre(formValue).subscribe({
      next: (offre) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Offre créée avec succès !',
        });
        this.offreForm.reset();
        this.responsabilites.clear();
        this.responsabilites.push(this.fb.control(''));
        this.avantages.clear();
        this.avantages.push(this.fb.control(''));
        this.exigances.clear();
        this.exigances.push(this.fb.control(''));
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Erreur lors de la création de l'offre.",
        });
      },
    });
  }
}
