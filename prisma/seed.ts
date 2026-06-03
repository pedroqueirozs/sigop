import "dotenv/config"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../app/generated/prisma/client"
import bcrypt from "bcryptjs"

const pool = new Pool({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const tipos = await prisma.tipoUsuario.createMany({
    data: [
      { descricao: "Aluno",         podeValidar: false, podeAdministrar: false },
      { descricao: "Professor",     podeValidar: false, podeAdministrar: false },
      { descricao: "Funcionário",   podeValidar: true,  podeAdministrar: false },
      { descricao: "Administrador", podeValidar: true,  podeAdministrar: true  },
    ],
    skipDuplicates: true,
  })

  const adminTipo = await prisma.tipoUsuario.findFirst({
    where: { descricao: "Administrador" },
  })

  await prisma.usuario.upsert({
    where: { email: "admin@sigop.edu.br" },
    update: {},
    create: {
      idTipoUsuario: adminTipo!.id,
      nome: "Administrador",
      email: "admin@sigop.edu.br",
      cpf: "00000000000",
      senhaHash: await bcrypt.hash("admin123", 12),
    },
  })

  await prisma.categoriaObjeto.createMany({
    data: [
      { nome: "Eletrônicos",          icone: "laptop" },
      { nome: "Documentos",           icone: "file-text" },
      { nome: "Vestuário",            icone: "shirt" },
      { nome: "Acessórios",           icone: "watch" },
      { nome: "Materiais Escolares",  icone: "book" },
      { nome: "Chaves",               icone: "key" },
      { nome: "Outros",               icone: "box" },
    ],
    skipDuplicates: true,
  })

  await prisma.local.createMany({
    data: [
      { nome: "Laboratório de Informática 1", bloco: "B", andar: "2", tipoLocal: "Laboratório" },
      { nome: "Biblioteca Central",           bloco: "A", andar: "1", tipoLocal: "Biblioteca"  },
      { nome: "Cantina",                      bloco: "C", andar: "T", tipoLocal: "Refeitório"  },
      { nome: "Estacionamento Principal",     tipoLocal: "Estacionamento" },
      { nome: "Corredor Bloco A",             bloco: "A", andar: "1", tipoLocal: "Corredor"    },
      { nome: "Sala 302",                     bloco: "A", andar: "3", tipoLocal: "Sala de Aula"},
    ],
    skipDuplicates: true,
  })

  console.log("Seed concluído.")
  console.log(`Tipos criados: ${tipos.count}`)
  console.log("Admin: admin@sigop.edu.br / admin123")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
