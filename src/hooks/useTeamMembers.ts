import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { STATIC_TEAM, TEAM_PHOTO_BY_NAME } from '@/data/teamStatic';

export interface TeamMemberView {
  id: string;
  /** Translation key for hardcoded fallback members (undefined for DB-backed members). */
  key?: string;
  name: string;
  position: string;
  description: string;
  tag: string;
  image?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  telegram?: string;
  website?: string;
}

const photoFor = (fullName: string): string | undefined => {
  const first = fullName.trim().split(/\s+/)[0]?.toLowerCase() ?? '';
  return TEAM_PHOTO_BY_NAME[first];
};

export const useTeamMembers = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'en').split('-')[0];

  const { data, isLoading } = useQuery({
    queryKey: ['team-members-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members_public')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 60_000,
  });

  const fallback: TeamMemberView[] = useMemo(
    () =>
      STATIC_TEAM.map((m) => ({
        id: m.key,
        key: m.key,
        name: t(`team.members.${m.key}.name`),
        position: t(`team.members.${m.key}.position`),
        description: t(`team.members.${m.key}.description`),
        tag: m.tag,
        image: m.image,
        linkedin: m.linkedin,
      })),
    [t],
  );

  const members: TeamMemberView[] = useMemo(() => {
    if (!data || data.length === 0) return fallback;
    return data.map((row: Record<string, unknown>) => {
      const bio =
        (row[`bio_${lang}`] as string | null) || (row.bio_en as string | null) || '';
      const fullName = (row.full_name as string) ?? '';
      return {
        id: row.id as string,
        name: fullName,
        position: (row.role_title as string) ?? '',
        description: bio,
        tag: (row.department as string) ?? '',
        image: (row.image_url as string | null) || photoFor(fullName),
        linkedin: (row.linkedin_url as string | null) || undefined,
        twitter: (row.twitter_url as string | null) || undefined,
        instagram: (row.instagram_url as string | null) || undefined,
        telegram: (row.telegram_url as string | null) || undefined,
        website: (row.website_url as string | null) || undefined,
      };
    });
  }, [data, fallback, lang]);

  return { members, isLoading };
};

/** Primary outbound link for a member's Contact action. */
export const primaryLink = (m: TeamMemberView) =>
  m.linkedin || m.twitter || m.telegram || m.instagram || m.website;
