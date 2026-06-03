# Etapa 2 — Requisitos do Sistema

## 2.1 Requisitos Funcionais

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-01 | O sistema deve permitir o cadastro de usuários com nome, e-mail, CPF, matrícula/SIAPE, telefone e tipo (aluno/professor/funcionário). | Alta |
| RF-02 | O sistema deve autenticar usuários por e-mail e senha. | Alta |
| RF-03 | O sistema deve permitir o registro de objetos perdidos com descrição, categoria, local, data/hora e observações. | Alta |
| RF-04 | O sistema deve permitir o registro de objetos encontrados com descrição, categoria, local onde foi encontrado, data/hora e observações. | Alta |
| RF-05 | O sistema deve permitir o upload de uma ou mais fotos para cada objeto registrado. | Alta |
| RF-06 | O sistema deve controlar o status do objeto ao longo do seu ciclo de vida. | Alta |
| RF-07 | O sistema deve permitir que usuários solicitem a posse de um objeto encontrado. | Alta |
| RF-08 | O sistema deve permitir o anexo de evidências de propriedade (fotos, documentos descritivos) em uma solicitação de posse. | Alta |
| RF-09 | O sistema deve permitir que um usuário responsável valide ou rejeite uma solicitação de posse. | Alta |
| RF-10 | O sistema deve registrar a devolução do objeto somente quando houver solicitação aprovada. | Alta |
| RF-11 | O sistema deve emitir um comprovante de devolução com dados do objeto, do solicitante e do responsável. | Média |
| RF-12 | O sistema deve registrar cada alteração de estado do objeto no histórico de movimentações. | Alta |
| RF-13 | O sistema deve enviar notificações in-app aos usuários envolvidos em cada transição relevante. | Média |
| RF-14 | O sistema deve permitir o cadastro de locais do campus (salas, laboratórios, corredores, etc.). | Alta |
| RF-15 | O sistema deve permitir o cadastro de categorias de objetos (eletrônicos, documentos, vestuário, etc.). | Alta |
| RF-16 | O sistema deve exibir listagem e busca de objetos perdidos e encontrados. | Alta |
| RF-17 | O sistema deve impedir que um objeto com status "Encerrado" seja devolvido novamente. | Alta |
| RF-18 | O sistema deve exibir o histórico completo de movimentações de um objeto. | Média |
| RF-19 | O sistema deve permitir que o administrador gerencie usuários, categorias e locais. | Alta |
| RF-20 | O sistema deve registrar data, hora e usuário responsável em toda alteração crítica. | Alta |

---

## 2.2 Requisitos Não Funcionais

| ID | Requisito | Categoria |
|----|-----------|-----------|
| RNF-01 | O sistema deve responder a requisições em menos de 2 segundos em condições normais de uso. | Desempenho |
| RNF-02 | O sistema deve estar disponível 99% do tempo em dias úteis. | Disponibilidade |
| RNF-03 | Senhas devem ser armazenadas com hash bcrypt (fator mínimo 12). | Segurança |
| RNF-04 | CPF, e-mail e matrícula devem ser únicos por usuário no banco de dados. | Integridade |
| RNF-05 | O sistema deve funcionar nos navegadores Chrome, Firefox, Edge e Safari (últimas 2 versões). | Compatibilidade |
| RNF-06 | A interface deve ser responsiva e funcional em dispositivos móveis (mínimo 375px de largura). | Usabilidade |
| RNF-07 | O banco de dados deve manter integridade referencial com uso de chaves estrangeiras. | Integridade |
| RNF-08 | Uploads de fotos devem ser limitados a 5 MB por arquivo, formatos JPG e PNG. | Restrição |
| RNF-09 | Todas as ações de criação, edição e exclusão devem ser registradas com timestamp e usuário autor. | Auditoria |
| RNF-10 | O código-fonte deve seguir padrões de linting (ESLint) e formatação consistentes. | Manutenibilidade |
| RNF-11 | O sistema deve utilizar HTTPS em produção. | Segurança |
| RNF-12 | Dados sensíveis (CPF, telefone) devem ter acesso restrito por perfil de usuário. | Privacidade |

---

## 2.3 Casos de Uso Principais

### UC-01 — Registrar Objeto Perdido

