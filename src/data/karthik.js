/**
 * karthik.js - Centralized, authoritative data source for Karthik NP's Portfolio
 * Strictly aligned with official resume:
 * - Azure Data Engineer (2+ years experience)
 * - Certifications: Databricks Certified Data Engineer Associate, Azure DP-203, Fabric DP-700
 * - Experience: UST Global (Aug 2024 - Present, Trivandrum)
 * - Projects: Tableau to Sigma Migration Automation POC (Claude Code, Python, APIs, Sigma, Snowflake),
 *             Azure Databricks Retail Lakehouse (2M+ records/day, Kafka 100K+ events/hr),
 *             Automated Kafka Stream Monitoring (80% manual effort reduction, 60% incident response improvement)
 * - Education: B.Tech CS (2020 - 2024), APJ Abdul Kalam Technological University (CGPA 8.31)
 */

export const profile = {
  name: 'Karthik NP',
  title: 'Karthik NP',
  role: 'Azure Data Engineer',
  experienceYears: '2+',
  location: 'Trivandrum, Kerala',
  status: 'Open to High-Impact Roles',
  tagline: 'Turning messy data chaos into calm, rock-solid lakehouses.',
  shortBio:
    'I’m an Azure Data Engineer at UST Global who transforms sprawling, chaotic enterprise data into clean, lightning-fast lakehouses. My daily craft revolves around PySpark, Delta Lake, and Kafka — building resilient systems that run on time, scale effortlessly, and never wake up the team at 2 AM.',
  contact: {
    email: 'karthik.np.work@gmail.com',
    phone: '',
    whatsapp: '',
    linkedin: 'https://linkedin.com/in/karthik-np',
    linkedinDisplay: 'linkedin.com/in/karthik-np',
  },
}

export const heroStats = [
  { value: '2+ Yrs', label: 'Azure Data Engineering' },
  { value: '2M+', label: 'Daily Records Processed' },
  { value: '80%', label: 'Manual Effort Reduced' },
  { value: '3x', label: 'Cloud Certifications' },
]

export const techStackLogos = [
  { name: 'Azure Databricks' },
  { name: 'Apache Spark' },
  { name: 'PySpark' },
  { name: 'Apache Kafka' },
  { name: 'Delta Lake' },
  { name: 'Azure Data Factory' },
  { name: 'Snowflake' },
  { name: 'MongoDB' },
  { name: 'Azure SQL' },
  { name: 'Python' },
  { name: 'Claude Code' },
  { name: 'Sigma Computing' },
]

export const focusKeywords = [
  'Lakehouse Architecture',
  'Real-Time Ingestion',
  'ETL Optimization',
  'Automated Migrations',
  'Kafka Event Streaming',
  'Delta Tables',
  'Metadata Automation',
  'Enterprise Data Platforms',
]

export const credentialsShelf = [
  {
    id: 'databricks-assoc',
    title: 'Databricks Certified',
    subtitle: 'Data Engineer Associate',
    issuer: 'Databricks',
    description: 'Proficiency in Apache Spark, Delta Lake architecture, data ingestion, and scalable lakehouse processing.',
  },
  {
    id: 'dp-203',
    title: 'Azure Data Engineer Associate',
    subtitle: 'Microsoft Certified (DP-203)',
    issuer: 'Microsoft',
    description: 'Expertise in data storage, data processing with Azure Databricks & ADF, security, and optimization.',
  },
  {
    id: 'dp-700',
    title: 'Fabric Data Engineer Associate',
    subtitle: 'Microsoft Certified (DP-700)',
    issuer: 'Microsoft',
    description: 'Lakehouse design, real-time analytics, Medallion architecture, and enterprise analytics governance.',
  },
  {
    id: 'dp-600',
    title: 'Fabric Analytics Engineer Associate',
    subtitle: 'Microsoft Certified (DP-600)',
    issuer: 'Microsoft',
    description: 'Data transformation, semantic modeling, DAX, Power BI enterprise integration, and fabric governance.',
  },
  {
    id: 'shining-star',
    title: 'Shining Star Award',
    subtitle: 'UST Global Recognition',
    issuer: 'UST Global',
    description: 'Awarded for high-impact delivery, technical initiative, and engineering excellence in retail data modernization.',
  },
]

