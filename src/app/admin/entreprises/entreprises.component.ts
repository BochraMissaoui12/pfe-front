import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EntrepriseService } from 'src/app/services/EntrepriseService';
import { NotificationService } from 'src/app/services/NotificationService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-entreprises',
  templateUrl: './entreprises.component.html',
  styleUrls: ['./entreprises.component.css'],
})
export class EntreprisesComponent implements OnInit {
  entreprises: any[] = [];
  selectedEntreprise: any | null = null;
  showDeleteConfirm = false;
  entrepriseToDeleteId: string | null = null;
  loading = false;
  errorMessage = '';
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
  loadEntreprises(): void {
    this.loading = true;
    this.entrepriseService.getAllEntreprises().subscribe({
      next: (data) => {
        this.entreprises = data.filter((e) => e.active);
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
    this.entrepriseService.getEntrepriseById(id).subscribe({
      next: (data) => {
        this.selectedEntreprise = data;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des détails';
        console.error(err);
      },
    });
  }

  closeDetails(): void {
    this.selectedEntreprise = null;
  }

  confirmDelete(id: string): void {
    this.entrepriseToDeleteId = id;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.entrepriseToDeleteId = null;
    this.showDeleteConfirm = false;
  }

  deleteEntreprise(): void {
    if (!this.entrepriseToDeleteId) return;

    this.entrepriseService
      .deleteEntreprise(this.entrepriseToDeleteId)
      .subscribe({
        next: () => {
          this.loadEntreprises();
          this.showDeleteConfirm = false;
          this.entrepriseToDeleteId = null;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la suppression';
          console.error(err);
        },
      });
  }
}
