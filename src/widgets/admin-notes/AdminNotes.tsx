import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { StickyNote, Send } from 'lucide-react';

export type AdminNote = {
  id: string;
  author: string;
  authorInitial: string;
  content: string;
  createdAt: string;
};

const CURRENT_ADMIN = {
  name: 'Hein Htet',
  initial: 'H',
};

export function AdminNotes({
  storageKey,
  seedNotes = [],
  title,
  description,
  placeholder,
}: {
  storageKey: string;
  seedNotes?: AdminNote[];
  title?: string;
  description?: string;
  placeholder?: string;
}) {
  const { t } = useTranslation();
  const [notes, setNotes] = useState<AdminNote[]>(seedNotes);
  const [draft, setDraft] = useState('');

  const canSave = draft.trim().length > 0;

  const handleAdd = () => {
    if (!canSave) return;
    const next: AdminNote = {
      id: `note-${storageKey}-${Date.now()}`,
      author: CURRENT_ADMIN.name,
      authorInitial: CURRENT_ADMIN.initial,
      content: draft.trim(),
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [next, ...prev]);
    setDraft('');
  };

  return (
    <section className="bg-white border border-[#E3E3E3] rounded-md shadow-none overflow-hidden">
      <div className="px-6 py-4 border-b border-[#F3F3F3] flex items-center gap-2">
        <StickyNote className="w-4 h-4 text-[#8A8A8A]" />
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-medium text-[#1A1A1A]">
            {title ?? t('Admin notes')}
          </h2>
          <p className="text-xs text-[#8A8A8A] mt-0.5">
            {description ?? t('Internal notes visible to admins only')}
          </p>
        </div>
        <span className="text-xs text-[#8A8A8A] tabular-nums shrink-0">{notes.length}</span>
      </div>

      {/* Composer */}
      <div className="px-6 py-4 border-b border-[#F3F3F3] bg-[#FAFAFA]">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FF3C21] text-white flex items-center justify-center text-xs font-medium shrink-0">
            {CURRENT_ADMIN.initial}
          </div>
          <div className="flex-1 min-w-0">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              placeholder={placeholder ?? t('Add a note for your team...')}
              rows={2}
              className="w-full resize-none px-3 py-2 bg-white border border-[#E3E3E3] rounded-md text-sm text-[#1A1A1A] focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] placeholder:text-[#8A8A8A]"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-[#8A8A8A]">{t('⌘ + Enter to save')}</span>
              <button
                onClick={handleAdd}
                disabled={!canSave}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[#FF3C21] text-white hover:bg-[#E63419] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                {t('Save note')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      {notes.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <div className="text-sm text-[#8A8A8A]">{t('No notes yet.')}</div>
          <div className="text-xs text-[#B5B5B5] mt-1">
            {t('Notes help the next admin understand decisions and context.')}
          </div>
        </div>
      ) : (
        <ol className="divide-y divide-[#F3F3F3]">
          {notes.map((note) => (
            <li key={note.id} className="px-6 py-4 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F3F3F3] text-[#4A4A4A] flex items-center justify-center text-xs font-medium shrink-0">
                {note.authorInitial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-[#1A1A1A]">{note.author}</span>
                  <span className="text-xs text-[#8A8A8A] tabular-nums">
                    {format(new Date(note.createdAt), 'MMM d, yyyy · HH:mm')}
                  </span>
                </div>
                <p className="text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
