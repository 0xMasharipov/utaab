// Dependency-free contract shared by the browser, Edge Function, and tests.
export const scenarioIds = ['deadline', 'evidence', 'priorities'] as const;
export type ScenarioId = typeof scenarioIds[number];
export const dimensions = ['motivation', 'collaboration', 'judgment', 'ownership', 'communication'] as const;
export const roles = ['Community & Growth', 'Partnerships', 'Events & Ecosystem', 'Research', 'Content & Media', 'Design', 'Product', 'Frontend Development', 'Backend Development', 'Smart Contract / Blockchain Development', 'Operations', 'Strategy', 'Education / Workshops', 'Analytics'] as const;
export const evidenceSources = ['whyJoin', 'desiredImpact', 'proudAchievement', 'whatToBuild', 'bestTeamEnvironment', ...scenarioIds] as const;

export interface Evidence {
  source: typeof evidenceSources[number];
  quote: string;
}
export interface Observation {
  dimension: typeof dimensions[number];
  observation: string;
  uncertainty: string;
  evidence: Evidence[];
}
export interface AIResult {
  primary_role: string;
  secondary_role: string;
  compatibility_score: number;
  profile_summary: string;
  strengths: string[];
  why_this_role: string;
  growth_recommendations: string;
  suggested_first_step: string;
  recommended_department: string;
  growth_path: string;
  observations?: Observation[];
  role_evidence?: Evidence[];
  discussion_questions?: string[];
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
const boundedText = (value: unknown, min = 1, max = 4000): value is string =>
  typeof value === 'string' && value.trim().length >= min && value.length <= max;

// Returns the first invalid stage, so both review submission and the server enforce the same requirements.
export function invalidAssessmentStage(data: Record<string, unknown>): number | null {
  if (!boundedText(data.fullName, 1, 200) || !boundedText(data.email, 1, 255) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email as string)) return 0;
  if (!Array.isArray(data.topicInterests) || !data.topicInterests.length || !data.topicInterests.every(v => boundedText(v, 1, 100))) return 1;
  if (!Array.isArray(data.strengths) || !data.strengths.length || !data.strengths.every(v => boundedText(v, 1, 100))) return 2;
  if (!boundedText(data.workPreference, 1, 100) || !boundedText(data.decisionStyle, 1, 100)) return 3;
  if (!boundedText(data.weeklyHours, 1, 50) || !boundedText(data.whyJoin, 1, 2000) || data.whyJoin.trim().split(/\s+/).length < 50) return 4;
  if (!isRecord(data.scenarioAnswers) || scenarioIds.some(id => !boundedText((data.scenarioAnswers as Record<string, unknown>)[id], 80, 2000))) return 5;
  return null;
}

export function getEvidenceText(data: Record<string, unknown>, source: string): string {
  const value = scenarioIds.includes(source as ScenarioId)
    ? (isRecord(data.scenarioAnswers) ? data.scenarioAnswers[source] : undefined)
    : data[source];
  return typeof value === 'string' ? value : '';
}

export function validateResult(value: unknown, data?: Record<string, unknown>, extended = false): AIResult {
  if (!isRecord(value)) throw new Error('Invalid report');
  if (!roles.includes(value.primary_role as typeof roles[number]) || !roles.includes(value.secondary_role as typeof roles[number])) throw new Error('Invalid role');
  if (typeof value.compatibility_score !== 'number' || !Number.isFinite(value.compatibility_score) || value.compatibility_score < 0 || value.compatibility_score > 100) throw new Error('Invalid estimate');
  for (const key of ['profile_summary', 'why_this_role', 'growth_recommendations', 'suggested_first_step', 'recommended_department', 'growth_path']) {
    if (!boundedText(value[key])) throw new Error('Incomplete report');
  }
  if (!Array.isArray(value.strengths) || value.strengths.length < 1 || value.strengths.length > 8 || !value.strengths.every(v => boundedText(v, 1, 300))) throw new Error('Invalid strengths');
  const checkEvidence = (items: unknown, min: number) => {
    if (!Array.isArray(items) || items.length < min || items.length > 5) throw new Error('Invalid evidence');
    for (const item of items) {
      if (!isRecord(item) || !evidenceSources.includes(item.source as typeof evidenceSources[number]) || !boundedText(item.quote, 8, 400)) throw new Error('Invalid citation');
      if (data && !getEvidenceText(data, item.source as string).includes(item.quote)) throw new Error('Evidence does not match the answer');
    }
  };
  if (extended || value.observations !== undefined) {
    if (!Array.isArray(value.observations) || value.observations.length !== dimensions.length) throw new Error('Missing observations');
    const found = new Set<string>();
    for (const item of value.observations) {
      if (!isRecord(item) || !dimensions.includes(item.dimension as typeof dimensions[number]) || found.has(item.dimension as string) || !boundedText(item.observation) || !boundedText(item.uncertainty)) throw new Error('Invalid observation');
      found.add(item.dimension as string);
      checkEvidence(item.evidence, 1);
    }
  }
  if (extended || value.role_evidence !== undefined) checkEvidence(value.role_evidence, 1);
  if (extended || value.discussion_questions !== undefined) {
    if (!Array.isArray(value.discussion_questions) || value.discussion_questions.length < 1 || value.discussion_questions.length > 5 || !value.discussion_questions.every(q => boundedText(q, 1, 500))) throw new Error('Invalid discussion questions');
  }
  return value as unknown as AIResult;
}
