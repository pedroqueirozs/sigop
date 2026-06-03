# Etapa 3 — Entidades, Atributos e Justificativas

## Visão Geral das 14 Entidades

```
1.  TipoUsuario
2.  Usuario
3.  Local
4.  CategoriaObjeto
5.  Objeto
6.  RegistroPerda
7.  RegistroEncontrado
8.  FotoObjeto
9.  SolicitacaoPosse
10. Evidencia
11. Validacao
12. Devolucao
13. Notificacao
14. HistoricoMovimentacao
```

---

## 3.1 TipoUsuario

**Justificativa:** Entidade separada para garantir extensibilidade do sistema, evitar repetição da string do tipo e permitir configuração de permissões por tipo sem alterar a tabela de usuários.

| Atributo | Tipo | Restrições | Descrição |
|----------|------|-----------|-----------|
| `id_tipo_usuario` | INT | **PK**, AUTO_INCREMENT | Identificador único |
| `descricao` | VARCHAR(50) | NOT NULL, UNIQUE | Ex.: "Aluno", "Professor", "Funcionário", "Administrador" |
| `pode_validar` | BOOLEAN | NOT NULL, DEFAULT FALSE | Se este tipo pode validar solicitações |
| `pode_administrar` | BOOLEAN | NOT NULL, DEFAULT FALSE | Se este tipo tem acesso administrativo |

---

## 3.2 Usuario

**Justificativa:** Entidade central do sistema. Representa qualquer membro da comunidade acadêmica que interage com o SIGOP. A separação do tipo de usuário em entidade própria evita redundâncias.

| Atributo | Tipo | Restrições | Descrição |
|----------|------|-----------|-----------|
| `id_usuario` | INT | **PK**, AUTO_INCREMENT | Identificador único |
| `id_tipo_usuario` | INT | **FK** → TipoUsuario | Tipo do usuário |
| `nome` | VARCHAR(150) | NOT NULL | Nome completo |
| `email` | VARCHAR(100) | NOT NULL, UNIQUE | E-mail institucional |
| `cpf` | CHAR(11) | NOT NULL, UNIQUE | CPF sem formatação |
| `matricula` | VARCHAR(20) | UNIQUE | Matrícula (aluno) ou SIAPE (servidor) |
| `telefone` | VARCHAR(15) | NULL | Telefone de contato |
| `senha_hash` | VARCHAR(255) | NOT NULL | Hash bcrypt da senha |
| `ativo` | BOOLEAN | NOT NULL, DEFAULT TRUE | Se o usuário está ativo |
| `data_cadastro` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data/hora do cadastro |

---

## 3.3 Local

**Justificativa:** Modelar os locais do campus como entidade independente garante consistência nas buscas por localização e permite filtros geográficos sem redundância de dados.

| Atributo | Tipo | Restrições | Descrição |
|----------|------|-----------|-----------|
| `id_local` | INT | **PK**, AUTO_INCREMENT | Identificador único |
| `nome` | VARCHAR(100) | NOT NULL | Ex.: "Laboratório de Informática 3" |
| `bloco` | VARCHAR(20) | NULL | Bloco físico do campus |
| `andar` | VARCHAR(20) | NULL | Andar ou pavimento |
| `tipo_local` | VARCHAR(50) | NOT NULL | Sala, Laboratório, Corredor, Estacionamento, etc. |
| `descricao` | TEXT | NULL | Descrição adicional do local |
| `ativo` | BOOLEAN | NOT NULL, DEFAULT TRUE | Se o local está ativo para seleção |

---

## 3.4 CategoriaObjeto

**Justificativa:** Categorias permitem filtros, relatórios e organização visual. Entidade própria evita valores de texto livres e inconsistentes na tabela de objetos.

| Atributo | Tipo | Restrições | Descrição |
|----------|------|-----------|-----------|
| `id_categoria` | INT | **PK**, AUTO_INCREMENT | Identificador único |
| `nome` | VARCHAR(80) | NOT NULL, UNIQUE | Ex.: "Eletrônicos", "Documentos", "Vestuário" |
| `descricao` | TEXT | NULL | Descrição da categoria |
| `icone` | VARCHAR(50) | NULL | Ícone associado (classe CSS ou nome) |