export const toolsMatrix = [
  {
    category: 'Languages',
    items: ['Python', 'PySpark', 'SQL'],
  },
  {
    category: 'Cloud Platforms',
    items: ['Azure Databricks', 'Azure Data Factory', 'Azure Blob Storage', 'Azure SQL'],
  },
  {
    category: 'Big Data & Streaming',
    items: ['Apache Spark', 'Apache Kafka', 'Delta Lake'],
  },
  {
    category: 'Databases',
    items: ['MongoDB', 'DB2', 'Azure SQL', 'SQL Server'],
  },
  {
    category: 'Core Competencies',
    items: ['ETL Pipelines', 'Data Modeling', 'Lakehouse Architecture', 'Batch & Streaming', 'Metadata Automation'],
  },
  {
    category: 'Tools & Workflows',
    items: ['Git', 'GitHub', 'Jira', 'Agile / Scrum', 'Claude Code'],
  },
]

export const careerJourney = [
  {
    role: 'Data Engineer',
    company: 'UST Global',
    location: 'Trivandrum, India',
    period: 'Aug 2024 – Present',
    type: 'Full-time',
    description:
      'Architecting and scaling production lakehouses and real-time Kafka pipelines on Azure Databricks. I focus on retail data modernization, making sure millions of daily transactions flow seamlessly from legacy databases into high-speed Delta tables without human babysitting.',
    summary:
      'Architecting and scaling production lakehouses and real-time Kafka pipelines on Azure Databricks. I focus on retail data modernization, making sure millions of daily transactions flow seamlessly from legacy databases into high-speed Delta tables without human babysitting.',
    achievements: [
      'Engineered Azure Databricks ETL pipelines processing 2M+ daily records, converting legacy retail data into clean, query-ready Delta tables.',
      'Built API-driven ingestion pipelines handling 100K+ events/hour via Kafka with sub-second event distribution.',
      'Automated Kafka stream monitoring and lag alerting, eliminating 80% of repetitive operational firefighting and improving incident response by 60%.',
      'Optimized PySpark transformations, partition pruning, and file compaction to shave 30% off pipeline execution times.',
      'Awarded UST Global Shining Star for high-impact engineering delivery, system stability, and technical ownership.',
    ],
    highlights: [
      'Engineered Azure Databricks ETL pipelines processing 2M+ daily records, converting legacy retail data into clean, query-ready Delta tables.',
      'Built API-driven ingestion pipelines handling 100K+ events/hour via Kafka with sub-second event distribution.',
      'Automated Kafka stream monitoring and lag alerting, eliminating 80% of repetitive operational firefighting and improving incident response by 60%.',
      'Optimized PySpark transformations, partition pruning, and file compaction to shave 30% off pipeline execution times.',
      'Awarded UST Global Shining Star for high-impact engineering delivery, system stability, and technical ownership.',
    ],
    tech: ['Azure Databricks', 'PySpark', 'Apache Kafka', 'Delta Lake', 'Claude Code', 'Snowflake', 'MongoDB', 'Python'],
  },
]

