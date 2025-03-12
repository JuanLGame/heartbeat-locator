
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Edit, CheckCheck } from 'lucide-react';
import Layout from '../components/Layout';

const Profile = () => {
  const [name, setName] = useState('Usuario');
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(name);
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      if (inputValue.trim() !== '') {
        setName(inputValue);
        toast.success('Nombre actualizado');
      } else {
        setInputValue(name);
        toast.error('El nombre no puede estar vacío');
      }
    }
    setIsEditing(!isEditing);
  };
  
  return (
    <Layout>
      <div className="space-y-8">
        <motion.div 
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div className="size-32 rounded-full bg-secondary flex items-center justify-center text-5xl font-bold text-muted-foreground">
              {name.charAt(0)}
            </div>
            <button 
              className="absolute bottom-0 right-0 size-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md"
              onClick={() => toast.info('Cambiar foto de perfil (No implementado)')}
            >
              <Edit className="size-5" />
            </button>
          </div>
          
          <div className="mt-6 flex items-center gap-2">
            {isEditing ? (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="text-2xl font-semibold text-center bg-transparent border-b border-primary focus:outline-none"
                autoFocus
              />
            ) : (
              <h2 className="text-2xl font-semibold">{name}</h2>
            )}
            <button 
              className="size-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
              onClick={handleEditToggle}
            >
              {isEditing ? (
                <CheckCheck className="size-5 text-primary" />
              ) : (
                <Edit className="size-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </motion.div>
        
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="text-lg font-medium">Estadísticas</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel rounded-lg p-4">
              <h4 className="text-sm text-muted-foreground">Alarmas activadas</h4>
              <p className="text-2xl font-semibold mt-1">0</p>
            </div>
            
            <div className="glass-panel rounded-lg p-4">
              <h4 className="text-sm text-muted-foreground">Matches</h4>
              <p className="text-2xl font-semibold mt-1">0</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Profile;
