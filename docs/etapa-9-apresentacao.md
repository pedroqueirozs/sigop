# Etapa 9 — Dicas de Apresentação

## 9.1 Estrutura Recomendada da Apresentação

Organize sua apresentação em 5 partes com os tempos sugeridos:

| Parte | Conteúdo | Tempo |
|-------|----------|-------|
| 1 | Contexto e Problema | 2 min |
| 2 | Modelagem — MER e UML | 5 min |
| 3 | Normalização (1FN → 3FN) | 4 min |
| 4 | Modelo Relacional e DDL | 3 min |
| 5 | Protótipo e Demonstração | 3 min |
| — | Perguntas | 3 min |

**Total: ~20 minutos**

---

## 9.2 Slides Recomendados

1. **Capa** — Nome do sistema, tema, integrantes, disciplina, data
2. **O Problema** — Situação atual da faculdade (sem sistema formal)
3. **Solução** — SIGOP: o que resolve e como
4. **Entidades** — Tabela com as 14 entidades e uma frase de justificativa de cada
5. **Diagrama MER** — O diagrama completo (use ferramenta visual: draw.io, Lucidchart)
6. **Cardinalidades** — Destaque os 3 relacionamentos mais interessantes: 1:1 com UNIQUE, N:M implícito, self-referência
7. **Diagrama UML** — Classes principais com composição vs. associação
8. **Normalização** — Slide comparativo: tabela feia → 3FN limpa
9. **Modelo Relacional** — Schema visual ou DDL comentado
10. **Protótipo** — Screenshots ou wireframes do fluxo principal
11. **Conclusão** — O que foi aprendido e possíveis evoluções do sistema

---

## 9.3 Pontos para Destacar durante a Apresentação

### Decisão mais importante do projeto
> "Optamos por separar as entidades `Validacao` e `Devolucao` pois representam eventos distintos no ciclo de vida do objeto — a validação autoriza, a devolução executa. Isso também facilitou a implementação da regra de negócio que impede a devolução dupla via UNIQUE constraint."

### Decisão de normalização mais relevante
> "A dependência transitiva mais importante que eliminamos na 3FN foi `id_devolucao → id_validador → nome_validador`. Ao separar os dados do validador na entidade `Usuario`, eliminamos a redundância e garantimos que uma atualização do nome do validador se propague automaticamente."

### Cardinalidade que merece explicação extra
> "O relacionamento Objeto × Devolucao é 1:1 implementado com UNIQUE constraint. Isso não é um erro — é a implementação direta da regra de negócio 'um objeto não pode ser devolvido duas vezes'. No modelo lógico, esse 1:1 opcional é a forma mais eficiente de garantir essa integridade."

---

## 9.4 Perguntas Prováveis do Professor — e Como Responder

---

### Q1: Por que você tem 14 entidades? Não é excessivo?

**Resposta:**
> "Não. Cada entidade existe por uma justificativa específica de modelagem. Por exemplo, `HistoricoMovimentacao` não poderia ser um atributo de `Objeto` — seria um atributo multivalorado, violando a 1FN. `TipoUsuario` separado evita a dependência transitiva que existiria se guardássemos texto como 'Aluno' em `Usuario` e derivássemos permissões desse texto. O número de entidades segue o domínio do problema, não uma meta arbitrária."

---

### Q2: Qual a diferença entre RegistroPerda e RegistroEncontrado? Por que não juntar em uma única entidade?

**Resposta:**
> "São eventos semanticamente distintos com atributos diferentes. `RegistroEncontrado` tem `local_guarda` (onde o objeto está fisicamente agora), que faz sentido apenas para objetos encontrados. `RegistroPerda` tem `descricao_circunstancias` com foco diferente — como o objeto foi perdido. Juntar as duas entidades forçaria atributos nulos para cada tipo de registro, criando uma estrutura esparsa e semanticamente ambígua, o que vai contra as boas práticas de modelagem."

---

### Q3: Como você garante que um objeto não seja devolvido duas vezes?

**Resposta:**
> "Via constraint `UNIQUE(id_objeto)` na tabela `DEVOLUCAO`. Em nível de banco de dados, essa constraint torna impossível inserir duas linhas com o mesmo `id_objeto`, independente de qualquer lógica de aplicação. Adicionalmente, a aplicação verifica o status `Encerrado` antes de qualquer operação, e o status também é atualizado para `Encerrado` após a devolução. São duas camadas de proteção: constraint no banco e validação na aplicação."

---

### Q4: Explique o processo de normalização. Por que a 3FN é suficiente?

**Resposta:**
> "Partimos de uma estrutura não normalizada com grupos repetitivos (fotos e evidências como listas em um campo). Na 1FN, separamos essas listas em tabelas próprias. Na 2FN, eliminamos dependências parciais — dados de objeto, usuário e local dependiam de seus próprios IDs, não da chave da tabela principal. Na 3FN, eliminamos dependências transitivas: `tipo_usuario` como texto determinava permissões, então extraímos para `TipoUsuario`; dados do validador foram movidos para `Usuario`."
>
> "A 3FN é suficiente porque o domínio não apresenta dependências multivaloradas ou de junção que exigiriam FNBC ou 4FN. Formas normais superiores adicionariam complexidade sem benefício real para este sistema."