export const projectsCatalog = [
  {
    id: 'tableau-sigma-poc',
    name: 'Tableau to Sigma Migration Automation',
    category: 'Streaming & Automation',
    tag: 'GenAI & Automation POC',
    badge: 'POC Delivered',
    description:
      'Enterprise BI migrations are notorious for burning weeks on tedious manual copy-pasting of calculated fields. I built an AI-assisted automation tool with Claude Code and Python that reverse-engineers Tableau metadata and translates it directly into Sigma with automated Snowflake query validation.',
    points: [
      'Automated metadata extraction across dozens of worksheets using Tableau REST API & Metadata GraphQL API.',
      'Developed an AST formula parser that maps complex Tableau LOD expressions to native Sigma calculations.',
      'Wrote automated SQL reconciliation test suites against Snowflake to verify 100% KPI precision across both platforms.',
      'Generated instant audit logs and migration reconciliation artifacts, wiping out 80% of repetitive migration drudgery.',
    ],
    stack: ['Claude Code', 'Python', 'Tableau REST API', 'Metadata API', 'Sigma', 'Snowflake'],
    gradient: 'from-[#f6fbff] to-[#e6f4ff]',
    metrics: [
      { label: 'Manual Effort', value: '-80%' },
      { label: 'Validation', value: '100% KPI parity' },
      { label: 'Workflow', value: 'Automated' },
    ],
  },
  {
    id: 'azure-retail-lakehouse',
    name: 'Azure Databricks Retail Lakehouse',
    category: 'Data Pipelines',
    tag: 'Enterprise Production',
    badge: '2M+ Records/Day',
    description:
      'Modernized legacy retail transaction storage into a battle-tested Medallion lakehouse on Azure Databricks. Replaced brittle batch scripts with unified PySpark transformations and Kafka streaming that process 2M+ records daily with zero data loss.',
    points: [
      'Engineered Bronze-Silver-Gold Delta Lake layers processing 2M+ records daily with sub-second latency.',
      'Implemented robust schema validation and upsert logic, ensuring operational stores in MongoDB stay in perfect sync.',
      'Cut compute costs and pipeline runtimes by 30% through intelligent partition pruning and Delta Lake file compaction.',
      'Guaranteed ACID transactional compliance across concurrent streaming writes, eliminating phantom reads forever.',
    ],
    stack: ['Azure Databricks', 'PySpark', 'Kafka', 'MongoDB', 'Delta Lake', 'DB2'],
    gradient: 'from-[#f5fff1] to-[#d4f2c7]',
    metrics: [
      { label: 'Daily Volume', value: '2M+ Records' },
      { label: 'Runtime Gain', value: '+30% Faster' },
      { label: 'Availability', value: '99.99%' },
    ],
  },
  {
    id: 'kafka-diagnostics-engine',
    name: 'Automated Kafka Monitoring & Alerting',
    category: 'Streaming & Automation',
    tag: 'Reliability Engineering',
    badge: '60% Faster TTR',
    description:
      'Nobody enjoys babysitting streaming consumers or getting woken up by silent partition lag. I engineered an automated telemetry engine that monitors high-cardinality Kafka topics 24/7, catching consumer lag and throughput spikes before they become customer incidents.',
    points: [
      'Continuous stream monitoring processing 100K+ events/hour across mission-critical retail topics.',
      'Automated metric polling and smart alert thresholds, slashing manual operational overhead by 80%.',
      'Accelerated mean-time-to-resolution (MTTR) by 60% through proactive anomaly detection and automated log correlation.',
      'Zero consumer group starvation across distributed Azure Databricks streaming jobs.',
    ],
    stack: ['Apache Kafka', 'Python', 'Azure Databricks', 'Delta Lake', 'REST APIs'],
    gradient: 'from-[#fffefb] to-[#fff1ce]',
    metrics: [
      { label: 'Event Stream', value: '100K+/hr' },
      { label: 'Manual Effort', value: '-80%' },
      { label: 'Response Time', value: '60% Faster' },
    ],
  },
  {
    id: 'ecommerce-sales-pipeline',
    name: 'E-Commerce Data Pipeline for Sales Analysis',
    category: 'Data Pipelines',
    tag: 'Cloud Analytics & BI',
    badge: 'Multi-Source ETL',
    description:
      'Took messy, multi-format checkout logs scattered across Azure Blob Storage and turned them into clean, reliable Spark SQL analytical tables — reducing sales reporting latency from several hours down to minutes.',
    points: [
      'Orchestrated multi-source ingestion schedules using Azure Data Factory and Blob Storage.',
      'Designed distributed PySpark transformation workflows applying schema validation, data deduplication, and currency normalization.',
      'Delivered structured business analytical views and Spark SQL tables powering real-time regional sales reporting.',
      'Reduced data ingestion latency from hours to minutes with automated trigger schedules.',
    ],
    stack: ['Azure Data Factory', 'Azure Databricks', 'PySpark', 'Spark SQL', 'Blob Storage'],
    gradient: 'from-[#fbf8ff] to-[#eddffc]',
    metrics: [
      { label: 'Data Sources', value: 'Multi-Format' },
      { label: 'Engine', value: 'PySpark DAGs' },
      { label: 'Latency', value: '-65% Faster' },
    ],
  },
]

