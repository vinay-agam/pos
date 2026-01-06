'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { verifyShopPassword, hasShopPassword } from '@/lib/password';
import { Lock } from 'lucide-react';

interface PasswordGateProps {
  shopId: string;
  children: React.ReactNode;
}

const SESSION_KEY_PREFIX = 'pos_session_';

export function PasswordGate({ shopId, children }: PasswordGateProps) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if shop has password configured
    if (!hasShopPassword(shopId)) {
      // No password required, allow access
      setIsAuthenticated(true);
      setIsChecking(false);
      return;
    }

    // Check session storage for authentication
    if (typeof window !== 'undefined') {
      const sessionKey = `${SESSION_KEY_PREFIX}${shopId}`;
      const session = sessionStorage.getItem(sessionKey);
      
      if (session === 'authenticated') {
        setIsAuthenticated(true);
      }
    }
    
    setIsChecking(false);
  }, [shopId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    if (verifyShopPassword(shopId, password)) {
      // Store authentication in session storage
      if (typeof window !== 'undefined') {
        const sessionKey = `${SESSION_KEY_PREFIX}${shopId}`;
        sessionStorage.setItem(sessionKey, 'authenticated');
      }
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!hasShopPassword(shopId)) {
    // No password required
    return <>{children}</>;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Lock className="h-12 w-12 text-gray-400" />
          </div>
          <CardTitle className="text-2xl text-center">Shop Access</CardTitle>
          <CardDescription className="text-center">
            Enter password to access shop: <strong>{shopId}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoFocus
                className={error ? 'border-red-500' : ''}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">
              Access Shop
            </Button>
            <p className="text-xs text-center text-gray-500 mt-4">
              Password is stored in JavaScript code (visible in browser dev tools)
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

