# Etapa 8 — Protótipo / MVP

## 8.1 Escopo do MVP

O protótipo contempla o **fluxo principal** do sistema: do registro de um objeto até a devolução ao proprietário. As funcionalidades de administração (gerenciar locais, categorias e usuários) são simplificadas no MVP.

**Stack do MVP:** Next.js 16 + React 19 + TypeScript + Tailwind CSS v4

---

## 8.2 Telas do Sistema

### TELA 1 — Login

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                    🎒  SIGOP                                 │
│            Sistema de Objetos Perdidos                       │
│                 Faculdade XYZ                                │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  E-mail institucional                                  │  │
│  │  [email@faculdade.edu.br                             ] │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Senha                                                 │  │
│  │  [••••••••••                                        ] │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │            ENTRAR NO SISTEMA                           │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│           Não tenho cadastro | Esqueci a senha               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Elementos:** Logo, campo e-mail, campo senha, botão entrar, links auxiliares

---

### TELA 2 — Dashboard (Página Inicial)

```
┌──────────────────────────────────────────────────────────────┐
│ SIGOP  [🔔 3]              Olá, João Silva  [▼] [Sair]       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│  │  📦 12       │ │  🔍 8        │ │  ✅ 5        │         │
│  │  Objetos     │ │  Aguardando  │ │  Devolvidos  │         │
│  │  Encontrados │ │  Validação   │ │  este mês    │         │
│  └──────────────┘ └──────────────┘ └──────────────┘         │
│                                                              │
│  AÇÕES RÁPIDAS                                               │
│  ┌────────────────────────┐  ┌────────────────────────────┐  │
│  │  [+] Registrar         │  │  [+] Registrar Objeto      │  │
│  │      Perda             │  │      Encontrado            │  │
│  └────────────────────────┘  └────────────────────────────┘  │
│                                                              │
│  OBJETOS RECENTEMENTE ENCONTRADOS                            │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ [foto] Carregador USB-C · Lab. Informática 1 · hoje    │  │
│  │        Eletrônicos · Status: Encontrado     [Ver →]    │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ [foto] Carteira preta · Biblioteca · ontem             │  │
│  │        Acessórios · Status: Em Análise      [Ver →]    │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ [foto] Chave com chaveiro azul · Cantina · 2 dias      │  │
│  │        Chaves · Status: Encontrado          [Ver →]    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                 [Ver todos os objetos →]     │
└──────────────────────────────────────────────────────────────┘
```

---

### TELA 3 — Registrar Objeto Perdido

```
┌──────────────────────────────────────────────────────────────┐
│ ← Voltar    REGISTRAR OBJETO PERDIDO                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  DESCRIÇÃO DO OBJETO                                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Descreva o objeto com o máximo de detalhes            │  │
│  │  [Notebook Dell preto, 15 polegadas, adesivo...      ] │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  CATEGORIA              MARCA (opcional)                     │
│  [Eletrônicos     ▼]    [Dell                              ] │
│                                                              │
│  COR PREDOMINANTE                                            │
│  [Preto                                                    ] │
│                                                              │
│  ÚLTIMO LOCAL CONHECIDO                                      │
│  [Selecione o local...                              ▼]       │
│                                                              │
│  DATA DA PERDA          HORA APROXIMADA                      │
│  [DD/MM/AAAA      ]     [HH:MM (opcional)         ]          │
│                                                              │
│  CIRCUNSTÂNCIAS (opcional)                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Onde e como o objeto foi perdido                      │  │
│  │  [Acredito ter esquecido na sala após a aula de...   ] │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  FOTOS DO OBJETO (opcional — ajuda na identificação)         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │         [📷 Clique para adicionar fotos]               │  │
│  │              JPG ou PNG, máx. 5 MB cada                │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  [CANCELAR]                    [REGISTRAR PERDA →]           │
└──────────────────────────────────────────────────────────────┘
```

---

### TELA 4 — Registrar Objeto Encontrado

