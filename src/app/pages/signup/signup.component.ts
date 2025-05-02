import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  throwError,
} from 'rxjs';
import { AuthService } from 'src/app/services/AuthService';
import { SkillService } from 'src/app/services/SkillService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  userType: 'entreprise' | 'candidat' | 'chercheur' | null = null;
  profileType: 'employé' | 'freelancer' | 'étudiant' | null = null;
  loginForm: FormGroup;
  currentStep: number = 1;
  @Output() verificationModeChange = new EventEmitter<boolean>();
  entrepriseForm: FormGroup;
  logoPreview: string | ArrayBuffer | null = null;
  rnePreview: string | ArrayBuffer | null = null;
  photoPreview: string | ArrayBuffer | null = null;
  uploadedFileName: string | null = null;
  uploadedFileNamee: string | null = null;

  newSkill: string = '';
  skills: string[] = [];
  suggestions: string[] = [];
  candidatForm: FormGroup;
  chercheurForm: FormGroup;
  showVerification: boolean = false;
  code: string[] = ['', '', '', ''];
  countdown: number = 59;
  cvName: string | null = null;
  isLoading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private skillService: SkillService
  ) {
    this.entrepriseForm = this.fb.group({
      nom: ['', Validators.required],
      responsable: ['', Validators.required],
      identifiant: ['', Validators.required],
      secteurActivite: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', Validators.required],
      gouvernement: ['', Validators.required],
      adresse: ['', Validators.required],
      motDePasse: ['', Validators.required],
      bio: ['', Validators.required],
      logo: [null, Validators.required],
      rne: [null, Validators.required],
    });
    this.chercheurForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required],
      titre: ['', Validators.required],
      domaine: ['', Validators.required],
      universite: ['', Validators.required],
      bio: ['', Validators.required],
      tel: ['', Validators.required],
      gouvernement: ['', Validators.required],
      adresse: ['', Validators.required],
    });
    this.candidatForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required],
      titre: ['', Validators.required],
      photo: [null],
      type: ['', Validators.required],
      skillInput: [''],
      competance: [[]],
      bio: [''],
      cv: [null],
    });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.candidatForm
      .get('skillInput')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value: string) => {
        if (value?.length >= 2) {
          this.skillService.searchSkills(value).subscribe((res) => {
            this.suggestions = res;
          });
        } else {
          this.suggestions = [];
        }
      });
  }
  logIn() {
    this.currentStep = 8;
  }
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const { email, motDePasse } = this.loginForm.value;

    this.authService.loginUser(email, motDePasse).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showVerification = true;
        this.nextStep();
      },
      error: (error) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.error, // Message d'erreur du backend
        });
      },
    });
  }

  verifyCode() {
    const email = this.loginForm.value.email;
    const enteredCode = this.code.join('');
    this.authService.confirmEmail(email, enteredCode).subscribe({
      next: (response) => {
        const token = response.token;
        localStorage.setItem('token', token);

        const decodedToken = this.decodeToken(token);
        const role = decodedToken?.role || decodedToken?.authorities || null;

        // Affichage du message de succès avec Swal
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: response.message,
        }).then(() => {
          // Après fermeture du Swal => Redirection basée sur le rôle
          this.redirectUserBasedOnRole(role);
        });
      },
      error: (error) => {
        console.error('Erreur de confirmation:', error);

        const errorMessage =
          error.error?.error || 'Erreur inconnue, veuillez réessayer.';

        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: errorMessage,
        });
      },
    });
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
  redirectUserBasedOnRole(role: string) {
    if (!role) {
      console.error('Role non trouvé');
      return;
    }

    if (role.includes('CANDIDAT')) {
      this.router.navigate(['/profil']);
    } else if (role.includes('ENTREPRISE')) {
      this.router.navigate(['/Eprofil']);
    } else if (role.includes('CHERCHEUR')) {
      this.router.navigate(['/profil']);
    } else {
      this.router.navigate(['/']);
    }
  }

  startCountdown() {
    setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      }
    }, 1000);
  }
  inscription() {
    this.currentStep = 1;
  }
  selectUserType(type: 'entreprise' | 'candidat' | 'chercheur') {
    this.userType = type;
    this.currentStep = 2;
  }
  selectProfile(profileType: 'employé' | 'freelancer' | 'étudiant') {
    this.profileType = profileType;
    this.currentStep++;
    this.candidatForm.get('type')?.setValue(profileType);
  }
  updateVerificationMode() {
    this.verificationModeChange.emit(
      (this.currentStep === 9 || this.currentStep === 6) &&
        this.showVerification
    );
  }
  nextStep() {
    if (this.currentStep < 9) {
      this.currentStep++;
    }
    this.updateVerificationMode();
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  addSkill(skill?: string): void {
    const inputValue = this.candidatForm.get('skillInput')?.value?.trim();

    const value = skill || inputValue;

    if (!skill && this.suggestions.length > 0) {
      return;
    }
    if (value && !this.skills.includes(value) && this.skills.length < 15) {
      this.skills.push(value);
    }
    this.candidatForm.get('competance')?.setValue(this.skills);
    this.candidatForm.get('skillInput')?.reset();
    this.suggestions = [];
  }

  removeSkill(index: number): void {
    this.skills.splice(index, 1);
    this.candidatForm.get('competance')?.setValue(this.skills);
  }
  onLogoUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.entrepriseForm.patchValue({ logo: file });
      this.entrepriseForm.get('logo')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => (this.logoPreview = reader.result);
      reader.readAsDataURL(file);
    }
  }
  onPhotoUpload(event: any) {
    const file = event.target.files[0];
    this.candidatForm.get('photo')?.setValue(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onCvUpload(event: any) {
    const file = event.target.files[0];
    this.candidatForm.get('cv')?.setValue(file);
    this.uploadedFileNamee = file.name;
  }
  onFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadedFileName = file.name;
    }
  }
  onRneUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.entrepriseForm.patchValue({ rne: file });
      this.entrepriseForm.get('rne')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => (this.rnePreview = reader.result);
      reader.readAsDataURL(file);
      this.uploadedFileName = file.name;
    }
  }
  submitForm() {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.userType == 'entreprise') {
      if (this.entrepriseForm.valid) {
        const formData = new FormData();
        Object.keys(this.entrepriseForm.controls).forEach((key) => {
          if (key !== 'logo' && key !== 'rne' && key !== 'confirmPassword') {
            formData.append(key, this.entrepriseForm.get(key)?.value);
          }
        });
        formData.append('logo', this.entrepriseForm.get('logo')?.value);
        formData.append('rne', this.entrepriseForm.get('rne')?.value);

        this.authService.registerEntreprise(formData).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.successMessage = response.message; // <-- récupérer message du backend
            Swal.fire(
              'Succès',
              this.successMessage || 'Opération réussie',
              'success'
            ); // <-- afficher Swal
            this.showVerification = true;
            this.nextStep();
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = "Erreur lors de l'inscription de l'entreprise.";
            Swal.fire('Erreur', this.errorMessage, 'error'); // <-- afficher Swal erreur
            console.error("Erreur d'inscription entreprise:", err);
          },
        });
      } else {
        this.isLoading = false;
        Swal.fire(
          'Erreur',
          'Veuillez vérifier les champs : tous les champs doivent être remplis.',
          'error'
        );
      }
    }
    if (this.userType == 'chercheur') {
      if (this.chercheurForm.valid) {
        const chercheurData = this.chercheurForm.value;
        this.authService.registerChercheur(chercheurData).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.successMessage = response.message; // <-- message backend
            Swal.fire(
              'Succès',
              this.successMessage || 'Opération réussie',
              'success'
            );
            this.currentStep = 8;
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = "Erreur lors de l'inscription du chercheur.";
            Swal.fire('Erreur', this.errorMessage, 'error');
            console.error("Erreur d'inscription chercheur:", err);
          },
        });
      } else {
        this.isLoading = false;
        Swal.fire(
          'Erreur',
          'Veuillez vérifier les champs : tous les champs doivent être remplis.',
          'error'
        );
      }
    }
  }

  submitCandidatForm() {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.userType == 'candidat') {
      if (this.candidatForm.valid) {
        const formData = new FormData();
        formData.append('nom', this.candidatForm.get('nom')?.value);
        formData.append('prenom', this.candidatForm.get('prenom')?.value);
        formData.append('email', this.candidatForm.get('email')?.value);
        formData.append(
          'motDePasse',
          this.candidatForm.get('motDePasse')?.value
        );
        formData.append('titre', this.candidatForm.get('titre')?.value);
        formData.append('type', this.candidatForm.get('type')?.value);
        formData.append('bio', this.candidatForm.get('bio')?.value);

        const competance = this.candidatForm.get('competance')?.value;
        if (competance && competance.length > 0) {
          competance.forEach((comp: any, index: any) => {
            formData.append(`competance[${index}]`, comp);
          });
        }
        if (this.candidatForm.get('photo')?.value) {
          formData.append('photo', this.candidatForm.get('photo')?.value);
        }
        if (this.candidatForm.get('cv')?.value) {
          formData.append('cv', this.candidatForm.get('cv')?.value);
        }

        this.authService.registerCandidat(formData).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.successMessage = response.message; // <-- message backend
            Swal.fire(
              'Succès',
              this.successMessage || 'Opération réussie',
              'success'
            );
            this.logIn();
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = "Erreur lors de l'inscription du candidat.";
            Swal.fire('Erreur', error.error, 'error');
            console.error("Erreur lors de l'enregistrement du candidat", error);
          },
        });
      } else {
        this.isLoading = false;
        Swal.fire(
          'Erreur',
          'Veuillez vérifier les champs : tous les champs doivent être remplis.',
          'error'
        );
      }
    }
  }
}
