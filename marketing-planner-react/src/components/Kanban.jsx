import React from 'react';
import { DndContext, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { CalendarDays, GripVertical, Image, Video, Plus, Trash2 } from 'lucide-react';
import { columns as defaultColumns } from '../lib/data';

function Card({ post, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: post.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 20, opacity: isDragging ? .78 : 1 } : undefined;
  const handleDelete = event => {
    event.stopPropagation();
    if (window.confirm(`Excluir a tarefa "${post.title}"?`)) onDelete(post.id);
  };

  return <article ref={setNodeRef} style={style} {...listeners} {...attributes} className="post-card" onClick={() => !isDragging && onEdit(post)}>
    <div className="post-card-top">
      <span className="type-pill">{post.type.toLowerCase().includes('vídeo') || post.type === 'Reels' ? <Video size={13}/> : <Image size={13}/>} {post.type}</span>
      <div className="post-card-actions">
        <button type="button" className="icon-btn card-delete" aria-label={`Excluir ${post.title}`} title="Excluir tarefa" onPointerDown={event => event.stopPropagation()} onClick={handleDelete}><Trash2 size={14}/></button>
        <GripVertical size={16} className="muted"/>
      </div>
    </div>
    <h3>{post.title}</h3>
    <div className="meta-row"><span>{post.channel}</span><span>{post.campaign || 'Sem campanha'}</span></div>
    <div className="date-row"><CalendarDays size={14}/><span>{post.date || 'Sem data'} {post.time || ''}</span></div>
    {post.owner && <div className="owner">{post.owner.slice(0,2).toUpperCase()}<span>{post.owner}</span></div>}
  </article>;
}

function Column({ column, posts, onEdit, onDelete, onAdd, onRename }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const handleRename = event => onRename(column.id, event.target.value);
  const restoreName = event => {
    if (!event.target.value.trim()) onRename(column.id, defaultColumns.find(item => item.id === column.id)?.title || 'Quadro');
  };

  return <section ref={setNodeRef} className={`kanban-column ${isOver ? 'is-over' : ''}`}>
    <header>
      <div className="column-title"><span className="dot" style={{ background: column.accent }}/><input className="column-name" value={column.title} onChange={handleRename} onBlur={restoreName} aria-label={`Nome do quadro ${column.title}`} /><span className="count">{posts.length}</span></div>
      <button className="icon-btn" onClick={() => onAdd(column.id)}><Plus size={17}/></button>
    </header>
    <div className="cards-stack">
      {posts.map(p => <Card key={p.id} post={p} onEdit={onEdit} onDelete={onDelete}/>) }
      {!posts.length && <div className="empty-column">Arraste um conteúdo para cá</div>}
    </div>
  </section>;
}

export default function Kanban({ columns, posts, onMove, onEdit, onDelete, onAdd, onRename }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const handleEnd = ({ active, over }) => {
    if (!over) return;
    const post = posts.find(p => p.id === active.id);
    if (post && columns.some(c => c.id === over.id)) onMove(post.id, over.id);
  };

  return <DndContext sensors={sensors} onDragEnd={handleEnd}>
    <div className="kanban-board">
      {columns.map(c => <Column key={c.id} column={c} posts={posts.filter(p => p.status === c.id)} onEdit={onEdit} onDelete={onDelete} onAdd={onAdd} onRename={onRename}/>) }
    </div>
  </DndContext>;
}
