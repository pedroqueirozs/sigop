# Etapa 5 — Diagrama de Classes UML

## 5.1 Diagrama de Classes Textual

```
┌───────────────────────────────────┐
│           <<enumeration>>         │
│           StatusObjeto            │
│───────────────────────────────────│
│ + PERDIDO                         │
│ + ENCONTRADO                      │
│ + EM_ANALISE                      │
│ + AGUARDANDO_VALIDACAO            │
│ + DISPONIVEL_PARA_RETIRADA        │
│ + DEVOLVIDO                       │
│ + ENCERRADO                       │
└───────────────────────────────────┘

┌───────────────────────────────────┐
│           <<enumeration>>         │
│        StatusSolicitacao          │
│───────────────────────────────────│
│ + PENDENTE                        │
│ + APROVADA                        │
│ + REJEITADA                       │
│ + CANCELADA                       │
└───────────────────────────────────┘

┌───────────────────────────────────┐
│           <<enumeration>>         │
│         ResultadoValidacao        │
│───────────────────────────────────│
│ + APROVADO                        │
│ + REJEITADO                       │
└───────────────────────────────────┘


┌─────────────────────────────┐
│          TipoUsuario        │
│─────────────────────────────│
│ - id: number                │
│ - descricao: string         │
│ - podeValidar: boolean      │
│ - podeAdministrar: boolean  │
│─────────────────────────────│
│ + getUsuarios(): Usuario[]  │
└─────────────────────────────┘
            △ (associação)
            │ 1
            │ N
┌───────────────────────────────────────────┐
│                  Usuario                  │
│───────────────────────────────────────────│
│ - id: number                              │
│ - tipoUsuario: TipoUsuario                │
│ - nome: string                            │
│ - email: string                           │
│ - cpf: string                             │
│ - matricula: string                       │
│ - telefone: string                        │
│ - senhaHash: string                       │
│ - ativo: boolean                          │
│ - dataCadastro: Date                      │
│───────────────────────────────────────────│
│ + autenticar(email, senha): boolean       │
│ + registrarPerda(objeto, local): RegistroPerda          │
│ + registrarEncontrado(objeto, local): RegistroEncontrado│
│ + solicitarPosse(objeto): SolicitacaoPosse              │
│ + validarSolicitacao(sol): Validacao      │
│ + receberNotificacao(): Notificacao[]     │
└───────────────────────────────────────────┘


┌──────────────────────────────┐
│        CategoriaObjeto       │
│──────────────────────────────│
│ - id: number                 │
│ - nome: string               │
│ - descricao: string          │
│ - icone: string              │
│──────────────────────────────│
│ + getObjetos(): Objeto[]     │
└──────────────────────────────┘
            △ (associação)
            │ 1
            │ N
┌───────────────────────────────────────────┐
│                   Objeto                  │
│───────────────────────────────────────────│
│ - id: number                              │
│ - categoria: CategoriaObjeto              │
│ - descricao: string                       │
│ - marca: string                           │
│ - cor: string                             │
│ - status: StatusObjeto                    │
│ - dataCriacao: Date                       │
│ - dataAtualizacao: Date                   │
│ - observacoes: string                     │
│───────────────────────────────────────────│
│ + atualizarStatus(novo: StatusObjeto): void │
│ + adicionarFoto(foto: FotoObjeto): void   │
│ + getHistorico(): HistoricoMovimentacao[] │
│ + getFotos(): FotoObjeto[]               │
│ + getSolicitacoes(): SolicitacaoPosse[]   │
│ + estaEncerrado(): boolean               │
│ + foiDevolvido(): boolean                │
└───────────────────────────────────────────┘
        │1           │1           │1           │1
        │N           │N           │N           │N
        ▼            ▼            ▼            ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐
│RegistroPerda │ │ RegistroEnc. │ │  FotoObjeto  │ │HistoricoMovimentacao │
│──────────────│ │──────────────│ │──────────────│ │──────────────────────│
│- id          │ │- id          │ │- id          │ │- id                  │
│- objeto      │ │- objeto      │ │- objeto      │ │- objeto              │
│- usuario     │ │- usuario     │ │- usuario     │ │- usuario             │
│- local       │ │- local       │ │- urlFoto     │ │- statusAnterior      │
│- dataPerda   │ │- dataEncontr │ │- nomeArquivo │ │- statusNovo          │
│- horaPerda   │ │- horaEncontr │ │- tamanho     │ │- acao                │
│- dataRegistro│ │- dataRegistro│ │- dataUpload  │ │- detalhes            │
│- descCirc.   │ │- localGuarda │ │- isPrincipal │ │- dataMovimentacao    │
│──────────────│ │- descCirc.   │ │──────────────│ │──────────────────────│
│+ getLocal()  │ │──────────────│ │+ getUrl()    │ │+ getAcao(): string   │
└──────────────┘ │+ getLocal()  │ └──────────────┘ └──────────────────────┘
                 └──────────────┘


┌──────────────────────────────────────────┐
│             SolicitacaoPosse             │
│──────────────────────────────────────────│
│ - id: number                             │
│ - objeto: Objeto                         │
│ - solicitante: Usuario                   │
│ - statusSolicitacao: StatusSolicitacao   │
│ - descricaoReivindicacao: string         │
│ - dataSolicitacao: Date                  │
│ - dataAtualizacao: Date                  │
│──────────────────────────────────────────│
│ + adicionarEvidencia(ev): void           │
│ + getEvidencias(): Evidencia[]           │
│ + getValidacao(): Validacao              │
│ + getDevolucao(): Devolucao              │
│ + cancelar(): void                       │
│ + estaPendente(): boolean                │
└──────────────────────────────────────────┘
        │1                   │1
        │N                   │1
        ▼                    ▼
┌──────────────────┐  ┌───────────────────────────┐
│    Evidencia     │  │         Validacao          │
│──────────────────│  │───────────────────────────│
│ - id             │  │ - id                      │
│ - solicitacao    │  │ - solicitacao              │
│ - tipoEvidencia  │  │ - validador: Usuario       │
│ - descricao      │  │ - resultado: ResultadoVal. │
│ - urlArquivo     │  │ - justificativa: string    │
│ - dataUpload     │  │ - dataValidacao: Date      │
│──────────────────│  │───────────────────────────│
│ + getArquivo()   │  │ + isAprovada(): boolean   │
└──────────────────┘  │ + getDevolucao(): Devolucao│
                      └───────────────────────────┘
                                  │1
                                  │1
                                  ▼
                    ┌─────────────────────────────┐
                    │          Devolucao          │
                    │─────────────────────────────│
                    │ - id: number                │
                    │ - objeto: Objeto            │
                    │ - solicitacao: SolicPosse   │
                    │ - responsavel: Usuario      │
                    │ - beneficiario: Usuario     │
                    │ - dataDevolucao: Date       │
                    │ - codigoComprovante: string │
                    │ - observacoes: string       │
                    │─────────────────────────────│
                    │ + gerarComprovante(): string│
                    │ + getCodigoUnico(): string  │
                    └─────────────────────────────┘


┌──────────────────────────────────┐
│            Local                 │
│──────────────────────────────────│
│ - id: number                     │
│ - nome: string                   │
│ - bloco: string                  │
│ - andar: string                  │
│ - tipoLocal: string              │
│ - descricao: string              │
│ - ativo: boolean                 │
│──────────────────────────────────│
│ + getNome(): string              │
│ + getEnderecoCompleto(): string  │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│           Notificacao            │
│──────────────────────────────────│
│ - id: number                     │
│ - usuarioDestino: Usuario        │
│ - objeto: Objeto                 │
│ - tipoNotificacao: string        │
│ - mensagem: string               │
│ - lida: boolean                  │
│ - dataCriacao: Date              │
│ - dataLeitura: Date              │
│──────────────────────────────────│
│ + marcarComoLida(): void         │
│ + isNaoLida(): boolean           │
└──────────────────────────────────┘
```

