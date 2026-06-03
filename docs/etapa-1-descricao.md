# Etapa 1 — Descrição do Sistema

## 1.1 Nome do Sistema

**SIGOP — Sistema Integrado de Gestão de Objetos Perdidos**

---

## 1.2 Descrição Geral

O SIGOP é um sistema de informação web desenvolvido para centralizar e formalizar o processo de registro, localização e devolução de objetos perdidos ou encontrados dentro do campus de uma instituição de ensino superior.

O sistema atende a três perfis de usuários: **alunos**, **professores** e **funcionários**. Qualquer membro da comunidade acadêmica pode registrar um objeto encontrado ou reportar um objeto perdido. O sistema conduz todo o fluxo de validação de propriedade até a devolução física do item, gerando evidências, notificações e comprovantes em cada etapa.

---

## 1.3 Problema que o Sistema Resolve

### Situação Atual (AS-IS)

A faculdade não possui processo formal para tratar objetos perdidos. O fluxo atual apresenta os seguintes problemas:

| Problema | Impacto |
|----------|---------|
| Objetos são deixados em locais sem identificação | Item perdido permanentemente |
| Comunicação via grupos de WhatsApp e murais físicos | Informação fragmentada, sem rastreabilidade |
| Portaria recebe objetos sem protocolo de registro | Sem responsabilização, sem histórico |
| Ausência de validação de propriedade | Fraudes e entregas incorretas |
| Sem prazo definido para guarda dos objetos | Acúmulo desordenado |
| Sem comprovante de devolução | Disputas e conflitos |

### Situação Desejada (TO-BE)

Com o SIGOP, o fluxo passa a ser:

```
Objeto encontrado → Registro digital → Fotos anexadas
    → Notificação automática aos possíveis donos
        → Solicitação de posse com evidências
            → Validação pelo responsável
                → Agendamento de retirada
                    → Devolução com comprovante
                        → Encerramento do caso
```

---

## 1.4 Objetivos

### Objetivo Geral

Desenvolver um sistema de informação que centralize, formalize e rastreie todo o ciclo de vida de objetos perdidos e encontrados no campus universitário, desde o registro inicial até a devolução ao proprietário legítimo.

### Objetivos Específicos

1. **OE-01** — Permitir o cadastro e autenticação de todos os membros da comunidade acadêmica (alunos, professores e funcionários).
2. **OE-02** — Oferecer um mecanismo estruturado para registrar objetos perdidos, com descrição, categoria, local e data da perda.
3. **OE-03** — Oferecer um mecanismo estruturado para registrar objetos encontrados, com upload de fotos como evidência visual.
4. **OE-04** — Mapear e manter atualizados os locais físicos do campus onde objetos podem ser perdidos ou encontrados.
5. **OE-05** — Permitir que usuários solicitem a posse de objetos encontrados mediante apresentação de evidências de propriedade.
6. **OE-06** — Gerenciar o processo de validação das solicitações de posse por usuários com perfil de responsável.
7. **OE-07** — Registrar formalmente a devolução do objeto ao proprietário e emitir comprovante digital.
8. **OE-08** — Manter histórico completo e auditável de todas as movimentações de cada objeto.
9. **OE-09** — Notificar automaticamente os usuários envolvidos em cada transição de estado do objeto.
10. **OE-10** — Garantir que nenhum objeto seja devolvido mais de uma vez e que objetos devolvidos sejam encerrados no sistema.

---

## 1.5 Escopo do Sistema

### Dentro do Escopo

- Cadastro e autenticação de usuários
- Registro de perda e de encontro de objetos
- Upload e visualização de fotos
- Solicitação e validação de posse
- Controle de devolução com comprovante
- Histórico e auditoria de movimentações
- Notificações por sistema (in-app)

### Fora do Escopo (versão inicial)

- Integração com sistemas de e-mail externo
- Aplicativo mobile nativo
- Câmeras de segurança ou reconhecimento de imagem
- Pagamento de taxas ou depósito caução
- Integração com sistema acadêmico (ERP institucional)

---

## 1.6 Stakeholders

| Stakeholder | Papel no Sistema |
|-------------|-----------------|
| Alunos | Registram perdas/encontros, solicitam posse |
| Professores | Registram perdas/encontros, solicitam posse |
| Funcionários | Registram perdas/encontros, validam solicitações |
| Administrador do Sistema | Gerencia usuários, categorias e locais |
| Responsável pela Portaria | Recebe e entrega objetos fisicamente |

---

## 1.7 Justificativa Acadêmica

Este projeto demonstra a aplicação de técnicas de **modelagem conceitual de banco de dados** em um cenário real e relevante. O domínio escolhido é suficientemente complexo para exigir:

- Mais de 10 entidades com relacionamentos variados
- Cardinalidades 1:1, 1:N e N:M
- Entidades associativas com atributos próprios
- Normalização até a 3FN com dependências funcionais não triviais
- Controle de estado (máquina de estados do objeto)
- Rastreabilidade e auditoria (histórico de movimentações)
