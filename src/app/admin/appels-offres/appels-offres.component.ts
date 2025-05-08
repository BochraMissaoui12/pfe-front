import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/NotificationService';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppelOffreService } from 'src/app/services/AppelOffreService';

@Component({
  selector: 'app-appels-offres',
  templateUrl: './appels-offres.component.html',
  styleUrls: ['./appels-offres.component.css'],
})
export class AppelsOffresComponent implements OnInit {
  appels: any[] = [];
  notifications: any[] = [];
  showNotifications: boolean = false;

  showModal = false;
  isEdit = false;
  currentAppel: any | null = null;
  appelForm: FormGroup;
  loading = false;

  constructor(
    private appelOffreService: AppelOffreService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.appelForm = this.fb.group({
      publieLe: ['', Validators.required],
      pays: ['', Validators.required],
      description: ['', Validators.required],
      promoteur: ['', Validators.required],
      type: ['', Validators.required],
      expireLe: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadNotifications();
    this.loadAppels();
  }

  loadAppels() {
    this.appelOffreService.getAll().subscribe({
      next: (data) => (this.appels = data),
      error: () => (this.appels = []),
    });
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

  openAddModal() {
    this.showModal = true;
    this.isEdit = false;
    this.currentAppel = null;
    this.appelForm.reset();
  }

  openEditModal(appel: any) {
    this.showModal = true;
    this.isEdit = true;
    this.currentAppel = appel;
    this.appelForm.patchValue({
      publieLe: appel.publieLe,
      pays: appel.pays,
      description: appel.description,
      promoteur: appel.promoteur,
      type: appel.type,
      expireLe: appel.expireLe,
    });
  }

  closeModal() {
    this.showModal = false;
    this.appelForm.reset();
    this.currentAppel = null;
  }

  submitForm() {
    if (this.appelForm.invalid) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs.', 'error');
      return;
    }
    this.loading = true;
    const formValue = this.appelForm.value;
    // Conversion en string pour LocalDate si besoin
    formValue.publieLe = formValue.publieLe.toString();
    formValue.expireLe = formValue.expireLe.toString();

    if (this.isEdit && this.currentAppel) {
      this.appelOffreService.update(this.currentAppel.id, formValue).subscribe({
        next: () => {
          this.loadAppels();
          this.closeModal();
          this.loading = false;
          Swal.fire('Succès', "Appel d'offre modifié avec succès.", 'success');
        },
        error: () => {
          this.loading = false;
          Swal.fire('Erreur', 'Erreur lors de la modification.', 'error');
        },
      });
    } else {
      this.appelOffreService.create(formValue).subscribe({
        next: () => {
          this.loadAppels();
          this.closeModal();
          this.loading = false;
          Swal.fire('Succès', "Appel d'offre ajouté avec succès.", 'success');
        },
        error: () => {
          this.loading = false;
          Swal.fire('Erreur', "Erreur lors de l'ajout.", 'error');
        },
      });
    }
  }

  async deleteAppel(appel: any) {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    });
    if (result.isConfirmed) {
      this.appelOffreService.delete(appel.id).subscribe({
        next: () => {
          this.loadAppels();
          Swal.fire('Supprimé', "Appel d'offre supprimé.", 'success');
        },
        error: () => {
          Swal.fire('Erreur', 'Erreur lors de la suppression.', 'error');
        },
      });
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
