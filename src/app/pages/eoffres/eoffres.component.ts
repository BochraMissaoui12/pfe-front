import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OffreService } from 'src/app/services/OffreService';
import { UtilisateurService } from 'src/app/services/UtilisateurService';

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
  entrepriseId: string = '';
  editingOffreId: string | null = null;
  constructor(
    private utilisateurService: UtilisateurService,
    private router: Router,
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
  loadOffres(): void {
    this.offreService.getOffresByEntrepriseId(this.entrepriseId).subscribe({
      next: (data) => (this.offres = data),
      error: () => (this.offres = []),
    });
  }

  deleteOffre(id: string): void {
    if (confirm('Supprimer cette offre ?')) {
      this.offreService.deleteOffre(id).subscribe(() => this.loadOffres());
    }
  }
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
        .subscribe(() => {
          this.loadOffres();
          this.closeEditModal();
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
