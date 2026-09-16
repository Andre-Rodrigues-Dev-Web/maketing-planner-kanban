import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Columns3, Download, Image, Plus, Search, Sparkles } from 'lucide-react';
import Kanban from './components/Kanban';
import CalendarView from './components/CalendarView';
import Artboards from './components/Artboards';
import PostModal from './components/PostModal';
import { channels, columns, initialPosts } from './lib/data';
import { exportPlannerPDF } from './lib/pdf';

const STORAGE_KEY = 'marketing-planner-v1';
const PROJECTS_STORAGE_KEY = 'marketing-planner-projects-v1';
const ACTIVE_PROJECT_STORAGE_KEY = 'marketing-planner-active-project-v1';
const LEGACY_COLUMNS_STORAGE_KEY = 'marketing-planner-columns-v1';

const defaultProject = { id: 'default', name: 'Planejamento de Marketing', columns };

export default function App() {
  const [posts, setPosts] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return (saved || initialPosts).map(post => ({ ...post, projectId: post.projectId || 'default' }));
    } catch { return initialPosts.map(post => ({ ...post, projectId: 'default' })); }
  });
  const [projects, setProjects] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PROJECTS_STORAGE_KEY));
      if (saved?.length) return saved;
      const legacyColumns = JSON.parse(localStorage.getItem(LEGACY_COLUMNS_STORAGE_KEY));
      const migratedColumns = columns.map(column => ({ ...column, title: legacyColumns?.find(item => item.id === column.id)?.title || column.title }));
      return [{ ...defaultProject, columns: migratedColumns }];
    } catch { return [defaultProject]; }
  });
  const [activeProjectId, setActiveProjectId] = useState(() => localStorage.getItem(ACTIVE_PROJECT_STORAGE_KEY) || 'default');
  const [view, setView] = useState('kanban');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [newStatus, setNewStatus] = useState('ideas');
  const [search, setSearch] = useState('');
  const [channel, setChannel] = useState('Todos');

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)), [posts]);
  useEffect(() => localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects)), [projects]);
  useEffect(() => localStorage.setItem(ACTIVE_PROJECT_STORAGE_KEY, activeProjectId), [activeProjectId]);

  const activeProject = projects.find(project => project.id === activeProjectId) || projects[0];

  useEffect(() => {
    if (activeProjectId !== activeProject.id) setActiveProjectId(activeProject.id);
  }, [activeProjectId, activeProject.id]);

  const filtered = useMemo(() => posts.filter(p => {
    const text = `${p.title} ${p.campaign} ${p.owner} ${p.caption}`.toLowerCase();
    return p.projectId === activeProject.id && text.includes(search.toLowerCase()) && (channel === 'Todos' || p.channel === channel);
  }), [posts, search, channel, activeProject.id]);

  const openNew = status => { setEditing(null); setNewStatus(status || 'ideas'); setModalOpen(true); };
  const openEdit = post => { setEditing(post); setModalOpen(true); };
  const savePost = post => {
    const final = { ...post, projectId: activeProject.id, ...(editing ? {} : { status: newStatus }) };
    setPosts(prev => prev.some(p => p.id === final.id) ? prev.map(p => p.id === final.id ? final : p) : [...prev, final]);
    setModalOpen(false);
  };
  const deletePost = id => { setPosts(prev => prev.filter(p => p.id !== id)); setModalOpen(false); };
  const movePost = (id, status) => setPosts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  const renameColumn = (id, title) => setProjects(prev => prev.map(project => project.id === activeProject.id ? {
    ...project,
    columns: project.columns.map(column => column.id === id ? { ...column, title } : column)
  } : project));
  const renameProject = event => setProjects(prev => prev.map(project => project.id === activeProject.id ? { ...project, name: event.target.value } : project));
  const createProject = () => {
    const name = window.prompt('Nome do projeto do cliente:');
    if (!name?.trim()) return;
    const project = { id: crypto.randomUUID(), name: name.trim(), columns: columns.map(column => ({ ...column })) };
    setProjects(prev => [...prev, project]);
    setActiveProjectId(project.id);
  };

  const scheduledCount = posts.filter(p => p.status === 'scheduled').length;
  const publishedCount = posts.filter(p => p.status === 'published').length;

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon"><Sparkles size={19}/></div><div><strong>PlanFlow</strong><span>Marketing Planner</span></div></div>
      <nav>
        <button className={view === 'kanban' ? 'active' : ''} onClick={() => setView('kanban')}><Columns3 size={18}/> Kanban</button>
        <button className={view === 'calendar' ? 'active' : ''} onClick={() => setView('calendar')}><CalendarDays size={18}/> Calendário</button>
        <button className={view === 'artboards' ? 'active' : ''} onClick={() => setView('artboards')}><Image size={18}/> Artes</button>
      </nav>
      <div className="sidebar-card">
        <small>Planejamento</small>
        <b>{posts.length} conteúdos</b>
        <span>{scheduledCount} agendados · {publishedCount} publicados</span>
      </div>
      <div className="sidebar-bottom">Dados salvos neste navegador</div>
    </aside>

    <main>
      <header className="topbar">
        <div>
          <div className="project-heading">
            <select className="project-selector" value={activeProject.id} onChange={event => setActiveProjectId(event.target.value)} aria-label="Projeto do cliente">
              {projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
            <input className="project-name" value={activeProject.name} onChange={renameProject} aria-label="Nome do projeto" />
          </div>
          <p>{view === 'artboards' ? 'Acompanhe a produção visual do cliente por campanha e formato.' : 'Organize ideias, produção, publicação e calendário editorial em um único fluxo.'}</p>
        </div>
        <div className="top-actions">
          <button className="ghost" onClick={() => exportPlannerPDF({ posts: filtered, projectName: activeProject.name })}><Download size={17}/> Exportar PDF</button>
          <button className="ghost" onClick={createProject}><Plus size={17}/> Novo cliente</button>
          <button className="primary" onClick={() => openNew('ideas')}><Plus size={17}/> Nova postagem</button>
        </div>
      </header>

      <section className="filters">
        <label className="search"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar conteúdo, campanha ou responsável..."/></label>
        <select value={channel} onChange={e => setChannel(e.target.value)}><option>Todos</option>{channels.map(c => <option key={c}>{c}</option>)}</select>
        <div className="view-switch">
          <button className={view === 'kanban' ? 'active' : ''} onClick={() => setView('kanban')}>Kanban</button>
          <button className={view === 'calendar' ? 'active' : ''} onClick={() => setView('calendar')}>Calendário</button>
          <button className={view === 'artboards' ? 'active' : ''} onClick={() => setView('artboards')}>Artes</button>
        </div>
      </section>

      {view === 'kanban' ? <Kanban columns={activeProject.columns} posts={filtered} onMove={movePost} onEdit={openEdit} onDelete={deletePost} onAdd={openNew} onRename={renameColumn}/> : view === 'calendar' ? <CalendarView posts={filtered} onEdit={openEdit}/> : <Artboards posts={filtered} onEdit={openEdit}/>} 
    </main>

    <PostModal open={modalOpen} post={editing} onClose={() => setModalOpen(false)} onSave={savePost} onDelete={deletePost}/>
  </div>;
}
