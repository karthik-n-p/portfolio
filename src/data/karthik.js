// Structured data extracted from karthik.txt
import { colors, sectionColors } from '../design-tokens.js'

const certsPalette = sectionColors.certs
const skillsPalette = sectionColors.skills

export const profile = {
  name: 'KARTHIK NP',
  title: 'DATA ENGINEER',
  summary: 'Building high-performance data pipelines on Databricks using PySpark, SQL, MongoDB, and Kafka. Specialized in data migration and performance optimization with a focus on reliability and automation.',
  contact: {
    phone: '+91 94969 08727',
    email: 'karthik.np.work@gmail.com',
    linkedin: 'karthik-np',
    github: 'github.com/karthiknp',
  }
}

export const skills = [
  {
    id: 'programming',
    category: 'Programming Languages',
    items: ['Python', 'SQL'],
    color: skillsPalette.primary,
    clusterPos: { x: -2.5, y: 1.2 },
    streamId: 'stream_0x1a',
  },
  {
    id: 'bigdata',
    category: 'Big Data & Streaming',
    items: ['Apache Spark', 'PySpark', 'Kafka', 'Hadoop', 'HDFS'],
    color: skillsPalette.secondary,
    clusterPos: { x: 2.8, y: 1.0 },
    streamId: 'stream_0x2b',
  },
  {
    id: 'cloud',
    category: 'Cloud & Data Platforms',
    items: ['Databricks', 'Azure Data Factory', 'Azure Synapse', 'Snowflake'],
    color: skillsPalette.glow,
    clusterPos: { x: 2.8, y: -1.2 },
    streamId: 'stream_0x5e',
  },
  {
    id: 'databases',
    category: 'Databases & Data Lakes',
    items: ['Delta Lake', 'MongoDB', 'Azure SQL', 'IBM DB2'],
    color: skillsPalette.primary,
    clusterPos: { x: -2.5, y: -1.0 },
    streamId: 'stream_0x4d',
  },
  {
    id: 'dataeng',
    category: 'Engineering & Analytics',
    items: ['ETL / ELT', 'Data Warehousing', 'Data Modeling', 'dbt', 'Alteryx'],
    color: skillsPalette.secondary,
    clusterPos: { x: 0, y: -2.0 },
    streamId: 'stream_0x3c',
  },
  {
    id: 'workflow',
    category: 'Tools & Methodologies',
    items: ['Git', 'GitHub', 'Agile / Scrum', 'CI/CD'],
    color: skillsPalette.glow,
    clusterPos: { x: 0, y: 2.2 },
    streamId: 'stream_0x6f',
  },
]

export const experience = [
  {
    id: 'ust-global',
    company: 'UST Global',
    role: 'Data Engineer',
    period: 'Aug 2024 – Present',
    location: 'Trivandrum',
    domain: 'Retail Domain',
    award: 'Shining Star Award',
    stages: [
      { id: 'source', label: 'Legacy DB2', type: 'source', icon: '⬡' },
      { id: 'ingest', label: 'Python Pipelines', type: 'transform', icon: '⚡' },
      { id: 'transform', label: 'Databricks / PySpark', type: 'transform', icon: '◈' },
      { id: 'kafka', label: 'Kafka Streams', type: 'stream', icon: '≋' },
      { id: 'sink', label: 'MongoDB / Azure', type: 'sink', icon: '⬡' },
    ],
    highlights: [
      'Migrated Item Merchandise data from DB2 to MongoDB by modernizing COBOL-based logic into scalable Python pipelines.',
      'Developed API-based ingestion pipelines in Databricks for CRUD on MongoDB and publishing to Kafka for real-time consumption.',
      'Replaced manual Kafka performance analysis with automated Databricks monitoring job — efficiency → 100%.',
      'Enhanced and maintained data pipelines with new functionalities, performance optimizations, and reliability improvements.',
      'Contributed to large-scale data migration projects in the retail domain, modernizing legacy systems.',
    ],
  }
]