**Ator principal:** Usuário autenticado (aluno/professor/funcionário)
**Pré-condição:** Usuário autenticado no sistema
**Fluxo principal:**
1. Usuário acessa "Registrar Perda"
2. Preenche: descrição, categoria, local, data/hora, observações
3. Opcionalmente adiciona fotos do objeto
4. Confirma o registro
5. Sistema salva com status **"Perdido"** e registra no histórico
6. Sistema notifica administrador/portaria

**Fluxo alternativo:** Usuário cancela o formulário → sem persistência

---

### UC-02 — Registrar Objeto Encontrado

**Ator principal:** Usuário autenticado
**Pré-condição:** Usuário autenticado no sistema
**Fluxo principal:**
1. Usuário acessa "Registrar Objeto Encontrado"
2. Preenche: descrição, categoria, local onde foi encontrado, data/hora
3. Faz upload de pelo menos uma foto do objeto
4. Confirma o registro
5. Sistema salva com status **"Encontrado"** e registra no histórico
6. Sistema verifica se há registros de perda compatíveis e notifica possíveis donos

---

### UC-03 — Solicitar Posse de Objeto

**Ator principal:** Usuário autenticado
**Pré-condição:** Objeto com status "Encontrado" ou "Em Análise"
**Fluxo principal:**
1. Usuário visualiza objeto encontrado
2. Clica em "Reivindicar Propriedade"
3. Descreve a evidência de posse (características únicas, marca, etc.)
4. Opcionalmente anexa foto da evidência
5. Confirma a solicitação
6. Sistema muda status do objeto para **"Em Análise"**
7. Sistema notifica o responsável pela validação

**Fluxo alternativo A:** Objeto já possui solicitação aprovada → sistema bloqueia nova solicitação

---

### UC-04 — Validar Solicitação de Posse

**Ator principal:** Funcionário / Administrador (perfil validador)
**Pré-condição:** Existe solicitação de posse pendente
**Fluxo principal:**
1. Responsável acessa lista de solicitações pendentes
2. Visualiza evidências do solicitante e fotos do objeto
3. Toma decisão: **Aprovar** ou **Rejeitar**
4. Se aprovado: sistema muda status do objeto para **"Aguardando Validação"** → **"Disponível para Retirada"**
5. Se rejeitado: sistema muda status de volta para "Encontrado" e notifica o solicitante
6. Sistema registra a validação com justificativa

---

### UC-05 — Registrar Devolução

**Ator principal:** Funcionário / Administrador
**Pré-condição:** Objeto com status "Disponível para Retirada" e solicitação aprovada
**Fluxo principal:**
1. Responsável acessa a solicitação aprovada
2. Confirma a entrega física do objeto ao solicitante
3. Sistema registra a devolução com data/hora e responsável
4. Sistema muda status do objeto para **"Devolvido"** → **"Encerrado"**
5. Sistema emite comprovante de devolução
6. Sistema notifica o beneficiário

**Regra crítica:** Se objeto já tem devolução registrada, o sistema bloqueia nova tentativa.

---

### UC-06 — Consultar Histórico de Movimentações

**Ator principal:** Qualquer usuário autenticado
**Fluxo principal:**
1. Usuário acessa detalhe de um objeto
2. Visualiza timeline com todas as movimentações
3. Cada entrada exibe: data/hora, ação realizada, usuário responsável, status anterior → status novo

---

### UC-07 — Gerenciar Locais do Campus

**Ator principal:** Administrador
**Fluxo principal:**
1. Administrador acessa configurações
2. Adiciona, edita ou desativa locais
3. Cada local tem: nome, bloco, andar, tipo (sala, laboratório, corredor, etc.)

---

## 2.4 Diagrama de Casos de Uso (Textual)

```
Sistema SIGOP
├── [Usuário Autenticado]
│   ├── UC-01: Registrar Objeto Perdido
│   ├── UC-02: Registrar Objeto Encontrado
│   ├── UC-03: Solicitar Posse de Objeto
│   ├── UC-06: Consultar Histórico
│   └── UC-08: Visualizar Notificações
│
├── [Funcionário / Validador]
│   ├── UC-04: Validar Solicitação de Posse
│   └── UC-05: Registrar Devolução
│
└── [Administrador]
    ├── UC-07: Gerenciar Locais
    ├── UC-09: Gerenciar Categorias
    └── UC-10: Gerenciar Usuários
```
