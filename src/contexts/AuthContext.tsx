
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ data: { user: User | null }, error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ data: { user: User | null; confirmationSent?: boolean }, error: Error | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data }) => {
      console.log("Initial session check:", data.session?.user?.email);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const signIn = async (email: string, password: string) => {
    console.log("Attempting sign in with:", email);
    const result = await supabase.auth.signInWithPassword({ email, password });
    console.log("Sign in result:", result.data.user?.email, result.error?.message);
    return result;
  };
  
  const signUp = async (email: string, password: string) => {
    console.log("Attempting sign up with:", email);
    const result = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: window.location.origin + '/login'
      }
    });
    
    console.log("Sign up result:", result.data.user?.email, result.error?.message);
    
    // Add a flag to indicate confirmation email was sent
    return {
      data: {
        ...result.data,
        confirmationSent: !result.error && result.data.user !== null
      },
      error: result.error
    };
  };
  
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
