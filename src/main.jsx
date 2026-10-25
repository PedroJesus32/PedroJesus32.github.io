import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowDownRight, ArrowLeft, ArrowUpRight, BriefcaseBusiness, Copy, Mail, Menu, Send, X } from 'lucide-react'
import './styles.css'

const projects = [
  {
    id: 'ai-traffic-queries',
    number: '01',
    title: 'AI Traffic Queries',
    short: 'Natural-language queries for traffic and sensor data through a local AI-powered web interface.',
    description: 'Natural-language queries for traffic and sensor data through a local AI-powered web interface.',
    stack: ['Python', 'FastAPI', 'Ollama'],
    accent: 'blue',
    visual: 'traffic-ai',
    image: '/images/projects/traffic-ai.png',
    details: {
      challenge: 'Traffic information is useful only when people can access it at the right level of abstraction. The challenge was to make structured data feel approachable while keeping the processing path understandable and local.',
      solution: 'A FastAPI service connects a simple question flow to a local Ollama model. The model interprets intent, the application validates the requested operation, and the result is returned in a human-readable format.',
      architecture: 'The prototype is split into a lightweight API layer, a controlled prompt and validation layer, and a data access boundary. This keeps model output from becoming an unreviewed source of truth.',
      results: 'Demonstrative interface and architecture prepared for continued testing. No performance metrics or production claims are presented at this stage.',
      learned: 'Designing the boundary between language models and structured data requires as much attention to validation and user trust as it does to the model itself.',
    },
  },
  {
    id: 'sensor-data-compression',
    number: '02',
    title: 'Sensor Data Compression',
    short: 'A lossless compression workflow for sensor data, with processing, validation and query support.',
    description: 'A lossless compression workflow for sensor data, with processing, validation and query support.',
    stack: ['Python', 'Lossless processing'],
    accent: 'cyan',
    visual: 'sensor',
    image: '/images/projects/sensor-data-compression.png',
    details: {
      challenge: 'Sensor data grows quietly and continuously. The challenge was to explore a more deliberate representation without changing the meaning of the original signal or exposing raw sensor data.',
      solution: 'The project focuses on lossless processing steps: identifying repeated structure, transforming data into a more compact representation, and preserving a clear path back to the original values.',
      architecture: 'A small processing pipeline separates ingestion, transformation, validation, and reconstruction. The design makes it possible to compare representations without coupling the experiment to a particular sensor source.',
      results: 'A demonstrative pipeline that keeps reconstruction as a first-class check. Any future benchmark will be added once it has been measured against a defined dataset.',
      learned: 'Data work is often about constraints: preserving meaning, documenting assumptions, and being precise about what has and has not been measured.',
    },
  },
  {
    id: 'traffic-simulator',
    number: '03',
    title: 'Traffic Simulator',
    short: 'A web-based traffic simulation and visualization tool for monitoring road flow and vehicle behaviour.',
    description: 'A web-based traffic simulation and visualization tool for monitoring road flow and vehicle behaviour.',
    stack: ['JavaScript', 'HTML/CSS', 'Web visualisation'],
    accent: 'violet',
    visual: 'simulator',
    image: '/images/projects/traffic-simulator.png',
    details: {
      challenge: 'Traffic systems are easier to reason about when their rules become visible. The challenge was to turn movement and interaction into a compact visual model that remains understandable.',
      solution: 'A browser-based simulator represents road segments, vehicles, and state changes as a small set of composable behaviours. The visual layer makes the model easier to inspect and iterate on.',
      architecture: 'The experience is organized around a deterministic simulation loop, a small state model, and a rendering layer. Keeping these concerns separate leaves room for new scenarios later.',
      results: 'A clear demonstrator for traffic logic and web-based visualisation. Scenario controls and future observations are intentionally left open for continued development.',
      learned: 'Visual feedback is a design tool: it can reveal the behaviour of a system before the system has a polished interface or a large feature set.',
    },
  },
]

const stackGroups = [
  { label: 'Programming & Web', items: ['Python', 'JavaScript', 'FastAPI', 'C# / .NET', 'Kotlin', 'HTML / CSS'] },
  { label: 'AI & LLMs', items: ['Ollama', 'Qwen'] },
  { label: 'Data', items: ['SQL', 'MySQL', 'DuckDB', 'ClickHouse'] },
  { label: 'Tools', items: ['Git', 'GitHub', 'Linux', 'Jupyter'] },
]

