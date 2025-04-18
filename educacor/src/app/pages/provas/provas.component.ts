import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-provas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './provas.component.html',
  styleUrls: ['./provas.component.scss']
})
export class ProvasComponent implements OnInit {
  displayedColumns: string[] = ['aluno', 'materia', 'turma', 'bimestre', 'nota', 'acoes'];

  provas: any[] = [];
  nomeAluno = '';
  turma = '';
  materia = '';
  bimestre: number | null = null;
  nota: number | null = null;
  professorEmail = '';
  editandoId: number | null = null;

  filtroTurma = '';
  filtroMateria = '';
  filtroBoletimAluno = '';
  filtroBoletimMateria = '';

  ngOnInit() {
    const professor = JSON.parse(localStorage.getItem('professorLogado') || '{}');
    if (!professor?.email) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }
    this.professorEmail = professor.email;

    const dadosSalvos = localStorage.getItem(`provas_${this.professorEmail}`);
    if (dadosSalvos) {
      this.provas = JSON.parse(dadosSalvos);
    }
  }

  salvarLocalStorage() {
    if (this.professorEmail) {
      localStorage.setItem(`provas_${this.professorEmail}`, JSON.stringify(this.provas));
    }
  }

  get provasFiltradas() {
    return this.provas.filter(p => {
      const turmaOK = this.filtroTurma ? p.turma === this.filtroTurma : true;
      const materiaOK = this.filtroMateria ? p.materia === this.filtroMateria : true;
      return turmaOK && materiaOK;
    });
  }

  get turmasUnicas() {
    return [...new Set(this.provas.map(p => p.turma))];
  }

  get materiasUnicas() {
    return [...new Set(this.provas.map(p => p.materia))];
  }

  get alunosUnicos() {
    return [...new Set(this.provas.map(p => p.nomeAluno))];
  }

  enviarNota() {
    if (this.nomeAluno && this.materia && this.bimestre !== null && this.nota !== null && this.turma) {
      if (this.editandoId) {
        const index = this.provas.findIndex(p => p.id === this.editandoId);
        if (index > -1) {
          this.provas[index] = {
            id: this.editandoId,
            nomeAluno: this.nomeAluno,
            turma: this.turma,
            materia: this.materia,
            bimestre: this.bimestre,
            nota: this.nota
          };
        }
      } else {
        const novaProva = {
          id: Date.now(),
          nomeAluno: this.nomeAluno,
          turma: this.turma,
          materia: this.materia,
          bimestre: this.bimestre,
          nota: this.nota
        };
        this.provas.push(novaProva);
      }

      this.salvarLocalStorage();
      this.resetarCampos();
    } else {
      alert('Preencha todos os campos corretamente.');
    }
  }

  editarNota(prova: any) {
    this.editandoId = prova.id;
    this.nomeAluno = prova.nomeAluno;
    this.turma = prova.turma;
    this.materia = prova.materia;
    this.bimestre = prova.bimestre;
    this.nota = prova.nota;
  }

  excluirNota(id: number) {
    this.provas = this.provas.filter(p => p.id !== id);
    this.salvarLocalStorage();
  }

  resetarCampos() {
    this.nomeAluno = '';
    this.turma = '';
    this.materia = '';
    this.bimestre = null;
    this.nota = null;
    this.editandoId = null;
  }

  get boletimFiltrado() {
    const resultado: { [aluno: string]: { [materia: string]: { notas: number[], media: number, status: string } } } = {};
    this.provas.forEach(prova => {
      if (this.filtroBoletimAluno && prova.nomeAluno !== this.filtroBoletimAluno) return;
      if (this.filtroBoletimMateria && prova.materia !== this.filtroBoletimMateria) return;

      if (!resultado[prova.nomeAluno]) resultado[prova.nomeAluno] = {};
      if (!resultado[prova.nomeAluno][prova.materia]) resultado[prova.nomeAluno][prova.materia] = { notas: [], media: 0, status: '' };

      resultado[prova.nomeAluno][prova.materia].notas.push(prova.nota);
    });

    for (const aluno in resultado) {
      for (const materia in resultado[aluno]) {
        const notas = resultado[aluno][materia].notas;
        const media = notas.reduce((a, b) => a + b, 0) / notas.length;
        resultado[aluno][materia].media = parseFloat(media.toFixed(2));

        if (media >= 7) resultado[aluno][materia].status = 'Aprovado';
        else if (media >= 5) resultado[aluno][materia].status = 'Recuperação';
        else resultado[aluno][materia].status = 'Reprovado';
      }
    }

    return resultado;
  }

  exportarNotasPorTurmaPDF() {
    const elemento = document.querySelector('.card-tabela');
    if (!elemento) return;

    html2canvas(elemento as HTMLElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save('notas_por_turma.pdf');
    });
  }

  exportarBoletimPorAlunoPDF(nomeAluno: string) {
    const elemento = document.getElementById(`boletim-aluno-${nomeAluno}`);
    if (!elemento) return;

    html2canvas(elemento).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`boletim_${nomeAluno}.pdf`);
    });
  }
}
