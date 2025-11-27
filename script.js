const setupArt = () => {
    const canvas = document.getElementById('art-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const fragmentShader = `
        #ifdef GL_ES
        precision mediump float;
        #endif
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        float random (in vec2 _st) { return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
        float noise (in vec2 _st) {
            vec2 i = floor(_st); vec2 f = fract(_st);
            float a = random(i); float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        #define NUM_OCTAVES 5
        float fbm ( in vec2 _st) {
            float v = 0.0; float a = 0.5; vec2 shift = vec2(100.0);
            mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
            for (int i = 0; i < NUM_OCTAVES; ++i) { v += a * noise(_st); _st = rot * _st * 2.0 + shift; a *= 0.5; }
            return v;
        }
        void main() {
            vec2 st = gl_FragCoord.xy/u_resolution.xy; st.x *= u_resolution.x/u_resolution.y;
            vec2 mouse = u_mouse / u_resolution.xy;
            vec2 q = vec2(0.); q.x = fbm( st + 0.00 * u_time); q.y = fbm( st + vec2(1.0));
            vec2 r = vec2(0.); r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*u_time ); r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time);
            float f = fbm(st+r);
            vec3 color = mix(vec3(0.05, 0.15, 0.1), vec3(0.02, 0.1, 0.05), clamp((f*f)*4.0,0.0,1.0));
            color = mix(color, vec3(0.1, 0.4, 0.25), clamp(length(q),0.0,1.0));
            color = mix(color, vec3(0.0, 0.3, 0.2), clamp(length(r.x),0.0,1.0));
            float dist = distance(st, vec2(mouse.x, 1.0-mouse.y));
            color += vec3(0.1, 0.2, 0.15) * (1.0 - smoothstep(0.0, 0.4, dist));
            gl_FragColor = vec4((f*f*f+.6*f*f+.5*f)*color + 0.05, 1.);
        }
    `;
    const material = new THREE.ShaderMaterial({
        uniforms: { u_time: { value: 0 }, u_resolution: { value: new THREE.Vector2() }, u_mouse: { value: new THREE.Vector2() } },
        fragmentShader: fragmentShader, vertexShader: `void main() { gl_Position = vec4( position, 1.0 ); }`
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(plane);
    const resize = () => { renderer.setSize(window.innerWidth, window.innerHeight); material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight); };
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => { material.uniforms.u_mouse.value.x = e.clientX; material.uniforms.u_mouse.value.y = e.clientY; });
    resize();
    const clock = new THREE.Clock();
    const animate = () => { material.uniforms.u_time.value = clock.getElapsedTime(); renderer.render(scene, camera); requestAnimationFrame(animate); };
    animate();
};
setupArt();

const langBtns = document.querySelectorAll('.lang-btn');
const cvLinks = document.querySelectorAll('.cv-link');

const texts = {
    fr: {
        cv_file: "CV_GAUTIER_FAYARD.pdf",
        nav_home: "ACCUEIL", nav_about: "PROFIL", nav_education: "FORMATION", nav_experience: "EXPÉRIENCE", nav_skills: "COMPÉTENCES", nav_cv: "MON CV", nav_contact: "CONTACT",
        btn_cv: "CV 2025",
        job_title: "B.U.T INFORMATIQUE",
        location: "Basé à Annecy / Lyon",
        section_profile: "À PROPOS DE MOI",
        
        p1: "Bonjour, je suis <span class='highlight'>Gautier Fayard</span>. Étudiant en <strong>2<sup>e</sup> année de B.U.T Informatique</strong> à l'IUT d'Annecy.",
        p2: "Actuellement à la <strong>recherche d'un stage de 2ème année</strong>. Passionné par le développement, je combine rigueur technique et créativité.",
        p3: "Je conçois des applications web et logicielles (C#, Python, Web) en m'appuyant sur des bases solides en algorithmique et gestion de données.",

        card_infos: "Infos & Contact",
        card_passions: "Passions & Soft Skills",
        driver_license: "Permis B",
        hobby_cycling: "Cyclisme (Niveau National)",
        hobby_video: "Création Audiovisuelle",
        hobby_volunteer: "Bénévolat Associatif",
        soft_organized: "Organisé & Ponctuel",
        soft_autonomy: "Autonome & Responsable",
        section_education: "FORMATION",
        date_current: "Actuel",
        edu_but_title: "B.U.T. Informatique",
        edu_but_desc: "2ème année. Parcours Conception et Développement d'Applications.",
        edu_bac_title: "Baccalauréat Général",
        edu_bac_desc: "Spécialités Mathématiques et NSI. Mention Assez Bien.",
        section_experience: "EXPÉRIENCE",
        exp_hosp_title: "Emploi Saisonnier — Hôpital",
        exp_hosp_desc: "Tri d'archives et logistique.",
        exp_leclerc_title: "Emploi Saisonnier — Leclerc",
        exp_leclerc_desc: "Mise en rayon, gestion réserve, étiquetage électronique.",
        exp_city_title: "Emploi Saisonnier — Mairie",
        exp_city_desc: "Entretien espaces verts, installation mobilier urbain.",
        section_tech_skills: "COMPÉTENCES TECHNIQUES",
        skill_cat_dev: "Frameworks & Bibliothèques",
        skill_cat_tools: "Environnement & Outils",
        skill_cat_manage: "Gestion de Projet & Méthodes",
        skill_cat_design: "Design & CMS",
        section_projects: "PORTFOLIO",
        proj_fifa_title: "Site Web FIFA", proj_fifa_short: "Laravel / Fullstack",
        proj_fifa_date: "Date : En cours", proj_fifa_type: "Type : Site Web", proj_fifa_tech: "Tech : Laravel, PHP", proj_fifa_context: "Contexte : Universitaire", proj_fifa_state: "État : En dév",
        proj_pf_title: "Mon Portfolio", proj_pf_short: "Design / WebGL",
        proj_pf_date: "Date : Jan 2025", proj_pf_type: "Type : Site Vitrine", proj_pf_tech: "Tech : JS, Three.js", proj_pf_context: "Contexte : Personnel", proj_pf_state: "État : En ligne",
        proj_nicolas_title: "Gestion Nicolas", proj_nicolas_short: "Gestion Logistique",
        proj_nicolas_date: "Date : Juin 2025", proj_nicolas_type: "Type : App Windows", proj_nicolas_tech: "Tech : C#, WPF", proj_nicolas_context: "Contexte : Universitaire", proj_nicolas_state: "État : Archivé",
        proj_potiron_title: "Jeu Potironator", proj_potiron_short: "Jeu Vidéo Arcade",
        proj_potiron_date: "Date : Déc. 2024", proj_potiron_type: "Type : Jeu Vidéo", proj_potiron_tech: "Tech : C#, IHM", proj_potiron_context: "Contexte : Universitaire", proj_potiron_state: "État : Archivé",
        section_references: "RÉFÉRENCES",
        ref_prof_prog: "Professeur de Programmation",
        footer_title: "Un projet ou un stage ?",
        footer_subtitle: "Je suis disponible et à l'écoute de nouvelles opportunités.",
        btn_access: "Accéder",
        btn_wip: "En cours"
    },
    en: {
        cv_file: "CV English.pdf",
        nav_home: "HOME", nav_about: "PROFILE", nav_education: "EDUCATION", nav_experience: "EXPERIENCE", nav_skills: "SKILLS", nav_cv: "MY RESUME", nav_contact: "CONTACT",
        btn_cv: "RESUME 2025",
        job_title: "B.U.T COMPUTER SCIENCE",
        location: "Based in Annecy / Lyon",
        section_profile: "ABOUT ME",
        
        p1: "Hello, I'm <span class='highlight'>Gautier Fayard</span>. <strong>2nd year Computer Science student</strong> at IUT Annecy.",
        p2: "Currently looking for a <strong>2nd-year internship</strong>. Passionate about development, I combine technical rigor with creativity.",
        p3: "I design web and software applications (C#, Python, Web) relying on a strong foundation in algorithms and data management.",

        card_infos: "Info & Contact",
        card_passions: "Hobbies & Soft Skills",
        driver_license: "Driving License",
        hobby_cycling: "Cycling (National Level)",
        hobby_video: "Audiovisual Creation",
        hobby_volunteer: "Volunteering",
        soft_organized: "Organized & Punctual",
        soft_autonomy: "Autonomous & Responsible",
        section_education: "EDUCATION",
        date_current: "Present",
        edu_but_title: "B.U.T. Computer Science",
        edu_but_desc: "2nd year. Application Design and Development track.",
        edu_bac_title: "High School Diploma",
        edu_bac_desc: "Mathematics & Computer Science. With Honors.",
        section_experience: "EXPERIENCE",
        exp_hosp_title: "Seasonal Job — Hospital",
        exp_hosp_desc: "Archive sorting and logistics.",
        exp_leclerc_title: "Seasonal Job — Supermarket",
        exp_leclerc_desc: "Shelf stocking, stock management, electronic labeling.",
        exp_city_title: "Seasonal Job — City Hall",
        exp_city_desc: "Green space maintenance, urban furniture installation.",
        section_tech_skills: "TECHNICAL SKILLS",
        skill_cat_dev: "Frameworks & Libraries",
        skill_cat_tools: "Environment & Tools",
        skill_cat_manage: "Project Management & Methods",
        skill_cat_design: "Design & CMS",
        section_projects: "PORTFOLIO",
        proj_fifa_title: "FIFA Website", proj_fifa_short: "Laravel / Fullstack",
        proj_fifa_date: "Date: In Progress", proj_fifa_type: "Type: Website", proj_fifa_tech: "Tech: Laravel, PHP", proj_fifa_context: "Context: University", proj_fifa_state: "Status: In Dev",
        proj_pf_title: "My Portfolio", proj_pf_short: "Design / WebGL",
        proj_pf_date: "Date: Jan 2025", proj_pf_type: "Type: Portfolio", proj_pf_tech: "Tech: JS, Three.js", proj_pf_context: "Context: Personal", proj_pf_state: "Status: Online",
        proj_nicolas_title: "Nicolas Mgmt", proj_nicolas_short: "Logistics App",
        proj_nicolas_date: "Date: June 2025", proj_nicolas_type: "Type: Windows App", proj_nicolas_tech: "Tech: C#, WPF", proj_nicolas_context: "Context: University", proj_nicolas_state: "Status: Archived",
        proj_potiron_title: "Potironator Game", proj_potiron_short: "Arcade Game",
        proj_potiron_date: "Date: Dec. 2024", proj_potiron_type: "Type: Video Game", proj_potiron_tech: "Tech: C#, GUI", proj_potiron_context: "Context: University", proj_potiron_state: "Status: Archived",
        section_references: "REFERENCES",
        ref_prof_prog: "Programming Professor",
        footer_title: "A project or internship?",
        footer_subtitle: "I am available and open to new opportunities.",
        btn_access: "View",
        btn_wip: "Work in Progress"
    }
};

langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.lang-btn.active').forEach(b => b.classList.remove('active'));
        const lang = btn.dataset.lang;
        document.querySelectorAll(`.lang-btn[data-lang="${lang}"]`).forEach(b => b.classList.add('active'));
        
        const content = texts[lang];
        
        cvLinks.forEach(link => link.setAttribute('href', content.cv_file));

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if(content[key]) el.innerText = content[key];
        });

        const p1 = document.querySelector('.text-content.p1');
        const p2 = document.querySelector('.text-content.p2');
        const p3 = document.querySelector('.text-content.p3');
        
        if (p1) p1.innerHTML = content.p1;
        if (p2) p2.innerHTML = content.p2;
        if (p3) p3.innerHTML = content.p3;
    });
});

lucide.createIcons();

const menuTrigger = document.querySelector('.menu-trigger');
const menuClose = document.querySelector('.menu-close');
const menuOverlay = document.querySelector('.menu-overlay');
const menuLinks = document.querySelectorAll('.menu-link');

menuTrigger.addEventListener('click', () => {
    menuOverlay.classList.add('active');
    gsap.to(menuLinks, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.3, ease: "power2.out" });
});
const closeMenu = () => {
    menuOverlay.classList.remove('active');
    gsap.to(menuLinks, { y: 20, opacity: 0, duration: 0.2 });
};
menuClose.addEventListener('click', closeMenu);
menuLinks.forEach(link => link.addEventListener('click', closeMenu));

const tl = gsap.timeline();
tl.to('.word', { y: 0, duration: 1.2, stagger: 0.2, ease: 'power4.out' })
  .to('.job-title', { opacity: 1, duration: 1 }, '-=0.8');

gsap.registerPlugin(ScrollTrigger);
const track = document.querySelector('.work-track');
if(track) {
    gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
            trigger: "#work", start: "top top", end: () => "+=" + (track.scrollWidth - window.innerWidth),
            pin: true, scrub: 1, invalidateOnRefresh: true
        }
    });
}

const dot = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');
window.addEventListener('mousemove', (e) => {
    dot.style.left = `${e.clientX}px`; dot.style.top = `${e.clientY}px`;
    outline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 500, fill: "forwards" });
});
document.querySelectorAll('.hover-trigger').forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering');
        if(el.dataset.cursorText) outline.innerText = el.dataset.cursorText;
    });
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovering');
        outline.innerText = '';
    });
});

const filterBtns = document.querySelectorAll('.filter-btn');
const workItems = document.querySelectorAll('.work-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filterValue = btn.getAttribute('data-filter');
        const parentGroup = btn.parentElement;

        parentGroup.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.filter-group').forEach(group => {
            if (group !== parentGroup) {
                group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                group.querySelector('[data-filter="all"]')?.classList.add('active');
            }
        });

        workItems.forEach(item => {
            if (filterValue === 'all') {
                item.classList.remove('hidden');
            } else {
                const tech = item.getAttribute('data-tech');
                const context = item.getAttribute('data-context');
                const state = item.getAttribute('data-state');

                if (tech === filterValue || context === filterValue || state === filterValue) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            }
        });

        ScrollTrigger.refresh();
    });
});

const lenis = new Lenis();
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);