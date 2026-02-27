export interface IndiaLeadPayload {
    name?: string;
    email: string;
    whatsapp?: string;
    role?: string;
    message?: string;
    company?: string;
    csrFocus?: string;
    employeeCount?: string;
    preferredState?: string;
    type: 'partner' | 'csr' | 'join';
}

export const submitIndiaLead = async (payload: IndiaLeadPayload): Promise<{ ok: boolean; error?: string }> => {
    try {
        const response = await fetch('/api/india_lead', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.text();
            return { ok: false, error: errorData || 'Submission failed' };
        }

        const data = await response.json();
        return { ok: true, ...data };
    } catch (error: any) {
        console.error("India Lead submission error:", error);
        return { ok: false, error: error.message || 'Network error occurred' };
    }
};
