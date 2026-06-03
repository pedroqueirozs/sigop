# Etapa 6 — Processo de Normalização

## Introdução

A normalização é um processo formal de organização de um banco de dados relacional para reduzir redundâncias e dependências inadequadas entre atributos. Nesta etapa, partimos de uma estrutura **não normalizada** (como ocorre quando se tenta guardar tudo em poucas tabelas) e evoluímos até a **Terceira Forma Normal (3FN)**.

O exemplo foca nas entidades centrais: **Objeto**, **Usuário** e o processo de **Devolução**.

---

## 6.1 Estrutura Não Normalizada (0FN)

Imagine que um desenvolvedor iniciante tentou criar uma única tabela para registrar a devolução de objetos, incluindo todos os dados relacionados em um único lugar:

### Tabela: DEVOLUCAO_COMPLETA (não normalizada)

```
DEVOLUCAO_COMPLETA
──────────────────────────────────────────────────────────────────────────
id_devolucao | data_devolucao | codigo_comprovante
| id_objeto | desc_objeto | marca_objeto | cor_objeto | status_objeto
| id_categoria | nome_categoria | desc_categoria
| id_solicitante | nome_solicitante | email_solicitante | cpf_solicitante
| tipo_usuario_solicitante | matricula_solicitante
| id_responsavel | nome_responsavel | email_responsavel | cpf_responsavel
| id_local_encontrado | nome_local | bloco_local | andar_local
| fotos_objeto (lista: "foto1.jpg, foto2.jpg, foto3.jpg")
| evidencias (lista: "Nota fiscal, foto_capa.jpg")
| resultado_validacao | justificativa_validacao | data_validacao
| nome_validador | email_validador
──────────────────────────────────────────────────────────────────────────
```

**Problemas identificados:**
1. **Grupos repetitivos** — `fotos_objeto` e `evidencias` são listas em um único campo
2. **Redundância** — dados do objeto, usuário e local se repetem em cada devolução
3. **Anomalia de inserção** — não é possível cadastrar um objeto sem associá-lo a uma devolução
4. **Anomalia de atualização** — alterar o nome de um local exige atualizar múltiplas linhas
5. **Anomalia de exclusão** — excluir a única devolução de um objeto apaga os dados do objeto
6. **Dependências transitivas** — `nome_categoria` depende de `id_categoria`, não de `id_devolucao`
7. **Dependências parciais** — `nome_solicitante` depende de `id_solicitante`, não da chave composta

---

## 6.2 Primeira Forma Normal (1FN)

**Regra da 1FN:** Todos os atributos devem ser atômicos (sem grupos repetitivos e sem atributos multivalorados). Cada linha deve ser única.

### Ação aplicada:

1. Eliminamos os campos de lista (`fotos_objeto`, `evidencias`) criando tabelas separadas
2. Identificamos uma chave primária para cada tabela

### Resultado em 1FN:

```
DEVOLUCAO_1FN
─────────────────────────────────────────────────────────────────────────
PK id_devolucao | data_devolucao | codigo_comprovante
   id_objeto | desc_objeto | marca_objeto | cor_objeto | status_objeto
   id_categoria | nome_categoria | desc_categoria
   id_solicitante | nome_solicitante | email_solicitante | cpf_solicitante
   tipo_usuario_solicitante | matricula_solicitante
   id_responsavel | nome_responsavel | email_responsavel | cpf_responsavel
   id_local_encontrado | nome_local | bloco_local | andar_local
   resultado_validacao | justificativa_validacao | data_validacao
   nome_validador | email_validador
─────────────────────────────────────────────────────────────────────────

FOTO_OBJETO_1FN
─────────────────────────────────────────────────────────────────────────
PK id_foto | id_objeto | url_foto | nome_arquivo | tamanho | data_upload
─────────────────────────────────────────────────────────────────────────

EVIDENCIA_1FN
─────────────────────────────────────────────────────────────────────────
PK id_evidencia | id_devolucao | tipo_evidencia | descricao | url_arquivo
─────────────────────────────────────────────────────────────────────────
```

**Status da 1FN:** ✅ Sem grupos repetitivos. Todos os atributos são atômicos. Chaves primárias definidas.

**Problema remanescente:** Ainda há muitas dependências parciais — atributos que dependem apenas de parte da chave (ou de outras colunas não-chave).

---

## 6.3 Segunda Forma Normal (2FN)

**Regra da 2FN:** Estar em 1FN E todos os atributos não-chave devem depender **totalmente** da chave primária (eliminar dependências parciais). Aplica-se principalmente quando a chave primária é composta.

No nosso caso, mesmo com chave simples (`id_devolucao`), existem atributos que dependem de outros identificadores não-primários (o que na prática é uma "dependência de subconjunto" em termos de modelagem conceitual).

