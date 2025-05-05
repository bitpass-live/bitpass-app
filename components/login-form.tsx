import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmailLoginForm } from '@/components/auth/email-login-form';
import { NostrLoginForm } from '@/components/auth/nostr-login-form';

export function LoginForm() {
  return (
    <>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Choose your preferred login method</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='email'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='email'>Email</TabsTrigger>
              <TabsTrigger value='nostr'>Nostr</TabsTrigger>
            </TabsList>
            <TabsContent value='email'>
              <EmailLoginForm />
            </TabsContent>
            <TabsContent value='nostr'>
              <NostrLoginForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
