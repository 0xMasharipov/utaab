import { useState } from 'react';
import { UserPlus, Mail, AlertTriangle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Applicant {
  id: string;
  full_name: string;
  email: string;
  department: string;
  status: string;
}

interface ApplicantConversionDialogProps {
  applicant: Applicant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const ApplicantConversionDialog = ({
  applicant,
  open,
  onOpenChange,
  onSuccess,
}: ApplicantConversionDialogProps) => {
  const [action, setAction] = useState<'invite' | 'create'>('invite');
  const [role, setRole] = useState<'student' | 'user'>('student');
  const [sendEmail, setSendEmail] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleConvert = async () => {
    if (!applicant) return;

    setIsLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in to perform this action.',
          variant: 'destructive',
        });
        return;
      }

      const response = await supabase.functions.invoke('convert-applicant-to-user', {
        body: {
          applicationId: applicant.id,
          action,
          role,
          sendEmail,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to convert applicant');
      }

      toast({
        title: 'Success',
        description: response.data.message,
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: unknown) {
      console.error('Conversion error:', error);
      toast({
        title: 'Conversion failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!applicant) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('community_applications')
        .update({ status: 'rejected' })
        .eq('id', applicant.id);

      if (error) throw error;

      toast({
        title: 'Application rejected',
        description: `${applicant.full_name}'s application has been rejected.`,
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: unknown) {
      console.error('Rejection error:', error);
      toast({
        title: 'Rejection failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!applicant) return null;

  const isAlreadyProcessed = applicant.status !== 'pending';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Convert Applicant to User
          </DialogTitle>
          <DialogDescription>
            Convert <strong>{applicant.full_name}</strong> ({applicant.email}) to an education platform user.
          </DialogDescription>
        </DialogHeader>

        {isAlreadyProcessed ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This application has already been processed (status: {applicant.status}).
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6 py-4">
            {/* Action Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Conversion Method</Label>
              <RadioGroup
                value={action}
                onValueChange={(value) => setAction(value as 'invite' | 'create')}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                  <RadioGroupItem value="invite" id="invite" className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor="invite" className="font-medium cursor-pointer">
                      Send Invitation
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      User receives an email invitation to complete their registration.
                    </p>
                  </div>
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                  <RadioGroupItem value="create" id="create" className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor="create" className="font-medium cursor-pointer">
                      Auto-Create Account
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Account is created immediately. User receives password reset link.
                    </p>
                  </div>
                  <UserPlus className="h-5 w-5 text-muted-foreground" />
                </div>
              </RadioGroup>
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Assign Role</Label>
              <RadioGroup
                value={role}
                onValueChange={(value) => setRole(value as 'student' | 'user')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student" className="cursor-pointer">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="user" />
                  <Label htmlFor="user" className="cursor-pointer">User</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Email Notification */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendEmail"
                checked={sendEmail}
                onCheckedChange={(checked) => setSendEmail(checked === true)}
              />
              <Label htmlFor="sendEmail" className="cursor-pointer">
                Send email notification to user
              </Label>
            </div>

            {/* Security Warning for Auto-Create */}
            {action === 'create' && (
              <Alert className="border-amber-500/50 bg-amber-500/10">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-200">
                  Auto-create will generate a temporary password. The user must reset their password on first login.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter className="flex gap-2 sm:gap-0">
          {!isAlreadyProcessed && (
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isLoading}
              className="mr-auto"
            >
              Reject
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          {!isAlreadyProcessed && (
            <Button onClick={handleConvert} disabled={isLoading} className="btn-primary">
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {action === 'invite' ? 'Send Invite' : 'Create Account'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
