import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProfileCandidatComponent } from './pages/profile-candidat/profile-candidat.component';
import { CandidaturesListComponent } from './pages/candidatures-list/candidatures-list.component';
import { ProfileEntrepriseComponent } from './pages/profile-entreprise/profile-entreprise.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profil', component: ProfileCandidatComponent },
  { path: 'candidatures', component: CandidaturesListComponent },
  { path: 'Eprofil', component: ProfileEntrepriseComponent },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