---

### Q5: O que é uma dependência funcional? Dê um exemplo do seu projeto.

**Resposta:**
> "Uma dependência funcional X → Y significa que para cada valor de X existe exatamente um valor de Y. No nosso projeto: `id_usuario → email` — para cada ID de usuário existe exatamente um e-mail. `id_categoria → nome_categoria` — para cada ID de categoria existe exatamente um nome. `id_objeto → status` — o status atual de um objeto é determinado unicamente pelo seu ID. A normalização é o processo de garantir que dependências como essas existam apenas entre a chave primária e os demais atributos."

---

### Q6: Por que Validacao e Devolucao são entidades separadas?

**Resposta:**
> "Porque representam responsabilidades e momentos diferentes no processo. A `Validacao` é uma decisão intelectual — alguém analisa as evidências e decide se a reivindicação é legítima. A `Devolucao` é um evento físico — o objeto é entregue nas mãos do beneficiário. Um funcionário pode aprovar a validação na segunda-feira e a devolução acontecer na sexta-feira quando o aluno comparecer. Separar as entidades permite registrar corretamente os timestamps e responsáveis de cada evento."

---

### Q7: Como funcionam as notificações? Qual a relação com o padrão Observer?

**Resposta:**
> "A entidade `Notificacao` implementa conceitualmente o padrão Observer: quando o estado de um `Objeto` muda, o sistema dispara notificações para os usuários relevantes. A relação é: Objeto → evento → Notificacao → Usuario destinatário. Na implementação, isso pode ser feito via triggers no banco de dados ou via lógica de serviço na aplicação. A tabela guarda o estado `lida` para que o usuário veja quantas notificações não foram visualizadas."

---

### Q8: Como tratou a questão de múltiplas pessoas reivindicando o mesmo objeto?

**Resposta:**
> "A entidade `SolicitacaoPosse` permite múltiplas instâncias para o mesmo objeto (cardinalidade 1:N entre Objeto e SolicitacaoPosse). Quando uma solicitação é aprovada, o status do objeto muda para 'Aguardando Validação' → 'Disponível para Retirada', e o sistema pode rejeitar automaticamente as demais solicitações pendentes. A constraint `UNIQUE(id_objeto)` na tabela `Devolucao` garante que, independentemente de quantas solicitações existam, apenas uma devolução seja registrada."

---

### Q9: O que é BCNF e o seu modelo atingiu essa forma normal?

**Resposta:**
> "BCNF (Boyce-Codd Normal Form) é uma variação mais estrita da 3FN. Uma tabela está em BCNF se, para toda dependência funcional não trivial X → Y, X é uma superchave. Diferente da 3FN, que permite que Y seja um atributo primo (parte de uma chave candidata). No nosso modelo, como todas as tabelas têm chaves primárias simples e os atributos não-chave dependem unicamente da PK, todas as tabelas também estão em BCNF. A distinção entre 3FN e BCNF só seria relevante se tivéssemos chaves compostas com sobreposição."

---

### Q10: Quais melhorias você implementaria com mais tempo?

**Resposta:**
> "Algumas evoluções naturais do sistema: (1) **Sistema de matching automático** — ao registrar um objeto encontrado, o sistema busca registros de perda com categoria, cor e localização similares e notifica os possíveis donos proativamente; (2) **Expiração automática** — objetos sem solicitação após X dias seriam marcados para doação; (3) **Integração com sistemas acadêmicos** — importar automaticamente o cadastro de alunos e professores do ERP da faculdade; (4) **Aplicativo mobile** — para facilitar o registro fotográfico no momento do encontro; (5) **Relatórios gerenciais** — taxa de devolução, objetos mais perdidos por categoria/local, tempo médio de resolução."

---

## 9.5 Checklist Final antes da Apresentação

- [ ] Diagrama MER desenhado em ferramenta visual (draw.io, Lucidchart, BRmodelo)
- [ ] Diagrama UML desenhado em ferramenta visual (draw.io, StarUML, PlantUML)
- [ ] Script SQL testado e funcional
- [ ] Wireframes ou screenshots do protótipo prontos
- [ ] Saber explicar cada entidade e sua justificativa
- [ ] Saber explicar as 3 formas normais com exemplos do próprio projeto
- [ ] Saber explicar pelo menos 3 cardinalidades em detalhes
- [ ] Ter resposta preparada para as 10 perguntas acima
- [ ] Ensaiou a apresentação ao menos uma vez

---

## 9.6 Ferramentas Recomendadas

| Ferramenta | Uso | Acesso |
|------------|-----|--------|
| draw.io (diagrams.net) | MER e UML | Gratuito, online |
| BRModelo | MER em padrão brasileiro | Gratuito |
| StarUML | Diagrama de Classes UML | Gratuito (versão básica) |
| PlantUML | UML em texto | Gratuito, online |
| DB Fiddle | Testar SQL online | Gratuito |
| Figma | Wireframes de alta fidelidade | Gratuito (versão básica) |
| Canva | Slides com template profissional | Gratuito |
