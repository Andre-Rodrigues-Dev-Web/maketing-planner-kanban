import React, { useMemo, useState } from 'react';
import { Check, Eye, Image, LayoutTemplate, MonitorPlay, Smartphone, Sparkles } from 'lucide-react';

const formats = [
  { id: 'all', label: 'Todas', icon: LayoutTemplate },
  { id: 'feed', label: 'Feed', icon: MonitorPlay },
  { id: 'story', label: 'Story', icon: Smartphone }
];

const artworkDefaults = [
  { id: 'art-1', postId: 'p1', format: 'feed', dimension: '1080 x 1350', variant: 'violet', status: 'Em produção', title: 'Bastidores da equipe', campaign: 'Institucional', version: 'V03' },
  { id: 'art-2', postId: 'p1', format: 'story', dimension: '1080 x 1920', variant: 'violet', status: 'Aguardando aprovação', title: 'Bastidores da equipe', campaign: 'Institucional', version: 'V02' },
  { id: 'art-3', postId: 'p2', format: 'feed', dimension: '1080 x 1350', variant: 'amber', status: 'Aprovada', title: 'Oferta da semana', campaign: 'Vendas', version: 'V05' },
  { id: 'art-4', postId: 'p2', format: 'story', dimension: '1080 x 1920', variant: 'amber', status: 'Em produção', title: 'Oferta da semana', campaign: 'Vendas', version: 'V04' },
  { id: 'art-5', postId: 'p3', format: 'feed', dimension: '1080 x 1350', variant: 'blue', status: 'Aguardando aprovação', title: 'Vídeo depoimento cliente', campaign: 'Prova social', version: 'V01' },
  { id: 'art-6', postId: 'p4', format: 'story', dimension: '1080 x 1920', variant: 'green', status: 'Aprovada', title: 'Dica rápida de marketing', campaign: 'Conteúdo', version: 'V02' }
];

function Preview({ artwork }) {
  return <div className={`art-preview ${artwork.format} ${artwork.variant}`}>
    <div className="preview-noise" />
    <div className="preview-brand"><Sparkles size={12} /> PlanFlow</div>
    <div className="preview-copy">
      <small>{artwork.campaign}</small>
      <strong>{artwork.title}</strong>
      <span>{artwork.format === 'feed' ? 'Conteúdo que aproxima marcas de pessoas.' : 'Arraste para conferir'}</span>
    </div>
    <div className="preview-shape" />
    <div className="preview-footer">@cliente · {artwork.version}</div>
  </div>;
}

function statusClass(status) {
  return status.toLowerCase().replaceAll(' ', '-').replace('ç', 'c').replace('ã', 'a');
}

export default function Artboards({ posts, onEdit }) {
  const [format, setFormat] = useState('all');
  const [campaign, setCampaign] = useState('Todas');
  const [selectedId, setSelectedId] = useState(null);
  const campaigns = ['Todas', ...new Set(posts.map(post => post.campaign).filter(Boolean))];
  const artworks = useMemo(() => artworkDefaults.filter(artwork => {
    const belongsToVisiblePost = posts.some(post => post.id === artwork.postId);
    return belongsToVisiblePost && (format === 'all' || artwork.format === format) && (campaign === 'Todas' || artwork.campaign === campaign);
  }), [posts, format, campaign]);
  const selectedArtwork = artworks.find(artwork => artwork.id === selectedId);
  const approved = artworks.filter(artwork => artwork.status === 'Aprovada').length;
  const pending = artworks.filter(artwork => artwork.status !== 'Aprovada').length;

  return <section className="artboards-page">
    <div className="artboards-intro">
      <div>
        <span className="eyebrow">Direção de arte</span>
        <h1>Artes por campanha</h1>
        <p>Revise as peças do cliente nos formatos certos para cada momento da campanha.</p>
      </div>
      <div className="artboard-metrics">
        <div><b>{artworks.length}</b><span>peças no fluxo</span></div>
        <div><b>{approved}</b><span>aprovadas</span></div>
        <div><b>{pending}</b><span>em revisão</span></div>
      </div>
    </div>

    <div className="artboard-toolbar">
      <div className="format-switch" role="tablist" aria-label="Formato da arte">
        {formats.map(item => {
          const Icon = item.icon;
          return <button key={item.id} className={format === item.id ? 'active' : ''} onClick={() => setFormat(item.id)} role="tab" aria-selected={format === item.id}><Icon size={15} /> {item.label}</button>;
        })}
      </div>
      <select value={campaign} onChange={event => setCampaign(event.target.value)} aria-label="Filtrar campanha">
        {campaigns.map(item => <option key={item}>{item}</option>)}
      </select>
    </div>

    <div className="artboard-grid">
      {artworks.map(artwork => <article key={artwork.id} className={`artwork-card ${selectedId === artwork.id ? 'selected' : ''}`} onClick={() => setSelectedId(artwork.id)}>
        <Preview artwork={artwork} />
        <div className="artwork-info">
          <div className="artwork-heading"><div><span className="artwork-campaign">{artwork.campaign}</span><h2>{artwork.title}</h2></div><span className={`status-badge ${statusClass(artwork.status)}`}>{artwork.status === 'Aprovada' && <Check size={12} />}{artwork.status}</span></div>
          <div className="artwork-meta"><span><Image size={13} /> {artwork.format === 'feed' ? 'Feed' : 'Story'}</span><span>{artwork.dimension}</span><span>{artwork.version}</span></div>
          <button className="artwork-review" onClick={event => { event.stopPropagation(); const post = posts.find(item => item.id === artwork.postId); if (post) onEdit(post); }}><Eye size={14} /> Ver postagem relacionada</button>
        </div>
      </article>)}
      {!artworks.length && <div className="artboard-empty">Nenhuma arte encontrada para este filtro.</div>}
    </div>

    {selectedArtwork && <div className="artboard-inspector"><div><span className="eyebrow">Peça selecionada</span><strong>{selectedArtwork.title} · {selectedArtwork.format === 'feed' ? 'Feed' : 'Story'}</strong><span>{selectedArtwork.dimension} · {selectedArtwork.version}</span></div><button className="ghost" onClick={() => setSelectedId(null)}>Fechar painel</button></div>}
  </section>;
}