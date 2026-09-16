export const columns = [
  { id: 'ideas', title: 'Ideias', accent: '#8b5cf6' },
  { id: 'production', title: 'A produzir', accent: '#f59e0b' },
  { id: 'editing', title: 'Em produção', accent: '#3b82f6' },
  { id: 'scheduled', title: 'Agendado', accent: '#10b981' },
  { id: 'published', title: 'Publicado', accent: '#6b7280' }
];

export const channels = ['Instagram', 'Facebook', 'TikTok', 'YouTube', 'LinkedIn', 'Site', 'WhatsApp'];
export const contentTypes = ['Imagem', 'Carrossel', 'Reels', 'Story', 'Vídeo', 'Artigo'];

export const initialPosts = [
  {
    id: 'p1', title: 'Bastidores da equipe', status: 'ideas', type: 'Reels', channel: 'Instagram',
    date: '2026-09-18', time: '18:30', campaign: 'Institucional', owner: 'Marketing',
    objective: 'Gerar proximidade com a marca', caption: 'Mostrar bastidores e rotina da equipe.', cta: 'Siga o perfil', notes: ''
  },
  {
    id: 'p2', title: 'Oferta da semana', status: 'production', type: 'Imagem', channel: 'Instagram',
    date: '2026-09-19', time: '12:00', campaign: 'Vendas', owner: 'Designer',
    objective: 'Gerar conversões', caption: 'Criativo promocional com benefício principal.', cta: 'Chame no WhatsApp', notes: ''
  },
  {
    id: 'p3', title: 'Vídeo depoimento cliente', status: 'editing', type: 'Vídeo', channel: 'YouTube',
    date: '2026-09-22', time: '20:00', campaign: 'Prova social', owner: 'Audiovisual',
    objective: 'Aumentar confiança', caption: 'Depoimento curto com resultados e experiência.', cta: 'Conheça nossos serviços', notes: ''
  },
  {
    id: 'p4', title: 'Dica rápida de marketing', status: 'scheduled', type: 'Carrossel', channel: 'LinkedIn',
    date: '2026-09-24', time: '09:00', campaign: 'Conteúdo', owner: 'Social Media',
    objective: 'Educar e gerar autoridade', caption: '5 dicas práticas para melhorar resultados.', cta: 'Salve para consultar depois', notes: ''
  }
];
