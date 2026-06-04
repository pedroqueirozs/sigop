"use server"
import { redirect } from "next/navigation"
import { z } from "zod"
import { put } from "@vercel/blob"
import { prisma } from "@/app/lib/db"
import { getSession } from "@/app/lib/session"

async function uploadFoto(file: File, objetoId: number): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg"
  const filename = `objetos/${objetoId}/${Date.now()}.${ext}`
  const blob = await put(filename, file, { access: "public" })
  return blob.url
}

const RegistroPerdaSchema = z.object({
  descricao:               z.string().min(5, { message: "Descreva o objeto com pelo menos 5 caracteres" }).trim(),
  idCategoria:             z.coerce.number({ message: "Selecione uma categoria" }).min(1),
  idLocal:                 z.coerce.number({ message: "Selecione o local" }).min(1),
  marca:                   z.string().trim().optional(),
  cor:                     z.string().trim().optional(),
  dataPerda:               z.string().min(1, { message: "Informe a data da perda" }),
  horaPerda:               z.string().optional(),
  descricaoCircunstancias: z.string().trim().optional(),
  observacoes:             z.string().trim().optional(),
})

const RegistroEncontradoSchema = z.object({
  descricao:               z.string().min(5, { message: "Descreva o objeto com pelo menos 5 caracteres" }).trim(),
  idCategoria:             z.coerce.number({ message: "Selecione uma categoria" }).min(1),
  idLocal:                 z.coerce.number({ message: "Selecione o local" }).min(1),
  marca:                   z.string().trim().optional(),
  cor:                     z.string().trim().optional(),
  dataEncontrado:          z.string().min(1, { message: "Informe a data" }),
  horaEncontrado:          z.string().optional(),
  localGuarda:             z.string().trim().optional(),
  descricaoCircunstancias: z.string().trim().optional(),
  observacoes:             z.string().trim().optional(),
})

export type RegistroPerdaState =
  | { errors?: Partial<Record<keyof z.infer<typeof RegistroPerdaSchema>, string[]>>; message?: string }
  | undefined

export type RegistroEncontradoState =
  | { errors?: Partial<Record<keyof z.infer<typeof RegistroEncontradoSchema>, string[]>>; message?: string }
  | undefined

export async function registrarPerda(
  state: RegistroPerdaState,
  formData: FormData
): Promise<RegistroPerdaState> {
  const session = await getSession()
  if (!session) redirect("/login")

  const validated = RegistroPerdaSchema.safeParse({
    descricao:               formData.get("descricao"),
    idCategoria:             formData.get("idCategoria"),
    idLocal:                 formData.get("idLocal"),
    marca:                   formData.get("marca") || undefined,
    cor:                     formData.get("cor") || undefined,
    dataPerda:               formData.get("dataPerda"),
    horaPerda:               formData.get("horaPerda") || undefined,
    descricaoCircunstancias: formData.get("descricaoCircunstancias") || undefined,
    observacoes:             formData.get("observacoes") || undefined,
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { descricao, idCategoria, idLocal, marca, cor, dataPerda, horaPerda, descricaoCircunstancias, observacoes } = validated.data

  const objeto = await prisma.objeto.create({
    data: {
      descricao,
      idCategoria,
      marca,
      cor,
      status: "PERDIDO",
      observacoes,
    },
  })

  await prisma.registroPerda.create({
    data: {
      idObjeto:                objeto.id,
      idUsuario:               session.userId,
      idLocal,
      dataPerda:               new Date(dataPerda),
      horaPerda:               horaPerda || null,
      descricaoCircunstancias: descricaoCircunstancias || null,
    },
  })

  await prisma.historicoMovimentacao.create({
    data: {
      idObjeto:      objeto.id,
      idUsuario:     session.userId,
      statusAnterior: null,
      statusNovo:    "PERDIDO",
      acao:          "Registro de perda",
      detalhes:      descricaoCircunstancias || null,
    },
  })

  redirect(`/objetos/${objeto.id}`)
}

export async function registrarEncontrado(
  state: RegistroEncontradoState,
  formData: FormData
): Promise<RegistroEncontradoState> {
  const session = await getSession()
  if (!session) redirect("/login")

  const validated = RegistroEncontradoSchema.safeParse({
    descricao:               formData.get("descricao"),
    idCategoria:             formData.get("idCategoria"),
    idLocal:                 formData.get("idLocal"),
    marca:                   formData.get("marca") || undefined,
    cor:                     formData.get("cor") || undefined,
    dataEncontrado:          formData.get("dataEncontrado"),
    horaEncontrado:          formData.get("horaEncontrado") || undefined,
    localGuarda:             formData.get("localGuarda") || undefined,
    descricaoCircunstancias: formData.get("descricaoCircunstancias") || undefined,
    observacoes:             formData.get("observacoes") || undefined,
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { descricao, idCategoria, idLocal, marca, cor, dataEncontrado, horaEncontrado, localGuarda, descricaoCircunstancias, observacoes } = validated.data

  const objeto = await prisma.objeto.create({
    data: {
      descricao,
      idCategoria,
      marca,
      cor,
      status: "ENCONTRADO",
      observacoes,
    },
  })

  await prisma.registroEncontrado.create({
    data: {
      idObjeto:                objeto.id,
      idUsuario:               session.userId,
      idLocal,
      dataEncontrado:          new Date(dataEncontrado),
      horaEncontrado:          horaEncontrado || null,
      localGuarda:             localGuarda || null,
      descricaoCircunstancias: descricaoCircunstancias || null,
    },
  })

  await prisma.historicoMovimentacao.create({
    data: {
      idObjeto:      objeto.id,
      idUsuario:     session.userId,
      statusAnterior: null,
      statusNovo:    "ENCONTRADO",
      acao:          "Objeto encontrado registrado",
      detalhes:      descricaoCircunstancias || null,
    },
  })

  // Upload de fotos (se houver token configurado)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const fotos = formData.getAll("fotos") as File[]
    const fotosValidas = fotos.filter((f) => f instanceof File && f.size > 0)

    for (let i = 0; i < fotosValidas.length; i++) {
      const foto = fotosValidas[i]
      const url = await uploadFoto(foto, objeto.id)
      await prisma.fotoObjeto.create({
        data: {
          idObjeto:     objeto.id,
          idUsuario:    session.userId,
          urlFoto:      url,
          nomeArquivo:  foto.name,
          tamanhoBytes: foto.size,
          isPrincipal:  i === 0,
        },
      })
    }
  }

  redirect(`/objetos/${objeto.id}`)
}
