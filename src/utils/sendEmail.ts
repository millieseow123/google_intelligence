export async function sendEmail({to, subject, body}: {to: string; subject: string; body: string}) {
  const res = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, body })
  });
  if (!res.ok) {
    throw new Error('Failed to send email');
  }
  return res.json();
}
