import type { ElementType } from 'react';
import {
  Rocket,
  Building2,
  ClipboardList,
  UsersRound,
  Wallet,
  Settings,
} from 'lucide-react';
import type { HelpIconKey } from './help-data';

export const HELP_ICONS: Record<HelpIconKey, ElementType> = {
  rocket: Rocket,
  building: Building2,
  clipboard: ClipboardList,
  users: UsersRound,
  wallet: Wallet,
  settings: Settings,
};
