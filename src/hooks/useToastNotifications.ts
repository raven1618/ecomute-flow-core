
import { useToast } from '@/hooks/use-toast';

export const useToastNotifications = () => {
  const { toast } = useToast();

  const notifySuccess = (message: string) => {
    toast({
      title: "Éxito",
      description: message,
    });
  };

  const notifyError = (error: string) => {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    });
  };

  return {
    notifySuccess,
    notifyError
  };
};
