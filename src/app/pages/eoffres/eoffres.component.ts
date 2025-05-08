import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CandidatService } from 'src/app/services/CandidatService';
import { CandidatureService } from 'src/app/services/CandidatureService';
import { OffreService } from 'src/app/services/OffreService';
import { UtilisateurService } from 'src/app/services/UtilisateurService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eoffres',
  templateUrl: './eoffres.component.html',
  styleUrls: ['./eoffres.component.css'],
})
export class EoffresComponent implements OnInit {
  menuOpen = false;
  entreprise: any;
  showEditModal = false;
  editedOffre: any = {};
  offres: any[] = [];
  pagedOffres: any[] = [];
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;

  showCandidaturesModal = false;
  selectedOffreId!: string;
  candidatures: any[] = [];
  selectedStatus: { [id: string]: string } = {};
  messageEntreprise: { [id: string]: string } = {};

  showCommissionModal = false;
  candidatureToAcceptId: string | null = null;

  showMessagerieModal = false;
  selectedCandidature: any = null;
  messageText: string = '';

  entrepriseId: string = '';
  editingOffreId: string | null = null;

  constructor(
    private utilisateurService: UtilisateurService,
    private router: Router,
    private candidatService: CandidatService,
    private candidatureService: CandidatureService,
    private offreService: OffreService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeToken(token);
      this.entrepriseId =
        decodedToken?.idEntreprise ||
        decodedToken?.entrepriseId ||
        decodedToken?.id;
      if (this.entrepriseId) {
        this.loadOffres();
      }
    }
    this.updatePagination();
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

  openCandidaturesModal(offreId: string) {
    this.selectedOffreId = offreId;
    this.candidatureService.getCandidaturesParOffre(offreId).subscribe({
      next: (data) => {
        this.candidatures = data;

        this.candidatures.forEach((c) => {
          // Charger l'offre complète si elle n'est pas déjà présente
          if (!c.offre && c.offreId) {
            this.offreService.getOffreById(c.offreId).subscribe({
              next: (offre) => (c.offre = offre),
              error: () => (c.offre = null),
            });
          }
          // Charger le candidat aussi si besoin
          if (!c.candidat && c.utilisateurId) {
            this.candidatService.getCandidatById(c.utilisateurId).subscribe({
              next: (candidat) => {
                c.candidat = candidat;
                console.log(candidat);
              },
              error: () => (c.candidat = null),
            });
          }
        });

        this.showCandidaturesModal = true;
      },
    });
  }

  canVoirContact(candidature: any): boolean {
    const typeOffre = candidature.offre?.typeOffre?.toLowerCase();
    if (!typeOffre) return false;
    return typeOffre !== 'freelance';
  }

  closeCandidaturesModal() {
    this.showCandidaturesModal = false;
    this.candidatures = [];
  }

  canModifierStatut(candidature: any): boolean {
    const typeOffre = candidature.offre?.typeOffre?.toLowerCase();
    const statut = candidature.statut?.toLowerCase();
    if (!typeOffre || !statut) return true;
    if (typeOffre === 'freelance' && statut === 'accepté') {
      return false;
    }
    return true;
  }

