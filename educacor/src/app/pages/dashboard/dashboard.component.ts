import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatListModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalTrabalhos: number = 45;
  totalProvas: number = 30;
  totalAlunos: number = 18;
  taxaAprovacao: number = 86;

  percentualTrabalhos: number = 75;
  percentualProvas: number = 62;

  atividadesRecentes = [
    {
      descricao: 'Trabalho de Matemática corrigido para Ana Souza.',
      data: new Date()
    },
    {
      descricao: 'Nota de Prova lançada para João Lima.',
      data: new Date()
    },
    {
      descricao: 'Verificação de plágio realizada em História.',
      data: new Date()
    },
    {
      descricao: 'Prova de Ciências revisada para Pedro Alves.',
      data: new Date()
    }
  ];

  ngOnInit() {}
}
