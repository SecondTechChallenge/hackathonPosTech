import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cadastrar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.scss']
})
export class CadastrarComponent {
  nome = '';
  email = '';
  senha = '';

  constructor(private router: Router) {}

  cadastrar() {
    if (!this.nome || !this.email || !this.senha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Regex simples para validar e-mail
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    if (!emailValido) {
      alert('E-mail inválido. Verifique o formato.');
      return;
    }

    const listaProfessores = JSON.parse(localStorage.getItem('listaProfessores') || '[]');
    const emailExistente = listaProfessores.find((p: any) => p.email === this.email);

    if (emailExistente) {
      alert('E-mail já cadastrado. Por favor, use outro.');
      return;
    }

    listaProfessores.push({
      nome: this.nome,
      email: this.email,
      senha: this.senha
    });

    localStorage.setItem('listaProfessores', JSON.stringify(listaProfessores));

    alert('Cadastro realizado com sucesso!');
    this.router.navigate(['/login']);
  }


  irParaLogin() {
    this.router.navigate(['/login']);
  }
}
