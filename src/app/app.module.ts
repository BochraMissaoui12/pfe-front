import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignupComponent } from './pages/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProfileCandidatComponent } from './pages/profile-candidat/profile-candidat.component';
import { CandidaturesListComponent } from './pages/candidatures-list/candidatures-list.component';
import { ProfileEntrepriseComponent } from './pages/profile-entreprise/profile-entreprise.component';
import { ListeOffresComponent } from './pages/liste-offres/liste-offres.component';
import { ToastrModule } from 'ngx-toastr';
import { AuthInterceptor } from './services/auth.interceptor';
import { LoginComponent } from './admin/login/login.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { AccueilComponent } from './admin/accueil/accueil.component';
import { NouveauComptesComponent } from './admin/nouveau-comptes/nouveau-comptes.component';
import { EntreprisesComponent } from './admin/entreprises/entreprises.component';
import { ChercheursComponent } from './admin/chercheurs/chercheurs.component';
import { CandidatsComponent } from './admin/candidats/candidats.component';
import { CevenementsActualitesComponent } from './admin/cevenements-actualites/cevenements-actualites.component';
import { AppelsOffresComponent } from './admin/appels-offres/appels-offres.component';
import { AdministrateursComponent } from './admin/administrateurs/administrateurs.component';
import { EoffresComponent } from './pages/eoffres/eoffres.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    ProfileCandidatComponent,
    CandidaturesListComponent,
    ProfileEntrepriseComponent,
    ListeOffresComponent,
    LoginComponent,
    SidebarComponent,
    AccueilComponent,
    NouveauComptesComponent,
    EntreprisesComponent,
    ChercheursComponent,
    CandidatsComponent,
    CevenementsActualitesComponent,
    AppelsOffresComponent,
    AdministrateursComponent,
    EoffresComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
