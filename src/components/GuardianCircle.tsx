import { useState } from 'react';
import { useTrustedContacts, TrustedContact, ContactInput } from '@/hooks/useTrustedContacts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Plus,
  Phone,
  User,
  Heart,
  Edit2,
  Trash2,
  CheckCircle2,
  MessageSquare,
  Loader2,
  Map
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const GuardianCircle = () => {
  const { contacts, isLoading, addContact, updateContact, deleteContact } = useTrustedContacts();
  const { toast } = useToast();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<TrustedContact | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<ContactInput>({
    name: '',
    phone_number: '',
    relationship: '',
  });

  const resetForm = () => {
    setFormData({ name: '', phone_number: '', relationship: '' });
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.phone_number) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in name and phone number.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    const success = await addContact(formData);
    if (success) {
      setIsAddOpen(false);
      resetForm();
    }
    setIsSubmitting(false);
  };

  const handleEdit = async () => {
    if (!editingContact) return;

    setIsSubmitting(true);
    const success = await updateContact(editingContact.id, formData);
    if (success) {
      setEditingContact(null);
      resetForm();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;

    setIsSubmitting(true);
    await deleteContact(deleteConfirmId);
    setDeleteConfirmId(null);
    setIsSubmitting(false);
  };

  const openEditDialog = (contact: TrustedContact) => {
    setFormData({
      name: contact.name,
      phone_number: contact.phone_number,
      relationship: contact.relationship || '',
    });
    setEditingContact(contact);
  };

  const handleTestSMS = (contact: TrustedContact) => {
    // Placeholder for SMS testing - will be implemented with Twilio
    toast({
      title: 'Test SMS',
      description: `SMS test would be sent to ${contact.name} at ${contact.phone_number}`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-emergency" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emergency/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-emergency" />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">Guardian Circle</CardTitle>
              <CardDescription className="text-muted-foreground">
                {contacts.length} emergency contact{contacts.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
          </div>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-emergency hover:bg-emergency/90 text-emergency-foreground">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Add Emergency Contact</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Add someone to your Guardian Circle who will be notified during emergencies.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Contact name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10 bg-muted border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Phone Number (E.164 format)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="+919876543210"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      className="pl-10 bg-muted border-border"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Include country code (e.g., +91 for India)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Relationship (optional)</Label>
                  <div className="relative">
                    <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="e.g., Parent, Friend, Spouse"
                      value={formData.relationship}
                      onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                      className="pl-10 bg-muted border-border"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAdd}
                  className="w-full bg-emergency hover:bg-emergency/90 text-emergency-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Add Contact
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className="space-y-3">
          {contacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No emergency contacts yet</p>
              <p className="text-sm">Add people who should be notified during emergencies</p>
            </div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                    <User className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{contact.name}</p>
                      {contact.is_verified && (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{contact.phone_number}</p>
                    {contact.relationship && (
                      <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 mr-3 pr-3 border-r border-border/50 hidden sm:flex">
                    <Map className="w-4 h-4 text-primary" />
                    <div className="flex flex-col">
                      <Label className="text-xs text-foreground cursor-pointer">Live Route</Label>
                    </div>
                    <Switch defaultChecked={true} className="scale-75" />
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => handleTestSMS(contact)}
                      title="Send Test SMS"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => openEditDialog(contact)}
                      title="Edit Contact"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteConfirmId(contact.id)}
                      title="Remove Contact"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingContact} onOpenChange={() => { setEditingContact(null); resetForm(); }}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Contact</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update emergency contact details.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-foreground">Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-muted border-border"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Phone Number</Label>
              <Input
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                className="bg-muted border-border"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Relationship</Label>
              <Input
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                className="bg-muted border-border"
              />
            </div>

            <Button
              onClick={handleEdit}
              className="w-full bg-emergency hover:bg-emergency/90 text-emergency-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Remove Contact</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This contact will no longer be notified during emergencies. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
