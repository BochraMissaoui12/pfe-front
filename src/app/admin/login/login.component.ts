import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      motDePasse: ['', Validators.required],
    });
  }

  get f() {
    return this.loginForm.get.bind(this.loginForm);
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    const email = this.f('email')?.value;
    const motDePasse = this.f('motDePasse')?.value;

    this.authService.loginAdmin(email, motDePasse).subscribe({
      next: (response) => {
        console.log(response);
        const token = response;
        localStorage.setItem('token', token);

        const decodedToken = this.decodeToken(token);
        const role = decodedToken?.role || decodedToken?.authorities || null;
        this.redirectUserBasedOnRole(role);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.error, // Message d'erreur du backend
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

    if (role.includes('ADMIN')) {
      this.router.navigate(['/accueil']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
