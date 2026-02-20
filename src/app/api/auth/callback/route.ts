import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  console.log("entro")
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // next indica la URL a la que redirigir después de la autenticación
  const next = searchParams.get('next') ?? '/login'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Redirige al usuario a la página deseada después de la autenticación exitosa
      return NextResponse.redirect(`${origin}${next}`)
    }
  }
  // Redirige a la página de error si algo sale mal
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}