---

## 5.2 Associações e Suas Naturezas

| Associação | Tipo UML | Justificativa |
|------------|----------|---------------|
| Usuario → TipoUsuario | Associação | Usuario referencia TipoUsuario, ambos existem independentemente |
| Objeto → CategoriaObjeto | Associação | Objeto referencia Categoria; Categoria existe sem Objetos |
| RegistroPerda → Objeto | Associação | Registro referencia Objeto existente |
| RegistroPerda → Usuario | Associação | Registro referencia Usuario existente |
| RegistroPerda → Local | Associação | Registro referencia Local existente |
| SolicitacaoPosse → Objeto | Associação | Solicitação referencia Objeto existente |
| SolicitacaoPosse → Evidencia | Composição | Evidências não existem sem a Solicitação |
| SolicitacaoPosse → Validacao | Composição | Validação não existe sem Solicitação |
| Validacao → Devolucao | Associação | Devolução pode existir conceitualmente sem validação (mas regra de negócio exige) |
| Objeto → FotoObjeto | Composição | Fotos não existem sem o Objeto |
| Objeto → HistoricoMovimentacao | Composição | Histórico não existe sem o Objeto |
| Usuario → Notificacao | Composição | Notificação não existe sem Usuário destinatário |

---

## 5.3 Herança / Especialização

Neste modelo, optou-se por **não usar herança na modelagem de banco de dados** para os tipos de usuário, em favor da entidade `TipoUsuario` com flags de permissão. Isso simplifica as consultas SQL e evita tabelas esparsas.

**Justificativa acadêmica:** Em modelagem relacional, herança de tabelas (Table-per-Hierarchy ou Table-per-Type) adiciona complexidade sem benefício neste domínio, pois as diferenças entre aluno, professor e funcionário são apenas de permissão e matrícula, não de comportamento estrutural distinto.

Se modelado em OO puro, a hierarquia seria:

```
           <<abstract>>
            Usuario
           /    |    \
          /     |     \
       Aluno  Professor  Funcionario
```

- `Aluno` tem: `curso`, `periodo`
- `Professor` tem: `departamento`, `titulacao`
- `Funcionario` tem: `setor`, `cargo`, `podeValidar`
