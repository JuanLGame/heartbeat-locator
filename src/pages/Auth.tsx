
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { toast } from 'sonner';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, complete todos los campos');
      return;
    }
    
    const { error } = isLogin 
      ? await signIn(email, password)
      : await signUp(email, password);
    
    if (error) {
      toast.error(error.message);
    } else if (!isLogin) {
      toast.success('Cuenta creada exitosamente');
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-md mx-auto mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-8 rounded-xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded bg-background border"
                placeholder="tu@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded bg-background border"
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-alarm text-white py-2 rounded-lg hover:bg-alarm/90 transition-colors"
            >
              {isLogin ? 'Entrar' : 'Registrarse'}
            </button>
          </form>
          
          <div className="text-center mt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Auth;
