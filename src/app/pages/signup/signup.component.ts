import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SkillService } from 'src/app/services/SkillService';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  userType: 'entreprise' | 'candidat' | null = null;
  profileType: 'candidat' | 'chercheur' | 'freelancer' | 'étudiant' | null =
    null;
  candidatForm: FormGroup;
  currentStep: number = 1;
  entrepriseForm: FormGroup;
  detailsForm: FormGroup;
  idForm: FormGroup;
  logoPreview: string | ArrayBuffer | null = null;
  uploadedFileName: string | null = null;
  newSkill: string = '';
  skills: string[] = [];
  suggestions: string[] = [];
  constructor(private fb: FormBuilder, private skillService: SkillService) {
    // Step 2 form
    this.entrepriseForm = this.fb.group({
      companyName: ['', Validators.required],
      responsable: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });

    // Step 3 form
    this.detailsForm = this.fb.group({
      sector: ['', Validators.required],
      government: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      logo: [null, Validators.required],
    });

    // Step 4 form
    this.idForm = this.fb.group({
      identifier: ['', Validators.required],
      rneDocument: [null, Validators.required],
    });
    this.candidatForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      skillInput: [''],
    });
  }

  ngOnInit(): void {
    this.candidatForm
      .get('skillInput')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value: string) => {
        if (value?.length >= 2) {
          this.skillService.searchSkills(value).subscribe((res) => {
            console.log('Suggestions reçues:', res); // Vérifier si les suggestions sont correctement mises à jour
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
  inscription() {
    this.currentStep = 1;
  }
  selectUserType(type: 'entreprise' | 'candidat') {
    this.userType = type;
    this.currentStep = 2; // Go to step 2 after selecting user type
  }
  selectProfile(
    profileType: 'candidat' | 'chercheur' | 'freelancer' | 'étudiant'
  ) {
    this.profileType = profileType;
    this.currentStep++;
  }

  nextStep() {
    if (this.currentStep < 8) {
      this.currentStep++;
    }
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

    this.candidatForm.get('skillInput')?.reset();
    this.suggestions = [];
  }

  removeSkill(index: number): void {
    this.skills.splice(index, 1);
  }
  onLogoUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      this.detailsForm.patchValue({ logo: file });
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadedFileName = file.name;
      // Tu peux aussi stocker le fichier ou l’envoyer ici
    }
  }
  submitForm() {
    if (
      this.entrepriseForm.valid &&
      this.detailsForm.valid &&
      this.idForm.valid
    ) {
      console.log('Formulaire soumis :', {
        entreprise: this.entrepriseForm.value,
        details: this.detailsForm.value,
        identifiant: this.idForm.value,
      });
      alert('Inscription réussie !');
    } else {
      alert('Veuillez remplir tous les champs requis !');
    }
  }
  submitCandidatForm() {
    if (this.candidatForm.valid) {
      console.log('Formulaire candidat soumis :', this.candidatForm.value);
      alert('Inscription candidat réussie !');
    } else {
      alert('Veuillez remplir tous les champs requis du formulaire candidat !');
    }
  }
}