```
┌──────────────────────────────────────────────────────────────┐
│ ← Voltar    REGISTRAR OBJETO ENCONTRADO                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ⚠️  Você está prestes a registrar um objeto encontrado.     │
│     O sistema notificará possíveis proprietários.            │
│                                                              │
│  DESCRIÇÃO DO OBJETO *                                       │
│  [Descreva o que você encontrou                            ] │
│                                                              │
│  CATEGORIA *            MARCA (opcional)                     │
│  [Selecione...   ▼]     [                                  ] │
│                                                              │
│  COR                                                         │
│  [                                                         ] │
│                                                              │
│  LOCAL ONDE FOI ENCONTRADO *                                 │
│  [Selecione o local...                              ▼]       │
│                                                              │
│  DATA *                 HORA APROXIMADA                      │
│  [DD/MM/AAAA      ]     [HH:MM             ]                 │
│                                                              │
│  ONDE O OBJETO ESTÁ GUARDADO AGORA?                          │
│  [Ex.: Portaria principal, com a secretaria...             ] │
│                                                              │
│  FOTOS DO OBJETO * (mínimo 1 foto obrigatória)              │
│  ┌───────────┐ ┌───────────┐ ┌───────────────────────────┐  │
│  │ [foto 1] ✓│ │[+ foto 2] │ │  [+ Adicionar mais fotos] │  │
│  └───────────┘ └───────────┘ └───────────────────────────┘  │
│                                                              │
│  [CANCELAR]               [REGISTRAR OBJETO ENCONTRADO →]   │
└──────────────────────────────────────────────────────────────┘
```

---

### TELA 5 — Listagem de Objetos

```
┌──────────────────────────────────────────────────────────────┐
│ SIGOP                OBJETOS REGISTRADOS                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  FILTROS                                                     │
│  [Categoria ▼] [Status ▼] [Local ▼] [Data ▼] [Buscar 🔍]   │
│                                                              │
│  ABAS: [Todos] [Encontrados] [Perdidos] [Em Análise]         │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ [foto]  Carregador USB-C                               │  │
│  │         Eletrônicos · Lab. Informática 1               │  │
│  │         Encontrado em: 01/06/2026 às 14h               │  │
│  │         🟢 Encontrado                      [Ver →]     │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ [foto]  Carteira preta com documentos                  │  │
│  │         Acessórios · Biblioteca Central                │  │
│  │         Encontrado em: 31/05/2026 às 10h               │  │
│  │         🟡 Em Análise                      [Ver →]     │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ [foto]  Notebook Dell                                  │  │
│  │         Eletrônicos · Sala 302                         │  │
│  │         Perdido em: 30/05/2026                         │  │
│  │         🔴 Perdido                         [Ver →]     │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│         [ 1 ] [ 2 ] [ 3 ] ... [ → Próxima ]                 │
└──────────────────────────────────────────────────────────────┘
```

---

### TELA 6 — Detalhe do Objeto

