import os
import subprocess

html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Karthik NP - Azure Data Engineer Resume</title>
<style>
  @page {
    size: A4;
    margin: 14mm 16mm;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #1a1a1a;
    line-height: 1.45;
    font-size: 9.5pt;
    background: #fff;
  }
  .header {
    border-bottom: 2px solid #E03E2D;
    padding-bottom: 10px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .name {
    font-size: 22pt;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: #111;
  }
  .title {
    font-size: 11pt;
    font-weight: 600;
    color: #E03E2D;
    margin-top: 2px;
  }
  .contact-info {
    font-size: 8.8pt;
    color: #555;
    text-align: right;
    line-height: 1.5;
  }
  .contact-info a { color: #555; text-decoration: none; }
  .section {
    margin-bottom: 11px;
  }
  .section-title {
    font-size: 10.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #111;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 3px;
    margin-bottom: 7px;
  }
  .summary {
    font-size: 9pt;
    color: #333;
    line-height: 1.45;
  }
  .job-header, .edu-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 2px;
  }
  .role {
    font-size: 10pt;
    font-weight: 700;
    color: #111;
  }
  .company {
    font-size: 9.5pt;
    font-weight: 600;
    color: #E03E2D;
  }
  .date, .location {
    font-size: 8.5pt;
    color: #666;
    font-family: monospace;
  }
  ul {
    margin-left: 16px;
    margin-top: 3px;
  }
  li {
    font-size: 8.8pt;
    color: #333;
    margin-bottom: 3px;
    line-height: 1.38;
  }
  li strong { color: #111; }
  .skills-grid {
    display: grid;
    grid-template-columns: 145px 1fr;
    gap: 3px 10px;
    font-size: 8.8pt;
  }
  .skill-cat {
    font-weight: 700;
    color: #222;
  }
  .skill-items {
    color: #444;
  }
  .cert-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px 14px;
  }
  .cert-item {
    font-size: 8.5pt;
  }
  .cert-title {
    font-weight: 700;
    color: #111;
  }
  .cert-issuer {
    color: #666;
    font-size: 7.8pt;
  }
</style>
</head>
<body>

<div class="header">
  <div>
    <div class="name">Karthik NP</div>
    <div class="title">Azure Data Engineer</div>
  </div>
  <div class="contact-info">
    <div>karthik.np.work@gmail.com | </div>
    <div>linkedin.com/in/karthik-np | Trivandrum, India</div>
  </div>
</div>

<div class="section">
  <div class="section-title">Professional Summary</div>
  <div class="summary">
    Performance-driven Azure Data Engineer with 2+ years of enterprise experience architecting Medallion lakehouse solutions and high-throughput real-time Kafka event streaming pipelines on Azure Databricks. Proven track record processing 2M+ daily records, slashing manual pipeline triage by 80%, and accelerating ETL execution times by 30%. Certified by Microsoft and Databricks.
  </div>
</div>

<div class="section">
  <div class="section-title">Work Experience</div>
  <div class="job-header">
    <div>
      <span class="role">Data Engineer</span> &mdash; <span class="company">UST Global</span>
    </div>
    <div class="date">Aug 2024 &ndash; Present | Trivandrum, India</div>
  </div>
  <ul>
    <li>Engineered production <strong>Azure Databricks ETL pipelines</strong> processing <strong>2M+ daily records</strong>, transforming raw retail data into query-optimized Delta Lake tables.</li>
    <li>Architected real-time <strong>Kafka streaming ingestion</strong> handling <strong>100K+ events/hour</strong> with sub-second event distribution and zero consumer starvation.</li>
    <li>Automated Kafka stream health monitoring and lag telemetry, eliminating <strong>80% of operational firefighting</strong> and cutting incident MTTR by 60%.</li>
    <li>Optimized PySpark transformations, partition pruning, and file compaction, reducing pipeline runtimes by <strong>30%</strong>.</li>
    <li>Awarded the <strong>UST Global Shining Star</strong> for technical ownership, system reliability, and high-impact engineering delivery.</li>
  </ul>
</div>

<div class="section">
  <div class="section-title">Technical Proficiencies</div>
  <div class="skills-grid">
    <div class="skill-cat">Languages & Query:</div>
    <div class="skill-items">Python, PySpark, SQL, Spark SQL, Bash</div>
    <div class="skill-cat">Cloud & Lakehouse:</div>
    <div class="skill-items">Azure Databricks, Azure Data Factory (ADF), Delta Lake, Azure Blob, Azure SQL</div>
    <div class="skill-cat">Streaming & Big Data:</div>
    <div class="skill-items">Apache Kafka, Apache Spark, Medallion Architecture (Bronze/Silver/Gold)</div>
    <div class="skill-cat">Data Warehousing:</div>
    <div class="skill-items">Snowflake, MongoDB, DB2, Relational Modeling, Star Schema</div>
    <div class="skill-cat">Tools & Workflows:</div>
    <div class="skill-items">Git, GitHub Actions, Jira, Agile/Scrum, CI/CD, Claude Code, Sigma Computing</div>
  </div>
</div>

<div class="section">
  <div class="section-title">Certifications & Honors</div>
  <div class="cert-list">
    <div class="cert-item">
      <div class="cert-title">Databricks Certified Data Engineer Associate</div>
      <div class="cert-issuer">Databricks &bull; Spark &amp; Delta Lake Architecture</div>
    </div>
    <div class="cert-item">
      <div class="cert-title">Azure Data Engineer Associate (DP-203)</div>
      <div class="cert-issuer">Microsoft Certified &bull; Enterprise Data Engineering</div>
    </div>
    <div class="cert-item">
      <div class="cert-title">Fabric Data Engineer Associate (DP-700)</div>
      <div class="cert-issuer">Microsoft Certified &bull; Modern Lakehouse &amp; Analytics</div>
    </div>
    <div class="cert-item">
      <div class="cert-title">Fabric Analytics Engineer Associate (DP-600)</div>
      <div class="cert-issuer">Microsoft Certified &bull; Semantic Modeling &amp; BI</div>
    </div>
    <div class="cert-item" style="grid-column: span 2;">
      <div class="cert-title">Shining Star Award &mdash; UST Global</div>
      <div class="cert-issuer">UST Global Recognition &bull; Engineering Excellence in Retail Modernization</div>
    </div>
  </div>
</div>

<div class="section">
  <div class="section-title">Education</div>
  <div class="edu-header">
    <div>
      <span class="role">B.Tech in Computer Science and Engineering</span>
      <span style="color:#555; font-size:8.8pt;"> &mdash; APJ Abdul Kalam Technological University (KTU)</span>
    </div>
    <div class="date">2020 &ndash; 2024 | CGPA: 8.31</div>
  </div>
  <div style="font-size: 8.5pt; color: #555; margin-top: 2px;">
    Specialized in Distributed Systems, Cloud Architecture, Database Engineering, and High-Performance Algorithms.
  </div>
</div>

</body>
</html>
'''

temp_html = os.path.abspath(r'd:\portfolio_website\public\resume_print.html')
pdf_out = os.path.abspath(r'd:\portfolio_website\public\karthik_np_resume.pdf')

with open(temp_html, 'w', encoding='utf-8') as f:
    f.write(html_content)

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
if not os.path.exists(chrome_path):
    chrome_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

cmd = [
    chrome_path,
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    f'--print-to-pdf={pdf_out}',
    temp_html
]

subprocess.run(cmd, check=True)
print(f"Generated {pdf_out}, size: {os.path.getsize(pdf_out)} bytes")
