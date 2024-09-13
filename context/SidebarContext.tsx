import { useContext, createContext, useState, ReactNode } from 'react';

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