import { useTranslation } from 'react-i18next';
const groups = [
  { id: 'builder', roles: ['frontend', 'backend', 'smartContract', 'product'] },
  { id: 'researcher', roles: ['research', 'analytics', 'education'] },
  { id: 'operator', roles: ['operations', 'strategy', 'events'] },
  { id: 'connector', roles: ['community', 'partnerships', 'events'] },
  { id: 'creator', roles: ['design', 'content'] },
  { id: 'strategist', roles: ['strategy', 'product', 'partnerships'] },
];
export default function ContributorArchetypes() {
  const { t } = useTranslation();
  return <div>
    <div className="cm-role-list">{groups.map(group => <article key={group.id}>
      <div className="cm-role-copy"><h3>{t(`contributor.archetypes.${group.id}`)}</h3><p>{t(`contributor.archetypes.${group.id}Desc`)}</p><div className="cm-role-tags">{group.roles.map(role => <span key={role}>{t(`contributor.archetypes.roles.${role}`)}</span>)}</div></div>
    </article>)}</div>
    <p className="cm-role-note">{t('contributor.studio.rolesNote')}</p>
  </div>;
}
