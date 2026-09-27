export * from './media';

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export type SectionVariant = 'carousel' | 'grid' | 'featured';

export interface AppNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}
