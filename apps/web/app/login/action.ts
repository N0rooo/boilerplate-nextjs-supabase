'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createAppServerClient } from '../../utils/supabase/server'
import { loginSchema } from '../../utils/zod/schema'

export async function login(formData: FormData) {
  const supabase = await createAppServerClient()

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  if (!data.email || !data.password) {
    redirect('/error')
  }

  const result = loginSchema.safeParse(data)

  if (!result.success) {
    redirect('/error')
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  })

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}

export async function signup(formData: FormData) {
  const supabase = await createAppServerClient()

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  if (!data.email || !data.password) {
    redirect('/error')
  }

  const result = loginSchema.safeParse(data)

  if (!result.success) {
    redirect('/error')
  }

  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
  })

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}