export const flagshipProject = projectsCatalog[0] // Tableau to Sigma Automation

export const engineeringProcess = [
  {
    step: '01',
    name: 'Listen to the Source',
    title: 'Schema Reality Check & Discovery',
    description:
      'Before touching Spark code, I dig into the raw source quirks (DB2, APIs, flat files), volume patterns, and access paths to see how the data actually behaves in the wild.',
  },
  {
    step: '02',
    name: 'Lay the Groundwork',
    title: 'Medallion Lakehouse Foundation',
    description:
      'Structuring clean Bronze, Silver, and Gold Delta layers with strict schema enforcement, sensible partitioning, and idempotency so duplicate records never slip through.',
  },
  {
    step: '03',
    name: 'Crunch Without Waste',
    title: 'Vectorized PySpark & Tuning',
    description:
      'Writing distributed PySpark that avoids costly shuffles and data skew. Fast queries are great, but keeping cloud infrastructure bills low is where real engineering shines.',
  },
  {
    step: '04',
    name: 'Sleep Soundly at Night',
    title: 'Automated Kafka Lag & Health Traps',
    description:
      'Setting up automated Kafka lag health checks, end-to-end reconciliation, and alerts that reduce manual intervention by 80% — catching issues before anyone notices.',
  },
]

export const educationList = [
  {
    degree: 'B.Tech in Computer Science and Engineering',
    institution: 'APJ Abdul Kalam Technological University (KTU)',
    location: 'Kannur, Kerala',
    period: '2020 – 2024',
    score: 'CGPA: 8.31',
    details: 'Rigorous coursework in Distributed Systems, Algorithms, Database Engineering, and Cloud Architecture.',
  },
  {
    degree: 'Higher Secondary Education (Computer Science)',
    institution: 'St. Michael’s Anglo-Indian Higher Secondary School',
    location: 'Kannur, Kerala',
    period: '2018 – 2020',
    score: 'Percentage: 92.1%',
    details: 'Specialized in Computer Science, Mathematics, and Physics with high academic distinction.',
  },
]

/* ── PERSONAL SECTION: TRAVEL MAP & COVERED PLACES ── */
export const travelMapData = {
  summary: '6 destinations covered across the Western Ghats & Coastal Trails.',
  stats: [
    { label: 'Destinations', value: '6 Covered' },
    { label: 'Total Distance', value: '2,400+ km' },
    { label: 'Terrain Types', value: 'Coast & Ghats' },
    { label: 'Travel Mode', value: 'Road & Rail' },
  ],
  places: [
    {
      id: 'kannur',
      name: 'Kannur',
      state: 'Kerala',
      status: 'COVERED',
      type: 'Home Base & Coastal',
      coordinates: '11.8745° N, 75.3704° E',
      x: 28, // % on SVG map
      y: 35,
      date: 'Native Grounds',
      highlight: 'Pristine Muzhappilangad drive-in beach, Theyyam heritage, and coastal serenity.',
    },
    {
      id: 'wayanad',
      name: 'Wayanad',
      state: 'Kerala',
      status: 'COVERED',
      type: 'Western Ghats Peak',
      coordinates: '11.6854° N, 76.1320° E',
      x: 48,
      y: 28,
      date: 'Ghats Roadtrip',
      highlight: 'Misty hairpin curves, rain-drenched Western Ghats trails, and coffee estate ridge lines.',
    },
    {
      id: 'bangalore',
      name: 'Bangalore',
      state: 'Karnataka',
      status: 'COVERED',
      type: 'Tech Metropol',
      coordinates: '12.9716° N, 77.5946° E',
      x: 75,
      y: 20,
      date: 'Tech & Meetups',
      highlight: 'Specialty coffee culture, tech meetups, Cubbon Park mornings, and urban energy.',
    },
    {
      id: 'munnar',
      name: 'Munnar',
      state: 'Kerala',
      status: 'COVERED',
      type: 'High Altitude Hills',
      coordinates: '10.0889° N, 77.0595° E',
      x: 62,
      y: 65,
      date: 'Mountain Escapes',
      highlight: 'Endless rolling emerald tea plantations, morning fog, and cool highland winds.',
    },
    {
      id: 'trivandrum',
      name: 'Trivandrum',
      state: 'Kerala',
      status: 'COVERED',
      type: 'Work & Coastal Hub',
      coordinates: '8.5241° N, 76.9366° E',
      x: 42,
      y: 88,
      date: 'Current Residence',
      highlight: 'UST Global campus base, Kovalam coastline, and evening drives along the Arabian Sea.',
    },
    {
      id: 'goa',
      name: 'Goa Coast',
      state: 'Goa',
      status: 'COVERED',
      type: 'Coastal Getaway',
      coordinates: '15.2993° N, 74.1240° E',
      x: 18,
      y: 8,
      date: 'Coastal Expedition',
      highlight: 'Southern Goa cliffs, quiet backwaters, coastal sunsets, and spontaneous bike rides.',
    },
  ],
}

