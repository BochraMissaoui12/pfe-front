import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/AdminService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administrateurs',
  templateUrl: './administrateurs.component.html',
  styleUrls: ['./administrateurs.component.css'],
})
export class AdministrateursComponent implements OnInit {
  admins: any[] = [];
  adminForm: FormGroup;
  isEditMode = false;
  editingAdminId: string | null = null;
  message: string = '';

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.adminForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', Validators.required],
      gouvernement: ['', Validators.required],
      adresse: ['', Validators.required],
      motDePasse: [''],
    });
  }

  ngOnInit(): void {
    this.loadAdmins();
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  loadAdmins() {
    this.adminService.getAllAdmins().subscribe({
      next: (data) => {
        this.admins = data;
      },
      error: (err) =>
        (this.message = 'Erreur lors du chargement des administrateurs'),
    });
  }

  submitForm() {
    if (this.adminForm.invalid) {
      Swal.fire(
        'Erreur',
        'Veuillez remplir tous les champs obligatoires.',
        'error'
      );
      return;
    }

    const adminData: any = this.adminForm.value;

    const action = this.isEditMode ? 'mettre à jour' : 'ajouter';
    Swal.fire({
      title: `Confirmer ${action}`,
      text: `Voulez-vous vraiment ${action} cet administrateur ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.isEditMode && this.editingAdminId) {
          this.adminService
            .updateAdmin(this.editingAdminId, adminData)
            .subscribe({
              next: (updatedAdmin) => {
                Swal.fire('Succès', 'Admin mis à jour avec succès', 'success');
                this.resetForm();
                this.loadAdmins();
              },
              error: () =>
                Swal.fire('Erreur', 'Erreur lors de la mise à jour', 'error'),
            });
        } else {
          this.adminService.addAdmin(adminData).subscribe({
            next: () => {
              Swal.fire('Succès', 'Admin ajouté avec succès', 'success');
              this.resetForm();
              this.loadAdmins();
            },
            error: () => Swal.fire('Erreur', "Erreur lors de l'ajout", 'error'),
          });
        }
      }
    });
  }

  editAdmin(admin: any) {
    this.isEditMode = true;
    this.editingAdminId = admin.id;
    this.adminForm.patchValue({
      nom: admin.nom,
      prenom: admin.prenom,
      email: admin.email,
      tel: admin.tel,
      gouvernement: admin.gouvernement,
      adresse: admin.adresse,
      motDePasse: '', // mot de passe non modifiable ici, ou à gérer différemment
    });
  }

  deleteAdmin(adminId: string) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteAdmin(adminId).subscribe({
          next: () => {
            Swal.fire(
              'Supprimé !',
              "L'administrateur a été supprimé.",
              'success'
            );
            this.loadAdmins();
          },
          error: () => {
            Swal.fire('Erreur', 'Erreur lors de la suppression', 'error');
          },
        });
      }
    });
  }

  resetForm() {
    this.adminForm.reset();
    this.isEditMode = false;
    this.editingAdminId = null;
    this.message = '';
  }
}
