# Etapa 4 — Modelo Entidade-Relacionamento (MER)

## 4.1 Diagrama MER Textual

```
┌─────────────────┐         ┌──────────────────────┐
│   TipoUsuario   │         │       Usuario         │
│─────────────────│         │──────────────────────│
│ PK id_tipo      │  1    N │ PK id_usuario         │
│    descricao    │────────>│ FK id_tipo_usuario    │
│    pode_validar │         │    nome               │
│    pode_admin   │         │    email (U)          │
└─────────────────┘         │    cpf (U)            │
                            │    matricula (U)       │
                            │    telefone           │
                            │    senha_hash         │
                            │    ativo              │
                            │    data_cadastro      │
                            └──────────────────────┘
                                    │ 1
                    ┌───────────────┼───────────────────┐
                    │               │                   │
                    │N              │N                  │N
          ┌─────────────────┐  ┌────────────────────┐  ┌──────────────────────┐
          │  RegistroPerda  │  │ RegistroEncontrado │  │  SolicitacaoPosse    │
          │─────────────────│  │────────────────────│  │──────────────────────│
          │ PK id_reg_perda │  │ PK id_reg_enc      │  │ PK id_solicitacao    │
          │ FK id_objeto    │  │ FK id_objeto       │  │ FK id_objeto         │
          │ FK id_usuario   │  │ FK id_usuario      │  │ FK id_solicitante    │
          │ FK id_local     │  │ FK id_local        │  │    status_solic.     │
          │    data_perda   │  │    data_encontrado │  │    descricao_reiv.   │
          │    hora_perda   │  │    hora_encontrado │  │    data_solicitacao  │
          │    data_registro│  │    local_guarda    │  └──────────────────────┘
          │    desc_circ.   │  │    data_registro   │           │ 1
          └─────────────────┘  │    desc_circ.      │           │
                               └────────────────────┘     ┌─────┴──────┐
                                                           │N           │1
                                                    ┌──────────┐  ┌────────────┐
                                                    │ Evidencia│  │ Validacao  │
                                                    │──────────│  │────────────│
                                                    │ PK id_ev │  │ PK id_val  │
                                                    │ FK id_sol│  │ FK id_solic│
                                                    │ tipo_ev  │  │ FK id_valid│
                                                    │ descricao│  │ resultado  │
                                                    │ url_arq  │  │ justific.  │
                                                    │ data_upl │  │ data_valid │
                                                    └──────────┘  └────────────┘
                                                                        │ 1
                                                                        │
                                                                  ┌─────▼──────────┐
                                                                  │    Devolucao   │
                                                                  │────────────────│
                                                                  │ PK id_devolucao│
                                                                  │ FK id_objeto(U)│
                                                                  │ FK id_solic.(U)│
                                                                  │ FK id_responsav│
                                                                  │ FK id_benefic. │
                                                                  │ data_devolucao │
                                                                  │ codigo_comprov │
                                                                  └────────────────┘

┌──────────────────┐         ┌─────────────────────┐
│  CategoriaObjeto │  1    N │       Objeto         │
│──────────────────│────────>│─────────────────────│
│ PK id_categoria  │         │ PK id_objeto         │
│    nome (U)      │         │ FK id_categoria      │
│    descricao     │         │    descricao         │
│    icone         │         │    marca             │
└──────────────────┘         │    cor               │
                             │    status (ENUM)     │
                             │    data_criacao      │
                             │    data_atualizacao  │
                             │    observacoes       │
                             └─────────────────────┘
                                      │ 1
                    ┌─────────────────┼─────────────────────┐
                    │N                │N                    │N
          ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐
          │   FotoObjeto     │  │   Notificacao    │  │ HistoricoMovimentacao│
          │──────────────────│  │──────────────────│  │──────────────────────│
          │ PK id_foto       │  │ PK id_notificacao│  │ PK id_historico      │
          │ FK id_objeto     │  │ FK id_usuario_des│  │ FK id_objeto         │
          │ FK id_usuario    │  │ FK id_objeto     │  │ FK id_usuario        │
          │    url_foto      │  │    tipo_notif.   │  │    status_anterior   │
          │    nome_arquivo  │  │    mensagem      │  │    status_novo       │
          │    tamanho_bytes │  │    lida          │  │    acao              │
          │    data_upload   │  │    data_criacao  │  │    detalhes          │
          │    is_principal  │  │    data_leitura  │  │    data_movimentacao │
          └──────────────────┘  └──────────────────┘  └──────────────────────┘

┌──────────┐
│  Local   │
│──────────│
│ PK id_loc│ 1 ──────> N  RegistroPerda.id_local
│ nome     │ 1 ──────> N  RegistroEncontrado.id_local
│ bloco    │
│ andar    │
│ tipo_loc │
│ descricao│
│ ativo    │
└──────────┘
```

