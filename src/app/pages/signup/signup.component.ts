import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
  RendererStyleFlags2,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SkillService } from 'src/app/services/SkillService';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  userType: 'entreprise' | 'candidat' | 'chercheur' | null = null;
  profileType: 'employé' | 'freelancer' | 'étudiant' | null = null;
  candidatForm: FormGroup;
  loginForm: FormGroup;
  currentStep: number = 1;
  @Output() verificationModeChange = new EventEmitter<boolean>();
  entrepriseForm: FormGroup;
  detailsForm: FormGroup;
  idForm: FormGroup;
  logoPreview: string | ArrayBuffer | null = null;
  uploadedFileName: string | null = null;
  newSkill: string = '';
  skills: string[] = [];
  suggestions: string[] = [];
  showVerification: boolean = false;
  code: string[] = ['', '', '', ''];
  countdown: number = 59;
  constructor(
    private fb: FormBuilder,
    private skillService: SkillService,
    private renderer: Renderer2
  ) {
    this.entrepriseForm = this.fb.group({
      companyName: ['', Validators.required],
      responsable: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });

    this.detailsForm = this.fb.group({
      sector: ['', Validators.required],
      government: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      logo: [null, Validators.required],
    });

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
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
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
    if (this.loginForm.valid) {
      this.showVerification = true;
      this.nextStep();
      this.startCountdown();
    } else {
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  verifyCode() {
    console.log('Verifying code:', this.code.join(''));
  }
  resendCode() {
    console.log('Resending code');
    this.countdown = 59;
    this.startCountdown();
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
    }
  }
  submitForm() {
    if (this.userType == 'entreprise') {
      this.showVerification = true;
      this.nextStep();
    } else {
      this.currentStep = 8;
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
