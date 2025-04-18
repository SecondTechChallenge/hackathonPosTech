import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.scss']
})
export class ConfiguracoesComponent implements OnInit {
  nome = '';
  email = '';
  novaSenha = '';

  tema = 'claro';
  idioma = 'pt';
  fonte = 'Média';

  notificarTrabalhos = true;
  notificarCorrecao = true;
  notificarRelatorios = false;

  usarIA = true;
  verificarPlagio = true;

  temasDisponiveis = ['claro', 'escuro', 'energia-laranja'];
  idiomasDisponiveis = [
    { nome: 'Português', codigo: 'pt' },
    { nome: 'Inglês', codigo: 'en' }
  ];
  fontesDisponiveis = ['Pequena', 'Média', 'Grande'];

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    const professor = JSON.parse(localStorage.getItem('professorLogado') || '{}');
    this.nome = professor.nome || '';
    this.email = professor.email || '';
  }

  salvarConta() {
    const atualizado = {
      nome: this.nome,
      email: this.email,
      senha: this.novaSenha || '123456'
    };
    localStorage.setItem('professorLogado', JSON.stringify(atualizado));
    alert('Dados da conta atualizados!');
  }

  salvarPreferencias() {
    localStorage.setItem('preferencias', JSON.stringify({ tema: this.tema, idioma: this.idioma, fonte: this.fonte }));
    alert('Preferências salvas!');
  }

  salvarNotificacoes() {
    localStorage.setItem('notificacoes', JSON.stringify({
      trabalhos: this.notificarTrabalhos,
      correcao: this.notificarCorrecao,
      relatorios: this.notificarRelatorios
    }));
    alert('Notificações salvas!');
  }

  exportarDados() {
    const dados = {
      conta: { nome: this.nome, email: this.email },
      preferencias: { tema: this.tema, idioma: this.idioma, fonte: this.fonte },
      notificacoes: {
        trabalhos: this.notificarTrabalhos,
        correcao: this.notificarCorrecao,
        relatorios: this.notificarRelatorios
      },
      extras: { usarIA: this.usarIA, verificarPlagio: this.verificarPlagio }
    };
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'configuracoes.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  encerrarSessoes() {
    alert('Todas as outras sessões foram encerradas com sucesso.');
  }

  confirmarExclusaoConta() {
    if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não poderá ser desfeita.')) {
      localStorage.removeItem('professorLogado');
      alert('Conta excluída com sucesso.');
    }
  }

  salvarExtras() {
    alert('Configurações extras salvas.');
  }

  aplicarTema(tema: string) {
    const body = document.body;
    body.classList.remove('tema-escuro', 'tema-claro');
    body.classList.add(`tema-${tema}`);
    localStorage.setItem('temaSelecionado', tema);
  }


}
