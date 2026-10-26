(() => {
  const form = document.querySelector('#ambassador-form');
  if (!form) return;
  const status = document.querySelector('#ambassador-status');
  const button = form.querySelector('[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const profile = String(data.get('profile') || '').trim();
    const message = [
      `Ambassador role: ${data.get('role')}`,
      profile ? `Portfolio or social profile: ${profile}` : '',
      '',
      String(data.get('story') || '').trim()
    ].join('\n');

    button.disabled = true;
    status.textContent = 'Sending your introduction…';
    try {
      const response = await fetch('/api/atelier/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(data.get('name') || '').trim(),
          email: String(data.get('email') || '').trim(),
          country: String(data.get('country') || '').trim(),
          interest: 'Zateemee Ambassador Program',
          message
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Your introduction could not be sent. Please try again.');
      status.textContent = `Thank you. Your introduction has been received. Reference: ${result.reference}.`;
      form.reset();
    } catch (error) {
      const prepared = `Zateemee Ambassador Program\n\nName: ${String(data.get('name') || '').trim()}\nEmail: ${String(data.get('email') || '').trim()}\nBased in: ${String(data.get('country') || '').trim()}\n\n${message}`;
      let fallback = form.querySelector('.ambassador-fallback');
      if (!fallback) {
        fallback = document.createElement('div');
        fallback.className = 'ambassador-fallback ambassador-wide';
        const copy = document.createElement('button');
        copy.type = 'button';
        copy.className = 'text-link';
        copy.textContent = 'Copy prepared introduction';
        const textarea = document.createElement('textarea');
        textarea.readOnly = true;
        textarea.rows = 8;
        copy.addEventListener('click', async () => { try { await navigator.clipboard.writeText(textarea.value); copy.textContent = 'Introduction copied'; } catch { textarea.select(); } });
        fallback.append(textarea, copy);
        form.append(fallback);
      }
      fallback.querySelector('textarea').value = prepared;
      status.textContent = 'Your introduction is prepared below. Copy it to share directly with the atelier.';
    } finally {
      button.disabled = false;
    }
  });
})();
