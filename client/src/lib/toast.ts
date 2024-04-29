import { toast } from 'react-hot-toast';

type TSeverity = 'success' | 'error' | 'loading';
export const toaster = (severity: TSeverity, message: string) => {
  toast[severity](message, {
    duration: 3000,
    position: 'top-center',
  });
};
