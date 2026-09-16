import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { channels, contentTypes } from '../lib/data';

const blank = {
  title: '', status: 'ideas', type: 'Imagem', channel: 'Instagram', date: '', time: '12:00',
  campaign: '', owner: '', objective: '', caption: '', cta: '', notes: ''
};

export default function PostModal({ open, post, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(blank);
  useEffect(() => { if (open) setForm(post || blank); }, [open, post]);
  if (!open) return null;

  const update = e => setForm(v => ({ ...v, [e.target.name]: e.target.value }));
  const submit = e => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...form, id: form.id || crypto.randomUUID() });
  };

  return <div className="modal-backdrop" onMouseDown={onClose}>
    <div className="modal" onMouseDown={e => e.stopPropagation()}>
      <div className="modal-head">
        <div><span className="eyebrow">Conteúdo</span><h2>{post ? 'Editar postagem' : 'Nova postagem'}</h2></div>
        <button className="icon-btn" onClick={onClose}><X size={20}/></button>
      </div>
      <form onSubmit={submit} className="form-grid">
        <label className="span-2">Título<input name="title" value={form.title} onChange={update} placeholder="Ex.: Reels — Bastidores da empresa" autoFocus/></label>
        <label>Formato<select name="type" value={form.type} onChange={update}>{contentTypes.map(x => <option key={x}>{x}</option>)}</select></label>
        <label>Canal<select name="channel" value={form.channel} onChange={update}>{channels.map(x => <option key={x}>{x}</option>)}</select></label>
        <label>Data<input type="date" name="date" value={form.date} onChange={update}/></label>
        <label>Horário<input type="time" name="time" value={form.time} onChange={update}/></label>
        <label>Campanha<input name="campaign" value={form.campaign} onChange={update} placeholder="Ex.: Lançamento"/></label>
        <label>Responsável<input name="owner" value={form.owner} onChange={update} placeholder="Ex.: Social Media"/></label>
        <label className="span-2">Objetivo<textarea name="objective" value={form.objective} onChange={update} placeholder="Qual o objetivo estratégico?"/></label>
        <label className="span-2">Legenda / roteiro<textarea name="caption" value={form.caption} onChange={update} rows="4" placeholder="Texto, roteiro ou briefing..."/></label>
        <label>CTA<input name="cta" value={form.cta} onChange={update} placeholder="Ex.: Compre agora"/></label>
        <label>Observações<input name="notes" value={form.notes} onChange={update} placeholder="Pendências, links, referências..."/></label>
        <div className="modal-actions span-2">
          {post && <button type="button" className="danger" onClick={() => onDelete(post.id)}>Excluir</button>}
          <div className="spacer"/>
          <button type="button" className="ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="primary">Salvar postagem</button>
        </div>
      </form>
    </div>
  </div>;
}
