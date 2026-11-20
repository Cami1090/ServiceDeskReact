import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContext } from './useAuth';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined);
  const [resultadoPerfil, setResultadoPerfil] = useState(null);
  const userId = session?.user?.id;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_evento, nuevaSesion) => setSession(nuevaSesion)
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;
    let vigente = true;
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
      .then(({ data }) => {
        if (vigente) setResultadoPerfil({ id: userId, data });
      })
      .catch(() => {
        if (vigente) setResultadoPerfil({ id: userId, data: null });
      });
    return () => { vigente = false; };
  }, [userId]);

  const perfil = userId && resultadoPerfil?.id === userId ? resultadoPerfil.data : null;
  const cargando = session === undefined || (Boolean(userId) && resultadoPerfil?.id !== userId);

  async function entrar() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/acceso' },
    });
    if (error) throw error;
  }

  async function salir() {
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) throw error;
  }

  const sesionVista = session ? { user: session.user } : session;

  return (
    <AuthContext.Provider value={{ session: sesionVista, perfil, cargando, entrar, salir }}>
      {children}
    </AuthContext.Provider>
  );
}