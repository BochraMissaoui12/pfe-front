import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProfileCandidatComponent } from './pages/profile-candidat/profile-candidat.component';
import { CandidaturesListComponent } from './pages/candidatures-list/candidatures-list.component';
import { ProfileEntrepriseComponent } from './pages/profile-entreprise/profile-entreprise.component';
import { ListeOffresComponent } from './pages/liste-offres/liste-offres.component';
import { AuthGuard } from './services/auth.guard';
import { AccueilComponent } from './admin/accueil/accueil.component';
import { AppelsOffresComponent } from './admin/appels-offres/appels-offres.component';
import { CandidatsComponent } from './admin/candidats/candidats.component';
import { ChercheursComponent } from './admin/chercheurs/chercheurs.component';
import { EntreprisesComponent } from './admin/entreprises/entreprises.component';
import { LoginComponent } from './admin/login/login.component';
import { NouveauComptesComponent } from './admin/nouveau-comptes/nouveau-comptes.component';
import { CevenementsActualitesComponent } from './admin/cevenements-actualites/cevenements-actualites.component';
import { AdministrateursComponent } from './admin/administrateurs/administrateurs.component';
import { EoffresComponent } from './pages/eoffres/eoffres.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'accueil',
    component: AccueilComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'administrateurs',
    component: AdministrateursComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'nouveau-comptes',
    component: NouveauComptesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'entreprises',
    component: EntreprisesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'chercheurs',
    component: ChercheursComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'candidats',
    component: CandidatsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'evenements-actualites',
    component: CevenementsActualitesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'appels-offres',
    component: AppelsOffresComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'profil',
    component: ProfileCandidatComponent,
    canActivate: [AuthGuard],
    data: { roles: ['CANDIDAT', 'CHERCHEUR'] }, // autorisé pour candidats et chercheurs
  },
  {
    path: 'candidatures',
    component: CandidaturesListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['CANDIDAT'] },
  },
  {
    path: 'Eprofil',
    component: ProfileEntrepriseComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ENTREPRISE'] },
  },
  {
    path: 'Eoffres',
    component: EoffresComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ENTREPRISE'] },
  },
  { path: 'offres', component: ListeOffresComponent },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
