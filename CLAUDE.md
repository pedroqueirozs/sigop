@AGENTS.md

# SIGOP — Sistema Integrado de Gestão de Objetos Perdidos

## Contexto do Projeto

Projeto Final de Modelagem Conceitual de Banco de Dados para disciplina universitária.
Sistema web para controle de objetos perdidos/encontrados em uma faculdade.

**Stack:** Next.js 16.2.7 · React 19 · TypeScript · Tailwind CSS v4 · App Router

## Estrutura de Documentação

Toda a documentação acadêmica fica em `docs/`. Consulte antes de implementar qualquer coisa:

- [docs/README.md](docs/README.md) — índice geral
- [docs/etapa-1-descricao.md](docs/etapa-1-descricao.md) — descrição e objetivos
- [docs/etapa-2-requisitos.md](docs/etapa-2-requisitos.md) — RF, RNF e casos de uso
- [docs/etapa-3-entidades.md](docs/etapa-3-entidades.md) — entidades, atributos, PKs/FKs
- [docs/etapa-4-mer.md](docs/etapa-4-mer.md) — Modelo Entidade-Relacionamento
- [docs/etapa-5-uml.md](docs/etapa-5-uml.md) — Diagrama de Classes UML
- [docs/etapa-6-normalizacao.md](docs/etapa-6-normalizacao.md) — 1FN, 2FN, 3FN
- [docs/etapa-7-modelo-relacional.md](docs/etapa-7-modelo-relacional.md) — modelo relacional final
- [docs/etapa-8-mvp.md](docs/etapa-8-mvp.md) — protótipo, wireframes e fluxo
- [docs/etapa-9-apresentacao.md](docs/etapa-9-apresentacao.md) — dicas e perguntas prováveis

## Entidades Principais (14)

Usuario, TipoUsuario, Objeto, CategoriaObjeto, Local, RegistroPerda,
RegistroEncontrado, FotoObjeto, SolicitacaoPosse, Evidencia,
Validacao, Devolucao, Notificacao, HistoricoMovimentacao

## Status do Objeto

`Perdido` → `Encontrado` → `Em Análise` → `Aguardando Validação`
→ `Disponível para Retirada` → `Devolvido` → `Encerrado`

## Regras de Negócio Críticas

- Um objeto não pode ser devolvido duas vezes
- Apenas solicitações aprovadas geram devolução
- Toda devolução gera histórico e notificação automática
- Objeto devolvido muda status para "Encerrado"

## Convenções de Código

- Componentes em `app/` usando App Router do Next.js 16
- Nomes de arquivos: kebab-case
- Componentes React: PascalCase
- Sem comentários óbvios — código deve ser autoexplicativo

## Convenções de Commit

- **Nunca** commitar sem Pedro pedir explicitamente
- **Nunca** incluir co-autores automáticos (IA ou ferramentas)
- Mensagens em inglês: `type: short description`
- Tipos: `feat` · `fix` · `refactor` · `style` · `docs`
- Exemplos: `feat: adds lost item registration` · `fix: fixes status update on return`
