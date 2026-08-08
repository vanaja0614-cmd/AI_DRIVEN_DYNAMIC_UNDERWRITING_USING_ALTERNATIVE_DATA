import client from "./client";

/**
 * POST /consent/
 * Backend schema (ConsentRequest) now accepts the four real UI toggles:
 *   employment_signals_consent, professional_presence_consent,
 *   digital_signals_consent, public_data_consent
 * plus the three legacy buckets (digital/transaction/behavioral) that the
 * older monitoring/reporting layer still expects.
 */
export function saveConsent({
  customerId,
  employmentSignals,
  professionalPresence,
  digitalSignals,
  publicData,
  version = "1.0",
}) {
  const payload = {
    customer_id: customerId,
    digital_data_consent: digitalSignals,
    transaction_data_consent: publicData,
    behavioral_data_consent: employmentSignals || professionalPresence,
    employment_signals_consent: employmentSignals,
    professional_presence_consent: professionalPresence,
    digital_signals_consent: digitalSignals,
    public_data_consent: publicData,
    version,
  };
  return client.post("/consent/", payload).then((res) => res.data);
}
