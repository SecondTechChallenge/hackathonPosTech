import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  nome = '';
  email = '';
  senha = '';

  ngOnInit(): void {
    const professor = JSON.parse(localStorage.getItem('professorLogado') || '{}');
    this.nome = professor.nome || '';
    this.email = professor.email || '';
  }

  salvar() {
    if (!this.nome || !this.email) {
      alert('Nome e e-mail são obrigatórios');
      return;
    }

    const professorAtualizado = {
      nome: this.nome,
      email: this.email,
      senha: this.senha || '123456' // senha simulada, opcional
    };

    localStorage.setItem('professorLogado', JSON.stringify(professorAtualizado));
    alert('Dados atualizados com sucesso!');
  }
}
