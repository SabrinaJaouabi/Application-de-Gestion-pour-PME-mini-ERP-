import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // <-- attention: 'styleUrls', pas 'styleUrl'
})
export class RegisterComponent {
  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private router: Router) {}

  loading = false;
  errorMsg = '';

  registerForm = this.fb.group({
    username: ['', Validators.required],
    fullName: ['', Validators.required],        // <-- champ correct
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['ROLE_USER']                         // par défaut
  });

  register() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMsg = '';

    // Assurer le type correct
    const formValue = this.registerForm.value as {
      username: string;
      password: string;
      fullName: string;
      role?: string;
    };

    this.auth.register(formValue).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMsg = err.error?.error || 'Registration failed. Try again.';
      }
    });
  }
}
