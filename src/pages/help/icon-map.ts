import type { ElementType } from 'react';
import {
  Rocket,
  ClipboardList,
  MessageSquare,
  CreditCard,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import type { HelpIconKey } from './help-data';

export const HELP_ICONS: Record<HelpIconKey, ElementType> = {
  rocket: Rocket,
  clipboard: ClipboardList,
  message: MessageSquare,
  credit: CreditCard,
  settings: Settings,
  shield: ShieldCheck,
};
