# Etapa 7 — Modelo Relacional Final

## 7.1 Convenções

- **PK** = Primary Key (Chave Primária)
- **FK** = Foreign Key (Chave Estrangeira)
- **U** = UNIQUE Constraint
- **NN** = NOT NULL
- **→** = referencia a tabela/coluna

---

## 7.2 Tabelas Completas

---

### TIPO_USUARIO

```sql
TIPO_USUARIO (
  id_tipo_usuario   INT           PK, AUTO_INCREMENT, NN
  descricao         VARCHAR(50)   NN, U
  pode_validar      BOOLEAN       NN, DEFAULT FALSE
  pode_administrar  BOOLEAN       NN, DEFAULT FALSE
)
```

---

### USUARIO

```sql
USUARIO (
  id_usuario       INT           PK, AUTO_INCREMENT, NN
  id_tipo_usuario  INT           FK → TIPO_USUARIO(id_tipo_usuario), NN
  nome             VARCHAR(150)  NN
  email            VARCHAR(100)  NN, U
  cpf              CHAR(11)      NN, U
  matricula        VARCHAR(20)   U
  telefone         VARCHAR(15)
  senha_hash       VARCHAR(255)  NN
  ativo            BOOLEAN       NN, DEFAULT TRUE
  data_cadastro    TIMESTAMP     NN, DEFAULT CURRENT_TIMESTAMP
)
```

---

### LOCAL

```sql
LOCAL (
  id_local    INT           PK, AUTO_INCREMENT, NN
  nome        VARCHAR(100)  NN
  bloco       VARCHAR(20)
  andar       VARCHAR(20)
  tipo_local  VARCHAR(50)   NN
  descricao   TEXT
  ativo       BOOLEAN       NN, DEFAULT TRUE
)
```

---

### CATEGORIA_OBJETO

```sql
CATEGORIA_OBJETO (
  id_categoria  INT           PK, AUTO_INCREMENT, NN
  nome          VARCHAR(80)   NN, U
  descricao     TEXT
  icone         VARCHAR(50)
)
```

---

### OBJETO

```sql
OBJETO (
  id_objeto         INT           PK, AUTO_INCREMENT, NN
  id_categoria      INT           FK → CATEGORIA_OBJETO(id_categoria), NN
  descricao         TEXT          NN
  marca             VARCHAR(80)
  cor               VARCHAR(50)
  status            ENUM(
                      'Perdido',
                      'Encontrado',
                      'Em Análise',
                      'Aguardando Validação',
                      'Disponível para Retirada',
                      'Devolvido',
                      'Encerrado'
                    )             NN, DEFAULT 'Perdido'
  data_criacao      TIMESTAMP     NN, DEFAULT CURRENT_TIMESTAMP
  data_atualizacao  TIMESTAMP     NN, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  observacoes       TEXT
)
```

---

### REGISTRO_PERDA

```sql
REGISTRO_PERDA (
  id_registro_perda       INT   PK, AUTO_INCREMENT, NN
  id_objeto               INT   FK → OBJETO(id_objeto), NN
  id_usuario              INT   FK → USUARIO(id_usuario), NN
  id_local                INT   FK → LOCAL(id_local), NN
  data_perda              DATE  NN
  hora_perda              TIME
  data_registro           TIMESTAMP  NN, DEFAULT CURRENT_TIMESTAMP
  descricao_circunstancias TEXT
)
```

---

### REGISTRO_ENCONTRADO

```sql
REGISTRO_ENCONTRADO (
  id_registro_encontrado  INT   PK, AUTO_INCREMENT, NN
  id_objeto               INT   FK → OBJETO(id_objeto), NN
  id_usuario              INT   FK → USUARIO(id_usuario), NN
  id_local                INT   FK → LOCAL(id_local), NN
  data_encontrado         DATE  NN
  hora_encontrado         TIME
  data_registro           TIMESTAMP   NN, DEFAULT CURRENT_TIMESTAMP
  local_guarda            VARCHAR(150)
  descricao_circunstancias TEXT
)
```

---

### FOTO_OBJETO

```sql
FOTO_OBJETO (
  id_foto        INT           PK, AUTO_INCREMENT, NN
  id_objeto      INT           FK → OBJETO(id_objeto), NN
  id_usuario     INT           FK → USUARIO(id_usuario), NN
  url_foto       VARCHAR(500)  NN
  nome_arquivo   VARCHAR(200)  NN
  tamanho_bytes  INT           NN
  data_upload    TIMESTAMP     NN, DEFAULT CURRENT_TIMESTAMP
  descricao      VARCHAR(255)
  is_principal   BOOLEAN       NN, DEFAULT FALSE
)
```

