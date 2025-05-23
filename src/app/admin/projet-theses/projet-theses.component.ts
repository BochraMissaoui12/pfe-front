import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { ChercheurService } from 'src/app/services/ChercheurService';
import { NotificationService } from 'src/app/services/NotificationService';
import { ProblemeTechniqueService } from 'src/app/services/ProblemeTechniqueService';
import { ProjetService } from 'src/app/services/ProjetService';
import { ReponseProblemeService } from 'src/app/services/ReponseProblemeService';
import { ReponseProjetService } from 'src/app/services/ReponseProjetService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-projet-theses',
  templateUrl: './projet-theses.component.html',
  styleUrls: ['./projet-theses.component.css'],
})
export class ProjetThesesComponent implements OnInit {
  notifications: any[] = [];
  showNotifications: boolean = false;

  projets: any[] = [];
  selectedProjetResponses: any[] = [];
  showResponsesModal: boolean = false;
  selectedProjetTitre: string = '';

  idChercheur: string = '';
  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private reponseService: ReponseProblemeService,
    private projetService: ProjetService,
    private chercheurService: ChercheurService,
    private reponseProjetService: ReponseProjetService
  ) {}
  ngOnInit(): void {
    this.loadNotifications();
    this.loadProjets();
  }

  loadProjets() {
    this.projetService.getAllProjets().subscribe({
      next: (projetsData) => {
        // Pour chaque projet, on va récupérer le chercheur
        const projetsWithChercheur$ = projetsData.map((projet) =>
          this.chercheurService.getChercheurById(projet.chercheurId).pipe(
            // On ajoute le nom complet dans le projet
            map((chercheur) => ({
              ...projet,
              chercheurNom: chercheur
                ? `${chercheur.prenom} ${chercheur.nom}`
                : 'Inconnu',
            }))
          )
        );

        // On combine tous les observables en un seul tableau
        forkJoin(projetsWithChercheur$).subscribe({
          next: (projetsAvecNom) => {
            this.projets = projetsAvecNom;
          },
          error: () => {
            this.projets = projetsData; // fallback sans noms
          },
        });
      },
      error: () => {
        this.projets = [];
      },
    });
  }

  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
  deleteProjet(projetId: string) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action supprimera le projet définitivement.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.projetService.deleteProjet(projetId).subscribe({
          next: () => {
            Swal.fire('Supprimé !', 'Le projet a été supprimé.', 'success');
            this.loadProjets();
          },
          error: () => {
            Swal.fire('Erreur', 'Impossible de supprimer le projet.', 'error');
          },
        });
      }
    });
  }

  showResponses(projet: any) {
    this.selectedProjetTitre = projet.titre;
    this.reponseProjetService.getReponsesByProjetId(projet.id!).subscribe({
      next: (data) => {
        this.selectedProjetResponses = data;
        this.showResponsesModal = true;
      },
      error: () => {
        Swal.fire('Erreur', 'Impossible de charger les réponses.', 'error');
      },
    });
  }

  closeResponsesModal() {
    this.showResponsesModal = false;
    this.selectedProjetResponses = [];
    this.selectedProjetTitre = '';
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
}
