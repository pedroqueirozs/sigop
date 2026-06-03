-- CreateEnum
CREATE TYPE "StatusObjeto" AS ENUM ('PERDIDO', 'ENCONTRADO', 'EM_ANALISE', 'AGUARDANDO_VALIDACAO', 'DISPONIVEL_PARA_RETIRADA', 'DEVOLVIDO', 'ENCERRADO');

-- CreateEnum
CREATE TYPE "StatusSolicitacao" AS ENUM ('PENDENTE', 'APROVADA', 'REJEITADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "ResultadoValidacao" AS ENUM ('APROVADO', 'REJEITADO');

-- CreateTable
CREATE TABLE "tipo_usuario" (
    "id" SERIAL NOT NULL,
    "descricao" VARCHAR(50) NOT NULL,
    "podeValidar" BOOLEAN NOT NULL DEFAULT false,
    "podeAdministrar" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tipo_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "idTipoUsuario" INTEGER NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "cpf" CHAR(11) NOT NULL,
    "matricula" VARCHAR(20),
    "telefone" VARCHAR(15),
    "senhaHash" VARCHAR(255) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "local" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "bloco" VARCHAR(20),
    "andar" VARCHAR(20),
    "tipoLocal" VARCHAR(50) NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "local_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoria_objeto" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(80) NOT NULL,
    "descricao" TEXT,
    "icone" VARCHAR(50),

    CONSTRAINT "categoria_objeto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "objeto" (
    "id" SERIAL NOT NULL,
    "idCategoria" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "marca" VARCHAR(80),
    "cor" VARCHAR(50),
    "status" "StatusObjeto" NOT NULL DEFAULT 'PERDIDO',
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,
    "observacoes" TEXT,

    CONSTRAINT "objeto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registro_perda" (
    "id" SERIAL NOT NULL,
    "idObjeto" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "idLocal" INTEGER NOT NULL,
    "dataPerda" DATE NOT NULL,
    "horaPerda" VARCHAR(5),
    "dataRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descricaoCircunstancias" TEXT,

    CONSTRAINT "registro_perda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registro_encontrado" (
    "id" SERIAL NOT NULL,
    "idObjeto" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "idLocal" INTEGER NOT NULL,
    "dataEncontrado" DATE NOT NULL,
    "horaEncontrado" VARCHAR(5),
    "dataRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "localGuarda" VARCHAR(150),
    "descricaoCircunstancias" TEXT,

    CONSTRAINT "registro_encontrado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foto_objeto" (
    "id" SERIAL NOT NULL,
    "idObjeto" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "urlFoto" VARCHAR(500) NOT NULL,
    "nomeArquivo" VARCHAR(200) NOT NULL,
    "tamanhoBytes" INTEGER NOT NULL,
    "dataUpload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descricao" VARCHAR(255),
    "isPrincipal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "foto_objeto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitacao_posse" (
    "id" SERIAL NOT NULL,
    "idObjeto" INTEGER NOT NULL,
    "idSolicitante" INTEGER NOT NULL,
    "statusSolicitacao" "StatusSolicitacao" NOT NULL DEFAULT 'PENDENTE',
    "descricaoReivindicacao" TEXT NOT NULL,
    "dataSolicitacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitacao_posse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidencia" (
    "id" SERIAL NOT NULL,
    "idSolicitacao" INTEGER NOT NULL,
    "tipoEvidencia" VARCHAR(80) NOT NULL,
    "descricao" TEXT,
    "urlArquivo" VARCHAR(500),
    "dataUpload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "validacao" (
    "id" SERIAL NOT NULL,
    "idSolicitacao" INTEGER NOT NULL,
    "idValidador" INTEGER NOT NULL,
    "resultado" "ResultadoValidacao" NOT NULL,
    "justificativa" TEXT,
    "dataValidacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "validacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devolucao" (
    "id" SERIAL NOT NULL,
    "idObjeto" INTEGER NOT NULL,
    "idSolicitacao" INTEGER NOT NULL,
    "idResponsavel" INTEGER NOT NULL,
    "idBeneficiario" INTEGER NOT NULL,
    "dataDevolucao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigoComprovante" VARCHAR(50) NOT NULL,
    "observacoes" TEXT,

    CONSTRAINT "devolucao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacao" (
    "id" SERIAL NOT NULL,
    "idUsuarioDestino" INTEGER NOT NULL,
    "idObjeto" INTEGER,
    "tipoNotificacao" VARCHAR(80) NOT NULL,
    "mensagem" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataLeitura" TIMESTAMP(3),

    CONSTRAINT "notificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico_movimentacao" (
    "id" SERIAL NOT NULL,
    "idObjeto" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "statusAnterior" VARCHAR(50),
    "statusNovo" VARCHAR(50) NOT NULL,
    "acao" VARCHAR(100) NOT NULL,
    "detalhes" TEXT,
    "dataMovimentacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_movimentacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tipo_usuario_descricao_key" ON "tipo_usuario"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_cpf_key" ON "usuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_matricula_key" ON "usuario"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_objeto_nome_key" ON "categoria_objeto"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "validacao_idSolicitacao_key" ON "validacao"("idSolicitacao");

-- CreateIndex
CREATE UNIQUE INDEX "devolucao_idObjeto_key" ON "devolucao"("idObjeto");

-- CreateIndex
CREATE UNIQUE INDEX "devolucao_idSolicitacao_key" ON "devolucao"("idSolicitacao");

-- CreateIndex
CREATE UNIQUE INDEX "devolucao_codigoComprovante_key" ON "devolucao"("codigoComprovante");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_idTipoUsuario_fkey" FOREIGN KEY ("idTipoUsuario") REFERENCES "tipo_usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objeto" ADD CONSTRAINT "objeto_idCategoria_fkey" FOREIGN KEY ("idCategoria") REFERENCES "categoria_objeto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_perda" ADD CONSTRAINT "registro_perda_idObjeto_fkey" FOREIGN KEY ("idObjeto") REFERENCES "objeto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_perda" ADD CONSTRAINT "registro_perda_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_perda" ADD CONSTRAINT "registro_perda_idLocal_fkey" FOREIGN KEY ("idLocal") REFERENCES "local"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_encontrado" ADD CONSTRAINT "registro_encontrado_idObjeto_fkey" FOREIGN KEY ("idObjeto") REFERENCES "objeto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_encontrado" ADD CONSTRAINT "registro_encontrado_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_encontrado" ADD CONSTRAINT "registro_encontrado_idLocal_fkey" FOREIGN KEY ("idLocal") REFERENCES "local"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foto_objeto" ADD CONSTRAINT "foto_objeto_idObjeto_fkey" FOREIGN KEY ("idObjeto") REFERENCES "objeto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foto_objeto" ADD CONSTRAINT "foto_objeto_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacao_posse" ADD CONSTRAINT "solicitacao_posse_idObjeto_fkey" FOREIGN KEY ("idObjeto") REFERENCES "objeto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacao_posse" ADD CONSTRAINT "solicitacao_posse_idSolicitante_fkey" FOREIGN KEY ("idSolicitante") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidencia" ADD CONSTRAINT "evidencia_idSolicitacao_fkey" FOREIGN KEY ("idSolicitacao") REFERENCES "solicitacao_posse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validacao" ADD CONSTRAINT "validacao_idSolicitacao_fkey" FOREIGN KEY ("idSolicitacao") REFERENCES "solicitacao_posse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validacao" ADD CONSTRAINT "validacao_idValidador_fkey" FOREIGN KEY ("idValidador") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devolucao" ADD CONSTRAINT "devolucao_idObjeto_fkey" FOREIGN KEY ("idObjeto") REFERENCES "objeto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devolucao" ADD CONSTRAINT "devolucao_idSolicitacao_fkey" FOREIGN KEY ("idSolicitacao") REFERENCES "solicitacao_posse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devolucao" ADD CONSTRAINT "devolucao_idResponsavel_fkey" FOREIGN KEY ("idResponsavel") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devolucao" ADD CONSTRAINT "devolucao_idBeneficiario_fkey" FOREIGN KEY ("idBeneficiario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacao" ADD CONSTRAINT "notificacao_idUsuarioDestino_fkey" FOREIGN KEY ("idUsuarioDestino") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacao" ADD CONSTRAINT "notificacao_idObjeto_fkey" FOREIGN KEY ("idObjeto") REFERENCES "objeto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_movimentacao" ADD CONSTRAINT "historico_movimentacao_idObjeto_fkey" FOREIGN KEY ("idObjeto") REFERENCES "objeto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_movimentacao" ADD CONSTRAINT "historico_movimentacao_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
