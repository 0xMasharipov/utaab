import { useState, useEffect } from 'react';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Role definitions with descriptions
const ROLE_CONFIG = [
  { 
    value: 'admin', 
    label: 'Admin', 
    description: 'Full platform access and management',
    dangerous: true 
  },
  { 
    value: 'moderator', 
    label: 'Moderator', 
    description: 'Content moderation and user management',
    dangerous: false 
  },
  { 
    value: 'instructor', 
    label: 'Instructor', 
    description: 'Can create and manage courses',
    dangerous: false 
  },
  { 
    value: 'community_admin', 
    label: 'Community Admin', 
    description: 'Manage assigned communities',
    dangerous: false 
  },
  { 
    value: 'student', 
    label: 'Student', 
    description: 'Standard learner access',
    dangerous: false 
  },
  { 
    value: 'user', 
    label: 'User', 
    description: 'Basic platform access',
    dangerous: false 
  },
] as const;

type AppRole = typeof ROLE_CONFIG[number]['value'];

interface UserRole {
  role: string;
}

interface RoleManagementDialogProps {
  user: {
    id: string;
    user_id: string;
    full_name: string;
    user_roles?: UserRole[];
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleUpdated: () => void;
}

export function RoleManagementDialog({
  user,
  open,
  onOpenChange,
  onRoleUpdated,
}: RoleManagementDialogProps) {
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  const [originalRoles, setOriginalRoles] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminWarning, setShowAdminWarning] = useState(false);

  // Initialize roles when user changes
  useEffect(() => {
    if (user?.user_roles) {
      const roles = new Set(user.user_roles.map(r => r.role));
      setSelectedRoles(roles);
      setOriginalRoles(roles);
    } else {
      setSelectedRoles(new Set());
      setOriginalRoles(new Set());
    }
    setShowAdminWarning(false);
  }, [user]);

  const handleRoleToggle = (role: string, checked: boolean) => {
    const newRoles = new Set(selectedRoles);
    
    if (checked) {
      newRoles.add(role);
      // Show warning when adding admin role
      if (role === 'admin') {
        setShowAdminWarning(true);
      }
    } else {
      newRoles.delete(role);
      if (role === 'admin') {
        setShowAdminWarning(false);
      }
    }
    
    setSelectedRoles(newRoles);
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Determine roles to add and remove
      const rolesToAdd = [...selectedRoles].filter(r => !originalRoles.has(r));
      const rolesToRemove = [...originalRoles].filter(r => !selectedRoles.has(r));
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Session expired. Please login again.');
        return;
      }

      // Process role changes
      const changes: Promise<Response>[] = [];
      
      for (const role of rolesToAdd) {
        changes.push(
          fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-user-role`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              targetUserId: user.user_id,
              role,
              action: 'add',
            }),
          })
        );
      }
      
      for (const role of rolesToRemove) {
        changes.push(
          fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-user-role`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              targetUserId: user.user_id,
              role,
              action: 'remove',
            }),
          })
        );
      }
      
      const results = await Promise.all(changes);
      
      // Check for errors
      let hasError = false;
      for (const response of results) {
        const data = await response.json();
        if (!data.success) {
          toast.error(data.message);
          hasError = true;
        }
      }
      
      if (!hasError) {
        toast.success('Roles updated successfully');
        onRoleUpdated();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error updating roles:', error);
      toast.error('Failed to update roles');
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = () => {
    if (selectedRoles.size !== originalRoles.size) return true;
    return [...selectedRoles].some(r => !originalRoles.has(r));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-strong">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Manage Roles
          </DialogTitle>
          <DialogDescription>
            Update roles for <span className="font-semibold">{user?.full_name}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {showAdminWarning && (
            <Alert variant="destructive" className="border-amber-500/50 bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-200">
                Admin role grants full platform access. This action will be logged.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-3">
            {ROLE_CONFIG.map((role) => (
              <div 
                key={role.value} 
                className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                  selectedRoles.has(role.value) 
                    ? 'border-primary/50 bg-primary/10' 
                    : 'border-border/50 hover:border-border'
                }`}
              >
                <Checkbox
                  id={role.value}
                  checked={selectedRoles.has(role.value)}
                  onCheckedChange={(checked) => handleRoleToggle(role.value, !!checked)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <Label 
                    htmlFor={role.value} 
                    className={`text-sm font-medium cursor-pointer ${
                      role.dangerous ? 'text-amber-400' : ''
                    }`}
                  >
                    {role.label}
                    {role.dangerous && (
                      <AlertTriangle className="inline h-3 w-3 ml-1" />
                    )}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {role.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading || !hasChanges()}
            className="btn-primary"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
