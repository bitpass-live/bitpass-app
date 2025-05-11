// AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, type ReactNode, use } from 'react';
import { useRouter } from 'next/navigation';
import { Bitpass } from './bitpass-sdk/src'; //TODO: usar libreria real
import { AuthResponse, User } from './bitpass-sdk/src/types/user';
import { getEventHash, NostrEvent, UnsignedEvent } from 'nostr-tools';
import NDK, { NDKEvent, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk'

export type UserRole = 'OWNER' | 'MODERATOR' | 'CHECKIN';

type AuthMethods = 'email' | 'nostr' | 'none'

interface ExtendedUser extends User {
  authMethod: AuthMethods;
  loaded: boolean
}

const DEFAULT_USER: ExtendedUser = {
  id: '',
  authMethod: 'none',
  loaded: false
}

export interface AuthContextType {
  bitpassAPI: Bitpass;
  user: ExtendedUser;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loginWithNostrExtension: () => Promise<void>;
  loginWithPrivateKey: (privateKey: string) => Promise<void>;
  requestOTPCode: (email: string) => Promise<void>;
  verifyOTPCode: (email: string, code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExtendedUser>(DEFAULT_USER);
  const [bitpassAPI] = useState(new Bitpass({ baseUrl: 'https://api.bitpass.live' }));
  const router = useRouter();

  useEffect(() => {
    loadStoragedUser();
  }, []);

  const loadStoragedUser = async () => {
    const userToken = localStorage.getItem('bitpass_access_token');
    if (!userToken) {
      setUser((prev) => ({ ...prev, loaded: true }));
      return;
    }

    try {
      bitpassAPI.setToken(userToken)
      const user = await bitpassAPI.getUserProfile();
      login(user, userToken)
    } catch {
      setUser((prev) => ({ ...prev, loaded: true }));
      return;
    }
  }

  const login = (user: User, token: string) => {
    let authMethod: AuthMethods = 'none';

    if (user.email) authMethod = 'email';
    if (user.nostrPubKey) authMethod = 'nostr';

    localStorage.setItem('bitpass_access_token', token)
    setUser({
      ...user,
      authMethod,
      loaded: true
    });
  };

  const logout = () => {
    localStorage.removeItem('bitpass_access_token');
    setUser({ ...DEFAULT_USER, loaded: true })
    router.push('/');
  };

  const requestOTPCode = async (email: string) => {
    await bitpassAPI.requestOtp(email);
  };

  const verifyOTPCode = async (email: string, code: string) => {
    const response: AuthResponse = await bitpassAPI.verifyOtp(email, code);
    const { success, token, user } = response;
    if (!success) {
      throw new Error('Ocurrió un error al verificar el código ingresado');
    }

    login(user, token);
  };

  async function loginWithNostrExtension() {
    const nostr = window.nostr
    if (!nostr?.getPublicKey || !nostr.signEvent) {
      throw new Error('No se detectó ninguna extensión Nostr')
    }

    const pubkey = await nostr.getPublicKey();

    const templateEvent: UnsignedEvent = {
      kind: 27235,
      pubkey,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: '',
    }


    const signedEvent: NostrEvent = await nostr.signEvent(templateEvent)
    const { user, token } = await bitpassAPI.verifyNostr(signedEvent)
    login(user, token)
  }

  async function loginWithPrivateKey(privateKey: string) {
    const signer = new NDKPrivateKeySigner(privateKey)
    
    const templateEvent: UnsignedEvent = {
      kind: 27235,
      pubkey: signer.pubkey,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: '',
    }


    const signedEvent: NostrEvent = {
      ...templateEvent,
      id: getEventHash(templateEvent),
      sig: await signer.sign(templateEvent)
    }

    const { user, token } = await bitpassAPI.verifyNostr(signedEvent)
    login(user, token)
  }

  return (
    <AuthContext.Provider
      value={{
        bitpassAPI,
        user,
        login,
        logout,
        isAuthenticated: Boolean(user.id),
        loginWithNostrExtension,
        loginWithPrivateKey,
        requestOTPCode,
        verifyOTPCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}