---

## 3.5 Objeto

**Justificativa:** Entidade central que representa o item físico. Contém os dados descritivos e o status atual. Separado dos registros de perda/encontro para permitir que um mesmo item tenha múltiplos ciclos no sistema (ex.: perdido, encontrado, devolvido — e perdido novamente).

| Atributo | Tipo | Restrições | Descrição |
|----------|------|-----------|-----------|
| `id_objeto` | INT | **PK**, AUTO_INCREMENT | Identificador único |
| `id_categoria` | INT | **FK** → CategoriaObjeto | Categoria do objeto |
| `descricao` | TEXT | NOT NULL | Descrição detalhada do item |
| `marca` | VARCHAR(80) | NULL | Marca (se aplicável) |
| `cor` | VARCHAR(50) | NULL | Cor predominante |
| `status` | ENUM | NOT NULL | Perdido/Encontrado/Em Análise/Aguardando Validação/Disponível para Retirada/Devolvido/Encerrado |
| `data_criacao` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação do registro |
| `data_atualizacao` | TIMESTAMP | NOT NULL | Última atualização |
| `observacoes` | TEXT | NULL | Observações gerais |

**Valores do ENUM `status`:**
```
'Perdido' | 'Encontrado' | 'Em Análise' | 'Aguardando Validação' |
'Disponível para Retirada' | 'Devolvido' | 'Encerrado'
```

---

## 3.6 RegistroPerda

**Justificativa:** Entidade associativa que vincula um usuário a um objeto com contexto da perda (quando, onde, como). Separada de Objeto para não poluir a entidade principal com dados situacionais e para permitir múltiplos registros de perda para o mesmo objeto.

| Atributo | Tipo | Restrições | Descrição |
|----------|------|-----------|-----------|
| `id_registro_perda` | INT | **PK**, AUTO_INCREMENT | Identificador único |
| `id_objeto` | INT | **FK** → Objeto | Objeto perdido |
| `id_usuario` | INT | **FK** → Usuario | Quem registrou a perda |
| `id_local` | INT | **FK** → Local | Último local conhecido do objeto |
| `data_perda` | DATE | NOT NULL | Data em que o objeto foi perdido |
| `hora_perda` | TIME | NULL | Hora aproximada da perda |
| `data_registro` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data do registro no sistema |
| `descricao_circunstancias` | TEXT | NULL | Como/onde o objeto foi perdido |

---

## 3.7 RegistroEncontrado

**Justificativa:** Análogo ao RegistroPerda, mas para quem encontrou o objeto. Deve conter o local exato onde foi encontrado e quem encontrou, para responsabilização e localização do item físico.

| Atributo | Tipo | Restrições | Descrição |
|----------|------|-----------|-----------|
| `id_registro_encontrado` | INT | **PK**, AUTO_INCREMENT | Identificador único |
| `id_objeto` | INT | **FK** → Objeto | Objeto encontrado |
| `id_usuario` | INT | **FK** → Usuario | Quem encontrou e registrou |
| `id_local` | INT | **FK** → Local | Local onde foi encontrado |
| `data_encontrado` | DATE | NOT NULL | Data em que foi encontrado |
| `hora_encontrado` | TIME | NULL | Hora aproximada |
| `data_registro` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data do registro no sistema |
| `local_guarda` | VARCHAR(150) | NULL | Onde o objeto está guardado fisicamente |
| `descricao_circunstancias` | TEXT | NULL | Circunstâncias do encontro |

---

## 3.8 FotoObjeto

**Justificativa:** Entidade separada para suportar múltiplas fotos por objeto. Evita atributos multivalorados na entidade Objeto, garantindo 1FN.

