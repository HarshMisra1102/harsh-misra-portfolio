const typingText = "OCR document scanner";
let index = 0;

const typingTarget = document.getElementById("typing");
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.querySelector(".nav-links");
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.querySelector(".theme-label");
const backToTopBtn = document.getElementById("back-to-top");
const progressBar = document.getElementById("scroll-progress");
const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const pageSections = Array.from(document.querySelectorAll("main section[id]"));
const revealTargets = Array.from(
    document.querySelectorAll(
        ".section, .fact, .experience-card, .skill-card, .focus-card, .project-card, .credential-card, .hero-note, .hero-photo-card, .highlight-chip"
    )
);

function type(){
    if(!typingTarget || index >= typingText.length){
        return;
    }

    typingTarget.textContent = typingText.slice(0, ++index);
    setTimeout(type, 85);
}

function setTheme(theme){
    const isDay = theme === "day";

    document.body.dataset.theme = isDay ? "day" : "night";
    document.documentElement.style.colorScheme = isDay ? "light" : "dark";

    if(themeToggle){
        themeToggle.setAttribute("aria-pressed", String(isDay));
        themeToggle.setAttribute("aria-label", isDay ? "Switch to night mode" : "Switch to day mode");
    }

    if(themeLabel){
        themeLabel.textContent = isDay ? "Day" : "Night";
    }

    try{
        localStorage.setItem("portfolio-theme", isDay ? "day" : "night");
    }
    catch(error){
        console.warn("Unable to save theme preference.", error);
    }
}

function loadTheme(){
    let savedTheme = "night";

    try{
        savedTheme = localStorage.getItem("portfolio-theme") || "night";
    }
    catch(error){
        console.warn("Unable to read saved theme preference.", error);
    }

    setTheme(savedTheme);
}

function updateScrollUI(){
    const scrollTop = window.scrollY || window.pageYOffset;
    const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollRange > 0 ? Math.min(scrollTop / scrollRange, 1) : 0;

    if(progressBar){
        progressBar.style.transform = `scaleX(${progress})`;
    }

    if(backToTopBtn){
        backToTopBtn.classList.toggle("visible", scrollTop > 420);
    }
}

function setActiveLink(activeId){
    navAnchors.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${activeId}`;
        link.classList.toggle("active", isActive);
    });
}

function initRevealAnimations(){
    if(!revealTargets.length){
        return;
    }

    revealTargets.forEach((element, targetIndex) => {
        element.classList.add("reveal");
        element.style.setProperty("--reveal-delay", `${(targetIndex % 4) * 90}ms`);
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if(entry.isIntersecting){
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold:0.14,
        rootMargin:"0px 0px -10% 0px"
    });

    revealTargets.forEach((target) => revealObserver.observe(target));
}

if(menuBtn && navLinks){
    menuBtn.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("active");
        menuBtn.setAttribute("aria-expanded", String(isOpen));
        menuBtn.innerHTML = isOpen
            ? '<i class="fas fa-xmark"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    navLinks.addEventListener("click", (event) => {
        if(event.target.tagName === "A"){
            navLinks.classList.remove("active");
            menuBtn.setAttribute("aria-expanded", "false");
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

if(themeToggle){
    themeToggle.addEventListener("click", () => {
        const nextTheme = document.body.dataset.theme === "day" ? "night" : "day";
        setTheme(nextTheme);
    });
}

if(backToTopBtn){
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top:0,
            behavior:"smooth"
        });
    });
}

if(pageSections.length){
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if(entry.isIntersecting){
                setActiveLink(entry.target.id);
            }
        });
    }, {
        threshold:0.35,
        rootMargin:"-18% 0px -42% 0px"
    });

    pageSections.forEach((section) => sectionObserver.observe(section));
}

window.addEventListener("scroll", updateScrollUI, { passive:true });

loadTheme();
updateScrollUI();
initRevealAnimations();
type();