---

## 4.2 Relacionamentos — Descrição das Cardinalidades

### R01 — TipoUsuario × Usuario
**1 para N (obrigatório em ambos os lados)**
Um tipo de usuário classifica um ou muitos usuários. Todo usuário pertence a exatamente um tipo.
- `TipoUsuario (1,1) ──── (0,N) Usuario`

### R02 — Usuario × RegistroPerda
**1 para N (obrigatório no lado N)**
Um usuário pode registrar zero ou muitas perdas. Cada registro de perda foi feito por exatamente um usuário.
- `Usuario (1,1) ──── (0,N) RegistroPerda`

### R03 — Usuario × RegistroEncontrado
**1 para N (obrigatório no lado N)**
Um usuário pode registrar zero ou muitos encontros. Cada registro de encontro tem exatamente um usuário.
- `Usuario (1,1) ──── (0,N) RegistroEncontrado`

### R04 — Usuario × SolicitacaoPosse
**1 para N (obrigatório no lado N)**
Um usuário pode fazer zero ou muitas solicitações de posse. Cada solicitação pertence a exatamente um solicitante.
- `Usuario (1,1) ──── (0,N) SolicitacaoPosse`

### R05 — CategoriaObjeto × Objeto
**1 para N (obrigatório em ambos os lados)**
Uma categoria agrupa um ou muitos objetos. Todo objeto pertence a exatamente uma categoria.
- `CategoriaObjeto (1,1) ──── (1,N) Objeto`

### R06 — Objeto × RegistroPerda
**1 para N (opcional no lado pai)**
Um objeto pode ter zero ou muitos registros de perda (casos recorrentes). Cada registro de perda refere-se a um único objeto.
- `Objeto (0,N) ──── (1,1) RegistroPerda`

### R07 — Objeto × RegistroEncontrado
**1 para N (opcional no lado pai)**
Um objeto pode ter zero ou muitos registros de encontro. Cada registro de encontro refere-se a um único objeto.
- `Objeto (0,N) ──── (1,1) RegistroEncontrado`

### R08 — Objeto × FotoObjeto
**1 para N (opcional no lado pai)**
Um objeto pode ter zero ou muitas fotos. Cada foto pertence a exatamente um objeto.
- `Objeto (0,N) ──── (1,1) FotoObjeto`

### R09 — Objeto × SolicitacaoPosse
**1 para N (opcional no lado pai)**
Um objeto pode receber zero ou muitas solicitações de posse. Cada solicitação refere-se a um único objeto.
- `Objeto (0,N) ──── (1,1) SolicitacaoPosse`

### R10 — Local × RegistroPerda
**1 para N (opcional no lado pai)**
Um local pode aparecer em zero ou muitos registros de perda. Cada registro de perda aponta para um único local.
- `Local (0,N) ──── (1,1) RegistroPerda`

### R11 — Local × RegistroEncontrado
**1 para N (opcional no lado pai)**
Um local pode aparecer em zero ou muitos registros de encontro. Cada registro de encontro aponta para um único local.
- `Local (0,N) ──── (1,1) RegistroEncontrado`

### R12 — SolicitacaoPosse × Evidencia
**1 para N (opcional no lado pai)**
Uma solicitação pode ter zero ou muitas evidências. Cada evidência pertence a exatamente uma solicitação.
- `SolicitacaoPosse (0,N) ──── (1,1) Evidencia`

