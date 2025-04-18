import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  senha = '';
  nome = '';

  constructor(private router: Router) {}

  login() {
    const listaProfessores = JSON.parse(localStorage.getItem('listaProfessores') || '[]');
    const professorEncontrado = listaProfessores.find((p: any) => p.email === this.email && p.senha === this.senha);

    if (professorEncontrado) {
      localStorage.setItem('professorLogado', JSON.stringify(professorEncontrado));
      this.router.navigate(['/dashboard']);
    } else {
      alert('E-mail ou senha inválidos.');
    }
  }


  irParaCadastro() {
    this.router.navigate(['/cadastrar']);
  }

}