  onAcceptClick(candidature: any) {
    const typeOffre = candidature.offre?.typeOffre?.toLowerCase();
    if (typeOffre === 'freelance') {
      this.candidatureToAcceptId = candidature.id;
      this.showCommissionModal = true;
    } else {
      this.changerStatut(
        candidature.id,
        'Accepté',
        this.messageEntreprise[candidature.id]
      );
    }
  }
  confirmCommission() {
    // On vérifie bien que l’ID n’est pas null ou undefined
    const id = this.candidatureToAcceptId;
    if (id) {
      // On force le message à une string (jamais null/undefined)
      const message = this.messageEntreprise[id] ?? '';

      Swal.fire({
        title: "Confirmer l'acceptation ?",
        text: 'En acceptant ce candidat freelance, vous acceptez de payer une commission de 10% sur ce projet.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, accepter',
        cancelButtonText: 'Annuler',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Traitement en cours...',
            html: 'Merci de patienter pendant la validation.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          this.candidatureService
            .changerStatut(id, 'Accepté', message)
            .subscribe({
              next: () => {
                Swal.fire(
                  'Succès',
                  'Nous allons vous contacter le plus tôt possible pour la mise en contact.',
                  'success'
                ).then(() => {
                  this.showCommissionModal = false;
                  this.candidatureToAcceptId = null;
                  this.closeCandidaturesModal();
                  this.loadOffres();
                });
              },
              error: () => {
                Swal.fire(
                  'Erreur',
                  'Une erreur est survenue lors de la validation.',
                  'error'
                );
                this.showCommissionModal = false;
                this.candidatureToAcceptId = null;
              },
            });
        }
      });
    }
  }

  cancelCommission() {
    this.showCommissionModal = false;
    this.candidatureToAcceptId = null;
  }

  changerStatut(id: string, statut: string, messageEntreprise: string) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous allez changer le statut de cette candidature en "${statut}"`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, confirmer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        // Affiche le spinner pendant l'appel backend
        Swal.fire({
          title: 'Traitement en cours...',
          html: 'Merci de patienter pendant la modification du statut.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        this.candidatureService
          .changerStatut(id, statut, messageEntreprise)
          .subscribe({
            next: () => {
              Swal.fire('Succès', 'Le statut a été modifié.', 'success').then(
                () => {
                  this.closeCandidaturesModal();
                  this.loadOffres();
                }
              );
            },
            error: (err) => {
              Swal.fire(
                'Erreur',
                'Une erreur est survenue lors du changement de statut.',
                'error'
              );
            },
          });
      }
    });
  }

  // Pagination et autres méthodes inchangées
  loadOffres(): void {
    this.offreService.getOffresByEntrepriseId(this.entrepriseId).subscribe({
      next: (data) => {
        this.offres = data;
        this.currentPage = 1;
        this.updatePagination();
      },
      error: () => {
        this.offres = [];
        this.pagedOffres = [];
        this.totalPages = 0;
      },
    });
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.offres.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedOffres = this.offres.slice(start, start + this.itemsPerPage);
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  // Edition offre
  startEdit(offre: any): void {
    this.editingOffreId = offre.id;
    this.editedOffre = JSON.parse(JSON.stringify(offre));
  }

  cancelEdit(): void {
    this.editingOffreId = null;
    this.editedOffre = {};
  }

  saveEdit(): void {
    if (this.editedOffre && this.editedOffre.id) {
      this.offreService
        .updateOffre(this.editedOffre.id, this.editedOffre)
        .subscribe({
          next: () => {
            this.loadOffres();
            this.closeEditModal();
            Swal.fire('Succès', "L'offre a été mise à jour.", 'success');
          },
          error: () => {
            Swal.fire('Erreur', 'La mise à jour a échoué.', 'error');
          },
        });
    }
  }

  addItem(listName: string): void {
    if (!this.editedOffre[listName]) {
      this.editedOffre[listName] = [];
    }
    this.editedOffre[listName].push('');
  }

  removeItem(listName: string, index: number): void {
    this.editedOffre[listName].splice(index, 1);
  }

  openEditModal(offre: any): void {
    this.editedOffre = JSON.parse(JSON.stringify(offre)); // deep copy
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editedOffre = {};
  }

  // Messagerie (si tu veux la garder, à adapter selon ton backend)
  openMessagerie(candidature: any) {
    this.selectedCandidature = candidature;
    this.showMessagerieModal = true;
    this.messageText = '';
  }

  closeMessagerie() {
    this.showMessagerieModal = false;
    this.selectedCandidature = null;
    this.messageText = '';
  }

  // Si tu veux gérer un envoi de message séparé (sinon à ignorer)
  sendMessage() {
    // Ici tu pourrais appeler un service pour envoyer le message à ce candidat
    alert(
      `Message envoyé à ${this.selectedCandidature?.candidat?.nom} : ${this.messageText}`
    );
    this.closeMessagerie();
  }

  deleteOffre(id: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.offreService.deleteOffre(id).subscribe({
          next: () => {
            this.loadOffres();
            Swal.fire('Supprimé !', "L'offre a été supprimée.", 'success');
          },
          error: () => {
            Swal.fire('Erreur', 'Une erreur est survenue.', 'error');
          },
        });
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
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
}
