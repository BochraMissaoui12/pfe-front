import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChercheurService } from 'src/app/services/ChercheurService';

@Component({
  selector: 'app-chercheurs',
  templateUrl: './chercheurs.component.html',
  styleUrls: ['./chercheurs.component.css'],
})
export class ChercheursComponent implements OnInit {
  chercheurs: any[] = [];
  selectedChercheur: any | null = null;
  showDeleteConfirm = false;
  chercheurToDeleteId: string | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private chercheurService: ChercheurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadChercheurs();
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  loadChercheurs(): void {
    this.loading = true;
    this.errorMessage = '';
    this.chercheurService.getAllChercheurs().subscribe({
      next: (data) => {
        this.chercheurs = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des chercheurs';
        console.error(err);
        this.loading = false;
      },
    });
  }

  openDetails(id: string): void {
    this.loading = true;
    this.errorMessage = '';
    this.chercheurService.getChercheurById(id).subscribe({
      next: (data) => {
        this.selectedChercheur = data;
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
    this.selectedChercheur = null;
  }

  confirmDelete(id: string): void {
    this.chercheurToDeleteId = id;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.chercheurToDeleteId = null;
    this.showDeleteConfirm = false;
  }

  deleteChercheur(): void {
    if (!this.chercheurToDeleteId) return;

    this.loading = true;
    this.errorMessage = '';
    this.chercheurService.deleteChercheur(this.chercheurToDeleteId).subscribe({
      next: () => {
        this.loadChercheurs();
        this.showDeleteConfirm = false;
        this.chercheurToDeleteId = null;
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
