import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EntrepriseService } from 'src/app/services/EntrepriseService';
import { NotificationService } from 'src/app/services/NotificationService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nouveau-comptes',
  templateUrl: './nouveau-comptes.component.html',
  styleUrls: ['./nouveau-comptes.component.css'],
})
export class NouveauComptesComponent implements OnInit {
  entreprisesNonActivees: any[] = [];
  selectedEntreprise: any | null = null;
  loading = false;
  errorMessage = '';
  showDeleteConfirm = false;
  entrepriseToDeleteId: string | null = null;
  showActivateConfirm = false;
  entrepriseToActivateId: string | null = null;
  candidaturesOffreSelectionnee: any[] = [];
  notifications: any[] = [];
  showNotifications: boolean = false;
  offreSelectionneePourCandidatures: any = null;
  constructor(
    private notificationService: NotificationService,
    private entrepriseService: EntrepriseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEntreprisesNonActivees();
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

  loadEntreprisesNonActivees(): void {
    this.loading = true;
    this.errorMessage = '';
    this.entrepriseService.getAllEntreprises().subscribe({
      next: (data) => {
        this.entreprisesNonActivees = data.filter((e) => !e.active);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des entreprises';
        console.error(err);
        this.loading = false;
      },
    });
  }

  openDetails(id: string): void {
    this.loading = true;
    this.errorMessage = '';
    this.entrepriseService.getEntrepriseById(id).subscribe({
      next: (data) => {
        this.selectedEntreprise = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des détails';
        console.error(err);
        this.loading = false;
      },
    });
  }

  closeDetails(): void {
    this.selectedEntreprise = null;
  }
  askActivate(id: string): void {
    this.entrepriseToActivateId = id;
    this.showActivateConfirm = true;
  }
  cancelActivate(): void {
    this.entrepriseToActivateId = null;
    this.showActivateConfirm = false;
  }

  confirmActivate(): void {
    if (!this.entrepriseToActivateId) return;

    this.loading = true;
    this.errorMessage = '';
    this.entrepriseService
      .activateEntreprise(this.entrepriseToActivateId)
      .subscribe({
        next: (response: any) => {
          Swal.fire(
            'Succès',
            response.message || 'Entreprise activée avec succès',
            'success'
          );
          this.loadEntreprisesNonActivees();
          this.showActivateConfirm = false;
          this.entrepriseToActivateId = null;
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = "Erreur lors de l'activation";
          console.error(err);
          this.loading = false;
        },
      });
  }

  confirmDelete(id: string): void {
    this.entrepriseToDeleteId = id;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.entrepriseToDeleteId = null;
    this.showDeleteConfirm = false;
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  deleteEntreprise(): void {
    if (!this.entrepriseToDeleteId) return;

    this.loading = true;
    this.errorMessage = '';
    this.entrepriseService
      .deleteEntreprise(this.entrepriseToDeleteId)
      .subscribe({
        next: () => {
          this.loadEntreprisesNonActivees();
          this.showDeleteConfirm = false;
          this.entrepriseToDeleteId = null;
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la suppression';
          console.error(err);
          this.loading = false;
        },
      });
  }
}
