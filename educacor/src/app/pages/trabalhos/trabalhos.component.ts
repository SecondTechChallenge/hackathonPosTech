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
  selector: 'app-trabalhos',
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
  templateUrl: './trabalhos.component.html',
  styleUrls: ['./trabalhos.component.scss']
})
export class TrabalhosComponent implements OnInit {
  displayedColumns: string[] = ['aluno', 'titulo', 'data', 'status', 'acoes'];

  trabalhos: any[] = [];
  nomeAluno = '';
  tituloTrabalho = '';
  novoArquivo: File | null = null;
  filtroNome = '';
  filtroTitulo = '';
  filtroStatus = '';
  professorEmail = '';
  filtroDataInicio: string = '';
  filtroDataFim: string = '';
  filtroExportAluno = '';
  filtroExportPeriodo = '';
  filtroExportCorrigido = false;

  ngOnInit() {
    const professor = JSON.parse(localStorage.getItem('professorLogado') || '{}');
    if (!professor?.email) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    this.professorEmail = professor.email;

    const dadosSalvos = localStorage.getItem(`trabalhos_${this.professorEmail}`);
    if (dadosSalvos) {
      const trabalhos = JSON.parse(dadosSalvos);
      this.trabalhos = trabalhos.map((t: any) => ({
        ...t,
        dataEnvio: new Date(t.dataEnvio)
      }));
    }
  }