---

### SOLICITACAO_POSSE

```sql
SOLICITACAO_POSSE (
  id_solicitacao          INT           PK, AUTO_INCREMENT, NN
  id_objeto               INT           FK → OBJETO(id_objeto), NN
  id_solicitante          INT           FK → USUARIO(id_usuario), NN
  status_solicitacao      ENUM(
                            'Pendente',
                            'Aprovada',
                            'Rejeitada',
                            'Cancelada'
                          )             NN, DEFAULT 'Pendente'
  descricao_reivindicacao TEXT          NN
  data_solicitacao        TIMESTAMP     NN, DEFAULT CURRENT_TIMESTAMP
  data_atualizacao        TIMESTAMP     NN, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

---

### EVIDENCIA

```sql
EVIDENCIA (
  id_evidencia   INT           PK, AUTO_INCREMENT, NN
  id_solicitacao INT           FK → SOLICITACAO_POSSE(id_solicitacao), NN
  tipo_evidencia VARCHAR(80)   NN
  descricao      TEXT
  url_arquivo    VARCHAR(500)
  data_upload    TIMESTAMP     NN, DEFAULT CURRENT_TIMESTAMP
)
```

---

### VALIDACAO

```sql
VALIDACAO (
  id_validacao   INT           PK, AUTO_INCREMENT, NN
  id_solicitacao INT           FK → SOLICITACAO_POSSE(id_solicitacao), NN, U
  id_validador   INT           FK → USUARIO(id_usuario), NN
  resultado      ENUM(
                   'Aprovado',
                   'Rejeitado'
                 )             NN
  justificativa  TEXT
  data_validacao TIMESTAMP     NN, DEFAULT CURRENT_TIMESTAMP
)
```

---

### DEVOLUCAO

```sql
DEVOLUCAO (
  id_devolucao       INT           PK, AUTO_INCREMENT, NN
  id_objeto          INT           FK → OBJETO(id_objeto), NN, U
  id_solicitacao     INT           FK → SOLICITACAO_POSSE(id_solicitacao), NN, U
  id_responsavel     INT           FK → USUARIO(id_usuario), NN
  id_beneficiario    INT           FK → USUARIO(id_usuario), NN
  data_devolucao     TIMESTAMP     NN, DEFAULT CURRENT_TIMESTAMP
  codigo_comprovante VARCHAR(50)   NN, U
  observacoes        TEXT
)
```

> **Nota:** `UNIQUE(id_objeto)` implementa a regra de negócio "um objeto não pode ser devolvido duas vezes".
> `UNIQUE(id_solicitacao)` implementa "uma solicitação gera no máximo uma devolução".

---

### NOTIFICACAO

```sql
NOTIFICACAO (
  id_notificacao     INT           PK, AUTO_INCREMENT, NN
  id_usuario_destino INT           FK → USUARIO(id_usuario), NN
  id_objeto          INT           FK → OBJETO(id_objeto)   [NULL permitido]
  tipo_notificacao   VARCHAR(80)   NN
  mensagem           TEXT          NN
  lida               BOOLEAN       NN, DEFAULT FALSE
  data_criacao       TIMESTAMP     NN, DEFAULT CURRENT_TIMESTAMP
  data_leitura       TIMESTAMP
)
```

---

### HISTORICO_MOVIMENTACAO

```sql
HISTORICO_MOVIMENTACAO (
  id_historico      INT           PK, AUTO_INCREMENT, NN
  id_objeto         INT           FK → OBJETO(id_objeto), NN
  id_usuario        INT           FK → USUARIO(id_usuario), NN
  status_anterior   VARCHAR(50)   [NULL no primeiro registro]
  status_novo       VARCHAR(50)   NN
  acao              VARCHAR(100)  NN
  detalhes          TEXT
  data_movimentacao TIMESTAMP     NN, DEFAULT CURRENT_TIMESTAMP
)
```

---

## 7.3 Diagrama Relacional (Esquemático)

```
TIPO_USUARIO ──────────────────< USUARIO
                                  │  │  │  │  │  │  │  │  │
                    ┌─────────────┘  │  │  │  │  │  │  │  └─────────────────┐
                    │                │  │  │  │  │  │  └──────────────┐      │
                    │                │  │  │  │  │  └──────────┐      │      │
                    │                │  │  │  │  └──────┐      │      │      │
                    ▼                │  │  │  │         │      │      │      │
              REGISTRO_PERDA         │  │  │  │         ▼      ▼      ▼      ▼
              REGISTRO_ENCONTRADO <──┘  │  │  │     FOTO_  VALID. DEVOLUC. NOTIF.
              SOLICITACAO_POSSE  <──────┘  │  │     OBJETO
              HISTORICO_MOVIM.  <──────────┘  │
              DEVOLUCAO (resp.) <─────────────┘
              DEVOLUCAO (benef.)<──────────────────────────── (segunda FK para USUARIO)

