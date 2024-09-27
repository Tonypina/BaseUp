import { useContext, createContext, type PropsWithChildren, useEffect } from 'react';
import { useStorageState } from '../hooks/useStorageState';
import axios from 'axios';
import * as Linking from 'expo-linking'; // Para manejar el deep linking

const AuthContext = createContext<{
  signIn: (email: string, pass: string) => Promise<{success: boolean, message: string}>;
  signOut: (token: string) => void;
  register: (name: string, email: string, pass: string, c_pass: string) => Promise<{success: boolean, message: {}}>;
  deleteAccount: (token: string) => Promise<void>;
  updateAccount: (name: string, email: string, token: string) => Promise<boolean>;
  session?: any | null;
  isLoading: boolean;
}>({
  signIn: async () => ({success: false, message: ""}),
  signOut: () => null,
  register: async () => ({success: false, message: {}}),
  deleteAccount: async () => {},
  updateAccount: async () => false,
  session: null,
  isLoading: false,
});

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  let isAuthenticated = false;
  let message = "";

  // Manejar el deep link para obtener el token
  const handleRedirect = async (event: { url: string }) => {
    const url = event.url;
    const token = new URLSearchParams(url.split('?')[1]).get('token');
    
    if (token) {
      // Guardamos el token en el estado de sesión
      setSession(JSON.stringify({ token }));
      isAuthenticated = true;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: async (email, pass) => {
          await axios({
            method: 'post',
            url: process.env.EXPO_PUBLIC_API_URL + 'login',
            data: {
              email: email,
              password: pass,
            },
          })
            .then(async (res) => {
              setSession(JSON.stringify(res.data.data));
              isAuthenticated = true;
              message = res.data.message
            })
            .catch(async (err) => {
              
              setSession(null);
              isAuthenticated = false;
              message = err.response.data.message;
            });
            
            return {success: isAuthenticated, message: message};
          },

        signOut: async (token) => {
          await axios({
            method: 'post',
            url: process.env.EXPO_PUBLIC_API_URL + 'logout',
            headers: {
              Authorization: 'Bearer ' + token,
            },
          });

          setSession(null);
        },

        register: async (name, email, pass, c_pass) => {
          let message_object = {
            name: "",
            email: "",
            password: "",
            c_password: "",
            message: ""
          };

          await axios({
            method: 'post',
            url: process.env.EXPO_PUBLIC_API_URL + 'register',
            data: {
              name: name,
              email: email,
              password: pass,
              c_password: c_pass,
            },
          })
            .then(async (res) => {
              setSession(JSON.stringify(res.data.data));
              isAuthenticated = true;
              message_object.message = res.data.message;
            })
            .catch(async (err) => {
              setSession(null);
              isAuthenticated = false;
              
              Object.keys(err.response.data.data).forEach(key => {
                message_object[key] = err.response.data.data[key][0];
              })
            });

            return {success: isAuthenticated, message: message_object};

        },

        deleteAccount: async (token) => {
          await axios({
            method: 'delete',
            url: process.env.EXPO_PUBLIC_API_URL + 'user',
            headers: {
              Authorization: 'Bearer ' + token,
            },
          })
            .then(() => {
              setSession(null); // Eliminar la sesión del usuario localmente después de eliminar la cuenta
            })
            .catch((err) => {
              console.error('Error eliminando la cuenta:', err);
            });
        },

        updateAccount: async (name, email, token) => {
          try {
            const response = await axios.put(
              process.env.EXPO_PUBLIC_API_URL + 'user',
              { name, email },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response.status === 200) {
              const updatedUser = response.data;              

              // Actualiza los datos del usuario en la sesión
              const updatedSession = {
                ...JSON.parse(session),
                name: updatedUser.user.name,
                email: updatedUser.user.email,
              };

              setSession(JSON.stringify(updatedSession));

              return true;
            }

            return false;
          } catch (error) {
            console.error('Error updating account:', error);
            return false;
          }
        },

        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
