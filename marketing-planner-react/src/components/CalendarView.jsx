import React, { useMemo, useState } from 'react';
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameMonth, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarView({ posts, onEdit }) {
  const [month, setMonth] = useState(new Date());
  const days = useMemo(() => eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 0 })
  }), [month]);

  return <div className="calendar-shell">
    <div className="calendar-toolbar">
      <button className="icon-btn" onClick={() => setMonth(subMonths(month, 1))}><ChevronLeft size={18}/></button>
      <h2>{format(month, 'MMMM yyyy', { locale: ptBR })}</h2>
      <button className="icon-btn" onClick={() => setMonth(addMonths(month, 1))}><ChevronRight size={18}/></button>
    </div>
    <div className="weekday-row">{['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => <div key={d}>{d}</div>)}</div>
    <div className="calendar-grid">
      {days.map(day => {
        const key = format(day, 'yyyy-MM-dd');
        const items = posts.filter(p => p.date === key);
        return <div key={key} className={`calendar-day ${!isSameMonth(day, month) ? 'outside' : ''}`}>
          <span className="day-number">{format(day, 'd')}</span>
          <div className="day-items">{items.slice(0,4).map(p => <button key={p.id} onClick={() => onEdit(p)}><b>{p.time}</b> {p.title}</button>)}</div>
          {items.length > 4 && <small>+{items.length - 4} conteúdos</small>}
        </div>;
      })}
    </div>
  </div>;
}