| Atributo | Tipo | Restrições | Descrição |
|----------|------|-----------|-----------|
| `id_foto` | INT | **PK**, AUTO_INCREMENT | Identificador único |
| `id_objeto` | INT | **FK** → Objeto | Objeto ao qual a foto pertence |
| `id_usuario` | INT | **FK** → Usuario | Quem fez o upload |
| `url_foto` | VARCHAR(500) | NOT NULL | Caminho/URL da foto |
| `nome_arquivo` | VARCHAR(200) | NOT NULL | Nome original do arquivo |
| `tamanho_bytes` | INT | NOT NULL | Tamanho do arquivo |
| `data_upload` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data/hora do upload |
| `descricao` | VARCHAR(255) | NULL | Legenda opcional da foto |
| `is_principal` | BOOLEAN | NOT NULL, DEFAULT FALSE | Se é a foto de capa do objeto |

---

## 3.9 SolicitacaoPosse

**Justificativa:** Entidade que representa a reivindicação formal de um usuário sobre um objeto encontrado. É a entidade central do fluxo de validação. Possui ciclo de vida próprio (status) e pode ter múltiplas instâncias para um mesmo objeto (diferentes pessoas reivindicando).

| Atributo | Tipo | Restrições | Descrição |
|----------|------|-----------|-----------|
| `id_solicitacao` | INT | **PK**, AUTO_INCREMENT | Identificador único |
| `id_objeto` | INT | **FK** → Objeto | Objeto reivindicado |
| `id_solicitante` | INT | **FK** → Usuario | Quem está solicitando |
| `status_solicitacao` | ENUM | NOT NULL | Pendente/Aprovada/Rejeitada/Cancelada |
| `descricao_reivindicacao` | TEXT | NOT NULL | Justificativa do solicitante |
| `data_solicitacao` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data/hora da solicitação |
| `data_atualizacao` | TIMESTAMP | NOT NULL | Última atualização |

**Valores do ENUM `status_solicitacao`:**
```
'Pendente' | 'Aprovada' | 'Rejeitada' | 'Cancelada'
```

---

## 3.10 Evidencia

**Justificativa:** Separada de SolicitacaoPosse para permitir múltiplas evidências por solicitação (foto do comprovante de compra, nota fiscal, foto com o objeto, etc.), evitando atributos multivalorados.

| Atributo | Tipo | Restrições | Descrição |
|----------|------|-----------|-----------|
| `id_evidencia` | INT | **PK**, AUTO_INCREMENT | Identificador único |
| `id_solicitacao` | INT | **FK** → SolicitacaoPosse | Solicitação à qual pertence |
| `tipo_evidencia` | VARCHAR(80) | NOT NULL | Foto, Documento, Descrição, Nota Fiscal |
| `descricao` | TEXT | NULL | Descrição textual da evidência |
| `url_arquivo` | VARCHAR(500) | NULL | Arquivo anexado (se houver) |
| `data_upload` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data/hora do upload |

---

## 3.11 Validacao

**Justificativa:** Entidade que representa a decisão formal de um responsável sobre uma solicitação de posse. Mantém o registro de quem validou, quando e por quê, garantindo auditoria completa.

| Atributo | Tipo | Restrições | Descrição |
|----------|------|-----------|-----------|
| `id_validacao` | INT | **PK**, AUTO_INCREMENT | Identificador único |
| `id_solicitacao` | INT | **FK** → SolicitacaoPosse, UNIQUE | Solicitação validada (1:1) |
| `id_validador` | INT | **FK** → Usuario | Quem realizou a validação |
| `resultado` | ENUM | NOT NULL | Aprovado / Rejeitado |
| `justificativa` | TEXT | NULL | Motivo da decisão |
| `data_validacao` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data/hora da validação |

---

## 3.12 Devolucao

**Justificativa:** Entidade que formaliza a entrega física do objeto ao proprietário. Separada de Validacao para representar um evento distinto (a validação autoriza, a devolução executa). Gera o comprovante oficial.