  salvarLocalStorage() {
    if (this.professorEmail) {
      localStorage.setItem(`trabalhos_${this.professorEmail}`, JSON.stringify(this.trabalhos));
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const tiposPermitidos = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
      ];
      const tamanhoMaximoMB = 5;

      if (!tiposPermitidos.includes(file.type)) {
        alert('Tipo de arquivo não permitido. Use: PDF, DOC, DOCX, JPG ou PNG.');
        this.novoArquivo = null;
        return;
      }

      if (file.size > tamanhoMaximoMB * 1024 * 1024) {
        alert('Arquivo muito grande. O tamanho máximo permitido é 5MB.');
        this.novoArquivo = null;
        return;
      }

      this.novoArquivo = file;
    }
  }

  async enviarTrabalho() {
    if (this.nomeAluno && this.tituloTrabalho && this.novoArquivo) {
      const file = this.novoArquivo;
      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: file.type });
      const fileUrl = URL.createObjectURL(blob);

      const novoTrabalho = {
        id: this.trabalhos.length + 1,
        nomeAluno: this.nomeAluno,
        titulo: this.tituloTrabalho,
        dataEnvio: new Date(),
        status: 'Pendente',
        arquivoNome: file.name,
        arquivoTipo: file.type,
        arquivoUrl: fileUrl,
        feedbackIA: null,
        plagioStatus: null
      };

      this.trabalhos.push(novoTrabalho);
      this.trabalhos = [...this.trabalhos];
      this.salvarLocalStorage();
      this.limparFiltros();

      this.nomeAluno = '';
      this.tituloTrabalho = '';
      this.novoArquivo = null;
    } else {
      alert('Preencha todos os campos e selecione um arquivo.');
    }
  }

  corrigirComIA(trabalho: any) {
    const respostasSimuladas = [
      'Texto bem estruturado e coeso.',
      'Boa introdução, mas a conclusão pode ser reforçada.',
      'Ótimo uso de fontes, porém há pequenos erros gramaticais.',
      'Recomendo revisar o desenvolvimento do tema.',
      'Trabalho claro e objetivo. Parabéns!'
    ];

    trabalho.status = 'Corrigido';
    trabalho.feedbackIA = respostasSimuladas[Math.floor(Math.random() * respostasSimuladas.length)];

    this.trabalhos = [...this.trabalhos];
    this.salvarLocalStorage();
  }

  verificarPlagio(trabalho: any) {
    const statusSimulados = [
      'Nenhuma similaridade encontrada.',
      'Semelhança leve com outros textos (10%).',
      'Alto grau de similaridade com outros trabalhos (65%).'
    ];

    trabalho.plagioStatus = statusSimulados[Math.floor(Math.random() * statusSimulados.length)];
    this.trabalhos = [...this.trabalhos];
    this.salvarLocalStorage();
  }

  corrigirTrabalho(trabalho: any) {
    this.corrigirComIA(trabalho);
  }

  excluirTrabalho(id: number) {
    const confirmacao = confirm('Deseja realmente excluir este trabalho?');
    if (confirmacao) {
      this.trabalhos = this.trabalhos.filter(t => t.id !== id);
      this.salvarLocalStorage();
    }
  }

  exportarFiltradoParaPDF() {
    if (!this.trabalhosParaExportar.length) {
      alert('Nenhum trabalho para exportar com os filtros selecionados.');
      return;
    }

    setTimeout(() => {
      const original = this.trabalhos;
      this.trabalhos = [...this.trabalhosParaExportar];

      setTimeout(() => {
        const tabela = document.getElementById('tabela-trabalhos');
        if (!tabela) return;

        html2canvas(tabela).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
          pdf.save('trabalhos_filtrados.pdf');

          this.trabalhos = original; // restaura
        });
      }, 100); // aguarda renderização
    }, 50);
  }


  baixarArquivo(trabalho: any) {
    const link = document.createElement('a');
    link.href = trabalho.arquivoUrl;
    link.download = trabalho.arquivoNome;
    link.click();
  }

  get trabalhosFiltrados() {
    return this.trabalhos.filter(trabalho => {
      const nomeOk = trabalho.nomeAluno.toLowerCase().includes(this.filtroNome.toLowerCase());
      const tituloOk = trabalho.titulo.toLowerCase().includes(this.filtroTitulo.toLowerCase());
      const statusOk = this.filtroStatus ? trabalho.status === this.filtroStatus : true;

      const dataTrabalho = new Date(trabalho.dataEnvio);
      const inicioOk = this.filtroDataInicio ? dataTrabalho >= new Date(this.filtroDataInicio) : true;
      const fimOk = this.filtroDataFim ? dataTrabalho <= new Date(this.filtroDataFim) : true;

      return nomeOk && tituloOk && statusOk && inicioOk && fimOk;
    });
  }

  limparFiltros() {
    this.filtroNome = '';
    this.filtroTitulo = '';
    this.filtroStatus = '';
    this.filtroDataInicio = '';
    this.filtroDataFim = '';
  }

  get alunosUnicos(): string[] {
    return [...new Set(this.trabalhos.map(t => t.nomeAluno))];
  }

  get trabalhosParaExportar() {
    const hoje = new Date();
    return this.trabalhos.filter(t => {
      const data = new Date(t.dataEnvio);
      const byAluno = this.filtroExportAluno ? t.nomeAluno === this.filtroExportAluno : true;
      const byCorrigido = this.filtroExportCorrigido ? t.status === 'Corrigido' : true;
      let byPeriodo = true;

      if (this.filtroExportPeriodo === '7') {
        const seteDiasAtras = new Date();
        seteDiasAtras.setDate(hoje.getDate() - 7);
        byPeriodo = data >= seteDiasAtras;
      } else if (this.filtroExportPeriodo === 'mes') {
        const mesAtual = hoje.getMonth();
        const anoAtual = hoje.getFullYear();
        byPeriodo = data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
      }

      return byAluno && byCorrigido && byPeriodo;
    });
  }



}

// 💬 NOTA IMPORTANTE:
// Os métodos de "correção com IA" e "análise de plágio" neste código são SIMULADOS.
// Para tornar reais:
// 1. Substitua os métodos corrigirComIA() e verificarPlagio() por chamadas HTTP para sua API backend.
// 2. Essa API pode usar serviços como OpenAI (para correção) e Copyleaks/Turnitin (para plágio).
// 3. Envie o conteúdo do trabalho (texto extraído ou arquivo) e aguarde a resposta com análise.
// 4. Atualize os campos feedbackIA e plagioStatus com base na resposta recebida.
// 5. Use HttpClient do Angular para integrar com seu backend.
//
// Essa estrutura está pronta para essa transição assim que quiser 💡