const caseStudies = {
  'ai-traffic-queries': {
    contribution: {
      label: '01 / My Contribution',
      title: 'Built independently.',
      text: 'Designed and developed the web application, including the frontend, backend and integration with an existing Qwen model through Ollama and an existing ClickHouse traffic database.',
    },
    features: {
      label: '02 / Features',
      title: 'What it can do.',
      items: [
        'Vehicle counts and traffic volume queries.',
        'Vehicle speed analysis.',
        'Vehicle classification queries.',
        'Filtering by road, time period and sensor.',
      ],
    },
    workflow: {
      title: 'From a question to a result.',
      steps: [
        { title: 'Ask', text: 'User submits a natural-language question.' },
        { title: 'Interpret', text: 'FastAPI sends the request to Ollama / Qwen.' },
        { title: 'Query', text: 'The system retrieves the relevant traffic data from ClickHouse.' },
        { title: 'Return', text: 'The application presents the results in a readable format.' },
      ],
    },
    learned: {
      title: 'What this project taught me.',
      text: 'Integrating existing AI models, developing backend APIs, working with databases and presenting structured information through web interfaces.',
    },
  },
  'sensor-data-compression': {
    contribution: {
      label: '01 / My Contribution',
      title: 'Developed and refined.',
      text: 'Developed and improved a lossless compression and decompression workflow for traffic sensor records, including data processing and integrity validation.',
    },
    features: {
      label: '02 / Main Features',
      title: 'What the system can do.',
      items: [
        'Compress and decompress sensor data.',
        'Validate recovered data.',
        'Perform filtered queries.',
        'Automate daily processing.',
      ],
    },
    workflow: {
      title: 'From raw records to validated archives.',
      description: 'A simplified view of the data-processing workflow.',
      steps: [
        { title: 'Process', text: 'Prepare sensor records.' },
        { title: 'Compress', text: 'Store without data loss.' },
        { title: 'Validate', text: 'Check data integrity.' },
        { title: 'Retrieve', text: 'Recover and query data.' },
      ],
    },
    learned: {
      title: 'Beyond compression algorithms.',
      text: 'Practical experience with binary data processing, lossless compression, command-line tools, automation and adapting software workflows across Windows and Linux.',
    },
  },
  'traffic-simulator': {
    contribution: {
      label: '01 / My Contribution',
      title: 'Building a traffic simulation.',
      text: 'Developed a web-based traffic simulator with vehicle movement visualization, simulation controls and traffic indicators.',
    },
    features: {
      label: '02 / Main Features',
      title: 'What the simulator can do.',
      items: [
        'Visualize vehicle movement by direction and lane.',
        'Pause, resume and advance simulation time.',
        'Display active vehicles and traffic counters.',
        'Monitor average speeds and traffic indicators.',
      ],
    },
    workflow: {
      title: 'From simulation to traffic insights.',
      description: 'An overview of the main interaction flow.',
      steps: [
        { title: 'Control', text: 'Manage the simulation.' },
        { title: 'Simulate', text: 'Represent vehicle movement.' },
        { title: 'Visualize', text: 'Follow traffic by direction.' },
        { title: 'Analyze', text: 'Observe traffic indicators.' },
      ],
    },
    learned: {
      title: 'Building interactive systems.',
      text: 'Practical experience developing web interfaces, simulation logic, real-time interaction and visual representations of traffic data.',
    },
  },
}

const EMAIL_ADDRESS = 'peterpriv32@gmail.com'

async function copyEmailAddress() {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(EMAIL_ADDRESS)
      return true
    }
  } catch {
    // Fall through to the legacy copy path when clipboard permissions are unavailable.
  }

  try {
    const textArea = document.createElement('textarea')
    textArea.value = EMAIL_ADDRESS
    textArea.setAttribute('readonly', '')
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    const copied = document.execCommand('copy')
    textArea.remove()
    return copied
  } catch {
    return false
  }
}

