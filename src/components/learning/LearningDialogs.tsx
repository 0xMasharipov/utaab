import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Award, LogIn, UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SignInToSaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SignInToSaveDialog = ({ open, onOpenChange }: SignInToSaveDialogProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = `${location.pathname}${location.search}`;

  const go = (path: string) => {
    navigate(`${path}?redirect=${encodeURIComponent(returnTo)}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-montserrat flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            {t('education.mitOcw.gateTitle')}
          </DialogTitle>
          <DialogDescription className="font-montserrat">
            {t('education.mitOcw.gateBody')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="font-montserrat">
            {t('education.mitOcw.gateContinue')}
          </Button>
          <Button variant="outline" onClick={() => go('/education/sign-in')} className="font-montserrat gap-2">
            <LogIn className="h-4 w-4" />
            {t('education.mitOcw.gateSignIn')}
          </Button>
          <Button onClick={() => go('/education/register')} className="font-montserrat gap-2">
            <UserPlus className="h-4 w-4" />
            {t('education.mitOcw.gateRegister')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface CourseCompletedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CourseCompletedDialog = ({ open, onOpenChange }: CourseCompletedDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-montserrat flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-400" />
            {t('education.mitOcw.completedTitle')}
          </DialogTitle>
          <DialogDescription className="font-montserrat">
            {t('education.mitOcw.completedBody')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="font-montserrat">
            {t('education.mitOcw.completedClose')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
