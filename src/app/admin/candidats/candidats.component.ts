import { Component, OnInit } from '@angular/core';
import { CandidatService } from 'src/app/services/CandidatService';

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

  constructor(private candidatService: CandidatService) {}

  ngOnInit(): void {
    this.loadCandidats();
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
