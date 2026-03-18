import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';
import { Languages, Upload, AlertTriangle } from 'lucide-react';
import i18n from '@/i18n/config';

import en from '@/i18n/locales/en.json';
import tr from '@/i18n/locales/tr.json';
import ru from '@/i18n/locales/ru.json';
import ar from '@/i18n/locales/ar.json';

const localeData: Record<string, Record<string, any>> = { en, tr, ru, ar };
const localeLabels: Record<string, string> = {
  en: 'English',
  tr: 'Türkçe',
  ru: 'Русский',
  ar: 'العربية',
};

export default function TranslationEditor() {
  const [selectedLocale, setSelectedLocale] = useState('en');
  const [edits, setEdits] = useState<Record<string, Record<string, string>>>({});

  const sections = useMemo(() => {
    const data = localeData[selectedLocale] || {};
    return Object.keys(data).sort();
  }, [selectedLocale]);

  const getSectionValue = (section: string): string => {
    return edits[selectedLocale]?.[section] ??
      JSON.stringify((localeData[selectedLocale] as any)?.[section] ?? {}, null, 2);
  };

  const handleSectionEdit = (section: string, value: string) => {
    setEdits((prev) => ({
      ...prev,
      [selectedLocale]: {
        ...prev[selectedLocale],
        [section]: value,
      },
    }));
  };

  const validateJson = (value: string): boolean => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleApply = () => {
    const localeEdits = edits[selectedLocale];
    if (!localeEdits || Object.keys(localeEdits).length === 0) {
      toast.info('No changes to apply');
      return;
    }

    const merged: Record<string, any> = { ...localeData[selectedLocale] };
    for (const [section, raw] of Object.entries(localeEdits)) {
      if (!validateJson(raw)) {
        toast.error(`Invalid JSON in section "${section}". Fix it before applying.`);
        return;
      }
      merged[section] = JSON.parse(raw);
    }

    i18n.addResourceBundle(selectedLocale, 'translation', merged, true, true);
    // Force re-render across the app by re-emitting languageChanged
    i18n.changeLanguage(selectedLocale);
    const updatedSections = Object.keys(localeEdits).join(', ');
    toast.success(`Translations applied for ${localeLabels[selectedLocale]}: ${updatedSections} (session only)`);
  };

  const handleExport = () => {
    const localeEdits = edits[selectedLocale];
    const merged: Record<string, any> = { ...localeData[selectedLocale] };
    if (localeEdits) {
      for (const [section, raw] of Object.entries(localeEdits)) {
        if (validateJson(raw)) merged[section] = JSON.parse(raw);
      }
    }
    const blob = new Blob([JSON.stringify(merged, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedLocale}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${selectedLocale}.json`);
  };

  return (
    <Card className="glass-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Translation Content</h2>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedLocale} onValueChange={setSelectedLocale}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(localeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExport}>
            Export JSON
          </Button>
          <Button size="sm" onClick={handleApply} className="gap-1">
            <Upload className="h-3.5 w-3.5" />
            Apply Changes
          </Button>
        </div>
      </div>

      <div className="flex items-start gap-2 mb-4 rounded-md border border-accent/30 bg-accent/10 p-3 text-sm text-muted-foreground">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
        <span>Changes are applied in-memory for this session only. Export the JSON to persist changes across deployments.</span>
      </div>

      <Accordion type="multiple" className="space-y-1">
        {sections.map((section) => {
          const raw = getSectionValue(section);
          const isValid = validateJson(raw);
          return (
            <AccordionItem key={section} value={section} className="border rounded-md px-3">
              <AccordionTrigger className="text-sm font-mono hover:no-underline">
                <span className="flex items-center gap-2">
                  {section}
                  {!isValid && (
                    <span className="text-xs text-destructive font-sans">(invalid JSON)</span>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Textarea
                  className={`font-mono text-xs min-h-[200px] ${!isValid ? 'border-destructive' : ''}`}
                  value={raw}
                  onChange={(e) => handleSectionEdit(section, e.target.value)}
                  spellCheck={false}
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Card>
  );
}
