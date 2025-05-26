import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Settings, Eye, ExternalLink, Instagram, Linkedin, Github, Camera, Upload, ImageIcon, Loader2, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { API_LINKS, API_SOCIALS, API_PROFILE, MAX_CUSTOM_LINKS, MAX_AVATAR_SIZE_BYTES, MAX_AVATAR_SIZE_MB } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

import EmojiPicker from '@/components/EmojiPicker';
import { EMOJI_LIST } from '@/components/emojiList';

interface CustomLink {
  id: string;
  name: string;
  url: string;
  emoji: string;
  active: boolean;
}

interface Social {
  _id: string;
  platform: string;
  username: string;
  url: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);
  const [socials, setSocials] = useState<Social[]>([]);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [editingSocialPlatform, setEditingSocialPlatform] = useState<string>('');
  const [isDeletingSocial, setIsDeletingSocial] = useState<string | null>(null);
  const [socialUsername, setSocialUsername] = useState<string>('');
  const [isNewLinkModalOpen, setIsNewLinkModalOpen] = useState(false);
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkEmoji, setNewLinkEmoji] = useState<string>('');
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingNewLink, setIsLoadingNewLink] = useState(false);
  const [isLoadingSocial, setIsLoadingSocial] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<string | null>(null);

  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editUserData, setEditUserData] = useState({
    name: '',
    email: '',
    username: '',
    bio: ''
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const [showEmojiLegend, setShowEmojiLegend] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserLinks();
      fetchSocials();
    }
  }, [user]);

  const fetchSocials = useCallback(async () => {
    try {
      const response = await fetch(API_SOCIALS, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setSocials(data.socials);
      } else {
        console.error('Error fetching socials:', data.message);
      }
    } catch (error) {
      console.error('Error fetching socials:', error);
    }
  }, []);

  const fetchUserLinks = useCallback(async () => {
    try {
      const response = await fetch(API_LINKS, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        const convertedLinks = data.links.map((link: any) => ({
          id: link._id,
          name: link.name,
          url: link.url,
          emoji: link.emoji,
          active: true
        }));
        setCustomLinks(convertedLinks);
      } else {
        toast({
          title: "Erro ao carregar links",
          description: data.message || "Não foi possível carregar seus links.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao buscar links:", error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível carregar seus links.",
        variant: "destructive"
      });
    }
  }, []);

  const openEditUserModal = useCallback(() => {
    setEditUserData({
      name: user?.name || '',
      email: user?.email || '',
      username: user?.username || '',
      bio: user?.bio || ''
    });
    setIsEditUserModalOpen(true);
  }, [user]);

  const handleEditUserSubmit = useCallback(async () => {
    setIsLoadingUser(true);

    if (!editUserData.name || !editUserData.email || !editUserData.username) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      setIsLoadingUser(false);
      return;
    }

    if (!editUserData.email.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      setIsLoadingUser(false);
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(editUserData.username)) {
      toast({
        title: "Username inválido",
        description: "O username deve conter apenas letras, números e underscores.",
        variant: "destructive"
      });
      setIsLoadingUser(false);
      return;
    }

    try {
      const response = await fetch(API_PROFILE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editUserData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast({
          title: "Oops",
          description: data.message || "Erro ao atualizar o perfil",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram atualizadas com sucesso.",
      });

      setIsEditUserModalOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor para atualizar o perfil.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingUser(false);
    }
  }, [editUserData]);

  const addCustomLink = useCallback(() => {
    if (customLinks.length >= MAX_CUSTOM_LINKS) {
      toast({
        title: "Limite atingido",
        description: `Máximo de ${MAX_CUSTOM_LINKS} links personalizados permitidos`,
        variant: "destructive"
      });
      return;
    }

    setNewLinkName('');
    setNewLinkUrl('');
    setIsNewLinkModalOpen(true);
  }, [customLinks.length]);

  const saveNewLink = useCallback(async () => {
    if (!newLinkName.trim() || !newLinkUrl.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e URL são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsLoadingNewLink(true);

    try {
      const response = await fetch(API_LINKS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: newLinkName.trim(),
          url: newLinkUrl.trim(),
          emoji: newLinkEmoji || '🔗'
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast({
          title: "Erro ao adicionar link",
          description: data.message || "Não foi possível adicionar o link.",
          variant: "destructive"
        });
        return;
      }

      const newLink: CustomLink = {
        id: data.link._id,
        name: data.link.name,
        url: data.link.url,
        emoji: data.link.emoji,
        active: true,
      };

      setCustomLinks([...customLinks, newLink]);
      setIsNewLinkModalOpen(false);
      setNewLinkName('');
      setNewLinkUrl('');

      toast({
        title: "Sucesso!",
        description: "Link adicionado com sucesso."
      });

    } catch (error) {
      console.error("Erro ao adicionar link:", error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor para adicionar o link.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingNewLink(false);
    }
  }, [newLinkName, newLinkUrl, newLinkEmoji, customLinks]);

  const toggleLinkStatus = useCallback((id: string) => {
    const updatedLinks = customLinks.map(link =>
      link.id === id ? { ...link, active: !link.active } : link
    );
    setCustomLinks(updatedLinks);
    toast({
      title: "Status do link atualizado",
      description: "O status do link foi atualizado com sucesso.",
    });
  }, [customLinks]);

  const deleteLink = useCallback(async (id: string) => {
    setIsLoadingDelete(id);

    try {
      const response = await fetch(`${API_LINKS}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast({
          title: "Erro ao excluir link",
          description: data.message || "Não foi possível excluir o link.",
          variant: "destructive"
        });
        return;
      }

      const updatedLinks = customLinks.filter(link => link.id !== id);
      setCustomLinks(updatedLinks);

      toast({
        title: "Sucesso!",
        description: "Link excluído com sucesso."
      });

    } catch (error) {
      console.error("Erro ao excluir link:", error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor para excluir o link.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingDelete(null);
    }
  }, [customLinks]);

  const openSocialModal = useCallback((platform: string) => {
    setEditingSocialPlatform(platform);
    const existingSocial = socials.find(s => s.platform.toLowerCase() === platform.toLowerCase());
    if (existingSocial) {
      setSocialUsername(existingSocial.username);
    } else {
      setSocialUsername('');
    }
    setIsSocialModalOpen(true);
  }, [socials]);

  const saveSocialLink = useCallback(async () => {
    if (!socialUsername.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "O nome de usuário é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setIsLoadingSocial(true);

    const existingSocial = socials.find(
      s => s.platform.toLowerCase() === editingSocialPlatform.toLowerCase()
    );

    try {
      const url = existingSocial
        ? `${API_SOCIALS}/${existingSocial._id}`
        : API_SOCIALS;

      const response = await fetch(url, {
        method: existingSocial ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          platform: editingSocialPlatform,
          username: socialUsername.trim()
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast({
          title: "Erro ao salvar rede social",
          description: data.message || "Não foi possível salvar a rede social.",
          variant: "destructive"
        });
        return;
      }

      await fetchSocials();
      setIsSocialModalOpen(false);
      setSocialUsername('');
      setEditingSocialPlatform('');

      toast({
        title: "Sucesso!",
        description: `${editingSocialPlatform} ${existingSocial ? 'atualizado' : 'adicionado'} com sucesso`,
      });
    } catch (error) {
      console.error("Erro ao salvar rede social:", error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingSocial(false);
    }
  }, [socialUsername, socials, editingSocialPlatform, fetchSocials]);

  const deleteSocialMedia = useCallback(async (socialId: string) => {
    setIsDeletingSocial(socialId);

    try {
      const response = await fetch(`${API_SOCIALS}/${socialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast({
          title: "Erro ao remover rede social",
          description: data.message || "Não foi possível remover a rede social.",
          variant: "destructive"
        });
        return;
      }

      await fetchSocials();
      toast({
        title: "Sucesso!",
        description: "Rede social removida com sucesso."
      });

    } catch (error) {
      console.error("Erro ao remover rede social:", error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor.",
        variant: "destructive"
      });
    } finally {
      setIsDeletingSocial(null);
    }
  }, [fetchSocials]);

  const username = user?.username || 'meu-perfil';

  // Função utilitária para obter o username do GitHub
  const getGithubUsername = () => {
    const githubSocial = socials.find(s => s.platform.toLowerCase() === 'github');
    if (githubSocial && githubSocial.username) {
      return githubSocial.username;
    }
    return null;
  };

  const githubUsername = getGithubUsername();
  const githubAvatarUrl = githubUsername ? `https://github.com/${githubUsername}.png` : undefined;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Olá, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">
          Gerencie seus links e personalize seu perfil Linkaí
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Status */}
          <Card className="glass-card animate-scale-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                      <AvatarImage src={githubAvatarUrl || user?.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg">
                        {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Seu Perfil Público
                      <span className="text-green-500 text-sm">✓ Ativo</span>
                    </CardTitle>
                    <CardDescription>
                      {`Seu link: link.ai/${username}`}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={`/${username}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver perfil
                    </Button>
                  </a>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={openEditUserModal}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Custom Links */}
          <Card className="glass-card animate-scale-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Links Personalizados</CardTitle>
                  <CardDescription>
                    Adicione até 5 links personalizados ({customLinks.length}/5)
                  </CardDescription>
                </div>
                <Button
                  onClick={addCustomLink}
                  disabled={customLinks.length >= 5}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {customLinks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum link personalizado ainda</p>
                  <p className="text-sm">Clique em "Adicionar" para começar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customLinks.map((link) => (
                    <div
                      key={link.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${link.active
                        ? 'border-purple-200 bg-purple-50'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{link.emoji || '🔗'}</span>
                        <div>
                          <h4 className="font-medium">{link.name}</h4>
                          <p className="text-sm text-gray-600">{link.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLinkStatus(link.id)}
                        >
                          {link.active ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLink(link.id)}
                          className="text-red-600 hover:text-red-700"
                          disabled={isLoadingDelete === link.id}
                        >
                          {isLoadingDelete === link.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="glass-card animate-scale-in">
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
              <CardDescription>
                Conecte suas principais redes sociais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['GitHub', 'LinkedIn', 'Instagram'].map((platform) => {
                  const social = socials.find(s => s.platform === platform);
                  return (
                    <div key={platform} className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-200">
                      <div className="flex items-center space-x-3">
                        {platform === 'LinkedIn' && <Linkedin className="w-6 h-6 text-blue-600" />}
                        {platform === 'GitHub' && <Github className="w-6 h-6 text-gray-800" />}
                        {platform === 'Instagram' && <Instagram className="w-6 h-6 text-pink-600" />}
                        <div>
                          <h4 className="font-medium">
                            {social?.platform}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {social?.url || 'Não configurado'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openSocialModal(platform)}
                        >
                          {social ? 'Editar' : 'Adicionar'}
                        </Button>
                        {social && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSocialMedia(social._id)}
                            className="text-red-600 hover:text-red-700"
                            disabled={isDeletingSocial === social._id}
                          >
                            {isDeletingSocial === social._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>


            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="glass-card animate-scale-in">
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {customLinks.filter(link => link.active).length}
                </div>
                <p className="text-sm text-gray-600">Links ativos</p>
              </div>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="glass-card animate-scale-in">
            <CardHeader>
              <CardTitle className="text-lg">Precisa de ajuda?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Confira nosso guia para personalizar seu perfil e maximizar seus resultados.
              </p>
              <Button variant="outline" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver Guia
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Social Link Modal */}
      <Dialog open={isSocialModalOpen} onOpenChange={setIsSocialModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {socials.find(s => s.platform === editingSocialPlatform) ? 'Editar' : 'Adicionar'} {editingSocialPlatform}
            </DialogTitle>
            <DialogDescription>
              Digite seu nome de usuário no {editingSocialPlatform}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-6">
            <div className="space-y-2">
              <Label>Nome de usuário</Label>
              <Input
                value={socialUsername}
                onChange={(e) => setSocialUsername(e.target.value)}
                placeholder={`Seu username no ${editingSocialPlatform}`}
                className="w-full"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsSocialModalOpen(false)} disabled={isLoadingSocial}>
                Cancelar
              </Button>
              <Button
                onClick={saveSocialLink}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={isLoadingSocial}
              >
                {isLoadingSocial ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Link Modal */}
      <Dialog open={isNewLinkModalOpen} onOpenChange={setIsNewLinkModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Link</DialogTitle>
            <DialogDescription>
              Preencha as informações do novo link
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="newLinkName">Nome do Link</Label>
              <Input
                id="newLinkName"
                value={newLinkName}
                onChange={(e) => setNewLinkName(e.target.value)}
                placeholder="Ex: Meu Blog"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newLinkUrl">URL</Label>
              <Input
                id="newLinkUrl"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://exemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Emoji (opcional)</Label>
              <div className="relative flex items-center space-x-2">
                <button
                  type="button"
                  ref={emojiButtonRef}
                  className="w-12 h-12 flex items-center justify-center text-2xl border rounded-full shadow bg-white hover:bg-purple-50 transition"
                  onClick={() => setShowEmojiPicker((v) => !v)}
                  aria-label="Escolher emoji"
                >
                  {newLinkEmoji || '🔗'}
                </button>
                {showEmojiPicker && (
                  <div className="absolute left-0 top-14 z-50">
                    <EmojiPicker
                      onSelect={(emoji) => {
                        setNewLinkEmoji(emoji);
                        setShowEmojiPicker(false);
                      }}
                      onClose={() => setShowEmojiPicker(false)}
                    />
                  </div>
                )}
                <input type="hidden" value={newLinkEmoji} name="emoji" />
              </div>
              {/* <button
                type="button"
                className="text-xs text-purple-600 underline mt-2"
                onClick={() => setShowEmojiLegend(true)}
              >
                Ver todos os emojis
              </button> */}
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsNewLinkModalOpen(false)}
                disabled={isLoadingNewLink}
              >
                Cancelar
              </Button>
              <Button
                onClick={saveNewLink}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={isLoadingNewLink}
              >
                {isLoadingNewLink ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adicionando...
                  </>
                ) : (
                  'Adicionar Link'
                )}
              </Button>
            </div>
          </div>
          {/* Modal de legenda de emojis */}
          {showEmojiLegend && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-xl shadow-2xl p-6 min-w-[700px] w-full max-w-2xl relative animate-fade-in">
                <h2 className="text-lg font-bold mb-4">Tabela de Emojis</h2>
                <div className="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                  {EMOJI_LIST.map(({ emoji, name }) => (
                    <div key={emoji + name} className="flex flex-col items-center text-center">
                      <span className="text-2xl mb-1">{emoji}</span>
                      <span className="text-xs text-gray-600 break-words">{name}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="absolute top-2 right-2 text-gray-500 hover:text-purple-600 text-sm font-bold px-2 py-1"
                  onClick={() => setShowEmojiLegend(false)}
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditUserModalOpen} onOpenChange={setIsEditUserModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>
              Atualize suas informações pessoais
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Nome</Label>
              <Input
                id="userName"
                value={editUserData.name}
                onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
                placeholder="Seu nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userEmail">Email</Label>
              <Input
                id="userEmail"
                type="email"
                value={editUserData.email}
                onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userUsername">Username</Label>
              <Input
                id="userUsername"
                value={editUserData.username}
                onChange={(e) => setEditUserData({ ...editUserData, username: e.target.value })}
                placeholder="seu_username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userBio">Bio</Label>
              <Textarea
                id="userBio"
                value={editUserData.bio}
                onChange={(e) => setEditUserData({ ...editUserData, bio: e.target.value })}
                placeholder="Conte um pouco sobre você..."
                className="h-24"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditUserModalOpen(false)}
                disabled={isLoadingUser}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleEditUserSubmit}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={isLoadingUser}
              >
                {isLoadingUser ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;