import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Mail, Lock, User, Loader2, UserPlus, Eye, EyeOff, Facebook, Chrome, Smartphone, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { loginSchema, signupSchema } from '@/lib/validations';
import { z } from 'zod';

const Auth = () => {
  const { user, isLoading, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Signup State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emergency" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/app" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    if (!parsed.success) {
      toast({
        title: 'Validation Error',
        description: parsed.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(parsed.data.email, parsed.data.password);

    if (error) {
      toast({
        title: 'Sign in failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
    }

    setIsSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupPassword !== confirmPassword) {
      toast({
        title: 'Validation Error',
        description: "Passwords do not match.",
        variant: 'destructive',
      });
      return;
    }

    const parsed = signupSchema.safeParse({ email: signupEmail, password: signupPassword, displayName: signupName || undefined });
    if (!parsed.success) {
      toast({
        title: 'Validation Error',
        description: parsed.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    const { data, error } = await signUp(parsed.data.email, parsed.data.password, parsed.data.displayName);

    if (error) {
      toast({
        title: 'Sign up failed',
        description: error.message,
        variant: 'destructive',
      });
    } else if (data?.session) {
      toast({
        title: 'Account created!',
        description: 'You have been successfully signed in.',
      });
    } else {
      toast({
        title: 'Account created!',
        description: 'Please check your email to verify your account.',
      });
    }

    setIsSubmitting(false);
  };



  const SocialButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
    <Button variant="outline" className="w-full flex items-center justify-center gap-2 h-11 hover:bg-muted transition-colors rounded-xl" onClick={onClick}>
      <Icon className="w-5 h-5" />
      <span className="sr-only sm:not-sr-only sm:inline-block">{label}</span>
      <span className="sm:hidden">{label.split(' ')[0]}</span>
    </Button>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emergency/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      {/* Back Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 z-50 text-muted-foreground hover:text-foreground"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-6 h-6" />
      </Button>

      <Tabs defaultValue="signin" className="w-full max-w-[480px]">
        <div className="flex flex-col items-center mb-8 space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emergency to-red-600 flex items-center justify-center shadow-lg shadow-emergency/20 mb-2">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-center">SafetyPulse</h1>
          <p className="text-muted-foreground text-center text-sm max-w-xs">
            Your personal safety network. Stay connected, stay safe.
          </p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="pb-0">
            <TabsList className="grid w-full grid-cols-2 h-12 rounded-xl bg-muted/50 p-1">
              <TabsTrigger value="signin" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all text-sm font-medium">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all text-sm font-medium">
                Create Account
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="pt-6 pb-6 px-6 sm:px-8">
            <TabsContent value="signin" className="mt-0 space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      className="pl-9 h-11 bg-muted/30 border-border/50 focus:border-emergency/50 focus:ring-emergency/20 rounded-xl transition-all"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-xs font-medium text-emergency hover:text-emergency/80 hover:underline transition-colors">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-9 pr-9 h-11 bg-muted/30 border-border/50 focus:border-emergency/50 focus:ring-emergency/20 rounded-xl transition-all"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    className="border-muted-foreground/30 data-[state=checked]:bg-emergency data-[state=checked]:border-emergency rounded-[4px]"
                  />
                  <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer select-none">Remember me for 30 days</Label>
                </div>
              </div>

              <Button
                onClick={handleSignIn}
                disabled={isSubmitting}
                className="w-full h-11 bg-emergency hover:bg-emergency/90 text-white shadow-lg shadow-emergency/20 rounded-xl font-medium transition-all active:scale-[0.98]"
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign In
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="mt-0 space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                    <Input
                      id="signup-name"
                      placeholder="John Doe"
                      className="pl-9 h-11 bg-muted/30 border-border/50 focus:border-emergency/50 focus:ring-emergency/20 rounded-xl transition-all"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                    <Input
                      id="signup-email"
                      placeholder="name@example.com"
                      className="pl-9 h-11 bg-muted/30 border-border/50 focus:border-emergency/50 focus:ring-emergency/20 rounded-xl transition-all"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="pl-9 pr-9 h-11 bg-muted/30 border-border/50 focus:border-emergency/50 focus:ring-emergency/20 rounded-xl transition-all"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-9 pr-9 h-11 bg-muted/30 border-border/50 focus:border-emergency/50 focus:ring-emergency/20 rounded-xl transition-all"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSignUp}
                disabled={isSubmitting}
                className="w-full h-11 bg-emergency hover:bg-emergency/90 text-white shadow-lg shadow-emergency/20 rounded-xl font-medium transition-all active:scale-[0.98]"
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Account
              </Button>
            </TabsContent>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background/95 backdrop-blur-sm px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <SocialButton icon={Chrome} label="Google" onClick={() => { }} />
                <SocialButton icon={Smartphone} label="Apple" onClick={() => { }} />
                <SocialButton icon={Facebook} label="Facebook" onClick={() => { }} />
              </div>


            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-8">
          By clicking continue, you agree to our <a href="#" className="underline hover:text-foreground">Terms of Service</a> and <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
        </p>
      </Tabs>
    </div>
  );
};

export default Auth;
