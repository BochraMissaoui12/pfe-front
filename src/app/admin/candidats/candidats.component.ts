import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CandidatService } from 'src/app/services/CandidatService';
import { NotificationService } from 'src/app/services/NotificationService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-candidats',
  templateUrl: './candidats.component.html',
  styleUrls: ['./candidats.component.css'],
})
export class CandidatsComponent implements OnInit {
  candidats: any[] = [];
  selectedCandidat: any | null = null;
  showDeleteConfirm = false;
  candidatToDeleteId: string | null = null;
  loading = false;
  errorMessage = '';
  candidaturesOffreSelectionnee: any[] = [];
  notifications: any[] = [];
  showNotifications: boolean = false;
  offreSelectionneePourCandidatures: any = null;
  constructor(
    private notificationService: NotificationService,
    private candidatService: CandidatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCandidats();
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
  loadCandidats(): void {
    this.loading = true;
    this.errorMessage = '';
    this.candidatService.getAllCandidats().subscribe({
      next: (data) => {
        this.candidats = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des candidats';
        console.error(err);
        this.loading = false;
      },
    });
  }

  openDetails(id: string): void {
    this.loading = true;
    this.errorMessage = '';
    this.candidatService.getCandidatById(id).subscribe({
      next: (data) => {
        this.selectedCandidat = data;
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
    this.selectedCandidat = null;
  }

  confirmDelete(id: string): void {
    this.candidatToDeleteId = id;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.candidatToDeleteId = null;
    this.showDeleteConfirm = false;
  }

  deleteCandidat(): void {
    if (!this.candidatToDeleteId) return;

    this.loading = true;
    this.errorMessage = '';
    this.candidatService.deleteCandidat(this.candidatToDeleteId).subscribe({
      next: () => {
        this.loadCandidats();
        this.showDeleteConfirm = false;
        this.candidatToDeleteId = null;
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
