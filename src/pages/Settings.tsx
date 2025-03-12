
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Bell, Volume2, Vibrate, Trash2, LogOut, Info } from 'lucide-react';
import Layout from '../components/Layout';
import { Switch } from '@/components/ui/switch';
import { requestNotificationPermission } from '../utils/notifications';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    vibration: true
  });
  
  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    const messages = {
      notifications: `Notificaciones ${value ? 'activadas' : 'desactivadas'}`,
      sound: `Sonido ${value ? 'activado' : 'desactivado'}`,
      vibration: `Vibración ${value ? 'activada' : 'desactivada'}`
    };
    
    toast.success(messages[key]);
    
    // If enabling notifications, request permission
    if (key === 'notifications' && value) {
      requestNotificationPermission();
    }
  };
  
  const handleDeleteAccount = () => {
    toast.error(
      'Confirmar eliminación de cuenta',
      {
        action: {
          label: 'Eliminar',
          onClick: () => toast.info('Esta acción requiere integración con backend')
        }
      }
    );
  };
  
  const handleLogout = () => {
    toast.info('Cerrar sesión (No implementado)');
  };
  
  return (
    <Layout>
      <div className="space-y-8">
        <motion.h1 
          className="text-2xl font-semibold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Configuración
        </motion.h1>
        
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Notificaciones</h2>
            
            <div className="glass-panel rounded-lg divide-y divide-border">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Bell className="size-5 text-primary" />
                  <div>
                    <p className="font-medium">Notificaciones</p>
                    <p className="text-sm text-muted-foreground">Recibir alertas de Love Alarm</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.notifications}
                  onCheckedChange={(checked) => updateSetting('notifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Volume2 className="size-5 text-primary" />
                  <div>
                    <p className="font-medium">Sonido</p>
                    <p className="text-sm text-muted-foreground">Reproducir sonido con las alertas</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.sound}
                  onCheckedChange={(checked) => updateSetting('sound', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Vibrate className="size-5 text-primary" />
                  <div>
                    <p className="font-medium">Vibración</p>
                    <p className="text-sm text-muted-foreground">Vibrar el dispositivo con las alertas</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.vibration}
                  onCheckedChange={(checked) => updateSetting('vibration', checked)}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Cuenta</h2>
            
            <div className="glass-panel rounded-lg divide-y divide-border">
              <button 
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/20 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="size-5 text-primary" />
                <div>
                  <p className="font-medium">Cerrar sesión</p>
                  <p className="text-sm text-muted-foreground">Salir de la aplicación</p>
                </div>
              </button>
              
              <button 
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/20 transition-colors"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="size-5 text-destructive" />
                <div>
                  <p className="font-medium text-destructive">Eliminar cuenta</p>
                  <p className="text-sm text-muted-foreground">Eliminar permanentemente tu cuenta y datos</p>
                </div>
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Información</h2>
            
            <div className="glass-panel rounded-lg p-4 flex items-start gap-3">
              <Info className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Acerca de Love Alarm</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Love Alarm es una aplicación de geolocalización que te permite 
                  expresar sentimientos a personas cercanas. Esta es una versión de 
                  demostración inspirada en la serie del mismo nombre.
                </p>
                <p className="text-sm text-muted-foreground mt-2">Versión 1.0.0</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Settings;
