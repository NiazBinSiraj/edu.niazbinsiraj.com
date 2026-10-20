// Academic Portfolio - Script (Tab-based layout)
// edu.niazbinsiraj.com

document.addEventListener('DOMContentLoaded', function () {
    initTabs();
    loadAllData();
});

// ============================
// TAB NAVIGATION
// ============================
function initTabs() {
    const navLinks = document.querySelectorAll('.nav-inner a[data-tab]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');

            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding panel
            document.querySelectorAll('.section-panel').forEach(p => p.classList.remove('active'));
            const panel = document.getElementById('tab-' + tabId);
            if (panel) panel.classList.add('active');

            // Scroll to top of content
            window.scrollTo({ top: document.getElementById('site-nav').offsetTop, behavior: 'smooth' });
        });
    });
}

// ============================
// DATA LOADING
// ============================
async function loadAllData() {
    try {
        await Promise.all([
            loadProfile(),
            loadResearch(),
            loadPublications(),
            loadEducation(),
            loadProjects(),
            loadExperience(),
            loadTeaching(),
            loadAchievements(),
            loadSidebar()
        ]);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// ============================
// PROFILE / HEADER
// ============================
async function loadProfile() {
    try {
        const response = await fetch('static/db/profile.json');
        const data = await response.json();
        renderProfile(data);
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

function renderProfile(profile) {
    // Name
    const nameEl = document.getElementById('hero-name');
    if (nameEl) nameEl.textContent = profile.name;

    // Role
    const roleEl = document.getElementById('hero-role');
    if (roleEl) roleEl.textContent = profile.title;

    // Affiliation
    const affEl = document.getElementById('hero-affiliation');
    if (affEl && profile.location) {
        affEl.innerHTML = 'Currently at Therap (BD) Ltd. &bull; ' + profile.location;
    }

    // Photo
    const photoEl = document.getElementById('hero-photo');
    if (photoEl && profile.photo) {
        photoEl.src = profile.photo;
        photoEl.alt = profile.name;
    }

    // Research Statement
    const statementEl = document.getElementById('research-statement');
    if (statementEl && profile.researchStatement) {
        statementEl.innerHTML = '<p>' + profile.researchStatement + '</p>';
    }

    // Bio
    const bioContainer = document.getElementById('bio-content');
    if (bioContainer && profile.bio) {
        bioContainer.innerHTML = '';
        profile.bio.forEach(paragraph => {
            const p = document.createElement('p');
            p.className = 'bio';
            // Bold research keywords
            p.innerHTML = paragraph
                .replace(/AI for Software Engineering/g, '<strong>AI for Software Engineering</strong>')
                .replace(/reliable AI agents/g, '<strong>reliable AI agents</strong>')
                .replace(/context engineering/g, '<strong>context engineering</strong>')
                .replace(/natural language interfaces for data systems/g, '<strong>natural language interfaces for data systems</strong>')
                .replace(/AI-native software architecture/g, '<strong>AI-native software architecture</strong>')
                .replace(/agentic workflows/g, '<strong>agentic workflows</strong>')
                .replace(/intelligent system design/g, '<strong>intelligent system design</strong>')
                .replace(/large language models/g, '<strong>large language models</strong>')
                .replace(/NL-to-SQL/g, '<strong>NL-to-SQL</strong>')
                .replace(/zero-data-leakage/g, '<strong>zero-data-leakage</strong>')
                .replace(/Model Context Protocol/g, '<strong>Model Context Protocol</strong>');
            bioContainer.appendChild(p);
        });
    }

    // Why I Seek a PhD
    const whyPhdContainer = document.getElementById('why-phd-content');
    if (whyPhdContainer && profile.whyPhd) {
        whyPhdContainer.innerHTML = '';
        profile.whyPhd.forEach(paragraph => {
            const p = document.createElement('p');
            p.className = 'bio';
            p.innerHTML = paragraph
                .replace(/NL-to-SQL/g, '<strong>NL-to-SQL</strong>')
                .replace(/open research problems/g, '<strong>open research problems</strong>')
                .replace(/why they work, when they fail/g, '<strong>why they work, when they fail</strong>')
                .replace(/first-class components/g, '<strong>first-class components</strong>');
            whyPhdContainer.appendChild(p);
        });
    }

    // Header links
    const linksContainer = document.getElementById('header-links');
    if (linksContainer) {
        linksContainer.innerHTML = '';

        if (profile.cvUrl) {
            const cvLink = document.createElement('a');
            cvLink.href = '#';
            cvLink.className = 'hlink';
            cvLink.innerHTML = '<i class="fa-solid fa-file-lines"></i> CV / Resume';
            cvLink.addEventListener('click', function(e) { e.preventDefault(); openCvModal(); });
            linksContainer.appendChild(cvLink);
        }
        if (profile.links.github) {
            linksContainer.appendChild(createHeaderLink(profile.links.github, 'fa-brands fa-github', 'GitHub', true));
        }
        if (profile.links.linkedin) {
            linksContainer.appendChild(createHeaderLink(profile.links.linkedin, 'fa-brands fa-linkedin-in', 'LinkedIn', true));
        }
        if (profile.links.scholar) {
            linksContainer.appendChild(createHeaderLink(profile.links.scholar, 'fa-brands fa-google-scholar', 'Scholar', true));
        }
        if (profile.links.email) {
            linksContainer.appendChild(createHeaderLink('mailto:' + profile.links.email, 'fa-solid fa-envelope', 'Email', false));
        }
    }

    // Stats
    renderStats(profile);
}

function createHeaderLink(href, iconClass, label, external, download) {
    const a = document.createElement('a');
    a.href = href;
    a.className = 'hlink';
    if (external) {
        a.target = '_blank';
        a.rel = 'noreferrer';
    }
    if (download) a.setAttribute('download', '');
    a.innerHTML = '<i class="' + iconClass + '"></i> ' + label;
    return a;
}

async function renderStats(profile) {
    const statsRow = document.getElementById('stats-row');
    if (!statsRow) return;

    // We'll compute stats from loaded data
    try {
        const [pubRes, projRes, expRes, achRes, compRes] = await Promise.all([
            fetch('static/db/publications.json').then(r => r.json()),
            fetch('static/db/projects.json').then(r => r.json()),
            fetch('static/db/experience.json').then(r => r.json()),
            fetch('static/db/achievements.json').then(r => r.json()),
            fetch('static/db/teaching.json').then(r => r.json())
        ]);

        const pubCount = pubRes.publications ? pubRes.publications.length : 0;
        const projCount = projRes.projects ? projRes.projects.length : 0;

        // Calculate years of industry exp
        const startDate = new Date('2022-06-01');
        const now = new Date();
        const years = Math.floor((now - startDate) / (365.25 * 24 * 60 * 60 * 1000));

        const stats = [
            { num: years + '+', label: 'Years Industry Research' },
            { num: pubCount.toString(), label: 'Publications' },
            { num: projCount.toString(), label: 'Research Projects' },
            { num: '', label: 'ICPC Finalist' }
        ];

        statsRow.innerHTML = '';
        stats.forEach(stat => {
            const chip = document.createElement('div');
            chip.className = 'stat-chip';
            if (stat.num) {
                chip.innerHTML = '<span class="stat-num">' + stat.num + '</span><span class="stat-label">' + stat.label + '</span>';
            } else {
                chip.innerHTML = '<span class="stat-label">' + stat.label + '</span>';
            }
            statsRow.appendChild(chip);
        });
    } catch (e) {
        console.error('Error rendering stats:', e);
    }
}

// ============================
// RESEARCH INTERESTS (on About tab)
// ============================
async function loadResearch() {
    try {
        const response = await fetch('static/db/research.json');
        const data = await response.json();
        renderResearchTags(data.interests);
    } catch (error) {
        console.error('Error loading research:', error);
    }
}

function renderResearchTags(interests) {
    const container = document.getElementById('ri-tags');
    if (!container) return;
    container.innerHTML = '';

    const icons = [
        'fa-solid fa-microchip',
        'fa-solid fa-brain',
        'fa-solid fa-database',
        'fa-solid fa-gears',
        'fa-solid fa-code',
        'fa-solid fa-robot'
    ];

    interests.forEach((interest, idx) => {
        const tag = document.createElement('span');
        tag.className = 'ri-tag';
        tag.innerHTML = '<i class="' + icons[idx % icons.length] + '"></i> ' + interest.title;
        container.appendChild(tag);
    });

    // Also render the Research tab detail view
    renderResearchDetail(interests);
}

function renderResearchDetail(interests) {
    const container = document.getElementById('research-container');
    if (!container) return;
    container.innerHTML = '';

    const icons = [
        'fa-solid fa-microchip',
        'fa-solid fa-brain',
        'fa-solid fa-database',
        'fa-solid fa-gears'
    ];

    interests.forEach((interest, idx) => {
        const card = document.createElement('div');
        card.className = 'content-card content-card--icon';

        let keywordsHtml = '';
        if (interest.keywords && interest.keywords.length > 0) {
            keywordsHtml = '<div class="card-tags">' +
                interest.keywords.map(k => '<span class="tag">' + k + '</span>').join('') +
                '</div>';
        }

        card.innerHTML =
            '<div class="card-icon"><i class="' + icons[idx % icons.length] + '"></i></div>' +
            '<div class="card-body">' +
                '<div class="card-title">' + interest.title + '</div>' +
                '<div class="card-desc">' + interest.description + '</div>' +
                keywordsHtml +
            '</div>';

        container.appendChild(card);
    });
}

// ============================
// AWARDS & HONORS (on About tab)
// ============================
async function loadAchievements() {
    try {
        const response = await fetch('static/db/achievements.json');
        const data = await response.json();
        renderAwardsOnAbout(data.honors);
    } catch (error) {
        console.error('Error loading achievements:', error);
    }
}

function renderAwardsOnAbout(honors) {
    const list = document.getElementById('awards-list');
    if (!list) return;
    list.innerHTML = '';

    honors.forEach(honor => {
        const li = document.createElement('li');
        li.className = 'award-row';

        let certHtml = '';
        if (honor.certificateUrl) {
            certHtml = '<a href="' + honor.certificateUrl + '" class="award-cert-link" target="_blank" rel="noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> Certificate</a>';
        }

        li.innerHTML =
            '<div class="award-year">' + honor.year + '</div>' +
            '<div class="award-info">' +
                '<div class="award-title">' + honor.title + '</div>' +
                '<div class="award-issuer">' + honor.issuer + '</div>' +
                certHtml +
            '</div>';

        list.appendChild(li);
    });
}

// ============================
// PUBLICATIONS TAB
// ============================
async function loadPublications() {
    try {
        const response = await fetch('static/db/publications.json');
        const data = await response.json();
        renderPublications(data.publications);
    } catch (error) {
        console.error('Error loading publications:', error);
    }
}

function renderPublications(publications) {
    const container = document.getElementById('pub-container');
    if (!container) return;
    container.innerHTML = '';

    publications.forEach(pub => {
        container.appendChild(createPublicationCard(pub));
    });
}

function createPublicationCard(pub) {
    const card = document.createElement('div');
    card.className = 'content-card';

    const authorsHtml = pub.authors.map(author => {
        if (author === 'Niaz Bin Siraj') {
            return '<span class="self">' + author + '</span>';
        }
        return author;
    }).join(', ');

    let badgesHtml = '<div class="pub-badges">';
    badgesHtml += '<span class="pub-badge pub-badge--venue">' + pub.venue + ' ' + pub.year + '</span>';
    const typeLabel = (pub.type || 'paper').replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    badgesHtml += '<span class="pub-badge pub-badge--status">' + typeLabel + '</span>';
    badgesHtml += '</div>';

    let linksHtml = '';
    if (pub.links) {
        const linkItems = [];
        if (pub.links.pdf) linkItems.push('<a href="' + pub.links.pdf + '" class="card-link" target="_blank" rel="noreferrer"><i class="fa-solid fa-file-pdf"></i> PDF</a>');
        if (pub.links.doi) linkItems.push('<a href="' + pub.links.doi + '" class="card-link" target="_blank" rel="noreferrer"><i class="fa-solid fa-link"></i> DOI</a>');
        if (pub.links.certificate) linkItems.push('<a href="' + pub.links.certificate + '" class="card-link" target="_blank" rel="noreferrer"><i class="fa-solid fa-certificate"></i> Certificate</a>');
        if (linkItems.length > 0) {
            linksHtml = '<div class="card-links">' + linkItems.join('') + '</div>';
        }
    }

    card.innerHTML =
        '<div class="card-body">' +
            '<div class="card-title">' + pub.title + '</div>' +
            '<div class="pub-authors">' + authorsHtml + '</div>' +
            '<div class="pub-venue">' + (pub.venueFullName || pub.venue) + ' &bull; ' + pub.year + '</div>' +
            badgesHtml +
            linksHtml +
        '</div>';

    return card;
}

// ============================
// PROJECTS TAB
// ============================
async function loadProjects() {
    try {
        const response = await fetch('static/db/projects.json');
        const data = await response.json();
        renderProjects(data.projects);
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function renderProjects(projects) {
    const container = document.getElementById('proj-container');
    if (!container) return;
    container.innerHTML = '';

    projects.forEach(project => {
        container.appendChild(createProjectCard(project));
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'content-card';

    let tagsHtml = '';
    if (project.techStack && project.techStack.length > 0) {
        tagsHtml = '<div class="card-tags">' +
            project.techStack.map(t => '<span class="tag">' + t + '</span>').join('') +
            '</div>';
    }

    let linksHtml = '';
    const linkItems = [];
    if (project.github) linkItems.push('<a href="' + project.github + '" class="card-link" target="_blank" rel="noreferrer"><i class="fa-brands fa-github"></i> Code</a>');
    if (project.demo) linkItems.push('<a href="' + project.demo + '" class="card-link" target="_blank" rel="noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> Website</a>');
    if (linkItems.length > 0) {
        tagsHtml += '<div class="card-links">' + linkItems.join('') + '</div>';
    }

    card.innerHTML =
        '<div class="card-body">' +
            '<div class="card-title">' + project.title + '</div>' +
            '<div class="card-desc">' + project.description + '</div>' +
            tagsHtml +
        '</div>';

    return card;
}

// ============================
// EXPERIENCE TAB
// ============================
async function loadExperience() {
    try {
        const response = await fetch('static/db/experience.json');
        const data = await response.json();
        renderExperience(data.experiences);
    } catch (error) {
        console.error('Error loading experience:', error);
    }
}

function renderExperience(experiences) {
    const container = document.getElementById('exp-container');
    if (!container) return;
    container.innerHTML = '';

    experiences.forEach(exp => {
        container.appendChild(createExperienceCard(exp));
    });
}

function createExperienceCard(exp) {
    const card = document.createElement('div');
    card.className = 'content-card content-card--icon';

    let bulletsHtml = '';
    if (exp.responsibilities && exp.responsibilities.length > 0) {
        bulletsHtml = '<ul class="card-bullets">' +
            exp.responsibilities.map(r => '<li>' + r + '</li>').join('') +
            '</ul>';
    }

    card.innerHTML =
        '<div class="card-icon"><i class="fa-solid fa-building"></i></div>' +
        '<div class="card-body">' +
            '<div class="card-header">' +
                '<div class="card-title">' + exp.position + '</div>' +
                '<span class="card-date">' + exp.duration + '</span>' +
            '</div>' +
            '<div class="card-subtitle">' + exp.company + ' &mdash; ' + exp.location + '</div>' +
            bulletsHtml +
        '</div>';

    return card;
}

// ============================
// EDUCATION TAB
// ============================
async function loadEducation() {
    try {
        const response = await fetch('static/db/education.json');
        const data = await response.json();
        renderEducation(data.education);
    } catch (error) {
        console.error('Error loading education:', error);
    }
}

function renderEducation(education) {
    const container = document.getElementById('edu-container');
    if (!container) return;
    container.innerHTML = '';

    education.forEach(edu => {
        container.appendChild(createEducationCard(edu));
    });
}

function createEducationCard(edu) {
    const card = document.createElement('div');
    card.className = 'content-card content-card--icon';

    let bulletsHtml = '<ul class="card-bullets">';
    if (edu.cgpa) bulletsHtml += '<li>GPA: ' + edu.cgpa + '</li>';
    if (edu.activities) {
        edu.activities.forEach(a => {
            bulletsHtml += '<li>' + a + '</li>';
        });
    }
    bulletsHtml += '</ul>';

    let courseworkHtml = '';
    if (edu.coursework && edu.coursework.length > 0) {
        courseworkHtml = '<div class="card-tags">' +
            edu.coursework.map(c => '<span class="tag">' + c + '</span>').join('') +
            '</div>';
    }

    card.innerHTML =
        '<div class="card-icon"><i class="fa-solid fa-graduation-cap"></i></div>' +
        '<div class="card-body">' +
            '<div class="card-header">' +
                '<div class="card-title">' + edu.degree + '</div>' +
                '<span class="card-date">' + edu.duration + '</span>' +
            '</div>' +
            '<div class="card-subtitle">' + edu.institution + ' &mdash; ' + (edu.location || '') + '</div>' +
            bulletsHtml +
            courseworkHtml +
        '</div>';

    return card;
}

// ============================
// TEACHING / EXTRA CURRICULAR TAB
// ============================
async function loadTeaching() {
    try {
        const response = await fetch('static/db/teaching.json');
        const data = await response.json();
        renderExtra(data.teaching);
    } catch (error) {
        console.error('Error loading teaching:', error);
    }
}

function renderExtra(items) {
    const container = document.getElementById('extra-container');
    if (!container) return;
    container.innerHTML = '';

    items.forEach(item => {
        container.appendChild(createExtraCard(item));
    });

    // Also add competitive programming section
    addCompetitiveProgramming(container);
}

function createExtraCard(item) {
    const card = document.createElement('div');
    card.className = 'content-card content-card--icon';

    const iconMap = {
        'workshop': 'fa-solid fa-chalkboard-user',
        'mentoring': 'fa-solid fa-users',
        'tutoring': 'fa-solid fa-book-open'
    };

    const icon = iconMap[item.type] || 'fa-solid fa-star';

    card.innerHTML =
        '<div class="card-icon"><i class="' + icon + '"></i></div>' +
        '<div class="card-body">' +
            '<div class="card-header">' +
                '<div class="card-title">' + item.title + '</div>' +
                '<span class="card-date">' + item.year + '</span>' +
            '</div>' +
            '<div class="card-subtitle">' + item.organization + '</div>' +
            '<div class="card-desc">' + item.description + '</div>' +
        '</div>';

    return card;
}

function addCompetitiveProgramming(container) {
    const card = document.createElement('div');
    card.className = 'content-card content-card--icon';

    card.innerHTML =
        '<div class="card-icon"><i class="fa-solid fa-code"></i></div>' +
        '<div class="card-body">' +
            '<div class="card-header">' +
                '<div class="card-title">ACM ICPC - Competitive Programming</div>' +
                '<span class="card-date">2018 - 2022</span>' +
            '</div>' +
            '<div class="card-subtitle">University of Rajshahi &mdash; Rajshahi, Bangladesh</div>' +
            '<div class="card-desc">' +
                'Active participant in the ACM International Collegiate Programming Contest (ICPC) community. ' +
                'Competed in 6 national and regional rounds, including the ICPC Dhaka Regional Onsite (2019). ' +
                'Practiced competitive programming involving algorithmic problem solving, data structures, and mathematical optimization under time constraints. ' +
                'Also participated in Google Code Jam (2020), ranking 5901st out of 40,000+ participants globally.' +
            '</div>' +
        '</div>';

    container.appendChild(card);
}

// ============================
// ============================
// SIDEBAR
// ============================
async function loadSidebar() {
    try {
        const [profileRes, researchRes, expRes, pubRes, projRes, eduRes] = await Promise.all([
            fetch('static/db/profile.json').then(r => r.json()),
            fetch('static/db/research.json').then(r => r.json()),
            fetch('static/db/experience.json').then(r => r.json()),
            fetch('static/db/publications.json').then(r => r.json()),
            fetch('static/db/projects.json').then(r => r.json()),
            fetch('static/db/education.json').then(r => r.json())
        ]);

        renderSidebarCTA(researchRes);
        renderSidebarStats(expRes, pubRes, projRes, eduRes);
        renderSidebarHighlights();
        renderSidebarSkills();
    } catch (error) {
        console.error('Error loading sidebar:', error);
    }
}

function renderSidebarCTA(researchData) {
    const container = document.getElementById('sidebar-ri-tags');
    if (!container || !researchData.interests) return;

    container.innerHTML = researchData.interests.map(interest =>
        '<span class="sidebar-ri-tag">' + interest.title + '</span>'
    ).join('');
}

function renderSidebarStats(expData, pubData, projData, eduData) {
    const container = document.getElementById('sidebar-stats');
    if (!container) return;

    // Calculate years of experience
    const startDate = new Date(2022, 5, 1); // Jun 2022
    const years = Math.floor((Date.now() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

    const pubCount = pubData.publications ? pubData.publications.length : 0;
    const projCount = projData.projects ? projData.projects.length : 0;

    const stats = [
        { label: 'Years Industry Exp.', value: years + '+' },
        { label: 'Publications / Presentations', value: pubCount },
        { label: 'Research Projects', value: projCount },
        { label: 'Engineers Mentored', value: '5+' }
    ];

    container.innerHTML = stats.map(s =>
        '<div class="sidebar-stat">' +
            '<span class="sidebar-stat-value">' + s.value + '</span>' +
            '<span class="sidebar-stat-label">' + s.label + '</span>' +
        '</div>'
    ).join('');
}

function renderSidebarHighlights() {
    const container = document.getElementById('sidebar-highlights');
    if (!container) return;

    const highlights = [
        'Designed a <strong>zero-data-leakage NL-to-SQL</strong> system serving millions of healthcare claims across <strong>30,000+ providers</strong>.',
        'Achieved <strong>40% reduction</strong> in development time through context-aware AI workflows using MCP.',
        'Built an LLM-powered code documentation system with <strong>incremental change detection</strong> for large-scale legacy codebases.',
        'Reduced enterprise API query execution time by <strong>50-60%</strong> through systematic optimization.',
        '<strong>3+ years</strong> teaching C/C++ programming and facilitating workshops on game development.'
    ];

    container.innerHTML = highlights.map(h =>
        '<li class="sidebar-highlight">' + h + '</li>'
    ).join('');
}

function renderSidebarSkills() {
    const container = document.getElementById('sidebar-skills');
    if (!container) return;

    const skillGroups = [
        { label: 'Languages', skills: ['Java 21', 'Python', 'JavaScript', 'SQL'] },
        { label: 'AI / ML', skills: ['LLMs', 'RAG', 'MCP', 'LangGraph', 'Gemini'] },
        { label: 'Backend', skills: ['Spring Boot', 'FastAPI', 'Hibernate', 'MyBatis'] },
        { label: 'Databases', skills: ['Oracle', 'DuckDB', 'PostgreSQL', 'Redis'] },
        { label: 'Tools', skills: ['Docker', 'Git', 'Jenkins', 'CI/CD', 'Linux'] }
    ];

    container.innerHTML = skillGroups.map(group =>
        '<div class="sidebar-skill-group">' +
            '<span class="sidebar-skill-label">' + group.label + '</span>' +
            '<div class="sidebar-skill-tags">' +
                group.skills.map(s => '<span class="sidebar-skill-tag">' + s + '</span>').join('') +
            '</div>' +
        '</div>'
    ).join('');
}

// ============================
// CV REQUEST MODAL
// ============================
function openCvModal() {
    var overlay = document.getElementById('cv-modal-overlay');
    if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCvModal(e) {
    var overlay = document.getElementById('cv-modal-overlay');
    if (e && e.target && e.target !== overlay) return;
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeCvModal();
});
