import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ⬅️ IMPORTANTE
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // ⬅️ AQUI
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})


export class LayoutComponent {
  professorNome: string = '';

  constructor(private router: Router) {
    const professor = JSON.parse(localStorage.getItem('professorLogado') || '{}');
    const nomeCompleto = professor.nome || 'Professor(a)';
    this.professorNome = nomeCompleto.split(' ')[0]; // Pega só o primeiro nome
  }

  logout() {
    localStorage.removeItem('professorLogado');
    this.router.navigate(['/login']);
  }
}


