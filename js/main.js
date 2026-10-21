(() => {
    const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);

    const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"></use></svg>`;

    // ---- Header and mobile menu --------------------------------------------

    const header = document.querySelector('.site-header');
    const toggle = header.querySelector('.nav-toggle');

    function setMenu(open) {
        header.toggleAttribute('data-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', () => setMenu(!header.hasAttribute('data-open')));
    // A tap outside the open menu (on the dimmed page) closes it.
    document.addEventListener('click', e => {
        if (header.hasAttribute('data-open') && !e.target.closest('.nav-links, .nav-toggle')) setMenu(false);
    });
    header.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') setMenu(false);
    });

    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // The navigation marks the section currently in view.
    const navLinks = [...header.querySelectorAll('.nav-links a[href^="#"]')];
    if ('IntersectionObserver' in window) {
        const spy = new IntersectionObserver(entries => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                for (const link of navLinks) {
                    if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'true');
                    else link.removeAttribute('aria-current');
                }
            }
        }, { rootMargin: '-35% 0px -60% 0px' });
        document.querySelectorAll('main > section').forEach(s => spy.observe(s));
    }

    // ---- Copy email ----------------------------------------------------------

    // For readers whose browser has no mail app set up; the address is selected if copying is refused.
    const copyButton = document.querySelector('[data-copy]');
    const copyStatus = document.querySelector('[data-copy-status]');
    if (copyButton && navigator.clipboard) {
        copyButton.hidden = false;
        let resetTimer;
        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(copyButton.dataset.copy);
                copyButton.textContent = 'Copied';
                copyStatus.textContent = 'Email address copied';
            } catch {
                getSelection().selectAllChildren(document.querySelector('.contact-email'));
                copyButton.textContent = 'Address selected';
                copyStatus.textContent = 'Could not copy. The email address is selected so you can copy it yourself.';
            }
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                copyButton.textContent = 'Copy email';
                copyStatus.textContent = '';
            }, 2500);
        });
    }

    // ---- Project data --------------------------------------------------------

    // js/projects.js is edited by hand; if it fails to load or has a typo, say so instead of showing empty lists.
    if (typeof PROJECTS === 'undefined' || !Array.isArray(PROJECTS)) {
        console.error('js/projects.js did not load or contains a syntax error.');
        document.getElementById('featured-projects').innerHTML =
            '<p class="data-error">The project list could not be loaded. My <a href="documents/cv-kajetan-newes.pdf">CV</a> lists my projects as well.</p>';
        document.querySelectorAll('.project-group').forEach(group => { group.hidden = true; });
        return;
    }

    const projectsById = new Map(PROJECTS.map(p => [p.id, p]));

    // ---- Rendering ---------------------------------------------------------

    // A diagram step is a string, or { step, input } when a second input joins at that step.
    const stepLabel = step => typeof step === 'string' ? step : step.step;
    const stepInput = step => typeof step === 'string' ? '' : step.input || '';

    function stepHtml(step, index, lastIndex) {
        const classes = ['step', index === 0 && 'is-input', index === lastIndex && 'is-result'].filter(Boolean).join(' ');
        const input = stepInput(step) ? `<span class="step-input">+ ${escapeHtml(stepInput(step))}</span>` : '';
        return `<li style="--step: ${index}"><span class="${classes}">${escapeHtml(stepLabel(step))}${input}</span></li>`;
    }

    // The vertical "how it works" diagram; a loop groups its steps and draws a return arrow beside them.
    function diagramHtml(project, extraClass = '') {
        const steps = project.diagram;
        if (!steps) return '';
        const { loop } = project;
        const lastIndex = steps.length - 1;
        let items = '';
        for (let i = 0; i <= lastIndex; i++) {
            if (loop && i === loop.from) {
                const inner = steps.slice(loop.from, loop.to + 1).map((step, k) => stepHtml(step, loop.from + k, lastIndex)).join('');
                items += `<li class="loop" style="--step: ${loop.from}; --step-end: ${loop.to}">
                    <ol class="loop-steps">${inner}</ol>
                    <span class="loop-arrow" aria-hidden="true"></span>
                    <span class="loop-label"><span aria-hidden="true">↺ </span>${escapeHtml(loop.label)}</span>
                </li>`;
                i = loop.to;
                continue;
            }
            items += stepHtml(steps[i], i, lastIndex);
        }
        return `<div class="media media--diagram ${extraClass}">
                <ol class="pipeline" aria-label="How it works">${items}</ol>
            </div>`;
    }

    // "Client · FreshBrains · Solo · 8 weeks": type, client, and the optional facts fields
    const TYPE_LABELS = { client: 'Client', internship: 'Internship', university: 'University' };
    const metaText = project => [TYPE_LABELS[project.type] || 'University', project.org, project.role, project.duration].filter(Boolean).join(' · ');

    // In the lists the group heading already says client or university, so the line starts with the client.
    const rowMeta = project => [project.org, project.role, project.duration].filter(Boolean).join(' · ');

    const tagsHtml = (tags = []) => `<ul class="tags">${tags.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul>`;

    const linkHtml = project =>
        `<button type="button" class="card-link" data-project="${project.id}" aria-haspopup="dialog">${escapeHtml(project.title)}</button>`;

    const featureHtml = project => `<article class="feature-card" id="${project.id}">
            ${diagramHtml(project)}
            <div class="card-body">
                <h3>${linkHtml(project)}</h3>
                <p class="meta">${escapeHtml(metaText(project))}</p>
                ${project.outcome ? `<p class="outcome">${escapeHtml(project.outcome)}</p>` : ''}
                ${project.summary ? `<p class="card-summary">${escapeHtml(project.summary)}</p>` : ''}
                ${tagsHtml((project.tags || []).slice(0, 5))}
                <span class="read-more" aria-hidden="true">Open project ${icon('arrow')}</span>
            </div>
        </article>`;

    const rowHtml = project => `<li class="project-row" id="${project.id}">
            <div>
                <h4>${linkHtml(project)}</h4>
                ${rowMeta(project) ? `<p class="meta">${escapeHtml(rowMeta(project))}</p>` : ''}
            </div>
            <div class="row-detail">
                <p class="row-outcome">${escapeHtml(project.outcome || project.summary || '')}</p>
                ${tagsHtml((project.tags || []).slice(0, 3))}
            </div>
            <span class="row-arrow" aria-hidden="true">${icon('arrow')}</span>
        </li>`;

    const others = PROJECTS.filter(p => !p.featured && !p.current);
    const isUniversity = p => p.type === 'university';
    document.getElementById('featured-projects').innerHTML = PROJECTS.filter(p => p.featured).map(featureHtml).join('');
    document.getElementById('client-projects').innerHTML = others.filter(p => !isUniversity(p)).map(rowHtml).join('');
    document.getElementById('university-projects').innerHTML = others.filter(isUniversity).map(rowHtml).join('');

    // On phones a long list shows its first rows and a button for the rest (the CSS hides [data-extra] rows).
    const ROWS_SHOWN = 4;
    function expandList(list) {
        list.toggleAttribute('data-expanded', true);
        const more = list.nextElementSibling;
        if (more?.matches('.list-more')) more.remove();
    }
    document.querySelectorAll('.project-list').forEach(list => {
        const extra = [...list.children].slice(ROWS_SHOWN);
        if (extra.length < 2) return;
        extra.forEach(row => row.toggleAttribute('data-extra', true));
        list.insertAdjacentHTML('afterend', `<button type="button" class="btn btn-secondary list-more">Show ${extra.length} more projects</button>`);
        list.nextElementSibling.addEventListener('click', () => {
            expandList(list);
            extra[0].querySelector('.card-link').focus();
        });
    });

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
            <div class="flow-head">
                <h2 class="flow-title">${escapeHtml(current.title)}</h2>
                <p class="meta">Current project · ${escapeHtml(metaText(current))}</p>
                ${current.outcome ? `<p class="flow-outcome">${escapeHtml(current.outcome)}</p>` : ''}
            </div>
            ${diagramHtml(current, 'flow-stage')}
            <div class="flow-foot">
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
        ...others.filter(p => !isUniversity(p)),
        ...others.filter(isUniversity),
    ];
    const nextProject = id => pageOrder[(pageOrder.findIndex(p => p.id === id) + 1) % pageOrder.length];

    function fillDialog(project) {
        slot('media').innerHTML = diagramHtml(project, 'dialog-media');
        slot('title').textContent = project.title;
        slot('meta').textContent = metaText(project);
        slot('outcome').textContent = project.outcome || '';
        slot('outcome').hidden = !project.outcome;
        slot('summary').textContent = project.summary || '';

        for (const key of ['details', 'results']) {
            slot(key).textContent = project[key] || '';
            section(key).hidden = !project[key];
        }

        const challenges = project.challenges || [];
        slot('challenges').innerHTML = challenges.map(c => `<li>${escapeHtml(c)}</li>`).join('');
        section('challenges').hidden = challenges.length === 0;

        const next = nextProject(project.id);
        nextButton.dataset.next = next.id;
        slot('next-name').textContent = `Next: ${next.title}`;

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
        const target = document.getElementById(linkedId);
        if (target?.hasAttribute('data-extra')) expandList(target.parentElement);
        target?.scrollIntoView({ block: 'center', behavior: 'instant' });
        openProject(linkedId, { updateUrl: false });
    }
})();
