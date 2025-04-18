import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-plagio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    NgChartsModule
  ],
  templateUrl: './plagio.component.html',
  styleUrls: ['./plagio.component.scss']
})
export class PlagioComponent implements OnInit {
  historicoPlagios: any[] = [];
  arquivoUpload: File | null = null;
  resultadoSimulacao: string = '';

  regras = {
    tolerancia: 20,
    ignorarPalavras: ''
  };

  filtroAluno = '';
  filtroMateria = '';
  filtroDataInicio: string = '';
  filtroDataFim: string = '';

  chartLabels: string[] = [];
  chartData: ChartData<'bar', (number | null)[], string> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Verificações por Aluno'
      }
    ]
  };
  chartOptions: ChartOptions<'bar'> = {
    responsive: true
  };
  chartType: ChartType = 'bar';

  ngOnInit() {
    const dados = localStorage.getItem('plagioHistorico');
    if (dados) {
      this.historicoPlagios = JSON.parse(dados);
    }
    this.gerarEstatisticas();
  }

  salvarHistorico() {
    localStorage.setItem('plagioHistorico', JSON.stringify(this.historicoPlagios));
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.arquivoUpload = file;
  }

  simularAnalise() {
    if (!this.arquivoUpload) {
      alert('Selecione um arquivo.');
      return;
    }

    const porcentagemSimulada = Math.floor(Math.random() * 100);
    this.resultadoSimulacao = `Semelhança detectada: ${porcentagemSimulada}%`;

    const novoRegistro = {
      id: Date.now(),
      nomeArquivo: this.arquivoUpload.name,
      data: new Date(),
      similaridade: porcentagemSimulada,
      aluno: this.filtroAluno || 'Não vinculado',
      materia: this.filtroMateria || 'Não informada'
    };

    this.historicoPlagios.unshift(novoRegistro);
    this.historicoPlagios = [...this.historicoPlagios];
    this.salvarHistorico();
    this.arquivoUpload = null;
    this.gerarEstatisticas();
  }

  deletarRegistro(id: number) {
    this.historicoPlagios = this.historicoPlagios.filter(p => p.id !== id);
    this.salvarHistorico();
    this.gerarEstatisticas();
  }

  get alunosUnicos() {
    return [...new Set(this.historicoPlagios.map(p => p.aluno).filter(a => a !== 'Não vinculado'))];
  }

  get materiasUnicas() {
    return [...new Set(this.historicoPlagios.map(p => p.materia).filter(m => m !== 'Não informada'))];
  }

  get verificacoesFiltradas() {
    return this.historicoPlagios.filter(v => {
      const data = new Date(v.data).toISOString().split('T')[0];
      const dentroIntervalo = (!this.filtroDataInicio || data >= this.filtroDataInicio) &&
                               (!this.filtroDataFim || data <= this.filtroDataFim);
      return dentroIntervalo;
    });
  }

  gerarEstatisticas() {
    const resumo: { [aluno: string]: number } = {};
    this.historicoPlagios.forEach(p => {
      if (!resumo[p.aluno]) {
        resumo[p.aluno] = 0;
      }
      resumo[p.aluno]++;
    });

    this.chartData.labels = Object.keys(resumo);
    this.chartData.datasets[0].data = Object.values(resumo);
  }

  exportarHistoricoParaPDF() {
    const elemento = document.body.querySelector('.card-tabela') as HTMLElement;
    if (!elemento) return;

    import('html2canvas').then(html2canvas => {
      html2canvas.default(elemento).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        import('jspdf').then(jsPDF => {
          const pdf = new jsPDF.jsPDF();
          pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
          pdf.save('historico-plagio.pdf');
        });
      });
    });
  }
}
