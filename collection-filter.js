document.querySelectorAll('[data-collection-filter]').forEach(controls => {
  const cards = [...document.querySelectorAll(controls.dataset.target)];
  const search = controls.querySelector('input[type="search"]');
  const filter = controls.querySelector('select');
  const status = controls.querySelector('[role="status"]');
  const special = document.body.classList.contains('page-special-event') || !!document.querySelector('.special-occasions-page');
  const uniqueDresses = new Set(cards.map(card => card.getAttribute('href') || card.dataset.filterValue));
  if (special && uniqueDresses.size < 6) { filter.hidden = true; filter.value = ''; filter.setAttribute('aria-hidden','true'); }
  const african = document.body.classList.contains('page-african-couture');
  const singular = controls.dataset.itemSingular || (african ? 'look' : 'dress');
  const plural = controls.dataset.itemPlural || (african ? 'looks' : 'dresses');

  function update() {
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    cards.forEach(card => {
      const searchable = `${card.dataset.filterValue || ''} ${card.querySelector('img')?.alt || ''}`.toLocaleLowerCase();
      const visible = searchable.includes(query) && (!filter.value || (card.dataset.filterValue || '').split(' ').includes(filter.value));
      card.hidden = !visible;
      if (visible) count++;
    });
    status.textContent = count ? `${count} ${count === 1 ? singular : plural}` : `No ${plural} found. Try another search or filter.`;
  }

  search.addEventListener('input', update);
  filter.addEventListener('change', update);
  update();
});
