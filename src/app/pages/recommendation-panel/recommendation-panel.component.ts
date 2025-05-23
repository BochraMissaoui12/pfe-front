import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UtilisateurService } from 'src/app/services/UtilisateurService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recommendation-panel',
  templateUrl: './recommendation-panel.component.html',
  styleUrls: ['./recommendation-panel.component.css'],
})
export class RecommendationPanelComponent implements OnInit {
  isOpen = false;
  recommendations: any[] = [];
  user: any | null = null; // Stocker les données du candidat
  token: string | null = localStorage.getItem('token');

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private router: Router,
    private utilisateurService: UtilisateurService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  togglePanel(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.recommendations.length === 0 && this.user) {
      this.loadRecommendations();
    }
  }

  loadUserData(): void {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = this.decodeToken(token);
      const id = decodedToken.id; // Assurez-vous que l'ID est dans le token
      const role = decodedToken.role; // Assurez-vous que le rôle est dans le token

      this.utilisateurService
        .getUtilisateurByIdAndRole(id, role)
        .subscribe((data) => {
          this.user = data;
          // Initialiser offresConsultees si non défini
          if (!this.user.offresConsultees) {
            this.user.offresConsultees = [];
          }
          localStorage.setItem('user', JSON.stringify(this.user)); // Stocker pour réutilisation
          this.loadRecommendations();
        });
    } else {
      console.error('Token non trouvé dans le localStorage');
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

  loadRecommendations(): void {
    if (!this.token || !this.user) return;

    const requestBody = {
      type: this.user.type,
      domaineExpertise: this.user.domaineExpertise,
      offresConsultees: this.user.offresConsultees || [],
    };

    this.http
      .post<any[]>('http://localhost:8080/api/recommendations', null, {
        params: {
          type: requestBody.type,
          domaineExpertise: requestBody.domaineExpertise,
          offresConsultees: requestBody.offresConsultees.join(','), // Convertir en chaîne pour @RequestParam
        },
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .subscribe({
        next: (data) => {
          console.log(data);
          this.recommendations = data || [];
          this.markOffersAsConsulted();
        },
        error: (error) => {
          console.error(
            'Erreur lors du chargement des recommandations :',
            error
          );
        },
      });
  }

  onRecommendationClick(offer: any): void {
    this.router.navigate(['/liste-offres'], {
      queryParams: { selectedOfferId: offer.id },
    });
  }

  markOffersAsConsulted(): void {
    if (!this.token || !this.recommendations || !this.user) return;

    this.recommendations.forEach((offer) => {
      if (!this.user.offresConsultees.includes(offer.id)) {
        this.http
          .post(`http://localhost:8080/api/offres/${offer.id}/consult`, null, {
            headers: { Authorization: `Bearer ${this.token}` },
          })
          .subscribe({
            next: () => {
              // Mettre à jour localement après succès
              this.user.offresConsultees = this.user.offresConsultees || [];
              if (!this.user.offresConsultees.includes(offer.id)) {
                this.user.offresConsultees.push(offer.id);
                localStorage.setItem('user', JSON.stringify(this.user));
              }
              console.log(`Offre ${offer.id} marquée comme consultée`);
            },
            error: (error) => {
              console.error(
                `Erreur lors de la mise à jour de ${offer.id} :`,
                error
              );
            },
          });
      }
    });
  }
}