function App() {
  const { pathname, key } = useLocation()

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => { window.history.scrollRestoration = previousRestoration }
  }, [])

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [key, pathname])

  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const targets = [...document.querySelectorAll([
      '#work .section-heading', '#work .project-card',
      '#about .about-label', '#about .about-intro', '#about .about-body > p', '#about .milestone',
      '#stack .section-heading', '#stack .stack-card',
      '#contact .contact-copy', '#contact .contact-card',
      '.case-content .case-section', '.case-next',
      '.site-footer .footer-inner',
    ].join(', '))]

    const reveal = (target) => {
      target.classList.add('is-visible')
      observer.unobserve(target)
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return
        reveal(target)
      })
    }, { threshold: 0.08 })

    targets.forEach((target) => {
      if (target.getBoundingClientRect().top < window.innerHeight) return
      target.classList.add('scroll-reveal')
      observer.observe(target)
    })

    const revealPassed = () => {
      targets.forEach((target) => {
        if (target.classList.contains('scroll-reveal') && !target.classList.contains('is-visible') && target.getBoundingClientRect().top < 0) reveal(target)
      })
    }
    window.addEventListener('scroll', revealPassed, { passive: true })

    const revealFocused = (event) => {
      const target = event.target.closest?.('.scroll-reveal')
      if (!target) return
      reveal(target)
    }
    document.addEventListener('focusin', revealFocused)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', revealPassed)
      document.removeEventListener('focusin', revealFocused)
      targets.forEach((target) => target.classList.remove('scroll-reveal', 'is-visible'))
    }
  }, [pathname])

  return (
    <div className="app-shell">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/:projectId" element={<ProjectPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => setOpen(false), [location.pathname])

  const goToSection = (section) => {
    setOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      window.setTimeout(() => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' }), 60)
      return
    }
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" to="/" aria-label="Pedro Jesus home">
          <span className="brand-mark">PJ</span>
          <span className="brand-name">Pedro Jesus</span>
        </Link>
        <button className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
          <a href="#work" onClick={(event) => { event.preventDefault(); goToSection('work') }}>Work</a>
          <a href="#about" onClick={(event) => { event.preventDefault(); goToSection('about') }}>About</a>
          <a href="#stack" onClick={(event) => { event.preventDefault(); goToSection('stack') }}>Stack</a>
          <a className="nav-contact" href="#contact" onClick={(event) => { event.preventDefault(); goToSection('contact') }}>Contact <ArrowUpRight size={14} /></a>
        </nav>
      </div>
    </header>
  )
}

function HomePage() {
  return (
    <>
      <Hero />
      <ProjectsSection />
      <AboutSection />
      <StackSection />
      <ContactSection />
    </>
  )
}

function Hero() {
  return (
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow"><span className="status-dot" /> Software engineer · Lisbon, Portugal</p>
        <h1 id="hero-title">Building software<br /><span>for real-world problems.</span></h1>
        <p className="hero-description">I design and build practical systems that make complex information easier to use, understand, and improve.</p>
        <div className="hero-actions">
        <a className="button button-primary" href="#work" onClick={(event) => { event.preventDefault(); document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }) }}>Explore selected work <ArrowDownRight size={17} /></a>
          <a className="text-link" href="#contact" onClick={(event) => { event.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}>Get in touch <ArrowUpRight size={15} /></a>
        </div>
      </div>
      <div className="hero-aside" aria-label="Portfolio introduction">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-aside-content">
          <span className="hero-aside-label">Selected focus</span>
          <strong>Data · AI · Visual systems</strong>
          <span className="hero-aside-line" />
          <span className="hero-aside-caption">From a clear problem to a working, thoughtful solution.</span>
        </div>
      </div>
    </section>
  )
}

function ProjectsSection() {
  return (
    <section className="section container" id="work" aria-labelledby="work-title">
      <div className="section-heading">
        <div><h2 id="work-title">Projects with a <span>purpose.</span></h2></div>
        <p className="section-intro">A small selection of experiments and builds where the technical detail serves a human question.</p>
      </div>
      <div className="project-list">
        {projects.map((project) => <ProjectRow key={project.id} project={project} />)}
      </div>
    </section>
  )
}

function ProjectRow({ project }) {
  return (
    <article className={`project-row project-card ${project.accent}`}>
      <div className="project-thumb">
        <img src={project.image} alt={`${project.title} application screenshot`} loading="lazy" />
      </div>
      <div className="project-copy">
        <div className="project-card-top"><p className="project-meta"><span>PROJECT </span>{project.number} </p><div className="project-tags">{project.stack.map((item) => <span key={item}>{item}</span>)}</div></div>
        <h3>{project.title}</h3>
        <p>{project.short}</p>
        <Link className="project-link" to={`/projects/${project.id}`}>View Project <ArrowUpRight size={16} /></Link>
      </div>
    </article>
  )
}

