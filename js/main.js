(() => {
    const projectsById = new Map(PROJECTS.map(p => [p.id, p]));

    const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);

    const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"></use></svg>`;

    // ---- Rendering ---------------------------------------------------------

    function diagramHtml(project, extraClass = '') {
        if (!project.diagram) return '';
        const steps = project.diagram.map((step, i) => `<li style="--step: ${i}">${escapeHtml(step)}</li>`).join('');
        return `<div class="media media--diagram ${extraClass}">
                <ol class="pipeline" aria-label="How it works">${steps}</ol>
            </div>`;
    }

    const metaText = project => [project.type === 'client' ? 'Client' : 'University', project.org].filter(Boolean).join(' · ');

    const tagsHtml = tags => `<ul class="tags">${tags.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul>`;

    const linkHtml = project =>
        `<button type="button" class="card-link" data-project="${project.id}" aria-haspopup="dialog">${escapeHtml(project.title)}</button>`;

    const featureHtml = project => `<article class="feature-card" id="${project.id}">
            ${diagramHtml(project)}
            <div class="card-body">
                <h3>${linkHtml(project)}</h3>
                <p class="meta">${escapeHtml(metaText(project))}</p>
                <p>${escapeHtml(project.summary)}</p>
                ${tagsHtml(project.tags)}
                <span class="read-more" aria-hidden="true">Read more ${icon('arrow')}</span>
            </div>
        </article>`;

    const rowHtml = project => `<li class="project-row" id="${project.id}">
            <div>
                <h4>${linkHtml(project)}</h4>
                ${project.org ? `<p class="meta">${escapeHtml(project.org)}</p>` : ''}
            </div>
            <p class="row-summary">${escapeHtml(project.summary)}</p>
            <span class="row-arrow" aria-hidden="true">${icon('arrow')}</span>
        </li>`;

    const others = PROJECTS.filter(p => !p.featured && !p.current);
    document.getElementById('featured-projects').innerHTML = PROJECTS.filter(p => p.featured).map(featureHtml).join('');
    document.getElementById('client-projects').innerHTML = others.filter(p => p.type === 'client').map(rowHtml).join('');
    document.getElementById('university-projects').innerHTML = others.filter(p => p.type !== 'client').map(rowHtml).join('');

    // ---- Pipeline motion ---------------------------------------------------

    // Steps light up in order the first time a diagram comes into view.
    const motionOk = 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startFlow = pipeline => pipeline.classList.add('is-flowing');

    if (motionOk) {
        const observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                startFlow(entry.target);
                observer.unobserve(entry.target);
            }
        }, { threshold: 0.4 });
        document.querySelectorAll('.featured .pipeline').forEach(el => observer.observe(el));
        document.documentElement.classList.add('flow-ready');
    }

    // ---- Hero: the current project and its pipeline ------------------------

    const flowEl = document.getElementById('hero-flow');
    const current = PROJECTS.find(p => p.current);

    if (flowEl && current) {
        flowEl.innerHTML = `
            <p class="flow-head">Current project</p>
            ${diagramHtml(current, 'flow-stage')}
            <div class="flow-foot">
                <div>
                    <p class="flow-title">${escapeHtml(current.title)}</p>
                    <p class="meta">${escapeHtml(metaText(current))}</p>
                </div>
                <button type="button" class="btn btn-sm btn-secondary" data-project="${current.id}" aria-haspopup="dialog">Open project ${icon('arrow')}</button>
            </div>`;
        if (motionOk) startFlow(flowEl.querySelector('.pipeline'));
    }

    // ---- Project dialog ----------------------------------------------------

    const dialog = document.getElementById('project-dialog');
    const slot = name => dialog.querySelector(`[data-slot="${name}"]`);
    const section = name => dialog.querySelector(`[data-section="${name}"]`);
    const nextButton = dialog.querySelector('[data-next]');
    // True when opening the dialog added a history entry, so closing it should go back.
    let pushedHistory = false;

    // "Next project" follows the order on the page: the current project, the featured ones, then the lists.
    const pageOrder = [
        ...PROJECTS.filter(p => p.current),
        ...PROJECTS.filter(p => p.featured && !p.current),
        ...others.filter(p => p.type === 'client'),
        ...others.filter(p => p.type !== 'client'),
    ];
    const nextProject = id => pageOrder[(pageOrder.findIndex(p => p.id === id) + 1) % pageOrder.length];

    function fillDialog(project) {
        slot('media').innerHTML = diagramHtml(project, 'dialog-media');
        slot('title').textContent = project.title;
        slot('meta').textContent = metaText(project);
        slot('summary').textContent = project.summary;

        for (const key of ['details', 'results']) {
            slot(key).textContent = project[key] || '';
            section(key).hidden = !project[key];
        }

        const challenges = project.challenges || [];
        slot('challenges').innerHTML = challenges.map(c => `<li>${escapeHtml(c)}</li>`).join('');
        section('challenges').hidden = challenges.length === 0;

        slot('screenshot').innerHTML = project.image
            ? `<img class="dialog-shot" src="${escapeHtml(project.image)}" alt="Screenshot: ${escapeHtml(project.title)}">`
            : '';
        section('screenshot').hidden = !project.image;

        const next = nextProject(project.id);
        nextButton.dataset.next = next.id;
        nextButton.setAttribute('aria-label', `Next project: ${next.title}`);

        slot('tags').innerHTML = tagsHtml(project.tags);

        const links = project.links || [];
        slot('links').innerHTML = links.map(link =>
            `<a class="btn btn-secondary" href="${escapeHtml(link.url)}" target="_blank" rel="noopener">${escapeHtml(link.text)} ${icon('external')}</a>`
        ).join('');
        slot('links').hidden = links.length === 0;

        const pipeline = slot('media').querySelector('.pipeline');
        if (pipeline && motionOk) startFlow(pipeline);
    }

    function openProject(id, { updateUrl = true } = {}) {
        const project = projectsById.get(id);
        if (!project) return;
        fillDialog(project);
        if (updateUrl && location.hash !== `#${id}`) {
            // Moving between projects inside the open dialog replaces the entry, so Back still closes it.
            if (dialog.open) {
                history.replaceState({ project: id }, '', `#${id}`);
            } else {
                history.pushState({ project: id }, '', `#${id}`);
                pushedHistory = true;
            }
        }
        if (!dialog.open) dialog.showModal();
        dialog.scrollTop = 0;
    }

    dialog.addEventListener('close', () => {
        if (pushedHistory) {
            pushedHistory = false;
            history.back();
        } else if (projectsById.has(location.hash.slice(1))) {
            history.replaceState(null, '', location.pathname + location.search);
        }
    });

    // Close on backdrop clicks, but not on clicks on the dialog's own scrollbar.
    dialog.addEventListener('click', e => {
        if (e.target !== dialog) return;
        const r = dialog.getBoundingClientRect();
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (!inside) dialog.close();
    });

    dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
    nextButton.addEventListener('click', () => openProject(nextButton.dataset.next));

    document.addEventListener('click', e => {
        const trigger = e.target.closest('[data-project]');
        if (trigger) openProject(trigger.dataset.project);
    });

    window.addEventListener('popstate', () => {
        const id = location.hash.slice(1);
        if (projectsById.has(id)) {
            openProject(id, { updateUrl: false });
        } else if (dialog.open) {
            pushedHistory = false;
            dialog.close();
        }
    });

    // A link like kajetannewes.github.io/#app-deployment opens that project directly.
    const linkedId = location.hash.slice(1);
    if (projectsById.has(linkedId)) {
        document.getElementById(linkedId)?.scrollIntoView({ block: 'center', behavior: 'instant' });
        openProject(linkedId, { updateUrl: false });
    }

    // ---- Header and mobile menu --------------------------------------------

    const header = document.querySelector('.site-header');
    const toggle = header.querySelector('.nav-toggle');

    function setMenu(open) {
        header.toggleAttribute('data-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', () => setMenu(!header.hasAttribute('data-open')));
    header.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') setMenu(false);
    });

    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
})();
