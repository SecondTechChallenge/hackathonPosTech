# 💜 EducaCor – Sistema de Correção Escolar

Projeto Angular voltado para professores da rede pública, oferecendo uma plataforma completa para correção de trabalhos e provas, com recursos como verificação de plágio, gráficos de desempenho, configurações personalizadas e muito mais.

---

## 📚 Funcionalidades

### 🧑‍🏫 Autenticação
- Login com nome, e-mail e senha
- Cadastro de novos professores
- Proteção de rotas com **AuthGuard**
- Armazenamento dos dados do professor via `localStorage`

### ✍️ Trabalhos
- Upload de trabalhos com validação de tipo de arquivo
- Lista com filtros por nome, data, status e matéria
- Simulação de correção com IA
- Verificação (simulada) de plágio
- Exportação avançada para PDF com filtros

### 📘 Provas
- Cadastro de notas por aluno, matéria, turma e bimestre
- Cálculo de média final
- Classificação automática (Aprovado, Recuperação, Reprovado)
- Filtros e exportação de boletins

### 📊 Dashboard
- Cards de resumo (trabalhos, provas, alunos, taxa de aprovação)
- Últimas atividades do professor
- Gráfico de progresso por categoria
- Acesso rápido a ações do sistema

### 📁 Verificação de Plágio
- Upload de arquivos
- Simulação de similaridade
- Histórico com filtro por data
- Gráfico estatístico por aluno

### ⚙️ Configurações
- Alteração de nome, e-mail e senha
- Preferências de tema, idioma e fonte
- Notificações configuráveis
- Exportação das configurações
- Segurança: encerrar sessões e excluir conta
- Extras: ativar IA e verificação de plágio

---

## 💡 Extras Implementados

- Aplicação dinâmica de **temas em tempo real**
- Feedback visual de ações (alertas de confirmação)
- Cards responsivos com estilo customizado
- Estrutura modularizada por páginas
- Uso de **Angular Material** para componentes
- Animação de transição entre rotas
- Gráficos com `ng2-charts` + `chart.js`
- Design consistente com a paleta **Energia Laranja**

---

## 🧱 Estrutura de Diretórios

```
src/
  └── app/
      ├── pages/
      │   ├── login/
      │   ├── cadastrar/
      │   ├── dashboard/
      │   ├── trabalhos/
      │   ├── provas/
      │   ├── plagio/
      │   ├── perfil/
      │   └── configuracoes/
      ├── layout/
      ├── auth/
      └── routes.ts
```

---

## 🚀 Como rodar o projeto

```bash
# Instalar dependências
npm install

# Servir a aplicação localmente
ng serve
```

---

## ✅ Dependências principais

- `@angular/*` (v17+)
- `@angular/material`
- `chart.js` + `ng2-charts`
- `html2canvas` + `jspdf`
- `rxjs`, `tslib`, `zone.js`

---

## 📂 Dados simulados

- Os dados dos professores, provas e trabalhos são armazenados via `localStorage` para simulação.
- O campo de senha é simbólico (não há criptografia).
- Verificações de plágio e correções são simuladas por IA.

---

## 🧪 Possíveis melhorias futuras

- Backend real com autenticação e banco de dados
- Upload real de arquivos e análise de plágio com API
- Gestão de múltiplos professores e permissões
- Controle de turmas e disciplinas
- Tema dark/light sincronizado com sistema

