
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Shield, Mail, Lock, Loader2, UserPlus, LogIn, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase!.auth.signUp({ email, password });
        if (error) throw error;
        alert("Registro exitoso. Revisa tu correo para confirmar la cuenta (si es necesario) o intenta iniciar sesión.");
        setIsSignUp(false);
      } else {
        const { error } = await supabase!.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || "Error en la operación táctica");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-titan-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-block p-4 bg-titan-dark rounded-3xl border-2 border-titan-accent/20 mb-4 shadow-2xl shadow-blue-900/20">
            <Shield size={48} className="text-titan-accent" />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">TITAN<span className="text-titan-accent">CORE</span></h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.5em]">Terminal de Identificación</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-titan-accent transition-colors" size={18} />
              <input 
                type="email" 
                placeholder="CORREO ELECTRÓNICO" 
                required
                className="w-full bg-titan-dark border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-sm font-bold uppercase tracking-wider focus:outline-none focus:border-titan-accent transition-all placeholder:text-zinc-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-titan-accent transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="CONTRASEÑA" 
                required
                className="w-full bg-titan-dark border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-sm font-bold uppercase tracking-wider focus:outline-none focus:border-titan-accent transition-all placeholder:text-zinc-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-500 text-[10px] font-bold uppercase tracking-widest animate-in slide-in-from-top-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-titan-accent text-white py-4 rounded-xl font-black italic uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : isSignUp ? (
              <><UserPlus size={20} /> Registrar Operador</>
            ) : (
              <><LogIn size={20} /> Acceder al Núcleo</>
            )}
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-titan-accent transition-colors"
          >
            {isSignUp ? "¿Ya tienes una cuenta? Inicia Sesión" : "¿Nuevo operador? Crea una cuenta táctica"}
          </button>
        </div>
      </div>

      <div className="fixed bottom-8 text-[8px] font-bold text-zinc-800 uppercase tracking-[0.4em]">
        Conexión Encriptada de Grado Militar
      </div>
    </div>
  );
};

export default Login;
