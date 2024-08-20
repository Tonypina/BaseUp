import { useContext, createContext, type PropsWithChildren, useState, ReactNode } from 'react';
import { useStorageState } from '../hooks/useStorageState';
import axios from 'axios';

const AuthContext = createContext<{
  signIn: (email: string, pass: string) => Promise<boolean>;
  signOut: (token: string) => void;
  register: (name: string, email: string, pass: string, c_pass: string) => Promise<boolean>;
  session?: any | null;
  isLoading: boolean;
}>({
  signIn: async () => false,
  signOut: () => null,
  register: async () => false,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
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

  // const [isAuthenticated, setIsAutheticated] = useState(false);
  let isAuthenticated = false


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
            }
          }).then(async res => {
                       
            setSession(JSON.stringify(res.data.data));
            isAuthenticated = true
            
          }).catch(async err => {
            
            setSession(null);
            isAuthenticated = false
          })

          return isAuthenticated
          
        },
        
        signOut: async ( token ) => {
          await axios({
            method: 'post',
            url: process.env.EXPO_PUBLIC_API_URL + 'logout',
            headers: {
              Authorization: 'Bearer ' + token
            }
          })
          
          setSession(null);
        },

        register: async (name, email, pass, c_pass) => {
          
          await axios({
            method: 'post',
            url: process.env.EXPO_PUBLIC_API_URL + 'register',
            data: {
              name: name,
              email: email,
              password: pass,
              c_password: c_pass,
            }
          }).then(async res => {
            
            setSession(JSON.stringify(res.data.data));
            isAuthenticated = true

          }).catch(async err => {
            
            setSession(null);
            isAuthenticated = false            
          })
          
          return isAuthenticated
        },

        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

interface SidebarContextType {
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const openSidebar = () => setIsSidebarOpen(true)
  const closeSidebar = () => setIsSidebarOpen(false)
  const toggleSidebar = () => setIsSidebarOpen(prevState => !prevState)

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, openSidebar, closeSidebar, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};