| Atributo | Tipo | Restrições | Descrição |
|----------|------|-----------|-----------|
| `id_devolucao` | INT | **PK**, AUTO_INCREMENT | Identificador único |
| `id_objeto` | INT | **FK** → Objeto, UNIQUE | Objeto devolvido (1:1 — nunca duas vezes) |
| `id_solicitacao` | INT | **FK** → SolicitacaoPosse, UNIQUE | Solicitação aprovada que originou a devolução |
| `id_responsavel` | INT | **FK** → Usuario | Funcionário que realizou a entrega |
| `id_beneficiario` | INT | **FK** → Usuario | Quem recebeu o objeto |
| `data_devolucao` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data/hora da devolução |
| `codigo_comprovante` | VARCHAR(50) | NOT NULL, UNIQUE | Código único do comprovante |
| `observacoes` | TEXT | NULL | Observações da devolução |

---

## 3.13 Notificacao

**Justificativa:** Centraliza todas as notificações geradas pelo sistema em uma única entidade, permitindo consulta de notificações não lidas, histórico e rastreabilidade de comunicações.

| Atributo | Tipo | Restrições | Descrição |
|----------|------|-----------|-----------|
| `id_notificacao` | INT | **PK**, AUTO_INCREMENT | Identificador único |
| `id_usuario_destino` | INT | **FK** → Usuario | Destinatário |
| `id_objeto` | INT | **FK** → Objeto, NULL | Objeto relacionado (se aplicável) |
| `tipo_notificacao` | VARCHAR(80) | NOT NULL | Objeto Encontrado, Solicitação Aprovada, etc. |
| `mensagem` | TEXT | NOT NULL | Conteúdo da notificação |
| `lida` | BOOLEAN | NOT NULL, DEFAULT FALSE | Se foi visualizada |
| `data_criacao` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data/hora de criação |
| `data_leitura` | TIMESTAMP | NULL | Data/hora em que foi lida |

---

## 3.14 HistoricoMovimentacao

**Justificativa:** Entidade de auditoria que registra cada transição de estado do objeto. Fundamental para rastreabilidade, resolução de disputas e requisitos legais. Imutável — registros nunca são editados ou excluídos.

| Atributo | Tipo | Restrições | Descrição |
|----------|------|-----------|-----------|
| `id_historico` | INT | **PK**, AUTO_INCREMENT | Identificador único |
| `id_objeto` | INT | **FK** → Objeto | Objeto movimentado |
| `id_usuario` | INT | **FK** → Usuario | Usuário que causou a movimentação |
| `status_anterior` | VARCHAR(50) | NULL | Status antes da transição (NULL no primeiro registro) |
| `status_novo` | VARCHAR(50) | NOT NULL | Novo status após a transição |
| `acao` | VARCHAR(100) | NOT NULL | Descrição da ação (ex.: "Registro de perda", "Solicitação de posse") |
| `detalhes` | TEXT | NULL | Informações adicionais |
| `data_movimentacao` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data/hora da movimentação |

---

## Resumo de Relacionamentos entre Entidades

| Entidade Pai | Entidade Filha | Cardinalidade |
|-------------|----------------|---------------|
| TipoUsuario | Usuario | 1 : N |
| Usuario | RegistroPerda | 1 : N |
| Usuario | RegistroEncontrado | 1 : N |
| Usuario | SolicitacaoPosse | 1 : N |
| Usuario | FotoObjeto | 1 : N |
| Usuario | Validacao | 1 : N |
| Usuario | Devolucao (responsavel) | 1 : N |
| Usuario | Devolucao (beneficiario) | 1 : N |
| Usuario | Notificacao | 1 : N |
| Usuario | HistoricoMovimentacao | 1 : N |
| CategoriaObjeto | Objeto | 1 : N |
| Objeto | RegistroPerda | 1 : N |
| Objeto | RegistroEncontrado | 1 : N |
| Objeto | FotoObjeto | 1 : N |
| Objeto | SolicitacaoPosse | 1 : N |
| Objeto | Devolucao | 1 : 1 |
| Objeto | HistoricoMovimentacao | 1 : N |
| Objeto | Notificacao | 1 : N |
| Local | RegistroPerda | 1 : N |
| Local | RegistroEncontrado | 1 : N |
| SolicitacaoPosse | Evidencia | 1 : N |
| SolicitacaoPosse | Validacao | 1 : 1 |
| SolicitacaoPosse | Devolucao | 1 : 1 |
