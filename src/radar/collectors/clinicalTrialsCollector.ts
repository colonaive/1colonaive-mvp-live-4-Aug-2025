/**
 * ClinicalTrials.gov Collector — fetches CRC-related clinical trials
 */

export interface ClinicalTrialResult {
  trial_id: string;
  title: string;
  institution: string;
  phase: string;
  status: string;
  country: string;
  link: string;
  summary: string;
}

const CT_QUERIES = [
  'colorectal cancer screening',
  'ctDNA colorectal',
  'methylation biomarkers colorectal',
];

export async function collectClinicalTrials(): Promise<ClinicalTrialResult[]> {
  const results: ClinicalTrialResult[] = [];
  const seenIds = new Set<string>();

  for (const query of CT_QUERIES) {
    try {
      const url =
        'https://clinicaltrials.gov/api/v2/studies?' +
        `query.term=${encodeURIComponent(query)}` +
        '&filter.overallStatus=RECRUITING,NOT_YET_RECRUITING,ACTIVE_NOT_RECRUITING' +
        '&pageSize=10&sort=LastUpdatePostDate';

      const res = await fetch(url, {
        headers: { 'User-Agent': 'COLONAiVE/RadarCollector' },
      });
      if (!res.ok) continue;

      const data = await res.json();
      const studies = data?.studies || [];

      for (const study of studies) {
        const proto = study?.protocolSection;
        if (!proto) continue;

        const nctId = proto.identificationModule?.nctId;
        if (!nctId || seenIds.has(nctId)) continue;
        seenIds.add(nctId);

        const phases = proto.designModule?.phases || [];
        const locations = proto.contactsLocationsModule?.locations || [];
        const country = locations[0]?.country || '';
        const institution = proto.identificationModule?.organization?.fullName ||
                           locations[0]?.facility || '';

        results.push({
          trial_id: nctId,
          title: proto.identificationModule?.briefTitle || proto.identificationModule?.officialTitle || '',
          institution,
          phase: phases.join(', ') || 'Not specified',
          status: proto.statusModule?.overallStatus || '',
          country,
          link: `https://clinicaltrials.gov/study/${nctId}`,
          summary: proto.descriptionModule?.briefSummary || '',
        });
      }
    } catch {
      continue;
    }
  }

  return results;
}