function ProjectVisual({ variant, title, image, large = false }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div className={`project-visual ${variant} ${large ? 'large' : ''} ${image && !imageFailed ? 'has-image' : ''}`} role={image && !imageFailed ? undefined : 'img'} aria-label={image && !imageFailed ? undefined : `${title} project visual`}>
      {image && !imageFailed && <img className="project-image" src={image} alt={`${title} application screenshot`} loading={large ? 'eager' : 'lazy'} onError={() => setImageFailed(true)} />}
      <div className="visual-window">
        <span /><span /><span />
      </div>
      {variant === 'traffic-ai' && <><div className="visual-query">show traffic<br /><b>by location</b><i>⌕</i></div><div className="visual-chart"><b>QUERY</b><span className="chart-line" /></div></>}
      {variant === 'sensor' && <><div className="sensor-stream"><span>01 11 01 00 101</span><span>1001 01 110 01</span><span>0 111 01 1001</span></div><div className="compression-pill">lossless <b>↘</b></div></>}
      {variant === 'simulator' && <><div className="road road-a" /><div className="road road-b" /><div className="car car-a" /><div className="car car-b" /><div className="sim-dot dot-a" /><div className="sim-dot dot-b" /></>}
      {!image || imageFailed ? <span className="placeholder-label">Project capture</span> : null}
    </div>
  )
}

function AboutSection() {
  return (
    <section className="section about-section" id="about" aria-labelledby="about-title">
      <div className="container about-grid">
        <p className="eyebrow about-label">02 / About me</p>
        <div className="about-intro"><Profile /><h2 id="about-title">Curious by nature.<br /><span>Practical by design.</span></h2></div>
        <div className="about-body">
          <p className="lead">I enjoy understanding how things work and turning complex problems into practical software solutions.</p>
          <p>My journey combines academic knowledge with hands-on experience in software development, artificial intelligence and data processing.</p>
          <div className="milestones" aria-label="Education and experience timeline">
            <Milestone year="2024–2026" title="CTeSP in Software Development" place="ISTEC Lisboa · completed" />
            <Milestone year="2026" title="Software Development Internship" place="Infraestruturas de Portugal" />
            <Milestone year="2026–2028" title="BSc in Computer Engineering" place="ISTEC Lisboa · expected" />
          </div>
          <p className="current-role"><strong>Beyond programming</strong><span>Torel Palace Lisbon</span></p>
        </div>
      </div>
    </section>
  )
}

function Profile() {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div className="profile">
      <div className="profile-photo" aria-label="Pedro Jesus profile photo">
        {!imageFailed ? <img src="/assets/FOTO_Pedro.jpg" alt="Pedro Jesus" onError={() => setImageFailed(true)} /> : <span>PJ</span>}
      </div>
      <div className="profile-copy">
        <strong>Pedro Jesus</strong>
        <span>Junior Software Developer</span>
        <span>Lisbon, Portugal</span>
      </div>
    </div>
  )
}

function Milestone({ year, title, place }) {
  return <div className="milestone"><div className="milestone-year">{year}</div><div className="milestone-marker" aria-hidden="true" /><div><h3>{title}</h3><p>{place}</p></div></div>
}

function StackSection() {
  return (
    <section className="section container" id="stack" aria-labelledby="stack-title">
      <div className="section-heading stack-heading"><div><p className="eyebrow">03 / Tech stack</p><h2 id="stack-title">Tools for the work.</h2></div><p className="section-intro">A flexible toolkit, chosen around the problem rather than the other way around.</p></div>
      <div className="stack-bento">{stackGroups.map((group, index) => <div key={group.label} className={`stack-card card-${index + 1}`}><span className="stack-index">0{index + 1}</span><h3>{group.label}</h3><div className="stack-tags">{group.items.map((item) => <span key={item}>{item}</span>)}</div></div>)}</div>
    </section>
  )
}

