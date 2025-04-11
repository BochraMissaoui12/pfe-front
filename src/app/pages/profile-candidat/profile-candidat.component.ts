import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { SkillService } from 'src/app/services/SkillService';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-profile-candidat',
  templateUrl: './profile-candidat.component.html',
  styleUrls: ['./profile-candidat.component.css'],
})
export class ProfileCandidatComponent implements OnInit {
  menuOpen = false;
  educations: any[] = [
    {
      university: 'Stanford University',
      degree: 'MSc in Artificial Intelligence',
    }, //Sample Data
  ];
  educationForm: FormGroup;
  experiences: any[] = [
    {
      company: 'NeuralTech',
      position: 'Senior Software Engineer',
      startDate: '2021',
      endDate: '2024',
    },
    {
      company: 'OpenLabs',
      position: 'Software Engineer',
      startDate: '2018',
      endDate: '2021',
    },
    {
      company: 'Stanford AI Labs',
      position: 'AI Researcher',
      startDate: '2015',
      endDate: '2018',
    },
  ];

  experienceForm: FormGroup;
  years: number[] = [];
  skills: string[] = [
    'Python',
    'JavaScript',
    'TypeScript',
    'C++',
    'TensorFlow',
    'Pytorch',
    'OpenCV',
    'LLMs',
    'ReactJs',
    'NextJs',
    'ExpressJs',
    'Mongoose',
  ];
  candidatForm: FormGroup;
  suggestions: string[] = [];

  constructor(private fb: FormBuilder, private skillService: SkillService) {
    this.candidatForm = this.fb.group({
      skillInput: [''],
    });
    this.educationForm = this.fb.group({
      university: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      degree: ['', Validators.required],
      fieldOfStudy: ['', Validators.required],
    });
    this.experienceForm = this.fb.group({
      company: ['', Validators.required],
      position: ['', Validators.required],
      startDate: [''],
      endDate: [''],
    });
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 2000; i--) {
      this.years.push(i);
    }
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
  openEducationModal() {
    const modalElement = document.getElementById('educationModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  saveEducation() {
    if (this.educationForm.valid) {
      this.educations.push(this.educationForm.value);
      console.log('Education added:', this.educationForm.value); // Debugging
      this.educationForm.reset();
      const modalElement = document.getElementById('educationModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }
    }
  }

  deleteEducation(index: number) {
    this.educations.splice(index, 1);
  }
  openSkillsModal() {
    const modalElement = document.getElementById('skillsModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  addSkill(skill?: string): void {
    const inputValue = this.candidatForm.get('skillInput')?.value?.trim();
    const value = skill || inputValue;

    if (!skill && this.suggestions.length > 0) {
      return; // If suggestions are showing, only add from suggestions
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

  openModal() {
    const modalElement = document.getElementById('editModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  openExperienceModal() {
    const modalElement = document.getElementById('experienceModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  saveExperience() {
    if (this.experienceForm.valid) {
      this.experiences.push(this.experienceForm.value);
      this.experienceForm.reset();
      // Close the modal after saving
      const modalElement = document.getElementById('experienceModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }
    }
  }

  deleteExperience(index: number) {
    this.experiences.splice(index, 1);
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    const navLinks = document.querySelector('.nav-links') as HTMLElement;
    if (this.menuOpen) {
      navLinks.classList.add('active');
    } else {
      navLinks.classList.remove('active');
    }
  }
}
