import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthModalsProps {
  isLoginOpen: boolean;
  isSignupOpen: boolean;
  isTagSelectionOpen: boolean;
  onLoginClose: () => void;
  onSignupClose: () => void;
  onTagSelectionClose: () => void;
  onLoginSuccess: () => void;
}

const interestTags = [
  'Music', 'Comedy', 'Sports', 'Theater', 'Art', 'Food', 'Technology', 
  'Fashion', 'Photography', 'Dance', 'Literature', 'Film', 'Business'
];

export function AuthModals({
  isLoginOpen,
  isSignupOpen,
  isTagSelectionOpen,
  onLoginClose,
  onSignupClose,
  onTagSelectionClose,
  onLoginSuccess
}: AuthModalsProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    middleName: '',
    surname: '',
    familyName: '',
    phone: ''
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();

  const handleLogin = () => {
    // No validation for testing
    toast({
      title: 'Login Successful',
      description: 'Welcome back!',
    });
    onLoginSuccess();
    onLoginClose();
    setPhoneNumber('');
  };

  const handleSignup = () => {
    // No validation for testing
    toast({
      title: 'Account Created',
      description: 'Please select your interests',
    });
    onSignupClose();
    // Reset form
    setUserInfo({
      firstName: '',
      middleName: '',
      surname: '',
      familyName: '',
      phone: ''
    });
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleTagSelectionComplete = () => {
    toast({
      title: 'Preferences Saved',
      description: `Selected ${selectedTags.length} interests`,
    });
    onLoginSuccess();
    onTagSelectionClose();
    setSelectedTags([]);
  };

  return (
    <>
      {/* Login Modal */}
      <Dialog open={isLoginOpen} onOpenChange={onLoginClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Sign In</DialogTitle>
            <DialogDescription>
              Enter your phone number to sign in
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+20 123 456 7890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            
            <Button variant="gradient" className="w-full" onClick={handleLogin}>
              Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Signup Modal */}
      <Dialog open={isSignupOpen} onOpenChange={onSignupClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create Account</DialogTitle>
            <DialogDescription>
              Fill in your details to create an account
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={userInfo.firstName}
                onChange={(e) => setUserInfo(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                value={userInfo.middleName}
                onChange={(e) => setUserInfo(prev => ({ ...prev, middleName: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="surname">Surname</Label>
              <Input
                id="surname"
                value={userInfo.surname}
                onChange={(e) => setUserInfo(prev => ({ ...prev, surname: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="familyName">Family Name</Label>
              <Input
                id="familyName"
                value={userInfo.familyName}
                onChange={(e) => setUserInfo(prev => ({ ...prev, familyName: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="phoneSignup">Phone Number</Label>
              <Input
                id="phoneSignup"
                type="tel"
                placeholder="+20 123 456 7890"
                value={userInfo.phone}
                onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            
            <Button variant="gradient" className="w-full" onClick={handleSignup}>
              Create Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tag Selection Modal */}
      <Dialog open={isTagSelectionOpen} onOpenChange={onTagSelectionClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Choose Your Interests</DialogTitle>
            <DialogDescription>
              Select tags that match your interests to get personalized event recommendations
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {interestTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "secondary"}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedTags.includes(tag) 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-primary/20'
                  }`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="text-sm text-muted-foreground">
              Selected: {selectedTags.length} interests
            </div>
            
            <Button 
              variant="gradient" 
              className="w-full" 
              onClick={handleTagSelectionComplete}
              disabled={selectedTags.length === 0}
            >
              Save Preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}