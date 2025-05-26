
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Users, Zap, Shield } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Linkaí</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Uma única página para todos os seus links. Crie seu perfil personalizado e 
              compartilhe tudo que importa em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/cadastro">
                <Button className="btn-gradient text-lg px-8 py-4">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="text-lg px-8 py-4 border-2">
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>

          {/* Floating Cards Demo */}
          <div className="mt-16 relative">
            <div className="animate-float">
              <div className="glass-card p-6 max-w-sm mx-auto transform rotate-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold text-gray-800">@exemplo</h3>
                    <p className="text-gray-600 text-sm">Criador de conteúdo</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/60 rounded-lg p-3 text-left">
                    <span className="text-sm font-medium">📱 Instagram</span>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 text-left">
                    <span className="text-sm font-medium">💼 LinkedIn</span>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 text-left">
                    <span className="text-sm font-medium">🌐 Meu Site</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o Linkaí?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Criamos a ferramenta mais simples e elegante para você centralizar todos os seus links importantes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl hover:bg-white/70 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Setup Rápido</h3>
              <p className="text-gray-600">Configure seu perfil em menos de 2 minutos</p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-white/70 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fácil de Compartilhar</h3>
              <p className="text-gray-600">Um link único para todos os seus conteúdos</p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-white/70 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Design Elegante</h3>
              <p className="text-gray-600">Interface moderna e responsiva</p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-white/70 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Gratuito</h3>
              <p className="text-gray-600">Sem taxas ocultas ou limitações</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Pronto para criar seu <span className="gradient-text">Linkaí</span>?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Junte-se a milhares de criadores que já centralizaram seus links conosco.
          </p>
          <Link to="/cadastro">
            <Button className="btn-gradient text-lg px-8 py-4">
              Criar Minha Página Grátis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
