import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Star,
  X,
  ArrowLeft,
} from 'lucide-react';
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from '@/shared/ui/drawer';
import { BrandSelect } from '@/shared/ui/brand-select';
import { cn } from '@/shared/lib/cn';
import { HELP_ICONS } from './icon-map';
import {
  useHelpStore,
  type HelpCategory,
  type HelpArticle,
  type HelpIconKey,
  type ArticleStatus,
} from './help-store';

const ICON_KEYS: HelpIconKey[] = ['rocket', 'building', 'clipboard', 'users', 'wallet', 'settings'];

const inputCls =
  'w-full px-3 py-2 bg-white border border-[#E3E3E3] rounded-md text-sm text-[#1A1A1A] placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] transition-colors';

export default function HelpManager({ onExit }: { onExit: () => void }) {
  const { t } = useTranslation();
  const rawCategories = useHelpStore((s) => s.categories);
  const articles = useHelpStore((s) => s.articles);
  const categories = useMemo(() => [...rawCategories].sort((a, b) => a.order - b.order), [rawCategories]);
  const reorderCategories = useHelpStore((s) => s.reorderCategories);
  const removeCategory = useHelpStore((s) => s.removeCategory);
  const removeArticle = useHelpStore((s) => s.removeArticle);
  const updateArticle = useHelpStore((s) => s.updateArticle);
  const resetToDefaults = useHelpStore((s) => s.resetToDefaults);

  const [catEditor, setCatEditor] = useState<{ open: boolean; cat: HelpCategory | null }>({ open: false, cat: null });
  const [artEditor, setArtEditor] = useState<{ open: boolean; art: HelpArticle | null }>({ open: false, art: null });
  const [confirm, setConfirm] = useState<{ kind: 'category' | 'article'; slug: string; name: string; note?: string } | null>(null);

  const catTitle = (slug: string) => categories.find((c) => c.slug === slug)?.title ?? '—';
  const moveCat = (slug: string, dir: -1 | 1) => {
    const ids = categories.map((c) => c.slug);
    const i = ids.indexOf(slug);
    const j = i + dir;
    if (i === -1 || j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    reorderCategories(ids);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      {/* Manage header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-sm font-medium text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('Back to Help Center')}
        </button>
        <button
          onClick={() => setConfirm({ kind: 'category', slug: '__reset__', name: t('all help content'), note: t('Restores the original categories and articles. Your edits will be lost.') })}
          className="text-sm font-medium text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors cursor-pointer"
        >
          {t('Restore defaults')}
        </button>
      </div>

      <div className="mb-2">
        <h1 className="text-3xl font-serif text-[#1A1A1A]">{t('Manage Help Center')}</h1>
        <p className="text-sm text-[#8A8A8A] mt-1 max-w-2xl">
          {t('Categories and articles below power the Help Center. Only published articles are shown to readers.')}
        </p>
      </div>

      <div className="mt-8 space-y-10 max-w-4xl pb-16">
        {/* Categories */}
        <section>
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-medium text-[#1A1A1A]">{t('Categories')}</h2>
              <p className="text-sm text-[#8A8A8A] mt-1">{categories.length} {t('total')}</p>
            </div>
            <button
              onClick={() => setCatEditor({ open: true, cat: null })}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#FF3C21] rounded-md hover:bg-[#E63419] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {t('Add category')}
            </button>
          </div>
          <div className="bg-white border border-[#E3E3E3] rounded-md divide-y divide-[#E3E3E3]">
            {categories.map((c, i) => {
              const Icon = HELP_ICONS[c.iconKey];
              const count = articles.filter((a) => a.categorySlug === c.slug).length;
              return (
                <div key={c.slug} className="flex items-center gap-3 px-5 py-4">
                  <div className="flex flex-col shrink-0">
                    <button onClick={() => moveCat(c.slug, -1)} disabled={i === 0} className="p-0.5 text-[#8A8A8A] hover:text-[#1A1A1A] rounded transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed" aria-label={t('Move up')}>
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => moveCat(c.slug, 1)} disabled={i === categories.length - 1} className="p-0.5 text-[#8A8A8A] hover:text-[#1A1A1A] rounded transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed" aria-label={t('Move down')}>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="flex items-center justify-center w-9 h-9 rounded-md bg-[#F3F3F3] text-[#4A4A4A] shrink-0">
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#1A1A1A]">{c.title}</div>
                    <div className="text-xs text-[#8A8A8A] mt-0.5 truncate">{c.description}</div>
                  </div>
                  <span className="text-xs text-[#8A8A8A] tabular-nums shrink-0 w-16 text-right">{count} {t('articles')}</span>
                  <button onClick={() => setCatEditor({ open: true, cat: c })} className="p-1.5 text-[#8A8A8A] hover:text-[#1A1A1A] hover:bg-[#F3F3F3] rounded-md transition-colors cursor-pointer shrink-0" aria-label={t('Edit')}>
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setConfirm({ kind: 'category', slug: c.slug, name: c.title, note: count > 0 ? `${count} ${t('articles in this category will also be deleted.')}` : undefined })} className="p-1.5 text-[#8A8A8A] hover:text-[#B91C1C] hover:bg-[#FEF2F2] rounded-md transition-colors cursor-pointer shrink-0" aria-label={t('Delete')}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Articles */}
        <section>
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-medium text-[#1A1A1A]">{t('Articles')}</h2>
              <p className="text-sm text-[#8A8A8A] mt-1">
                {articles.filter((a) => a.status === 'published').length} {t('published')} · {articles.length} {t('total')}
              </p>
            </div>
            <button
              onClick={() => setArtEditor({ open: true, art: null })}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#FF3C21] rounded-md hover:bg-[#E63419] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {t('Add article')}
            </button>
          </div>
          <div className="bg-white border border-[#E3E3E3] rounded-md divide-y divide-[#E3E3E3]">
            {articles.map((a) => (
              <div key={a.slug} className="flex items-center gap-3 px-5 py-4">
                <button
                  onClick={() => updateArticle(a.slug, { popular: !a.popular })}
                  className="p-1 shrink-0 cursor-pointer"
                  title={a.popular ? t('Featured in Popular') : t('Mark as popular')}
                  aria-label={t('Toggle popular')}
                >
                  <Star className={cn('w-4 h-4 transition-colors', a.popular ? 'text-[#FF3C21] fill-[#FF3C21]' : 'text-[#D4D4D4]')} />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#1A1A1A] truncate">{a.title}</div>
                  <div className="text-xs text-[#8A8A8A] mt-0.5 truncate">{catTitle(a.categorySlug)} · {a.readTime}</div>
                </div>
                <button
                  onClick={() => updateArticle(a.slug, { status: a.status === 'published' ? 'draft' : 'published' })}
                  className={cn(
                    'shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors',
                    a.status === 'published' ? 'bg-[#ECFDF5] text-[#047857] hover:bg-[#D1FAE5]' : 'bg-[#F3F3F3] text-[#8A8A8A] hover:bg-[#E8E8E8]',
                  )}
                  title={t('Toggle published / draft')}
                >
                  {a.status === 'published' ? t('Published') : t('Draft')}
                </button>
                <button onClick={() => setArtEditor({ open: true, art: a })} className="p-1.5 text-[#8A8A8A] hover:text-[#1A1A1A] hover:bg-[#F3F3F3] rounded-md transition-colors cursor-pointer shrink-0" aria-label={t('Edit')}>
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setConfirm({ kind: 'article', slug: a.slug, name: a.title })} className="p-1.5 text-[#8A8A8A] hover:text-[#B91C1C] hover:bg-[#FEF2F2] rounded-md transition-colors cursor-pointer shrink-0" aria-label={t('Delete')}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {articles.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-[#8A8A8A]">{t('No articles yet.')}</div>
            )}
          </div>
        </section>
      </div>

      <CategoryEditor
        key={catEditor.cat?.slug ?? 'new-cat'}
        open={catEditor.open}
        category={catEditor.cat}
        onClose={() => setCatEditor({ open: false, cat: null })}
      />
      <ArticleEditor
        key={artEditor.art?.slug ?? 'new-art'}
        open={artEditor.open}
        article={artEditor.art}
        categories={categories}
        onClose={() => setArtEditor({ open: false, art: null })}
      />
      <ConfirmDelete
        confirm={confirm}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (!confirm) return;
          if (confirm.slug === '__reset__') resetToDefaults();
          else if (confirm.kind === 'category') removeCategory(confirm.slug);
          else removeArticle(confirm.slug);
          setConfirm(null);
        }}
      />
    </motion.div>
  );
}

/* ─────────────────────────── Category editor drawer ─────────────────────────── */

function CategoryEditor({
  open,
  category,
  onClose,
}: {
  open: boolean;
  category: HelpCategory | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const addCategory = useHelpStore((s) => s.addCategory);
  const updateCategory = useHelpStore((s) => s.updateCategory);
  const [title, setTitle] = useState(category?.title ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [iconKey, setIconKey] = useState<HelpIconKey>(category?.iconKey ?? 'rocket');
  const canSave = title.trim().length > 0;

  const submit = () => {
    if (category) updateCategory(category.slug, { title, description, iconKey });
    else addCategory({ title, description, iconKey });
    onClose();
  };

  return (
    <EditorShell
      open={open}
      onClose={onClose}
      title={category ? t('Edit category') : t('Add category')}
      description={t('Categories group articles in the Help Center.')}
      onSave={submit}
      canSave={canSave}
      saveLabel={category ? t('Save changes') : t('Add category')}
    >
      <Field label={t('Title')}>
        <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('e.g. Getting Started')} />
      </Field>
      <Field label={t('Description')}>
        <textarea className={cn(inputCls, 'resize-none')} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('One line shown under the title.')} />
      </Field>
      <Field label={t('Icon')}>
        <BrandSelect
          value={iconKey}
          onValueChange={(v) => setIconKey(v as HelpIconKey)}
          options={ICON_KEYS.map((k) => {
            const Icon = HELP_ICONS[k];
            return { value: k, label: (<span className="flex items-center gap-2"><Icon className="w-4 h-4" />{k}</span>) };
          })}
        />
      </Field>
    </EditorShell>
  );
}

/* ─────────────────────────── Article editor drawer ─────────────────────────── */

function ArticleEditor({
  open,
  article,
  categories,
  onClose,
}: {
  open: boolean;
  article: HelpArticle | null;
  categories: HelpCategory[];
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const addArticle = useHelpStore((s) => s.addArticle);
  const updateArticle = useHelpStore((s) => s.updateArticle);
  const [title, setTitle] = useState(article?.title ?? '');
  const [categorySlug, setCategorySlug] = useState(article?.categorySlug ?? categories[0]?.slug ?? '');
  const [description, setDescription] = useState(article?.description ?? '');
  const [readTime, setReadTime] = useState(article?.readTime ?? '3 min');
  const [body, setBody] = useState(article?.body ?? '');
  const [status, setStatus] = useState<ArticleStatus>(article?.status ?? 'published');
  const [popular, setPopular] = useState(article?.popular ?? false);
  const canSave = title.trim().length > 0 && categorySlug.length > 0;

  const submit = () => {
    if (article) updateArticle(article.slug, { categorySlug, title, description, readTime, body, status, popular });
    else addArticle({ categorySlug, title, description, readTime, body, status, popular });
    onClose();
  };

  return (
    <EditorShell
      open={open}
      onClose={onClose}
      title={article ? t('Edit article') : t('Add article')}
      description={t('Only published articles appear in the Help Center.')}
      onSave={submit}
      canSave={canSave}
      saveLabel={article ? t('Save changes') : t('Add article')}
    >
      <Field label={t('Title')}>
        <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('e.g. How to create your first survey')} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label={t('Category')}>
          <BrandSelect value={categorySlug} onValueChange={setCategorySlug} options={categories.map((c) => ({ value: c.slug, label: c.title }))} />
        </Field>
        <Field label={t('Read time')}>
          <input className={inputCls} value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder="3 min" />
        </Field>
      </div>
      <Field label={t('Description')}>
        <textarea className={cn(inputCls, 'resize-none')} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('Short summary shown in lists.')} />
      </Field>
      <Field label={t('Body')} hint={t('Plain text — blank lines start a new paragraph.')}>
        <textarea className={cn(inputCls, 'resize-y min-h-[160px] leading-relaxed')} value={body} onChange={(e) => setBody(e.target.value)} placeholder={t('Write the article content…')} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label={t('Status')}>
          <BrandSelect value={status} onValueChange={(v) => setStatus(v as ArticleStatus)} options={[{ value: 'published', label: t('Published') }, { value: 'draft', label: t('Draft') }]} />
        </Field>
        <Field label={t('Popular')} hint={t('Feature in “Popular articles”.')}>
          <button
            type="button"
            role="switch"
            aria-checked={popular}
            onClick={() => setPopular((v) => !v)}
            className={cn('relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors cursor-pointer', popular ? 'bg-[#FF3C21]' : 'bg-[#E3E3E3]')}
          >
            <span className={cn('inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform', popular ? 'translate-x-[18px]' : 'translate-x-[3px]')} />
          </button>
        </Field>
      </div>
    </EditorShell>
  );
}

/* ─────────────────────────── Shared editor shell + helpers ─────────────────────────── */

function EditorShell({
  open,
  onClose,
  title,
  description,
  onSave,
  canSave,
  saveLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onSave: () => void;
  canSave: boolean;
  saveLabel: string;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <Drawer direction="right" open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="!max-w-lg data-[vaul-drawer-direction=right]:sm:!max-w-lg bg-white border-l border-[#E3E3E3] p-0">
        <div className="flex flex-col h-full overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E3E3E3] flex items-start justify-between gap-4 shrink-0">
            <div className="min-w-0">
              <DrawerTitle className="text-base font-medium text-[#1A1A1A]">{title}</DrawerTitle>
              <DrawerDescription className="text-sm text-[#8A8A8A] mt-0.5">{description}</DrawerDescription>
            </div>
            <button onClick={onClose} className="p-1 text-[#8A8A8A] hover:text-[#1A1A1A] hover:bg-[#F3F3F3] rounded-md transition-colors cursor-pointer shrink-0" aria-label={t('Close')}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">{children}</div>
          <div className="px-6 py-4 border-t border-[#E3E3E3] bg-white shrink-0 flex items-center justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-[#4A4A4A] bg-white border border-[#E3E3E3] rounded-md hover:bg-[#F3F3F3] transition-colors cursor-pointer">{t('Cancel')}</button>
            <button onClick={onSave} disabled={!canSave} className="px-4 py-2 text-sm font-medium text-white bg-[#FF3C21] rounded-md hover:bg-[#E63419] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">{saveLabel}</button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{label}</label>
      {hint && <p className="text-xs text-[#8A8A8A] mb-1.5 -mt-1">{hint}</p>}
      {children}
    </div>
  );
}

function ConfirmDelete({
  confirm,
  onCancel,
  onConfirm,
}: {
  confirm: { kind: 'category' | 'article'; slug: string; name: string; note?: string } | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { t } = useTranslation();
  if (typeof document === 'undefined') return null;
  const isReset = confirm?.slug === '__reset__';
  return createPortal(
    <AnimatePresence>
      {confirm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#1A1A1A]/30 flex items-center justify-center z-50 p-4" onClick={onCancel}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="bg-white rounded-md w-full max-w-sm border border-[#E3E3E3] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-base font-medium text-[#1A1A1A]">
                {isReset ? t('Restore default help content?') : confirm.kind === 'category' ? t('Delete category?') : t('Delete article?')}
              </h2>
              <p className="text-sm text-[#4A4A4A] mt-2 leading-relaxed">
                <span className="font-medium text-[#1A1A1A]">{confirm.name}</span>
                {confirm.note ? ` — ${confirm.note}` : isReset ? '' : ` ${t('will be permanently removed.')}`}
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[#E3E3E3]">
              <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-[#4A4A4A] bg-white border border-[#E3E3E3] rounded-md hover:bg-[#F3F3F3] transition-colors cursor-pointer">{t('Cancel')}</button>
              <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-[#DC2626] rounded-md hover:bg-[#B91C1C] transition-colors cursor-pointer">{isReset ? t('Restore') : t('Delete')}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