function ContactSection() {
  const [contactNotice, setContactNotice] = useState('')
  const noticeTimer = useRef(null)

  useEffect(() => () => window.clearTimeout(noticeTimer.current), [])

  const handleCopyEmail = async () => {
    window.clearTimeout(noticeTimer.current)
    const copied = await copyEmailAddress()
    setContactNotice(copied ? 'Email copied!' : `Could not copy. Please select ${EMAIL_ADDRESS} manually.`)
    noticeTimer.current = window.setTimeout(() => setContactNotice(''), 4000)
  }

  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="container contact-inner">
        <div className="contact-copy"><span className="contact-send" aria-hidden="true"><Send size={20} /></span><p className="eyebrow">04 / Contact</p><h2 id="contact-title">Let’s build<br /><span>something together.</span></h2><p>Have a problem worth exploring? I’d be happy to hear about it.</p><button className="button button-primary" type="button" onClick={handleCopyEmail}>Copy Email</button></div>
        <div className="contact-links">
          <div className="contact-card"><svg className="contact-github-icon" width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" /></svg><a className="contact-link-label" href="https://github.com/PedroJesus32" target="_blank" rel="noreferrer" aria-label="GitHub — Projects & Code"><span className="contact-link-name">GitHub</span><span aria-hidden="true">↗</span></a><small>Projects &amp; Code</small></div>
          <div className="contact-card"><BriefcaseBusiness size={20} aria-hidden="true" /><a className="contact-link-label" href="https://www.linkedin.com/in/pedro-jesus-7436b8333" target="_blank" rel="noreferrer" aria-label="LinkedIn — Professional Profile"><span className="contact-link-name">LinkedIn</span><span aria-hidden="true">↗</span></a><small>Professional Profile</small></div>
          <div className="contact-card"><Mail size={20} aria-hidden="true" /><div className="contact-email-row"><span className="contact-email-address">{EMAIL_ADDRESS}</span><button type="button" className="contact-copy-icon" onClick={handleCopyEmail} aria-label={`Copy email address ${EMAIL_ADDRESS}`} title="Copy email"><Copy size={15} aria-hidden="true" /></button></div><small>Get in Touch</small></div>
        </div>
      </div>
      <div className={`contact-notice ${contactNotice ? 'is-visible' : ''}`} role="status" aria-live="polite">{contactNotice}</div>
    </section>
  )
}

function ProjectPage() {
  const { projectId } = useParams()
  const project = projects.find((item) => item.id === projectId) || projects[0]
  const caseStudy = caseStudies[project.id]
  const nextProject = projects[(projects.indexOf(project) + 1) % projects.length]
  return (
    <div className="case-study case-study-redesign container">
      <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to selected work</Link>

      <div className={`case-hero ${project.accent} case-project-${project.id}`}>
        <div className="case-hero-copy">
          <p className="eyebrow">Project {project.number}</p>
          <h1>{project.title}</h1>
          <p className="case-summary">{project.description}</p>
          <div className="case-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
        </div>
        <ProjectVisual variant={project.visual} title={project.title} image={project.image} large />
      </div>

      <div className="case-content">
        <div className="case-overview">
          <section className="case-section case-panel">
            <p className="case-section-label">{caseStudy.contribution.label}</p>
            <h2>{caseStudy.contribution.title}</h2>
            <p>{caseStudy.contribution.text}</p>
          </section>
          <section className="case-section case-panel">
            <p className="case-section-label">{caseStudy.features.label}</p>
            <h2>{caseStudy.features.title}</h2>
            <ul className="case-feature-list">
              {caseStudy.features.items.map((feature) => <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>)}
            </ul>
          </section>
        </div>

        <section className="case-section case-process">
          <p className="case-section-label">03 / How It Works</p>
          <h2>{caseStudy.workflow.title}</h2>
          {caseStudy.workflow.description && <p className="case-process-description">{caseStudy.workflow.description}</p>}
          {caseStudy.workflow.flow
            ? <ol className="case-flow" aria-label="Conceptual project flow">{caseStudy.workflow.flow.map((step) => <li key={step}>{step}</li>)}</ol>
            : <ol className="case-steps">{caseStudy.workflow.steps.map((step, index) => <li key={step.title}><span className="case-step-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>}
          {caseStudy.workflow.note && <p className="case-flow-note">{caseStudy.workflow.note}</p>}
        </section>

        <section className="case-section case-learned">
          <p className="case-section-label">04 / What I Learned</p>
          <h2>{caseStudy.learned.title}</h2>
          <p>{caseStudy.learned.text}</p>
        </section>
      </div>

      <nav className="case-next" aria-label="Project navigation">
        <Link to="/"><ArrowLeft size={16} /> All projects</Link>
        <Link to={`/projects/${nextProject.id}`}>Next project: {nextProject.title} <ArrowUpRight size={16} /></Link>
      </nav>
    </div>
  )
}

function SiteFooter() {
  return <footer className="site-footer"><div className="container footer-inner">Built with passion &amp; code.</div></footer>
}

createRoot(document.getElementById('root')).render(<HashRouter><App /></HashRouter>)