### Dependências parciais identificadas na DEVOLUCAO_1FN:

```
id_devolucao → data_devolucao, codigo_comprovante       ✅ (dependência total)

id_objeto → desc_objeto, marca_objeto, cor_objeto, status_objeto  ✗ (parcial)
id_categoria → nome_categoria, desc_categoria                      ✗ (parcial)
id_solicitante → nome_solic., email_solic., cpf_solic., tipo_user, matricula  ✗
id_responsavel → nome_resp., email_resp., cpf_resp.                ✗ (parcial)
id_local → nome_local, bloco_local, andar_local                   ✗ (parcial)
```

### Ação aplicada:

Extraímos cada grupo de atributos dependentes para suas próprias tabelas.

### Resultado em 2FN:

```
DEVOLUCAO_2FN
────────────────────────────────────────────────────────
PK id_devolucao
   data_devolucao
   codigo_comprovante
FK id_objeto
FK id_solicitante
FK id_responsavel
   resultado_validacao
   justificativa_validacao
   data_validacao
FK id_validador
────────────────────────────────────────────────────────

OBJETO_2FN
────────────────────────────────────────────────────────
PK id_objeto
FK id_categoria
   desc_objeto
   marca_objeto
   cor_objeto
   status_objeto
────────────────────────────────────────────────────────

CATEGORIA_2FN
────────────────────────────────────────────────────────
PK id_categoria
   nome_categoria
   desc_categoria
────────────────────────────────────────────────────────

USUARIO_2FN
────────────────────────────────────────────────────────
PK id_usuario
   nome_usuario
   email_usuario
   cpf_usuario
   tipo_usuario
   matricula
────────────────────────────────────────────────────────

LOCAL_2FN
────────────────────────────────────────────────────────
PK id_local
   nome_local
   bloco_local
   andar_local
────────────────────────────────────────────────────────

FOTO_OBJETO_2FN
────────────────────────────────────────────────────────
PK id_foto
FK id_objeto
   url_foto
   nome_arquivo
   tamanho
   data_upload
────────────────────────────────────────────────────────

EVIDENCIA_2FN
────────────────────────────────────────────────────────
PK id_evidencia
FK id_devolucao
   tipo_evidencia
   descricao
   url_arquivo
────────────────────────────────────────────────────────
```

**Status da 2FN:** ✅ Sem dependências parciais. Cada atributo depende totalmente de sua chave primária.

---

## 6.4 Terceira Forma Normal (3FN)

**Regra da 3FN:** Estar em 2FN E não haver **dependências transitivas** — nenhum atributo não-chave pode depender de outro atributo não-chave.

### Dependências transitivas identificadas:

Na tabela `USUARIO_2FN`:
```
id_usuario → tipo_usuario → [permissões associadas ao tipo]
```
O campo `tipo_usuario` (texto) determina implicitamente permissões. Se tivermos "Aluno" em texto, o nome completo do tipo depende de um código do tipo, não do id_usuario diretamente.

Na tabela `DEVOLUCAO_2FN`:
```
id_devolucao → id_validador → nome_validador, email_validador
```
Dados do validador dependem de `id_validador`, não de `id_devolucao` diretamente.

Além disso, validação é um conceito separado de devolução (validação autoriza; devolução executa):
```
id_devolucao → resultado_validacao, justificativa_validacao, data_validacao
```
Esses campos pertencem conceitualmente à entidade **Validacao**, não à **Devolucao**.

### Ação aplicada:

1. Extraímos `tipo_usuario` para a tabela `TIPO_USUARIO`
2. Extraímos os dados de validação para a tabela `VALIDACAO`
3. Separamos `SolicitacaoPosse` de `Devolucao`

### Resultado final em 3FN:

