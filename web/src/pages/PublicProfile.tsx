import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Instagram, Linkedin, Github, Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Social {
  _id: string;
  platform: string;
  username: string;
  url: string;
}

interface Link {
  _id: string;
  name: string;
  url: string;
  emoji: string;
  createdAt: string;
}

interface UserProfile {
  name: string;
  username: string;
  bio: string;
  links: Link[];
  socials: Social[];
}

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3333/api/u/${username}`);
        const data = await response.json();
        if (!response.ok || !data.success || !data.profile) {
          setError('Perfil não encontrado');
          setProfile(null);
          return;
        }
        setProfile(data.profile);
      } catch (err) {
        setError('Erro ao carregar perfil');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const handleLinkClick = (link: Link) => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const handleSocialClick = (platform: string, url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Perfil de ${profile?.username} - Linkaí`,
          text: `Confira o perfil de ${profile?.username} no Linkaí`,
          url: url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copiado!",
          description: "O link do perfil foi copiado para a área de transferência.",
        });
      } catch (err) {
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o link.",
          variant: "destructive"
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-4">
            <Skeleton className="w-24 h-24 rounded-full mx-auto" />
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="glass-card w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">!</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {error || 'Perfil não encontrado'}
            </h1>
            <p className="text-gray-600 mb-6">
              O perfil "@{username}" não existe ou não está disponível.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="btn-gradient"
            >
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const socialsObj = profile.socials.reduce((acc, social) => {
    acc[social.platform.toLowerCase()] = social.url;
    return acc;
  }, {} as Record<string, string>);

  const activeLinks = profile.links;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="relative mb-6">
            <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-xl">
              {(() => {
                const github = profile.socials.find(s => s.platform.toLowerCase() === 'github');
                const githubAvatar = github ? `https://github.com/${github.username}.png` : undefined;
                return (
                  <AvatarImage 
                    src={githubAvatar}
                    alt={profile.name}
                  />
                );
              })()}
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                {profile.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {profile.name}
          </h1>
          {profile.bio && (
            <p className="text-gray-700 leading-relaxed max-w-xs mx-auto">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Social Links */}
        {profile.socials.length > 0 && (
          <div className="flex justify-center space-x-4 mb-8 animate-scale-in">
            {profile.socials.map((social) => {
              const platformConfig = {
                instagram: { icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50 hover:bg-pink-100' },
                linkedin: { icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-50 hover:bg-blue-100' },
                github: { icon: Github, color: 'text-gray-800', bg: 'bg-gray-50 hover:bg-gray-100' }
              };
              const config = platformConfig[social.platform.toLowerCase() as keyof typeof platformConfig];
              if (!config) return null;
              const Icon = config.icon;
              return (
                <Button
                  key={social.platform}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSocialClick(social.platform, social.url)}
                  className={`${config.bg} ${config.color} p-3 rounded-full transition-all duration-300 hover:scale-110`}
                >
                  <Icon className="w-5 h-5" />
                </Button>
              );
            })}
          </div>
        )}

        {/* Custom Links */}
        <div className="space-y-4 animate-fade-in">
          {activeLinks.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">Nenhum link disponível no momento</p>
              </CardContent>
            </Card>
          ) : (
            activeLinks.map((link, index) => (
              <Card
                key={link._id}
                className="glass-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleLinkClick(link)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{link.emoji}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{link.name}</h3>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm mb-2">
            Criado com
          </p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">L</span>
            </div>
            <span className="text-lg font-bold gradient-text">Linkaí</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;