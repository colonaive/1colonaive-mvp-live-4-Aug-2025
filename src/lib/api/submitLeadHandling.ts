import { submitIndiaLead } from "./submitIndiaLead.ts";

export const submitLeadHandling = async (e: React.FormEvent<HTMLFormElement>, formData: any, type: "partner" | "csr" | "join", toast: any, onSuccess: () => void) => {
    e.preventDefault();
    const loadingToast = toast.loading("Submitting...");

    try {
        const payload = { ...formData, type };
        const result = await submitIndiaLead(payload);

        if (result.ok) {
            toast.success("Thank you for your interest. We will be in touch shortly.", { id: loadingToast });
            onSuccess();
        } else {
            toast.error(result.error || "Failed to submit. Please try again.", { id: loadingToast });
        }
    } catch (error) {
        toast.error("An unexpected error occurred.", { id: loadingToast });
    }
};