### R13 — SolicitacaoPosse × Validacao
**1 para 1 (opcional em ambos)**
Uma solicitação pode ter zero ou uma validação. Uma validação está ligada a exatamente uma solicitação.
- `SolicitacaoPosse (0,1) ──── (1,1) Validacao`

### R14 — SolicitacaoPosse × Devolucao
**1 para 1 (opcional em ambos)**
Uma solicitação aprovada pode gerar zero ou uma devolução. Uma devolução está ligada a exatamente uma solicitação.
- `SolicitacaoPosse (0,1) ──── (1,1) Devolucao`

### R15 — Objeto × Devolucao
**1 para 1 (obrigatório no lado filho)**
Um objeto pode ter no máximo uma devolução. Essa restrição implementa a regra de negócio "um objeto não pode ser devolvido duas vezes".
- `Objeto (0,1) ──── (1,1) Devolucao` (UNIQUE em `id_objeto`)

### R16 — Usuario × Validacao
**1 para N (obrigatório no lado filho)**
Um usuário com perfil validador pode realizar zero ou muitas validações. Cada validação foi feita por exatamente um usuário.
- `Usuario (0,N) ──── (1,1) Validacao`

### R17 — Usuario (responsável) × Devolucao
**1 para N**
Um funcionário pode realizar zero ou muitas devoluções. Cada devolução tem um único responsável.
- `Usuario (0,N) ──── (1,1) Devolucao.id_responsavel`

### R18 — Usuario (beneficiário) × Devolucao
**1 para N**
Um usuário pode ser beneficiário de zero ou muitas devoluções. Cada devolução tem um único beneficiário.
- `Usuario (0,N) ──── (1,1) Devolucao.id_beneficiario`

### R19 — Objeto × HistoricoMovimentacao
**1 para N (obrigatório no lado filho)**
Um objeto tem um ou muitos registros no histórico. Cada histórico refere-se a um único objeto.
- `Objeto (1,N) ──── (1,1) HistoricoMovimentacao`

### R20 — Usuario × HistoricoMovimentacao
**1 para N (obrigatório no lado filho)**
Um usuário pode ter zero ou muitas movimentações registradas no histórico.
- `Usuario (0,N) ──── (1,1) HistoricoMovimentacao`

### R21 — Usuario × Notificacao
**1 para N (obrigatório no lado filho)**
Um usuário pode ter zero ou muitas notificações. Cada notificação tem um único destinatário.
- `Usuario (0,N) ──── (1,1) Notificacao`

---

## 4.3 Resumo das Cardinalidades

| Relacionamento | Tipo | Obrigatoriedade |
|----------------|------|-----------------|
| TipoUsuario — Usuario | 1:N | Obrigatório (ambos) |
| CategoriaObjeto — Objeto | 1:N | Obrigatório (ambos) |
| Objeto — RegistroPerda | 1:N | Obrigatório (filho) |
| Objeto — RegistroEncontrado | 1:N | Obrigatório (filho) |
| Objeto — FotoObjeto | 1:N | Obrigatório (filho) |
| Objeto — SolicitacaoPosse | 1:N | Obrigatório (filho) |
| **Objeto — Devolucao** | **1:1** | **Opcional (UNIQUE constraint)** |
| Usuario — RegistroPerda | 1:N | Obrigatório (filho) |
| Usuario — RegistroEncontrado | 1:N | Obrigatório (filho) |
| Usuario — SolicitacaoPosse | 1:N | Obrigatório (filho) |
| Usuario — Validacao | 1:N | Obrigatório (filho) |
| Usuario — Devolucao (2 papéis) | 1:N | Obrigatório (filho) |
| Local — RegistroPerda | 1:N | Obrigatório (filho) |
| Local — RegistroEncontrado | 1:N | Obrigatório (filho) |
| SolicitacaoPosse — Evidencia | 1:N | Opcional |
| **SolicitacaoPosse — Validacao** | **1:1** | **Opcional** |
| **SolicitacaoPosse — Devolucao** | **1:1** | **Opcional** |
| Objeto — HistoricoMovimentacao | 1:N | Obrigatório (filho) |
| Objeto — Notificacao | 1:N | Opcional |
| Usuario — Notificacao | 1:N | Obrigatório (filho) |
