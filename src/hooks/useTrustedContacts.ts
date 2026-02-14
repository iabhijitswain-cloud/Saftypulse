import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface TrustedContact {
  id: string;
  name: string;
  phone_number: string;
  relationship: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactInput {
  name: string;
  phone_number: string;
  relationship?: string;
}

// E.164 phone number validation
const isValidE164 = (phone: string): boolean => {
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone);
};

export const useTrustedContacts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch contacts
  const fetchContacts = useCallback(async () => {
    if (!user) {
      setContacts([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('trusted_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load trusted contacts.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Add contact
  const addContact = async (input: ContactInput): Promise<boolean> => {
    if (!user) return false;

    // Validate E.164 format
    if (!isValidE164(input.phone_number)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please use E.164 format (e.g., +1234567890)',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('trusted_contacts')
        .insert({
          user_id: user.id,
          name: input.name.trim(),
          phone_number: input.phone_number,
          relationship: input.relationship?.trim() || null,
        })
        .select()
        .single();

      if (error) throw error;

      setContacts((prev) => [...prev, data]);
      toast({
        title: 'Contact Added',
        description: `${input.name} has been added to your Guardian Circle.`,
      });
      return true;
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: 'Error',
        description: 'Failed to add contact.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Update contact
  const updateContact = async (id: string, input: Partial<ContactInput>): Promise<boolean> => {
    if (!user) return false;

    // Validate E.164 format if phone is being updated
    if (input.phone_number && !isValidE164(input.phone_number)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please use E.164 format (e.g., +1234567890)',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('trusted_contacts')
        .update({
          ...(input.name && { name: input.name.trim() }),
          ...(input.phone_number && { phone_number: input.phone_number }),
          ...(input.relationship !== undefined && { relationship: input.relationship?.trim() || null }),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setContacts((prev) => prev.map((c) => (c.id === id ? data : c)));
      toast({
        title: 'Contact Updated',
        description: 'Contact details have been updated.',
      });
      return true;
    } catch (error) {
      console.error('Error updating contact:', error);
      toast({
        title: 'Error',
        description: 'Failed to update contact.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Delete contact
  const deleteContact = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('trusted_contacts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setContacts((prev) => prev.filter((c) => c.id !== id));
      toast({
        title: 'Contact Removed',
        description: 'Contact has been removed from your Guardian Circle.',
      });
      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove contact.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    contacts,
    isLoading,
    addContact,
    updateContact,
    deleteContact,
    refetch: fetchContacts,
  };
};