export const projects = [
  {
    id: 'ecommerce-pipeline',
    name: 'E-Commerce Data Pipeline',
    subtitle: 'for Sales Analysis',
    description: 'Built a scalable data pipeline to integrate and process sales data from multiple sources, enabling insights through PySpark transformations and Spark SQL dashboards.',
    stack: ['Azure Data Factory', 'Databricks', 'PySpark', 'Spark SQL', 'Delta Lake'],
    stackColors: [colors.accent, colors.neutral[100], colors.neutral[300], colors.neutral[100], colors.neutral[300]],
    dag: [
      { id: 'source-a', label: 'Sales DB', pos: { x: 0, y: 0 } },
      { id: 'source-b', label: 'API Feeds', pos: { x: 0, y: 1 } },
      { id: 'adf', label: 'Azure ADF', pos: { x: 1, y: 0.5 } },
      { id: 'databricks', label: 'Databricks', pos: { x: 2, y: 0.5 } },
      { id: 'delta', label: 'Delta Lake', pos: { x: 3, y: 0 } },
      { id: 'dashboard', label: 'Spark SQL Dashboards', pos: { x: 3, y: 1 } },
    ],
    edges: [
      ['source-a', 'adf'],
      ['source-b', 'adf'],
      ['adf', 'databricks'],
      ['databricks', 'delta'],
      ['databricks', 'dashboard'],
    ]
  },
  {
    id: 'movie-3d-viz',
    name: '3D Movie Data Visualization',
    subtitle: 'Interactive Cinema Explorer',
    description: 'Developed an interactive 3D web application to visualize regional movie data fetched from a curated API. Users can explore a dynamically generated universe of films directly in the browser, utilizing advanced WebGL rendering techniques for a deeply immersive, spatial experience.',
    link: 'https://cineverse-omuz.onrender.com',
    stack: ['Three.js', 'React', 'REST APIs', 'Supabase', 'Node.js'],
    stackColors: [colors.neutral[100], colors.neutral[300], colors.neutral[100], colors.accent, colors.neutral[300]],
    dag: [
      { id: 'api', label: 'Movie API', pos: { x: 0, y: 0.5 } },
      { id: 'fetch', label: 'Data Fetcher', pos: { x: 1, y: 0.5 } },
      { id: 'three', label: 'WebGL Scene', pos: { x: 2, y: 0.5 } },
      { id: 'ui', label: 'React UI', pos: { x: 3, y: 0.5 } },
    ],
    edges: [
      ['api', 'fetch'],
      ['fetch', 'three'],
      ['three', 'ui'],
    ]
  }
]

export const certifications = [
  {
    id: 'dp203',
    name: 'Azure Data Engineer Associate',
    code: 'DP-203',
    issuer: 'Microsoft',
    color: certsPalette.primary,
  },
  {
    id: 'dp600',
    name: 'Fabric Analytics Engineer Associate',
    code: 'DP-600',
    issuer: 'Microsoft',
    color: certsPalette.secondary,
  },
  {
    id: 'dp700',
    name: 'Fabric Data Engineer Associate',
    code: 'DP-700',
    issuer: 'Microsoft',
    color: certsPalette.glow,
  },
]

export const education = [
  {
    id: 'btech',
    degree: 'B.Tech in Computer Science',
    institution: 'APJ Abdul Kalam Technological University (KTU)',
    location: 'Kannur',
    period: '2020 – 2024',
    score: 'CGPA: 8.31',
  },
  {
    id: 'higher-sec',
    degree: 'Higher Secondary Education',
    institution: "St. Michael's Anglo-Indian Higher Secondary School",
    location: 'Kannur',
    period: '2018 – 2020',
    score: 'Percentage: 92.1%',
  },
]

// Node positions in 3D space (used by Three.js scene)
export const nodePositions = {
  hub:       { x: 0,    y: 0,    z: 0 },
  pipeline:  { x: -4,   y: -1,   z: -2 },
  projects:  { x: 4,    y: 0,    z: -1 },
  skills:    { x: 0,    y: 2.5,  z: -1 },
  certs:     { x: -3.5, y: 2,    z: -1 },
  education: { x: 3.5,  y: -2,   z: -1 },
}
