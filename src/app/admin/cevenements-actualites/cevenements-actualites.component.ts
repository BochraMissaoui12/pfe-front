import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EntrepriseService } from 'src/app/services/EntrepriseService';
import { EvenementService } from 'src/app/services/EvenementService';
import { NotificationService } from 'src/app/services/NotificationService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cevenements-actualites',
  templateUrl: './cevenements-actualites.component.html',
  styleUrls: ['./cevenements-actualites.component.css'],
})
export class CevenementsActualitesComponent implements OnInit {
  evenements: any[] = [];
  selectedEvenement: any | null = null;
  showModal = false;
  isEditMode = false;
  eventForm: FormGroup;
  loading = false;
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  entreprises: any[] = [];
  existingImgs: string[] = [];
  candidaturesOffreSelectionnee: any[] = [];
  notifications: any[] = [];
  showNotifications: boolean = false;
  offreSelectionneePourCandidatures: any = null;
  constructor(
    private notificationService: NotificationService,
    private evenementService: EvenementService,
    private fb: FormBuilder,
    private router: Router,
    private entrepriseService: EntrepriseService
  ) {
    this.eventForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      emplacement: ['', Validators.required],
      type: ['', Validators.required],
      datePublication: ['', Validators.required],
      entrepriseId: [null], // Optional field
    });
  }

  ngOnInit(): void {
    this.loadEvenements();
    this.loadEntreprises();
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

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  loadEntreprises() {
    this.entrepriseService.getAllEntreprises().subscribe((data) => {
      this.entreprises = data;
      this.evenements.forEach((event) => {
        console.log(event.entrepriseId);
        if (event.entrepriseId) {
          this.entrepriseService
            .getEntrepriseById(event.entrepriseId)
            .subscribe((entreprise) => {
              event.entrepriseNom = entreprise.nom;
            });
        } else {
          event.entrepriseNom = '—';
        }
      });
    });
  }

  loadEvenements() {
    this.evenementService.getAllEvenements().subscribe((data) => {
      this.evenements = data;
    });
  }

  openModal(editMode = false, event?: any) {
    this.isEditMode = editMode;
    this.showModal = true;
    this.selectedFiles = [];
    this.previewUrls = [];
    this.existingImgs = [];

    if (editMode && event) {
      this.selectedEvenement = event;
      this.eventForm.patchValue(event);
      this.existingImgs = event.imgs || []; // images du backend
    } else {
      this.selectedEvenement = null;
      this.eventForm.reset();
      this.existingImgs = [];
    }
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.selectedFiles = [];
    this.previewUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.selectedFiles.push(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrls.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  saveEvenement() {
    if (this.eventForm.invalid) return;

    this.loading = true;
    const formData = new FormData();

    Object.entries(this.eventForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    this.selectedFiles.forEach((file) => {
      formData.append('imgs', file);
    });

    const request =
      this.isEditMode && this.selectedEvenement
        ? this.evenementService.updateEvenement(
            this.selectedEvenement.id,
            formData
          )
        : this.evenementService.createEvenement(formData);

    request.subscribe({
      next: () => {
        this.loadEvenements();
        this.showModal = false;
        this.loading = false;
        Swal.fire(
          'Succès',
          `Événement ${this.isEditMode ? 'modifié' : 'ajouté'} avec succès`,
          'success'
        );
      },
      error: () => {
        this.loading = false;
        Swal.fire(
          'Erreur',
          `Échec de ${
            this.isEditMode ? 'la modification' : 'l’ajout'
          } de l’événement`,
          'error'
        );
      },
    });
  }

  deleteEvenement(id: string) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment supprimer cet événement ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.evenementService.deleteEvenement(id).subscribe({
          next: () => {
            this.loadEvenements();
            Swal.fire(
              'Supprimé !',
              'L’événement a été supprimé avec succès.',
              'success'
            );
          },
          error: () => {
            Swal.fire('Erreur', 'La suppression a échoué.', 'error');
          },
        });
      }
    });
  }

  validerEvenement(id: string) {
    Swal.fire({
      title: 'Valider l’événement',
      text: 'Voulez-vous vraiment valider cet événement ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, valider',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.evenementService.validerEvenement(id).subscribe({
          next: () => {
            this.loadEvenements();
            Swal.fire(
              'Validé',
              'L’événement a été validé avec succès.',
              'success'
            );
          },
          error: () => {
            Swal.fire('Erreur', 'La validation a échoué.', 'error');
          },
        });
      }
    });
  }

  closeModal() {
    this.showModal = false;
    this.selectedEvenement = null;
    this.selectedFiles = [];
    this.previewUrls = [];
  }
}
