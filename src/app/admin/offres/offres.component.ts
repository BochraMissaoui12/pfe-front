import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OffreService } from 'src/app/services/OffreService';
import Swal from 'sweetalert2';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntrepriseService } from 'src/app/services/EntrepriseService';
import { CandidatureService } from 'src/app/services/CandidatureService';
import { CandidatService } from 'src/app/services/CandidatService';
import { NotificationService } from 'src/app/services/NotificationService';

@Component({
  selector: 'app-offres',
  templateUrl: './offres.component.html',
  styleUrls: ['./offres.component.css'],
})
export class OffresComponent implements OnInit {
  offres: any[] = [];
  selectedOffre: any | null = null;
  showModal: boolean = false;
  formMode: 'view' | 'edit' | 'add' = 'view';
  offreForm: FormGroup;
  candidaturesParOffre: { [offreId: string]: any[] } = {};
  showCandidaturesModal: boolean = false;
  candidaturesOffreSelectionnee: any[] = [];
  notifications: any[] = [];
  showNotifications: boolean = false;
  offreSelectionneePourCandidatures: any = null;
  constructor(
    private notificationService: NotificationService,
    private offreService: OffreService,
    private router: Router,

    private candidatService: CandidatService,
    private candidatureService: CandidatureService,
    private entrepriseService: EntrepriseService,
    private fb: FormBuilder
  ) {
    this.offreForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      specilite: [''],
      experience: [''],
      niveauEtudes: [''],
      typeOffre: [''],
      typeTemps: [''],
      avantages: this.fb.array([this.fb.control('')]),
      responsabilites: this.fb.array([this.fb.control('')]),
      exigances: this.fb.array([this.fb.control('')]),
      localisation: [''],
    });
  }

  ngOnInit(): void {
    this.loadOffres();
    this.loadNotifications();
  }
  loadNotifications() {
    this.notificationService.getNonConsultees().subscribe({
      next: (data) => (this.notifications = data),
      error: () => (this.notifications = []),
    });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.loadNotifications();
    }
  }

  async consulterNotification(notification: any) {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment marquer cette notification comme consultée ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, marquer comme consultée',
      cancelButtonText: 'Annuler',
    });
    if (result.isConfirmed) {
      this.notificationService
        .marquerCommeConsulte(notification.id)
        .subscribe(() => {
          this.loadNotifications();
          Swal.fire('Notification consultée', '', 'success');
        });
    }
  }

  loadOffres(): void {
    this.offreService.getAllOffres().subscribe(
      (data) => {
        this.offres = data.sort((a: any, b: any) => {
          return (
            new Date(b.datePublication).getTime() -
            new Date(a.datePublication).getTime()
          );
        });

        // Ici, this.offres est bien rempli !
        this.offres.forEach((offre) => {
          console.log(offre.entrepriseId); // Ceci va s'afficher !
          if (offre.entrepriseId) {
            this.entrepriseService
              .getEntrepriseById(offre.entrepriseId)
              .subscribe((entreprise) => {
                offre.entrepriseNom = entreprise.nom;
              });
          } else {
            offre.entrepriseNom = '-';
          }
        });
      },
      () => {
        Swal.fire('Erreur', 'Impossible de charger les offres', 'error');
      }
    );
  }
  voirCandidatures(offre: any) {
    this.offreSelectionneePourCandidatures = offre;
    this.showCandidaturesModal = true;
    this.candidatureService.getCandidaturesParOffre(offre.id).subscribe({
      next: (data) => {
        this.candidaturesOffreSelectionnee = data;
        console.log(data);
        this.candidaturesOffreSelectionnee.forEach((c) => {
          this.candidatService.getCandidatById(c.utilisateurId).subscribe({
            next: (candidat) => (c.candidat = candidat),
            error: () => (c.candidat = null),
          });
        });
      },
      error: (err) => {
        this.candidaturesOffreSelectionnee = [];
      },
    });
  }

  fermerCandidaturesModal() {
    this.showCandidaturesModal = false;
    this.candidaturesOffreSelectionnee = [];
    this.offreSelectionneePourCandidatures = null;
  }
  openModal(offre: any): void {
    this.selectedOffre = offre;
    this.formMode = 'view';
    this.showModal = true;
  }

  ajouterOffre(): void {
    this.selectedOffre = null;
    this.formMode = 'add';
    this.offreForm.reset();
    this.resetFormArrays();
    this.showModal = true;
  }

  editOffre(offre: any): void {
    this.selectedOffre = offre;
    this.formMode = 'edit';
    this.offreForm.reset();

    // Patch les champs simples
    this.offreForm.patchValue({
      titre: offre.titre,
      description: offre.description,
      specilite: offre.specilite,
      experience: offre.experience,
      niveauEtudes: offre.niveauEtudes,
      typeOffre: offre.typeOffre,
      typeTemps: offre.typeTemps,
      localisation: offre.localisation,
    });

    // Remplit les FormArray dynamiquement
    this.setFormArray('avantages', offre.avantages);
    this.setFormArray('responsabilites', offre.responsabilites);
    this.setFormArray('exigances', offre.exigances);

    this.showModal = true;
  }

  setFormArray(arrayName: string, values: string[]) {
    const array = this.offreForm.get(arrayName) as FormArray;
    array.clear();
    if (values && values.length > 0) {
      values.forEach((val) => array.push(this.fb.control(val)));
    } else {
      array.push(this.fb.control(''));
    }
  }

  resetFormArrays() {
    ['avantages', 'responsabilites', 'exigances'].forEach((arrayName) => {
      const array = this.offreForm.get(arrayName) as FormArray;
      array.clear();
      array.push(this.fb.control(''));
    });
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
    if (this.responsabilites.length > 1) {
      this.responsabilites.removeAt(index);
    }
  }

  ajouterAvantage() {
    this.avantages.push(this.fb.control(''));
  }

  supprimerAvantage(index: number) {
    if (this.avantages.length > 1) {
      this.avantages.removeAt(index);
    }
  }

  ajouterExigance() {
    this.exigances.push(this.fb.control(''));
  }

  supprimerExigance(index: number) {
    if (this.exigances.length > 1) {
      this.exigances.removeAt(index);
    }
  }

  currentStep: number = 1;

  nextStep() {
    if (this.currentStep < 5) this.currentStep++;
  }

  previousStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  onSubmit() {
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

    if (this.formMode === 'add') {
      this.offreService.creerOffre(formValue).subscribe({
        next: () => {
          Swal.fire('Succès', 'Offre créée avec succès !', 'success');
          this.loadOffres();
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          Swal.fire(
            'Erreur',
            "Erreur lors de la création de l'offre.",
            'error'
          );
        },
      });
    } else if (this.formMode === 'edit' && this.selectedOffre) {
      this.offreService
        .updateOffre(this.selectedOffre.id, formValue)
        .subscribe({
          next: () => {
            Swal.fire('Succès', 'Offre modifiée avec succès !', 'success');
            this.loadOffres();
            this.closeModal();
          },
          error: (err) => {
            console.error(err);
            Swal.fire(
              'Erreur',
              "Erreur lors de la modification de l'offre.",
              'error'
            );
          },
        });
    }
  }

  closeModal(): void {
    this.selectedOffre = null;
    this.showModal = false;
    this.formMode = 'view';
    this.currentStep = 1;
  }

  valider(id: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir valider cette offre ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, valider',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.offreService.validerOffre(id).subscribe(
          () => {
            Swal.fire('Succès', 'Offre validée avec succès', 'success');
            this.loadOffres();
          },
          () => {
            Swal.fire('Erreur', "Échec de la validation de l'offre", 'error');
          }
        );
      }
    });
  }

  supprimer(id: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer cette offre ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.offreService.deleteOffre(id).subscribe(
          () => {
            Swal.fire('Supprimée', "L'offre a été supprimée.", 'success');
            this.loadOffres();
          },
          () => {
            Swal.fire('Erreur', "Échec de la suppression de l'offre", 'error');
          }
        );
      }
    });
  }
  // Pagination
  pageSize = 8;
  currentPage = 1;

  get paginatedOffres() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.offres.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.offres.length / this.pageSize);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