CATEGORIA_OBJETO ──────────────< OBJETO
                                  │
          ┌────────────┬──────────┼──────────────┬────────────────────┐
          ▼            ▼          ▼               ▼                    ▼
    REGISTRO_    REGISTRO_    FOTO_OBJETO   SOLICITACAO_POSSE   HISTORICO_MOVIM.
    PERDA        ENCONTRADO                    │        │
                                               ▼        ▼
                                           EVIDENCIA  VALIDACAO
                                                         │
                                                         ▼
                                                     DEVOLUCAO

LOCAL ─────< REGISTRO_PERDA
      └────< REGISTRO_ENCONTRADO
```

---

## 7.4 Script SQL de Criação (DDL)

```sql
-- ========================================================
-- SIGOP — Script DDL de Criação do Banco de Dados
-- Sistema Integrado de Gestão de Objetos Perdidos
-- ========================================================

CREATE DATABASE IF NOT EXISTS sigop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sigop;

-- ------------------------------------------------------------
CREATE TABLE tipo_usuario (
  id_tipo_usuario   INT           NOT NULL AUTO_INCREMENT,
  descricao         VARCHAR(50)   NOT NULL,
  pode_validar      BOOLEAN       NOT NULL DEFAULT FALSE,
  pode_administrar  BOOLEAN       NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id_tipo_usuario),
  UNIQUE KEY uk_tipo_descricao (descricao)
);

-- ------------------------------------------------------------
CREATE TABLE usuario (
  id_usuario       INT           NOT NULL AUTO_INCREMENT,
  id_tipo_usuario  INT           NOT NULL,
  nome             VARCHAR(150)  NOT NULL,
  email            VARCHAR(100)  NOT NULL,
  cpf              CHAR(11)      NOT NULL,
  matricula        VARCHAR(20),
  telefone         VARCHAR(15),
  senha_hash       VARCHAR(255)  NOT NULL,
  ativo            BOOLEAN       NOT NULL DEFAULT TRUE,
  data_cadastro    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY uk_usuario_email (email),
  UNIQUE KEY uk_usuario_cpf (cpf),
  UNIQUE KEY uk_usuario_matricula (matricula),
  CONSTRAINT fk_usuario_tipo FOREIGN KEY (id_tipo_usuario)
    REFERENCES tipo_usuario(id_tipo_usuario)
);

-- ------------------------------------------------------------
CREATE TABLE local (
  id_local    INT           NOT NULL AUTO_INCREMENT,
  nome        VARCHAR(100)  NOT NULL,
  bloco       VARCHAR(20),
  andar       VARCHAR(20),
  tipo_local  VARCHAR(50)   NOT NULL,
  descricao   TEXT,
  ativo       BOOLEAN       NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id_local)
);

-- ------------------------------------------------------------
CREATE TABLE categoria_objeto (
  id_categoria  INT           NOT NULL AUTO_INCREMENT,
  nome          VARCHAR(80)   NOT NULL,
  descricao     TEXT,
  icone         VARCHAR(50),
  PRIMARY KEY (id_categoria),
  UNIQUE KEY uk_categoria_nome (nome)
);

-- ------------------------------------------------------------
CREATE TABLE objeto (
  id_objeto         INT           NOT NULL AUTO_INCREMENT,
  id_categoria      INT           NOT NULL,
  descricao         TEXT          NOT NULL,
  marca             VARCHAR(80),
  cor               VARCHAR(50),
  status            ENUM(
                      'Perdido','Encontrado','Em Análise',
                      'Aguardando Validação','Disponível para Retirada',
                      'Devolvido','Encerrado'
                    ) NOT NULL DEFAULT 'Perdido',
  data_criacao      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP,
  observacoes       TEXT,
  PRIMARY KEY (id_objeto),
  CONSTRAINT fk_objeto_categoria FOREIGN KEY (id_categoria)
    REFERENCES categoria_objeto(id_categoria)
);