```
┌──────────────────────────────────────────────────────────────┐
│ ← Voltar    OBJETO #042 · 🟢 Encontrado                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  Carregador USB-C branco               │
│  │                  │  Categoria: Eletrônicos                │
│  │   [FOTO DO OBJ]  │  Marca: Apple                         │
│  │                  │  Cor: Branco                          │
│  └──────────────────┘  Encontrado em: Lab. Info. 1           │
│  [foto 1] [foto 2]     Data: 01/06/2026 às 14h              │
│                        Guardado na: Portaria Principal       │
│                                                              │
│  DESCRIÇÃO                                                   │
│  Carregador com cabo USB-C, cabo branco, sem caixa.          │
│  Tem pequeno arranhão na ponta do conector.                  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ ✋  Este objeto é seu?                                  │  │
│  │    Apresente evidências de propriedade e solicite      │  │
│  │    a devolução.                                        │  │
│  │                          [REIVINDICAR PROPRIEDADE →]   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  HISTÓRICO DE MOVIMENTAÇÕES                                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 01/06/2026 14:32  Maria Souza registrou o encontro    │  │
│  │                   Status: — → Encontrado               │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ 01/06/2026 14:32  Sistema criou o registro do objeto  │  │
│  │                   Status: — → Encontrado               │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

### TELA 7 — Solicitação de Posse

```
┌──────────────────────────────────────────────────────────────┐
│ ← Voltar    REIVINDICAR PROPRIEDADE                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Objeto: Carregador USB-C branco (Objeto #042)               │
│                                                              │
│  Por que você acredita que este objeto é seu?                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Descreva características únicas que só o proprietário │  │
│  │  real saberia, como risco, etiqueta, cor exata...      │  │
│  │  [O carregador tem meu nome escrito na fita adesiva  ] │  │
│  │  [branca colada no cabo. A ponta também tem uma marca ] │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  EVIDÊNCIAS DE PROPRIEDADE (anexe fotos ou documentos)       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  [+ Adicionar nota fiscal]                             │  │
│  │  [+ Foto mostrando o objeto sendo usado]               │  │
│  │  [+ Print de e-mail de compra]                         │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ℹ️  Sua solicitação será analisada por um responsável.      │
│     Você receberá uma notificação com o resultado.           │
│                                                              │
│  [CANCELAR]                         [ENVIAR SOLICITAÇÃO →]   │
└──────────────────────────────────────────────────────────────┘
```

---

### TELA 8 — Painel de Validação (Funcionário)

```
┌──────────────────────────────────────────────────────────────┐
│ SIGOP    PAINEL DE VALIDAÇÃO          [Funcionário: Carlos]  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  SOLICITAÇÕES PENDENTES (3)                                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Solicitação #015 — Carregador USB-C             🟡     │  │
│  │ Solicitante: João Silva (Aluno - Mat. 2022001)         │  │
│  │ Recebida em: 02/06/2026 09:15                          │  │
│  │                                         [ANALISAR →]   │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ Solicitação #014 — Carteira preta               🟡     │  │
│  │ Solicitante: Ana Lima (Professora)                     │  │
│  │ Recebida em: 01/06/2026 17:40                          │  │
│  │                                         [ANALISAR →]   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  RECENTEMENTE VALIDADAS                                      │
│  [Solicitação #013 · Aprovada · 01/06/2026] [Ver →]         │
│  [Solicitação #012 · Rejeitada · 31/05/2026] [Ver →]        │
└──────────────────────────────────────────────────────────────┘
```

---

### TELA 9 — Análise de Solicitação (Funcionário)

```
┌──────────────────────────────────────────────────────────────┐
│ ← Voltar    ANALISAR SOLICITAÇÃO #015                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  OBJETO REIVINDICADO                                         │
│  [foto] Carregador USB-C branco · Eletrônicos                │
│         Encontrado em: Lab. Info 1 · 01/06/2026              │
│                                                              │
│  ─────────────────────────────────────────────────────────   │
│                                                              │
│  SOLICITANTE                                                 │
│  João Silva · Aluno · Mat. 2022001                           │
│  joao.silva@faculdade.edu.br · (11) 9 9999-0001              │
│                                                              │
│  JUSTIFICATIVA DO SOLICITANTE                                │
│  "O carregador tem meu nome escrito na fita adesiva          │
│  branca colada no cabo. A ponta também tem uma marca         │
│  de queimado pequena."                                       │
│                                                              │
│  EVIDÊNCIAS ANEXADAS                                         │
│  [📎 nota_fiscal_apple.pdf]  [📷 foto_comprovante.jpg]       │
│                                                              │
│  ─────────────────────────────────────────────────────────   │
│                                                              │
│  SUA DECISÃO                                                 │
│  Justificativa (obrigatória para rejeição):                  │
│  [                                                         ] │
│                                                              │
│  ┌─────────────────────────┐  ┌─────────────────────────┐   │
│  │  ❌ REJEITAR             │  │  ✅ APROVAR SOLICITAÇÃO  │   │
│  └─────────────────────────┘  └─────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

### TELA 10 — Registrar Devolução (Funcionário)

```
┌──────────────────────────────────────────────────────────────┐
│ ← Voltar    REGISTRAR DEVOLUÇÃO                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ✅ Solicitação #015 APROVADA                                 │
│                                                              │
│  RESUMO DA DEVOLUÇÃO                                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Objeto:      Carregador USB-C branco (#042)           │  │
│  │  Beneficiário: João Silva (Aluno 2022001)              │  │
│  │  Aprovado por: Carlos Mendes (Funcionário)             │  │
│  │  Data/Hora:   02/06/2026 · 14:30                       │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ⚠️  Confirme que o objeto foi entregue fisicamente          │
│     ao beneficiário antes de registrar a devolução.          │
│                                                              │
│  Observações:                                                │
│  [Ex.: Beneficiário apresentou RG para confirmação        ] │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  ✅ CONFIRMAR DEVOLUÇÃO E EMITIR COMPROVANTE           │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### TELA 11 — Comprovante de Devolução

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              ✅  DEVOLUÇÃO REALIZADA COM SUCESSO             │
│                                                              │
│  ╔══════════════════════════════════════════════════════╗    │
│  ║         COMPROVANTE DE DEVOLUÇÃO — SIGOP             ║    │
│  ║══════════════════════════════════════════════════════║    │
│  ║  Código: SIGOP-2026-0042-DEV                         ║    │
│  ║                                                      ║    │
│  ║  Objeto:      Carregador USB-C branco                ║    │
│  ║  Categoria:   Eletrônicos                            ║    │
│  ║                                                      ║    │
│  ║  Beneficiário: João Silva                            ║    │
│  ║  Matrícula:   2022001                                ║    │
│  ║                                                      ║    │
│  ║  Responsável: Carlos Mendes                          ║    │
│  ║  Data/Hora:   02/06/2026 às 14:32                    ║    │
│  ║                                                      ║    │
│  ║  Faculdade XYZ — Campus Principal                    ║    │
│  ╚══════════════════════════════════════════════════════╝    │
│                                                              │
│  [🖨️  IMPRIMIR]    [📄 SALVAR PDF]    [Ir ao início →]       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 8.3 Fluxo do Usuário (User Flow)

```
                              ┌─────────────┐
                              │    LOGIN    │
                              └──────┬──────┘
                                     │
                              ┌──────▼──────┐
                              │  DASHBOARD  │
                              └──────┬──────┘
                          ┌──────────┴──────────┐
                          │                     │
                   ┌──────▼──────┐      ┌───────▼──────┐
                   │  Registrar  │      │  Listar /    │
                   │   Perda     │      │  Buscar Obj. │
                   └──────┬──────┘      └───────┬──────┘
                          │                     │
               ┌──────────┘             ┌───────▼──────────┐
               │                        │  Detalhe Objeto  │
               │                        └───────┬──────────┘
               │                                │
               │                  ┌─────────────┴──────────┐
               │                  │                        │
               │          ┌───────▼──────┐        (já tem dono)
               │          │  Reivindicar │                  │
               │          │   Posse      │                  │
               │          └───────┬──────┘                  │
               │                  │                         │
               │          ┌───────▼──────┐                  │
               │          │  Solicitação │                  │
               │          │  Pendente    │                  │
               │          └───────┬──────┘                  │
               │                  │ [notifica funcionário]  │
               │          ┌───────▼──────┐                  │
               │          │  FUNCIONÁRIO │                  │
               │          │  Analisa     │                  │
               │          └───────┬──────┘                  │
               │            ┌─────┴──────┐                  │
               │        ┌───▼──┐      ┌──▼────┐             │
               │        │Aprov.│      │Rejeit.│             │
               │        └───┬──┘      └──┬────┘             │
               │            │            │ [notifica        │
               │            │            │  solicitante]    │
               │    ┌───────▼──────┐     │                  │
               │    │  Disponível  │     │                  │
               │    │ para Retirada│     │                  │
               │    └───────┬──────┘     │                  │
               │            │ [beneficiário vai buscar]     │
               │    ┌───────▼──────┐                        │
               │    │  Registrar   │                        │
               │    │  Devolução   │                        │
               │    └───────┬──────┘                        │
               │            │                               │
               │    ┌───────▼──────┐                        │
               │    │  Comprovante │                        │
               │    │  + ENCERRADO │◄───────────────────────┘
               │    └──────────────┘
               │
      ┌────────▼─────────────┐
      │  Registrar Encontrado│
      │  (quem achou)        │
      └──────────────────────┘
```

---

## 8.4 Rotas do Sistema (Next.js App Router)

```
app/
├── (auth)/
│   ├── login/page.tsx              → Tela 1: Login
│   └── cadastro/page.tsx           → Cadastro de usuário
│
├── (app)/
│   ├── layout.tsx                  → Layout com navbar e notificações
│   ├── page.tsx                    → Tela 2: Dashboard
│   │
│   ├── objetos/
│   │   ├── page.tsx                → Tela 5: Listagem
│   │   ├── [id]/page.tsx           → Tela 6: Detalhe
│   │   └── [id]/reivindicar/page.tsx → Tela 7: Solicitação
│   │
│   ├── registrar/
│   │   ├── perda/page.tsx          → Tela 3: Registrar Perda
│   │   └── encontrado/page.tsx     → Tela 4: Registrar Encontrado
│   │
│   ├── validacao/
│   │   ├── page.tsx                → Tela 8: Painel de Validação
│   │   ├── [id]/page.tsx           → Tela 9: Análise
│   │   └── [id]/devolucao/page.tsx → Tela 10: Registrar Devolução
│   │
│   ├── comprovante/[id]/page.tsx   → Tela 11: Comprovante
│   │
│   └── admin/
│       ├── usuarios/page.tsx       → Gerenciar Usuários
│       ├── locais/page.tsx         → Gerenciar Locais
│       └── categorias/page.tsx     → Gerenciar Categorias
│
└── api/
    ├── auth/[...nextauth]/route.ts
    ├── objetos/route.ts
    ├── objetos/[id]/route.ts
    ├── solicitacoes/route.ts
    ├── validacoes/route.ts
    └── devolucoes/route.ts
```
