import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { columns } from './data';

export function exportPlannerPDF({ posts, projectName = 'Planejamento de Marketing' }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(17, 24, 39);
  doc.rect(0, 0, pageWidth, 33, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text(projectName, 14, 16);
  doc.setFontSize(9);
  doc.text(`Gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}`, 14, 24);

  doc.setTextColor(31, 41, 55);
  doc.setFontSize(13);
  doc.text('Resumo do planejamento', 14, 44);

  const summary = columns.map(c => [c.title, posts.filter(p => p.status === c.id).length]);
  autoTable(doc, {
    startY: 49,
    head: [['Etapa', 'Quantidade']],
    body: summary,
    theme: 'grid',
    headStyles: { fillColor: [31, 41, 55] }
  });

  let y = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(13);
  doc.text('Fluxo Kanban', 14, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    head: [['Etapa', 'Conteúdos']],
    body: columns.map(c => [c.title, posts.filter(p => p.status === c.id).map(p => p.title).join(' • ') || '—']),
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: [31, 41, 55] },
    columnStyles: { 0: { cellWidth: 34, fontStyle: 'bold' } }
  });

  y = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(13);
  doc.text('Calendário editorial', 14, y);
  y += 4;

  const sorted = [...posts].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  autoTable(doc, {
    startY: y,
    head: [['Data', 'Hora', 'Título', 'Formato', 'Canal', 'Campanha', 'Etapa']],
    body: sorted.map(p => [
      p.date ? format(parseISO(p.date), 'dd/MM/yyyy', { locale: ptBR }) : '-',
      p.time || '-', p.title, p.type, p.channel, p.campaign || '-',
      columns.find(c => c.id === p.status)?.title || p.status
    ]),
    theme: 'striped',
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [17, 24, 39] }
  });

  sorted.forEach((p, index) => {
    if (index === 0 || doc.lastAutoTable.finalY > 240) doc.addPage();
    const start = index === 0 && doc.getNumberOfPages() === 1 ? doc.lastAutoTable.finalY + 10 : 18;
    if (index === 0 && doc.getNumberOfPages() === 1) {
      doc.setFontSize(13);
      doc.text('Briefing dos conteúdos', 14, start);
    }

    if (index > 0) doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(17, 24, 39);
    doc.text(p.title, 14, 20);
    autoTable(doc, {
      startY: 25,
      body: [
        ['Data e horário', `${p.date || '-'} ${p.time || ''}`],
        ['Formato / canal', `${p.type} / ${p.channel}`],
        ['Campanha', p.campaign || '-'],
        ['Responsável', p.owner || '-'],
        ['Objetivo', p.objective || '-'],
        ['Legenda / roteiro', p.caption || '-'],
        ['CTA', p.cta || '-'],
        ['Observações', p.notes || '-']
      ],
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } },
      headStyles: { fillColor: [17, 24, 39] }
    });
  });

  doc.save(`${projectName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}
