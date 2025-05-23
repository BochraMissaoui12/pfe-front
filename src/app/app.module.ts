import { LOCALE_ID, NgModule } from '@angular/core';
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
import { OffresComponent } from './admin/offres/offres.component';
import { ProblemeTechniquesComponent } from './admin/probleme-techniques/probleme-techniques.component';
import { FileNamePipe } from './services/file-name.pipe';
import { ProblemesComponent } from './pages/problemes/problemes.component';
import { ProfilChercheurComponent } from './pages/profil-chercheur/profil-chercheur.component';
import { EproblemesComponent } from './pages/eproblemes/eproblemes.component';
import { AppeldOffresComponent } from './pages/appeld-offres/appeld-offres.component';
import { TruncatePipe } from './services/TruncatePipe';
import { ProjetThesesComponent } from './admin/projet-theses/projet-theses.component';
import { ProjetsComponent } from './pages/projets/projets.component';
import { CprojetsComponent } from './pages/cprojets/cprojets.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { RecommendationPanelComponent } from './pages/recommendation-panel/recommendation-panel.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr, 'fr');
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
    OffresComponent,
    FileNamePipe,
    TruncatePipe,
    ProblemeTechniquesComponent,
    ProblemesComponent,
    ProfilChercheurComponent,
    EproblemesComponent,
    AppeldOffresComponent,
    ProjetThesesComponent,
    ProjetsComponent,
    CprojetsComponent,
    ChatbotComponent,
    RecommendationPanelComponent,
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
    { provide: LOCALE_ID, useValue: 'fr' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
