import React from 'react';
import {
  WhatsAppIcon,
  InstagramIcon,
  FacebookIcon,
  TelegramIcon,
} from '@/components/common/BrandIcons';
import { Globe } from 'lucide-react';

export function ChannelLogo({ name }: { name: string }) {
  const n = name.toLowerCase();
  if (n.includes('whatsapp')) return <WhatsAppIcon className="h-8 w-8 shrink-0" />;
  if (n.includes('instagram')) return <InstagramIcon className="h-8 w-8 shrink-0" />;
  if (n.includes('facebook') || n.includes('messenger')) return <FacebookIcon className="h-8 w-8 shrink-0" />;
  if (n.includes('telegram')) return <TelegramIcon className="h-8 w-8 shrink-0" />;
  return <Globe className="h-8 w-8 text-primary shrink-0" />;
}