-- ------------------------------------------------------------
CREATE TABLE registro_perda (
  id_registro_perda        INT   NOT NULL AUTO_INCREMENT,
  id_objeto                INT   NOT NULL,
  id_usuario               INT   NOT NULL,
  id_local                 INT   NOT NULL,
  data_perda               DATE  NOT NULL,
  hora_perda               TIME,
  data_registro            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  descricao_circunstancias TEXT,
  PRIMARY KEY (id_registro_perda),
  CONSTRAINT fk_regperda_objeto   FOREIGN KEY (id_objeto)  REFERENCES objeto(id_objeto),
  CONSTRAINT fk_regperda_usuario  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
  CONSTRAINT fk_regperda_local    FOREIGN KEY (id_local)   REFERENCES local(id_local)
);

-- ------------------------------------------------------------
CREATE TABLE registro_encontrado (
  id_registro_encontrado   INT   NOT NULL AUTO_INCREMENT,
  id_objeto                INT   NOT NULL,
  id_usuario               INT   NOT NULL,
  id_local                 INT   NOT NULL,
  data_encontrado          DATE  NOT NULL,
  hora_encontrado          TIME,
  data_registro            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  local_guarda             VARCHAR(150),
  descricao_circunstancias TEXT,
  PRIMARY KEY (id_registro_encontrado),
  CONSTRAINT fk_regenc_objeto   FOREIGN KEY (id_objeto)  REFERENCES objeto(id_objeto),
  CONSTRAINT fk_regenc_usuario  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
  CONSTRAINT fk_regenc_local    FOREIGN KEY (id_local)   REFERENCES local(id_local)
);

-- ------------------------------------------------------------
CREATE TABLE foto_objeto (
  id_foto        INT           NOT NULL AUTO_INCREMENT,
  id_objeto      INT           NOT NULL,
  id_usuario     INT           NOT NULL,
  url_foto       VARCHAR(500)  NOT NULL,
  nome_arquivo   VARCHAR(200)  NOT NULL,
  tamanho_bytes  INT           NOT NULL,
  data_upload    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  descricao      VARCHAR(255),
  is_principal   BOOLEAN       NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id_foto),
  CONSTRAINT fk_foto_objeto   FOREIGN KEY (id_objeto)  REFERENCES objeto(id_objeto),
  CONSTRAINT fk_foto_usuario  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- ------------------------------------------------------------
CREATE TABLE solicitacao_posse (
  id_solicitacao          INT           NOT NULL AUTO_INCREMENT,
  id_objeto               INT           NOT NULL,
  id_solicitante          INT           NOT NULL,
  status_solicitacao      ENUM('Pendente','Aprovada','Rejeitada','Cancelada')
                          NOT NULL DEFAULT 'Pendente',
  descricao_reivindicacao TEXT          NOT NULL,
  data_solicitacao        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                          ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_solicitacao),
  CONSTRAINT fk_solicitacao_objeto      FOREIGN KEY (id_objeto)
    REFERENCES objeto(id_objeto),
  CONSTRAINT fk_solicitacao_solicitante FOREIGN KEY (id_solicitante)
    REFERENCES usuario(id_usuario)
);

-- ------------------------------------------------------------
CREATE TABLE evidencia (
  id_evidencia   INT           NOT NULL AUTO_INCREMENT,
  id_solicitacao INT           NOT NULL,
  tipo_evidencia VARCHAR(80)   NOT NULL,
  descricao      TEXT,
  url_arquivo    VARCHAR(500),
  data_upload    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_evidencia),
  CONSTRAINT fk_evidencia_solicitacao FOREIGN KEY (id_solicitacao)
    REFERENCES solicitacao_posse(id_solicitacao)
);

-- ------------------------------------------------------------
CREATE TABLE validacao (
  id_validacao   INT       NOT NULL AUTO_INCREMENT,
  id_solicitacao INT       NOT NULL,
  id_validador   INT       NOT NULL,
  resultado      ENUM('Aprovado','Rejeitado') NOT NULL,
  justificativa  TEXT,
  data_validacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_validacao),
  UNIQUE KEY uk_validacao_solicitacao (id_solicitacao),
  CONSTRAINT fk_validacao_solicitacao FOREIGN KEY (id_solicitacao)
    REFERENCES solicitacao_posse(id_solicitacao),
  CONSTRAINT fk_validacao_validador   FOREIGN KEY (id_validador)
    REFERENCES usuario(id_usuario)
);

