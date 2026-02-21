import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Loader2, Save } from 'lucide-react';

export const ProfileSettings = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('phone_number')
                    .eq('id', user.id)
                    .single();

                if (data?.phone_number) {
                    setPhoneNumber(data.phone_number);
                }
            } catch (err) {
                console.error('Failed to load profile settings');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ phone_number: phoneNumber })
                .eq('id', user.id);

            if (error) throw error;

            toast({
                title: 'Profile Updated',
                description: 'Your phone number has been saved.',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to save your phone number.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="text-lg text-foreground flex items-center gap-2">
                    <Phone className="w-5 h-5 text-emergency" />
                    Personal Details
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Your personal phone will be used as the sender origin context for your trusted contacts.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center p-4">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label className="text-foreground">Your Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="+919876543210"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="pl-10 bg-muted border-border"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Ensure this is correct so your trusted Guardian Circle knows exactly who is texting them natively.
                            </p>
                        </div>

                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full bg-emergency hover:bg-emergency/90 text-emergency-foreground"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Phone Number
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
