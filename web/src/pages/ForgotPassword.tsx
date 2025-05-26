import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, AtSign, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, preencha o campo de email.",
        variant: "destructive"
      });
      return;
    }
    if (!email.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3333/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast({
          title: "Instruções enviadas!",
          description: `Se uma conta com o email ${email} existir, você receberá instruções para redefinir sua senha.`,
        });
        navigate('/login');
      } else {
        toast({
          title: "Erro ao enviar",
          description: data.message || 'Não foi possível enviar as instruções. Tente novamente.',
          variant: 'destructive'
        });
      }
    } catch (err) {
      toast({
        title: "Erro de conexão",
        description: 'Não foi possível conectar ao servidor.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/login" className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Login
          </Link>
          <div className="flex justify-center mb-4">
            <Mail className="w-16 h-16 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Esqueceu sua senha?</h1>
          <p className="text-gray-600">Sem problemas! Insira seu email abaixo para receber as instruções de recuperação.</p>
        </div>
        <Card className="glass-card animate-scale-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Recuperar Senha</CardTitle>
            <CardDescription>
              Nós enviaremos um link de redefinição para o seu email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 input-glass"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full btn-gradient"
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