-- ------------------------------------------------------------
CREATE TABLE devolucao (
  id_devolucao       INT           NOT NULL AUTO_INCREMENT,
  id_objeto          INT           NOT NULL,
  id_solicitacao     INT           NOT NULL,
  id_responsavel     INT           NOT NULL,
  id_beneficiario    INT           NOT NULL,
  data_devolucao     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  codigo_comprovante VARCHAR(50)   NOT NULL,
  observacoes        TEXT,
  PRIMARY KEY (id_devolucao),
  UNIQUE KEY uk_devolucao_objeto      (id_objeto),
  UNIQUE KEY uk_devolucao_solicitacao (id_solicitacao),
  UNIQUE KEY uk_devolucao_comprovante (codigo_comprovante),
  CONSTRAINT fk_devolucao_objeto      FOREIGN KEY (id_objeto)
    REFERENCES objeto(id_objeto),
  CONSTRAINT fk_devolucao_solicitacao FOREIGN KEY (id_solicitacao)
    REFERENCES solicitacao_posse(id_solicitacao),
  CONSTRAINT fk_devolucao_responsavel FOREIGN KEY (id_responsavel)
    REFERENCES usuario(id_usuario),
  CONSTRAINT fk_devolucao_beneficiario FOREIGN KEY (id_beneficiario)
    REFERENCES usuario(id_usuario)
);

-- ------------------------------------------------------------
CREATE TABLE notificacao (
  id_notificacao     INT       NOT NULL AUTO_INCREMENT,
  id_usuario_destino INT       NOT NULL,
  id_objeto          INT,
  tipo_notificacao   VARCHAR(80) NOT NULL,
  mensagem           TEXT       NOT NULL,
  lida               BOOLEAN    NOT NULL DEFAULT FALSE,
  data_criacao       TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_leitura       TIMESTAMP,
  PRIMARY KEY (id_notificacao),
  CONSTRAINT fk_notif_usuario FOREIGN KEY (id_usuario_destino)
    REFERENCES usuario(id_usuario),
  CONSTRAINT fk_notif_objeto  FOREIGN KEY (id_objeto)
    REFERENCES objeto(id_objeto)
);

-- ------------------------------------------------------------
CREATE TABLE historico_movimentacao (
  id_historico      INT           NOT NULL AUTO_INCREMENT,
  id_objeto         INT           NOT NULL,
  id_usuario        INT           NOT NULL,
  status_anterior   VARCHAR(50),
  status_novo       VARCHAR(50)   NOT NULL,
  acao              VARCHAR(100)  NOT NULL,
  detalhes          TEXT,
  data_movimentacao TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_historico),
  CONSTRAINT fk_historico_objeto  FOREIGN KEY (id_objeto)
    REFERENCES objeto(id_objeto),
  CONSTRAINT fk_historico_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario(id_usuario)
);
```

---

## 7.5 Dados de Exemplo (DML — Seed)

```sql
-- Tipos de usuário
INSERT INTO tipo_usuario (descricao, pode_validar, pode_administrar) VALUES
  ('Aluno',          FALSE, FALSE),
  ('Professor',      FALSE, FALSE),
  ('Funcionário',    TRUE,  FALSE),
  ('Administrador',  TRUE,  TRUE);

-- Categorias de objeto
INSERT INTO categoria_objeto (nome, icone) VALUES
  ('Eletrônicos',  'laptop'),
  ('Documentos',   'file-text'),
  ('Vestuário',    'shirt'),
  ('Acessórios',   'watch'),
  ('Materiais Escolares', 'book'),
  ('Chaves',       'key'),
  ('Outros',       'box');

-- Locais
INSERT INTO local (nome, bloco, andar, tipo_local) VALUES
  ('Laboratório de Informática 1', 'B', '2', 'Laboratório'),
  ('Biblioteca Central',           'A', '1', 'Biblioteca'),
  ('Cantina',                      'C', 'T', 'Refeitório'),
  ('Estacionamento Principal',     '-', '-', 'Estacionamento'),
  ('Corredor Bloco A',             'A', '1', 'Corredor'),
  ('Sala 302',                     'A', '3', 'Sala de Aula');
```
