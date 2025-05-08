import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EntrepriseService } from 'src/app/services/EntrepriseService';
import { NotificationService } from 'src/app/services/NotificationService';
import { ProblemeTechniqueService } from 'src/app/services/ProblemeTechniqueService';
import { ReponseProblemeService } from 'src/app/services/ReponseProblemeService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-probleme-techniques',
  templateUrl: './probleme-techniques.component.html',
  styleUrls: ['./probleme-techniques.component.css'],
})
export class ProblemeTechniquesComponent implements OnInit {
  entreprises: any[] = [];
  problemes: any[] = [];
  selectedProbleme: any = null;
  showModal: boolean = false;
  isEditMode: boolean = false;

  showReponseModal: boolean = false;
  problemeEnCours: any = null;
  reponseForm: any = { solution: '', fichiersUrls: [] };
  selectedReponseFile?: File;
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 1;

  showListeReponsesModal: boolean = false;
  reponsesProbleme: any[] = [];
  problemePourListeReponses: any = null;

  problemeForm: any = {
    description: '',
    entrepriseId: '',
    fichiersUrls: [],
    statut: 'En attente',
    publieSurSite: false,
  };
  selectedFile?: File;

  notifications: any[] = [];
  showNotifications: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private entrepriseService: EntrepriseService,
    private problemeService: ProblemeTechniqueService,
    private router: Router,
    private reponseService: ReponseProblemeService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.loadEntreprises();
    this.loadProblemes();
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

  openAddModal() {
    this.isEditMode = false;
    this.problemeForm = {
      description: '',
      entrepriseId: '',
      fichiersUrls: [],
      statut: 'En attente',
      publieSurSite: false,
    };
    this.selectedFile = undefined;
    this.showModal = true;
  }

  openEditModal(probleme: any) {
    this.isEditMode = true;
    this.problemeForm = { ...probleme };
    this.selectedFile = undefined;
    this.showModal = true;
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  saveProbleme() {
    if (!this.problemeForm.description || !this.problemeForm.entrepriseId) {
      Swal.fire(
        'Erreur',
        'Veuillez remplir tous les champs obligatoires',
        'error'
      );
      return;
    }

    if (this.isEditMode && this.problemeForm.id) {
      this.problemeService
        .updateProbleme(this.problemeForm.id, this.problemeForm)
        .subscribe({
          next: () => {
            Swal.fire('Succès', 'Problème mis à jour', 'success');
            this.loadProblemes();
            this.showModal = false;
          },
          error: () => {
            Swal.fire('Erreur', 'Erreur lors de la mise à jour', 'error');
          },
        });
    } else {
      this.problemeService
        .createProblemeWithFile(this.problemeForm, this.selectedFile)
        .subscribe({
          next: () => {
            Swal.fire('Succès', 'Problème ajouté', 'success');
            this.loadProblemes();
            this.showModal = false;
          },
          error: () => {
            Swal.fire('Erreur', "Erreur lors de l'ajout du problème", 'error');
          },
        });
    }
  }

  cancelModal() {
    this.showModal = false;
  }

  deleteProbleme(id: string) {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Voulez-vous vraiment supprimer ce problème ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.problemeService.deleteProbleme(id).subscribe({
          next: () => {
            Swal.fire('Supprimé', 'Le problème a été supprimé', 'success');
            this.loadProblemes();
            if (this.selectedProbleme?.id === id) this.selectedProbleme = null;
          },
          error: () => {
            Swal.fire('Erreur', 'Erreur lors de la suppression', 'error');
          },
        });
      }
    });
  }

  loadEntreprises() {
    this.entrepriseService.getAllEntreprises().subscribe({
      next: (data) => (this.entreprises = data),
      error: () => (this.entreprises = []),
    });
  }

  loadProblemes() {
    this.problemeService.getAllProblemes().subscribe({
      next: (data) => {
        this.problemes = data;
        this.totalPages = Math.ceil(this.problemes.length / this.itemsPerPage);
        this.currentPage = 1; // reset page
      },
      error: () => (this.problemes = []),
    });
  }

  getEntrepriseNom(entrepriseId: string): string {
    const entreprise = this.entreprises.find((e) => e.id === entrepriseId);
    return entreprise ? entreprise.nom : 'N/A';
  }
  get paginatedProblemes() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.problemes.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  // Modal réponse admin
  openReponseModal(probleme: any) {
    this.problemeEnCours = probleme;
    this.reponseForm = { solution: '', fichiersUrls: [] };
    this.selectedReponseFile = undefined;
    this.showReponseModal = true;
  }

  onReponseFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedReponseFile = event.target.files[0];
    }
  }

  envoyerReponseProbleme() {
    if (!this.reponseForm.solution.trim()) {
      Swal.fire('Erreur', 'Veuillez saisir une solution.', 'error');
      return;
    }
    const payload = {
      problemeId: this.problemeEnCours.id,
      solution: this.reponseForm.solution,
      fichiersUrls: [],
    };
    this.reponseService
      .createReponseWithFile(payload, this.selectedReponseFile)
      .subscribe({
        next: () => {
          Swal.fire('Succès', 'Solution envoyée avec succès.', 'success');
          this.showReponseModal = false;
          this.problemeEnCours = null;
          this.reponseForm = { solution: '', fichiersUrls: [] };
          this.selectedReponseFile = undefined;
        },
        error: () => {
          Swal.fire(
            'Erreur',
            "Erreur lors de l'envoi de la solution.",
            'error'
          );
        },
      });
  }

  cancelReponseModal() {
    this.showReponseModal = false;
    this.problemeEnCours = null;
  }

  // Modal liste réponses
  openListeReponsesModal(probleme: any) {
    this.problemePourListeReponses = probleme;
    this.reponseService.getByProbleme(probleme.id).subscribe({
      next: (data) => {
        this.reponsesProbleme = data;
        this.showListeReponsesModal = true;
      },
      error: () => {
        Swal.fire('Erreur', 'Impossible de charger les réponses.', 'error');
      },
    });
  }

  closeListeReponsesModal() {
    this.showListeReponsesModal = false;
    this.problemePourListeReponses = null;
    this.reponsesProbleme = [];
  }

  getNomResponsable(r: any) {
    return r.nomUtilisateur ? r.nomUtilisateur : 'Admin';
  }

  getEmailResponsable(r: any) {
    return r.emailUtilisateur ? r.emailUtilisateur : 'admin@example.com';
  }
}
