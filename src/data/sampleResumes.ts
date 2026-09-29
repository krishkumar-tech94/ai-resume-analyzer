import { TargetRole } from '../types/resume';

export interface SampleResume {
  id: string;
  name: string;
  targetRole: TargetRole;
  experienceLevel: string;
  description: string;
  fileName: string;
  text: string;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: 'junior-swe',
    name: 'Alex Chen',
    targetRole: 'Software Engineer',
    experienceLevel: 'Entry-Level / Intern (0-2 yrs)',
    description: 'Recent CS grad with React/Node/Python projects; needs metric-driven bullet points & ATS heading optimization.',
    fileName: 'Alex_Chen_Software_Engineer_Resume.txt',
    text: `ALEX CHEN
San Francisco, CA | (415) 555-0182 | alex.chen.dev@email.com | linkedin.com/in/alexchen-dev | github.com/alexchen-code

PROFESSIONAL SUMMARY
Motivated Computer Science graduate with internship experience in full-stack web development. Passionate about building responsive web applications using React, Node.js, and TypeScript. Eager to contribute to scalable engineering teams.

EDUCATION
University of California, Davis — B.S. in Computer Science
Graduation: June 2024 | GPA: 3.65/4.0
Relevant Coursework: Data Structures & Algorithms, Operating Systems, Database Management Systems, Software Engineering Methodologies, Computer Networks.

TECHNICAL SKILLS
- Programming Languages: JavaScript, TypeScript, Python, Java, SQL, HTML5, CSS3
- Frameworks & Libraries: React.js, Next.js, Node.js, Express.js, Tailwind CSS, Jest
- Tools & Cloud: Git, GitHub, Docker, AWS (S3, EC2), Postman, Linux/Unix
- Databases: PostgreSQL, MongoDB, Redis

WORK & INTERNSHIP EXPERIENCE
Software Engineering Intern | BrightWave Solutions | Remote
June 2023 – September 2023
- Worked with senior developers to build customer-facing dashboard features using React and Express.
- Helped improve API response times by debugging slow database queries in PostgreSQL.
- Participated in daily agile stand-ups, code reviews, and sprint planning sessions.
- Wrote unit tests using Jest to test frontend components and backend endpoints.
- Assisted with fixing bugs reported by QA team before production releases.

Undergraduate Research Assistant | UC Davis Distributed Systems Lab | Davis, CA
October 2022 – May 2023
- Assisted lab professors with Python scripts for parsing network packet log datasets.
- Cleaned and aggregated gigabytes of server telemetry data.
- Built a lightweight internal visualization dashboard with React and Chart.js for the research team.

KEY PROJECTS
DevCollab: Real-Time Developer Collaboration Platform (React, Node.js, Socket.io, MongoDB)
- Built a web app allowing developers to share code snippets, live chat, and manage task boards.
- Implemented real-time synchronization using WebSockets and Socket.io with under 100ms latency.
- Deployed full application on AWS EC2 with Docker containers and automated GitHub Actions CI.

SmartReceipt: AI Expense Categorizer (Python, Flask, React, Tesseract OCR)
- Created an image-to-text receipt scanner that extracts vendor name, line items, and totals.
- Integrated SQLite database with automatic categorical spending breakdowns and export to CSV.

CERTIFICATIONS
- AWS Certified Cloud Practitioner (2024)
- Meta Front-End Developer Professional Certificate (Coursera, 2023)

ACTIVITIES & LEADERSHIP
- HackDavis 2023 Participant (Top 10 Finalist in Web Track)
- Member, ACM Student Chapter UC Davis
`
  },
  {
    id: 'aiml-engineer',
    name: 'Priya Sharma',
    targetRole: 'AI/ML Engineer',
    experienceLevel: 'Mid-Level (2-5 yrs)',
    description: 'Machine Learning engineer with PyTorch, NLP, and RAG pipelines; evaluates readiness for senior AI/ML roles.',
    fileName: 'Priya_Sharma_AIML_Engineer_Resume.txt',
    text: `PRIYA SHARMA
Seattle, WA | (206) 555-7391 | priya.sharma.ml@email.com | linkedin.com/in/priyasharma-ai | github.com/priyasharma-ml

SUMMARY
AI/ML Engineer with 3 years of production experience designing, training, and deploying deep learning models, retrieval-augmented generation (RAG) systems, and computer vision pipelines. Experienced in model quantization, low-latency inference with TensorRT, and scalable cloud architectures.

TECHNICAL EXPERTISE
- ML / AI Frameworks: PyTorch, TensorFlow, Hugging Face Transformers, LangChain, LlamaIndex, vLLM, DeepSpeed
- Languages: Python (Proficient), C++, SQL, Bash
- MLOps & Infrastructure: Docker, Kubernetes, MLflow, Weights & Biases, Triton Inference Server, AWS SageMaker, Ray
- Data & Vector Stores: Pinecone, Qdrant, PostgreSQL (pgvector), Apache Spark, Pandas, NumPy
- Core Domains: Natural Language Processing (LLM fine-tuning, LoRA/QLoRA), RAG, Semantic Search, Computer Vision

PROFESSIONAL EXPERIENCE
Machine Learning Engineer | CognaTech AI | Seattle, WA
February 2023 – Present
- Architected enterprise multi-turn RAG search assistant over 2M+ internal technical documents, reducing search latency by 45% and boosting semantic retrieval precision from 68% to 91%.
- Fine-tuned open-source LLMs (Llama 3 and Mistral 7B) using QLoRA and PEFT for specialized customer domain tasks, outperforming base models by 24% on domain-specific evaluation benchmarks.
- Deployed high-throughput inference endpoints with vLLM and TensorRT-LLM on AWS EKS GPU clusters, decreasing p99 inference latency by 35% while cutting GPU hosting costs by $18,000/month.
- Integrated automated continuous model evaluation pipelines using MLflow and LangSmith to monitor hallucination rates, drift, and toxicity.

Junior AI Engineer | DeepVision Labs | San Jose, CA
July 2021 – January 2023
- Developed real-time object detection and segmentation pipeline for industrial manufacturing quality inspection using PyTorch and YOLOv7.
- Optimized edge inference on NVIDIA Jetson devices using ONNX runtime and FP16 quantization, achieving 42 FPS with less than 2% drop in mAP.
- Built data annotation and synthetic data augmentation workflows that scaled training dataset by 5x.
- Collaborated with hardware engineers to deploy vision models on 12 assembly lines across North America.

EDUCATION
University of Washington — M.S. in Computer Science (Machine Learning Specialization) | 2021
Indian Institute of Technology (IIT) Delhi — B.Tech in Electrical Engineering | 2019

SELECTED PROJECTS
NeuralDoc: Multimodal Document Parsing & Question Answering
- Open-source toolkit converting unstructured PDFs into structured JSON and vector embeddings using Vision-Language Models (ColPali & LayoutLMv3).
- Starred by 800+ developers on GitHub; benchmarked against standard OCR pipelines with 3x higher extraction accuracy.

GraphRec: Graph Neural Network Recommendation Engine
- Implemented PyTorch Geometric heterogeneous GNN for item recommendations on bipartite e-commerce graphs with 500k nodes.

PUBLICATIONS & PATENTS
- "Efficient Parameter-Efficient Fine-Tuning for Domain-Adapted LLMs", Co-author, Workshop at NeurIPS 2023
`
  },
  {
    id: 'data-analyst-to-ds',
    name: 'Marcus Vance',
    targetRole: 'Data Scientist',
    experienceLevel: 'Entry-Level / Intern (0-2 yrs)',
    description: 'Experienced Data Analyst seeking transition into Data Scientist; shows skill gaps in statistical modeling & MLOps.',
    fileName: 'Marcus_Vance_Data_Analyst_Resume.txt',
    text: `MARCUS VANCE
Chicago, IL | (312) 555-8942 | marcus.vance.analytics@email.com | linkedin.com/in/marcusvance-data

OBJECTIVE
Energetic Senior Data Analyst with 3 years of experience in SQL, statistical analysis, and business intelligence looking to transition into a full-time Data Scientist role. Passionate about machine learning, predictive modeling, and data-driven strategy.

PROFESSIONAL EXPERIENCE
Senior Data Analyst | Horizon Logistics | Chicago, IL
August 2022 – Present
- Developed automated executive BI dashboards in Tableau and Power BI connected to Snowflake data warehouse, tracking daily fleet logistics across 48 states.
- Analyzed shipping route variance using SQL and Python (pandas, scipy), identifying route inefficiencies that saved $240,000 annually.
- Built an internal churn risk scoring script using Scikit-Learn Logistic Regression that identified high-risk B2B freight clients with 74% precision.
- Partnered with product and engineering teams to establish tracking KPIs and define A/B testing frameworks for mobile warehouse scanning app.

Data Analyst | Peak Retail Partners | Chicago, IL
June 2021 – July 2022
- Queried large-scale transactional datasets with SQL (PostgreSQL, BigQuery) to generate weekly sales forecasting reports for merchandising teams.
- Conducted cohort retention analyses and customer segmentation using K-Means clustering in Python Jupyter Notebooks.
- Automated 15+ manual weekly Excel reporting tasks by writing scheduled Python ETL scripts.

EDUCATION
University of Illinois Urbana-Champaign (UIUC)
B.S. in Statistics, Minor in Business Informatics | 2021
GPA: 3.52 / 4.0

TECHNICAL SKILLS
- Languages: SQL (Advanced), Python (Pandas, NumPy, Matplotlib, Seaborn, basic Scikit-learn), R (Introductory)
- BI & Analytics Tools: Tableau, Power BI, Excel (Advanced VBA, Pivot Tables), Looker
- Databases & Warehouses: Snowflake, Google BigQuery, PostgreSQL
- Modeling Techniques: Linear Regression, Logistic Regression, K-Means Clustering, Hypothesis Testing, A/B Testing
- Tools: Git, Jupyter Notebook, Jira, Confluence

PROJECTS
Customer Lifetime Value & Churn Predictor
- Analyzed 100k e-commerce records using Python to forecast 90-day repeat purchase probability using Random Forest and Logistic Regression.
- Built interactive Streamlit web dashboard for marketing managers to test segment pricing sensitivity.

Airbnb Pricing Explorer & Predictive Model
- Scraped 25,000 Chicago vacation listings; conducted exploratory data analysis and built a multiple linear regression model predicting nightly rental rates based on neighborhood and amenities.

CERTIFICATIONS
- Google Data Analytics Professional Certificate (Coursera)
- Snowflake SnowPro Core Certification (2023)
`
  }
];
