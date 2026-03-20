-- CTW-COCKPIT-03B: Seed sample CEO contacts
-- Strategic contacts across all four projects with pre-computed scores

INSERT INTO public.ceo_contacts (name, organisation, role, project_tags, last_interaction_at, responsiveness_score, strategic_value_score, recency_score, momentum_score, cross_project_score, total_score, priority_level, follow_up_action, follow_up_message_type, notes) VALUES

-- 1. Prof Eu Kong Weng — COLONAiVE KOL (Critical)
('Prof Eu Kong Weng', 'National University Hospital', 'kol',
 ARRAY['COLONAiVE'], '2026-03-18T00:00:00Z',
 18, 36, 12, 14, 2, 82,
 'critical', 'convert', 'strategic',
 'Senior colorectal surgeon. Key advisory board candidate. Movement champion.'),

-- 2. Dr Francis Seow-Choen — COLONAiVE KOL (Critical)
('Dr Francis Seow-Choen', 'Seow-Choen Colorectal Centre', 'kol',
 ARRAY['COLONAiVE'], '2026-03-15T00:00:00Z',
 16, 36, 10, 13, 2, 77,
 'active', 'follow_up', 'strategic',
 'Pioneer colorectal surgeon Singapore. Strong advocate for screening. Advisor.'),

-- 3. Prof Lawrence Ho — COLONAiVE KOL (Active)
('Prof Lawrence Ho', 'NUS / NUHS', 'kol',
 ARRAY['COLONAiVE'], '2026-03-10T00:00:00Z',
 14, 36, 10, 12, 2, 74,
 'active', 'nurture', 'update',
 'Academic KOL. National screening policy influence.'),

-- 4. Aaron (Singlera) — COLONAiVE Partner (Active)
('Aaron', 'Singlera Genomics', 'partner',
 ARRAY['COLONAiVE'], '2026-03-19T00:00:00Z',
 15, 25, 15, 12, 2, 69,
 'active', 'nurture', 'update',
 'Key manufacturer contact. Technical support and supply chain.'),

-- 5. Qiang Liu — COLONAiVE Partner (Active)
('Qiang Liu', 'Singlera Health Technologies', 'partner',
 ARRAY['COLONAiVE'], '2026-03-12T00:00:00Z',
 12, 25, 10, 10, 2, 59,
 'warm', 'nurture', 'relationship',
 'Singlera leadership. Strategic partnership alignment.'),

-- 6. Dr Daniel Lee — COLONAiVE Clinician (Active)
('Dr Daniel Lee', 'KTPH', 'clinician',
 ARRAY['COLONAiVE'], '2026-03-05T00:00:00Z',
 10, 28, 7, 13, 2, 60,
 'active', 'follow_up', 'ask',
 'Investigator-initiated study interest. Priority to convert to structured local evidence plan.'),

-- 7. Manish Shrivastava — COLONAiVE Regulator Consultant (Warm)
('Manish Shrivastava', 'SKV Solutions Pvt Ltd', 'regulator',
 ARRAY['COLONAiVE'], '2026-02-20T00:00:00Z',
 8, 40, 4, 8, 2, 62,
 'active', 'follow_up', 'strategic',
 'India CDSCO regulatory consultant. MD-14/MD-15 pathway.'),

-- 8. Durham University Contact — Durmah Academic (Warm)
('Prof Sarah Mitchell', 'Durham University Law School', 'academic',
 ARRAY['Durmah'], '2026-03-01T00:00:00Z',
 10, 15, 7, 10, 2, 44,
 'warm', 'nurture', 'relationship',
 'Law faculty contact. University partnership for learning packs.'),

-- 9. MyScienceHOD Lead — Cross-Project (Active)
('Dr Raj Patel', 'MOE Singapore', 'government',
 ARRAY['MyScienceHOD', 'COLONAiVE'], '2026-03-14T00:00:00Z',
 14, 35, 10, 12, 5, 76,
 'active', 'convert', 'strategic',
 'Education ministry contact. Cross-project influence. Revenue activation pathway.'),

-- 10. SG Renovate Advisor — Governance (Warm)
('James Tan', 'BCA Singapore', 'government',
 ARRAY['SG Renovate'], '2026-02-15T00:00:00Z',
 6, 35, 4, 5, 2, 52,
 'warm', 'nurture', 'update',
 'Building & Construction Authority. Renovation governance alignment.');
