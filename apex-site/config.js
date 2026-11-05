// Where the contact form POSTs (JSON body). Leave empty until a backend exists —
// the form will refuse to submit and tell the user to email instead, so no
// lead is silently dropped.
//
// Options:
//  - Formspree / Basin / Getform endpoint URL (fastest, no code)
//  - A Supabase Edge Function that inserts into a `leads` table
//    (keep the table insert-only via the function; don't expose it to anon reads)
window.APEX_CONFIG = {
  formEndpoint: ""
};
