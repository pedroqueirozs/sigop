"use server"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { prisma } from "@/app/lib/db"
import { createSession, deleteSession } from "@/app/lib/session"
import { LoginSchema, LoginFormState, CadastroSchema, CadastroFormState } from "@/app/lib/definitions"

export async function login(
  state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const validated = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { email, password } = validated.data

  const usuario = await prisma.usuario.findUnique({
    where: { email },
    include: { tipoUsuario: true },
  })

  if (!usuario || !usuario.ativo) {
    return { message: "E-mail ou senha incorretos." }
  }

  const senhaValida = await bcrypt.compare(password, usuario.senhaHash)
  if (!senhaValida) {
    return { message: "E-mail ou senha incorretos." }
  }

  await createSession({
    userId: usuario.id,
    tipoUsuarioId: usuario.idTipoUsuario,
    podeValidar: usuario.tipoUsuario.podeValidar,
    podeAdministrar: usuario.tipoUsuario.podeAdministrar,
  })

  redirect("/")
}

export async function logout() {
  await deleteSession()
  redirect("/login")
}

export async function cadastrar(
  state: CadastroFormState,
  formData: FormData
): Promise<CadastroFormState> {
  const validated = CadastroSchema.safeParse({
    nome: formData.get("nome"),
    email: formData.get("email"),
    cpf: formData.get("cpf"),
    matricula: formData.get("matricula") || undefined,
    telefone: formData.get("telefone") || undefined,
    idTipoUsuario: formData.get("idTipoUsuario"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { nome, email, cpf, matricula, telefone, idTipoUsuario, password } = validated.data

  const emailExistente = await prisma.usuario.findUnique({ where: { email } })
  if (emailExistente) {
    return { errors: { email: ["Este e-mail já está cadastrado."] } }
  }

  const cpfExistente = await prisma.usuario.findUnique({ where: { cpf } })
  if (cpfExistente) {
    return { errors: { cpf: ["Este CPF já está cadastrado."] } }
  }

  const senhaHash = await bcrypt.hash(password, 12)

  await prisma.usuario.create({
    data: { nome, email, cpf, matricula, telefone, idTipoUsuario, senhaHash },
  })

  redirect("/login?cadastro=ok")
}