/* ── PERSONAL SECTION: WORKOUT STATUS ── */
export const workoutStatus = {
  currentSplit: 'Push • Pull • Legs + 5K Cadence',
  consistencyRate: '92% 52-Week Active Streak',
  mindset:
    'Treating physical fitness like pipeline reliability: establishing steady cadence, eliminating bottlenecks, and maintaining long-term stamina.',
  stats: [
    { label: 'Weekly Sessions', value: '5 - 6 Days' },
    { label: '5K Pace', value: '5:15 /km' },
    { label: 'Current Streak', value: '48 Weeks' },
    { label: 'Rest & Recovery', value: '7.5h Sleep' },
  ],
  dailyRoutine: [
    { time: '06:30 AM', activity: 'Hydration & Dynamic Mobility', note: 'Joint preparation & light core activation' },
    { time: '07:00 AM', activity: 'Compound Resistance Training', note: 'Heavy barbell & functional hypertrophy' },
    { time: '06:30 PM', activity: 'Aerobic Coastal 5K Run', note: 'Steady-state aerobic base along coastal breeze' },
  ],
}

/* ── PERSONAL SECTION: PHOTOGRAPHY HOBBY ── */
export const photographyGallery = [
  {
    id: 'photo-1',
    title: 'Western Ghats Mist',
    location: 'Wayanad, Kerala',
    category: 'Landscape',
    camera: '35mm • f/2.8 • ISO 100',
    caption: 'Dense cloud blanket rolling through high-altitude tea valleys at dawn.',
    gradient: 'from-emerald-900 via-teal-900 to-slate-900',
  },
  {
    id: 'photo-2',
    title: 'Arabian Sea Golden Hour',
    location: 'Kannur Coast, Kerala',
    category: 'Seascape',
    camera: '50mm • f/1.8 • ISO 50',
    caption: 'Sun dipping into the horizon over tranquil Malabar shores.',
    gradient: 'from-amber-800 via-orange-900 to-stone-900',
  },
  {
    id: 'photo-3',
    title: 'Contoured Tea Terraces',
    location: 'Munnar Hills, Kerala',
    category: 'Nature',
    camera: '24mm • f/4.0 • ISO 200',
    caption: 'Geometric tea bushes tracing natural mountain contours in soft morning light.',
    gradient: 'from-green-950 via-emerald-950 to-neutral-900',
  },
  {
    id: 'photo-4',
    title: 'Architectural Shadows',
    location: 'Bangalore, Karnataka',
    category: 'Street & Geometry',
    camera: '40mm • f/2.0 • ISO 400',
    caption: 'Geometric balance between concrete verticals and natural morning light.',
    gradient: 'from-slate-800 via-zinc-900 to-neutral-950',
  },
]