```
TIPO_USUARIO (3FN)
────────────────────────────────────────────────────────
PK id_tipo_usuario
   descricao          (ex.: "Aluno", "Professor")
   pode_validar       BOOLEAN
   pode_administrar   BOOLEAN
────────────────────────────────────────────────────────
→ Elimina: dependência transitiva tipo_texto → permissoes em USUARIO

USUARIO (3FN)
────────────────────────────────────────────────────────
PK id_usuario
FK id_tipo_usuario     ← substituiu o campo texto
   nome
   email              UNIQUE
   cpf                UNIQUE
   matricula          UNIQUE
   telefone
   senha_hash
   ativo
   data_cadastro
────────────────────────────────────────────────────────

CATEGORIA_OBJETO (3FN)
────────────────────────────────────────────────────────
PK id_categoria
   nome               UNIQUE
   descricao
   icone
────────────────────────────────────────────────────────

OBJETO (3FN)
────────────────────────────────────────────────────────
PK id_objeto
FK id_categoria
   descricao
   marca
   cor
   status             ENUM
   data_criacao
   data_atualizacao
   observacoes
────────────────────────────────────────────────────────

LOCAL (3FN)
────────────────────────────────────────────────────────
PK id_local
   nome
   bloco
   andar
   tipo_local
   descricao
   ativo
────────────────────────────────────────────────────────

REGISTRO_PERDA (3FN)
────────────────────────────────────────────────────────
PK id_registro_perda
FK id_objeto
FK id_usuario
FK id_local
   data_perda
   hora_perda
   data_registro
   descricao_circunstancias
────────────────────────────────────────────────────────

REGISTRO_ENCONTRADO (3FN)
────────────────────────────────────────────────────────
PK id_registro_encontrado
FK id_objeto
FK id_usuario
FK id_local
   data_encontrado
   hora_encontrado
   local_guarda
   data_registro
   descricao_circunstancias
────────────────────────────────────────────────────────

FOTO_OBJETO (3FN)
────────────────────────────────────────────────────────
PK id_foto
FK id_objeto
FK id_usuario
   url_foto
   nome_arquivo
   tamanho_bytes
   data_upload
   descricao
   is_principal
────────────────────────────────────────────────────────

SOLICITACAO_POSSE (3FN)
────────────────────────────────────────────────────────
PK id_solicitacao
FK id_objeto
FK id_solicitante
   status_solicitacao  ENUM
   descricao_reivindicacao
   data_solicitacao
   data_atualizacao
────────────────────────────────────────────────────────
→ Separada de DEVOLUCAO: são eventos distintos no fluxo

EVIDENCIA (3FN)
────────────────────────────────────────────────────────
PK id_evidencia
FK id_solicitacao
   tipo_evidencia
   descricao
   url_arquivo
   data_upload
────────────────────────────────────────────────────────

VALIDACAO (3FN)
────────────────────────────────────────────────────────
PK id_validacao
FK id_solicitacao    UNIQUE  ← 1:1 com solicitação
FK id_validador
   resultado          ENUM
   justificativa
   data_validacao
────────────────────────────────────────────────────────
→ Elimina: dependência transitiva em DEVOLUCAO

DEVOLUCAO (3FN)
────────────────────────────────────────────────────────
PK id_devolucao
FK id_objeto         UNIQUE  ← um objeto não é devolvido 2x
FK id_solicitacao    UNIQUE  ← uma solicitação gera no máximo 1 devolução
FK id_responsavel
FK id_beneficiario
   data_devolucao
   codigo_comprovante  UNIQUE
   observacoes
────────────────────────────────────────────────────────

NOTIFICACAO (3FN)
────────────────────────────────────────────────────────
PK id_notificacao
FK id_usuario_destino
FK id_objeto         (nullable)
   tipo_notificacao
   mensagem
   lida
   data_criacao
   data_leitura
────────────────────────────────────────────────────────

HISTORICO_MOVIMENTACAO (3FN)
────────────────────────────────────────────────────────
PK id_historico
FK id_objeto
FK id_usuario
   status_anterior
   status_novo
   acao
   detalhes
   data_movimentacao
────────────────────────────────────────────────────────
```

---

## 6.5 Resumo do Processo de Normalização

| Forma Normal | Problema Eliminado | Resultado |
|---|---|---|
| **0FN (não normalizado)** | Grupos repetitivos, dados misturados | 1 tabela gigante com listas |
| **1FN** | Atributos não atômicos (listas) | Tabelas separadas para fotos e evidências |
| **2FN** | Dependências parciais | Objeto, Usuário, Local, Categoria extraídos |
| **3FN** | Dependências transitivas | TipoUsuario extraído; Validacao separada de Devolucao; SolicitacaoPosse separada |

### Dependências Funcionais Verificadas na 3FN

Após a normalização, as seguintes dependências funcionais diretas foram confirmadas em cada tabela:

```
USUARIO:        id_usuario → {nome, email, cpf, matricula, id_tipo_usuario, ...}
TIPO_USUARIO:   id_tipo_usuario → {descricao, pode_validar, pode_administrar}
OBJETO:         id_objeto → {descricao, marca, cor, status, id_categoria, ...}
CATEGORIA:      id_categoria → {nome, descricao, icone}
LOCAL:          id_local → {nome, bloco, andar, tipo_local, ...}
SOLICITACAO:    id_solicitacao → {id_objeto, id_solicitante, status, ...}
VALIDACAO:      id_validacao → {id_solicitacao, id_validador, resultado, ...}
DEVOLUCAO:      id_devolucao → {id_objeto, id_solicitacao, id_responsavel, ...}
```

Nenhuma tabela contém atributos não-chave que dependam de outros atributos não-chave. ✅ **3FN atingida.**
