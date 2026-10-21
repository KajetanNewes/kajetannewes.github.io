// All projects on the site. The order here is the order on the page.
//
//   type      'client' or 'university'
//   current   true shows the project in the hero as the one you are working on now
//   featured  true shows the project as a large card; the others are listed by type
//   org       optional client or partner name, shown after "Client" / "University"
//   role      optional, e.g. 'Solo' or 'Team of 4'    } shown in the line under the title,
//   duration  optional, e.g. '8 weeks'                } e.g. "Client · Solo · 8 weeks"
//   outcome   one line, 60 characters or fewer, shown on the card or row: what came out of it
//   diagram   the steps of the "how it works" diagram; the last step is the result. A step can be
//             { step: '...', input: '...' } when a second input joins there
//   loop      optional { from, to, label }: steps from..to repeat, drawn as a return arrow
//   links     [{ text: 'GitHub', url: 'https://...' }], shown as buttons in the popup
const PROJECTS = [
    {
        id: 'invoice-control',
        title: 'AI-Powered Invoice Checker',
        type: 'client',
        current: true,
        diagram: ['Invoice PDFs', 'OCR + LLM extraction', { step: 'Match to planned job', input: 'planning and hours data' }, 'Rate, hours + VAT checks', 'Findings for review'],
        outcome: 'Checking real invoices in a pilot',
        summary: 'A review tool that checks subcontractor invoices against the agreed rates and the company\'s own hours and planning data before they are approved.',
        details: 'Invoices are read into a fixed structure with OCR and a language model (Mistral); all arithmetic and rate comparisons are done in plain Python. Each invoice is matched to the planned job it belongs to, using hours and planning data from the company\'s planning system, and then checked: the contractor, the agreed rates, line and total sums including VAT, billed hours against logged hours, break rules from the collective labour agreement, kilometres and volume. A Streamlit screen shows the findings in Dutch or English, the reviewer signs off, and the results can be exported or turned into a draft email to the contractor.',
        results: 'Running in a pilot.',
        tags: ['Python', 'Streamlit', 'Mistral OCR', 'LLM', 'Docker'],
        links: []
    },
    {
        id: 'review-clustering',
        title: 'Review Comment Clustering',
        type: 'client',
        featured: true,
        diagram: ['Review comments', 'Text cleaning', 'Unsupervised clustering', 'Human-in-the-loop labels', 'Themes for decisions'],
        loop: { from: 2, to: 3, label: 'refine' },
        outcome: 'Teams spot common themes in review comments quickly',
        summary: 'Groups review comments into themes with unsupervised clustering, so the team spends less time reading and sorting them by hand.',
        details: 'Built a system that clusters analytical review comments by theme. Unsupervised learning finds the patterns in large volumes of feedback, and a Streamlit interface lets users explore the results. A semi-supervised module adds a human-in-the-loop step: users assign categories by hand, and the clustering model learns from them.',
        challenges: [
            'Processing and cleaning unstructured text data from various sources',
            'Selecting appropriate clustering algorithms for comment categorization',
            'Determining optimal number of clusters for meaningful groupings',
            'Creating an intuitive interface for non-technical users to explore results'
        ],
        results: 'Teams use it to find recurring themes in review feedback, and the clusters get more accurate as users refine them over time.',
        tags: ['Python', 'Machine Learning', 'NLP', 'Clustering', 'Streamlit'],
        links: []
    },
    {
        id: 'app-deployment',
        title: 'MLOps & Cloud Model Deployment',
        type: 'university',
        featured: true,
        diagram: ['Automated training', 'Automated tests', 'Docker container', 'CI/CD to Azure', 'Rootify app, monitored'],
        outcome: 'Deployed on Azure with CI/CD and monitoring',
        summary: 'Took the root segmentation model from the plant inoculation project to production: automated training and tests, a Docker container, CI/CD to Azure, and monitoring.',
        details: 'Set up automated training pipelines, automated tests and version control for the model, packaged the app in a Docker container, and deployed it to Azure through a CI/CD pipeline. Monitoring tracks the model\'s performance in production, and users work with it through a Streamlit interface.',
        challenges: [
            'Setting up robust CI/CD pipelines for automated model training and deployment',
            'Implementing effective monitoring to detect model performance degradation',
            'Ensuring scalability and reliability of the deployed application on cloud infrastructure',
            'Containerizing the application for consistent deployment across environments'
        ],
        results: 'Users upload an image to the Streamlit app on Azure and get the root segmentation back. The project covers the full MLOps cycle, from training to monitoring in production.',
        tags: ['Python', 'MLOps', 'Cloud', 'CI/CD', 'Docker'],
        links: []
    },
    {
        id: 'invoice-processing',
        title: 'Invoice PDF Processing System',
        type: 'client',
        org: 'Ceban Pharmaceuticals',
        featured: true,
        diagram: ['Invoice PDFs', 'Text extraction + OCR', 'Validation rules', 'Excel', 'Power BI dashboard'],
        outcome: 'Cleared the invoice backlog and surfaced cost savings',
        summary: 'A Python script that reads invoice PDFs from different suppliers, checks the data against validation rules, and loads it into Excel and a Power BI dashboard.',
        details: 'Extracts the data from each PDF with text extraction and OCR, validates it, and writes it to Excel, which feeds a Power BI dashboard for reporting. It replaced manual data entry and made the company\'s finances easier to track.',
        challenges: [
            'Handling varying PDF formats and layouts from different vendors',
            'Ensuring high accuracy in data extraction to avoid financial errors',
            'Implementing validation rules for pharmaceutical industry compliance',
            'Creating seamless integration with existing Excel and Power BI workflows'
        ],
        results: 'Cleared a large invoice backlog, and the dashboard helped the company find cost savings.',
        tags: ['Python', 'PDF Processing', 'OCR', 'Power BI', 'Automation'],
        links: []
    },
    {
        id: 'accounting-integration',
        title: 'Automated Accounting Data Integration',
        type: 'client',
        org: 'FreshBrains',
        diagram: ['E-boekhouden API', 'Python sync in Docker', 'Data transformation', 'Power BI dashboard'],
        loop: { from: 0, to: 3, label: 'runs continuously' },
        outcome: 'Power BI now updates itself, with no manual data entry',
        summary: 'Feeds accounting data from E-boekhouden into a Power BI dashboard automatically, through the E-boekhouden API.',
        details: 'A Python service calls the accounting API, transforms the data into the format Power BI needs, and updates the dashboards. It runs continuously in Docker.',
        challenges: [
            'Integrating with third-party accounting API documentation and rate limits',
            'Designing a reliable system for continuous data synchronization',
            'Handling data transformations between accounting and BI formats',
            'Deploying and maintaining the solution in Docker'
        ],
        results: 'FreshBrains no longer updates its financial data by hand: the dashboards always show current figures, for real-time financial reporting.',
        tags: ['Python', 'Power BI', 'API', 'Docker', 'Automation'],
        links: []
    },
    {
        id: 'pqr-generator',
        title: 'AI-Supported Quality Report Generator',
        type: 'client',
        org: 'Ceban Pharmaceuticals',
        diagram: ['Structured input data', { step: 'Word template', input: 'OpenAI summaries of documents' }, 'Draft PQR'],
        outcome: 'Working PQR drafts; stopped by a company policy change',
        summary: 'Drafts product quality reports (PQRs) in Word from structured data, with some sections summarized from other documents by the OpenAI API.',
        details: 'A Python tool fills a Word template from structured input data. For the sections that summarize other documents, it calls the OpenAI API and inserts the summary, so the reviewer starts from a first draft instead of a blank report.',
        challenges: [
            'Ensuring AI-generated summaries are accurate and contextually relevant',
            'Designing prompts that produce consistent, high-quality output',
            'Integrating AI generation with Word document formatting and templates',
            'Implementing review workflows to maintain quality assurance'
        ],
        results: 'The tool produced working PQR drafts, but the company stopped the project after an internal policy change.',
        tags: ['Python', 'OpenAI API', 'Microsoft Word', 'Automation'],
        links: []
    },
    {
        id: 'lab-time-logging',
        title: 'Lab Time Logging Application',
        type: 'client',
        diagram: ['Mobile Power Apps form', 'Input validation', 'SharePoint list', 'Reports'],
        outcome: 'Replaced spreadsheet logging; lab staff adopted it quickly',
        summary: 'A mobile Power Apps form for logging lab hours, replacing a spreadsheet.',
        details: 'Lab staff log their hours and projects in a mobile-friendly Power Apps form. Input is validated before it is saved to a SharePoint list, which the reports are built from.',
        challenges: [
            'Designing an interface simple enough for quick daily logging',
            'Implementing data validation to ensure accurate time tracking',
            'Integrating with existing data systems and reporting requirements'
        ],
        results: 'Lab staff adopted it quickly. The time data is more accurate, there is less admin work, and management can see how lab time is used.',
        tags: ['Power Apps', 'Low-Code', 'Workflow Automation'],
        links: []
    },
    {
        id: 'cv-robotics',
        title: 'Computer Vision & Robotics for Plant Inoculation',
        type: 'university',
        diagram: ['Petri-dish images', 'Root segmentation (DL)', 'Root-tip detection', 'RL control agent', 'Simulated inoculation'],
        outcome: 'Root-tip pipeline and RL agent, tested in simulation',
        summary: 'Finds root tips in petri-dish images and trains a reinforcement learning agent to guide a robotic arm to them for inoculation, in simulation.',
        details: 'Trained a deep learning model to segment roots in petri-dish images, then used traditional computer vision to detect and track the root tips. Reinforcement learning agents learned to move a simulated robotic arm to each tip for inoculation.',
        challenges: [
            'Integrating traditional CV methods with modern deep learning approaches',
            'Training RL agents to control the robotic arm reliably in simulation',
            'Ensuring accurate root tip detection and tracking in varying image conditions',
            'Combining deep learning segmentation with real-time robotic control'
        ],
        results: 'A working pipeline from image to root-tip positions, and RL agents that carry out the inoculation in a simulated environment.',
        tags: ['Python', 'Computer Vision', 'Reinforcement Learning', 'Robotics'],
        links: []
    },
    {
        id: 'nac-football',
        title: 'Machine Learning Predictions for NAC Breda',
        type: 'university',
        org: 'NAC Breda',
        diagram: ['Player data', 'Cleaning + features', 'Model training', 'Evaluation', 'Value-for-money score'],
        outcome: 'Scores players\' value for money for scouting',
        summary: 'A model that scores players\' value for money, to support NAC Breda\'s scouting.',
        details: 'Collected and cleaned player data, engineered features, then trained and evaluated a prediction model. Value for money compares a player\'s market value with their performance metrics.',
        challenges: [
            'Working with limited and unstructured sports business data',
            'Balancing technical complexity with stakeholder understanding',
            'Ensuring the model provided actionable insights rather than just predictions'
        ],
        results: 'A working model that predicts each player\'s value for money.',
        tags: ['Python', 'Machine Learning', 'Business Analytics'],
        links: []
    },
    {
        id: 'image-classification',
        title: 'Deep Learning Image Classification',
        type: 'university',
        diagram: ['Custom image dataset', 'CNN training', 'Explainable AI', 'Prototype app', 'Clean / not clean'],
        outcome: 'Cleanliness classifier with a working prototype app',
        summary: 'A CNN that classifies kitchen images as clean or not clean, built into a prototype app.',
        details: 'Built a custom image dataset, designed and trained the CNN, and used explainable AI techniques to make its predictions easier to interpret. The prototype app is designed for non-technical users.',
        challenges: [
            'Collecting and labeling a high-quality custom image dataset',
            'Designing a model architecture that balanced accuracy with interpretability',
            'Ensuring the model could generalize well beyond the training data',
            'Creating a prototype that was both functional and user-friendly for non-technical users'
        ],
        results: 'The model reached high accuracy on images it had not seen during training, and the prototype app works end to end.',
        tags: ['Python', 'Computer Vision', 'Deep Learning', 'CNN'],
        links: []
    },
    {
        id: 'nlp-pipeline',
        title: 'NLP Video Processing Pipeline',
        type: 'university',
        diagram: ['French video', 'Transcribe', 'Translate to English', 'Classify emotion', 'Emotion-tagged transcript'],
        outcome: 'French video in, emotion-tagged English transcript out',
        summary: 'Transcribes French video, translates it to English and tags each sentence with an emotion, using traditional NLP instead of large language models.',
        details: 'The pipeline extracts the audio, transcribes it, translates the French transcript to English and classifies the emotion of each sentence. Every step uses traditional NLP techniques rather than large language models.',
        challenges: [
            'Ensuring accurate transcription across different audio qualities and accents',
            'Maintaining context and meaning during translation',
            'Developing reliable emotion detection that works across different speaking styles',
            'Integrating multiple NLP components into a cohesive pipeline'
        ],
        results: 'The full pipeline works end to end, from a French video to an emotion-tagged English transcript.',
        tags: ['Python', 'NLP', 'Transcription', 'Emotion Analysis'],
        links: []
    },
    {
        id: 'road-safety-app',
        title: 'Road Safety Application',
        type: 'university',
        diagram: ['Street data', 'SQL database', 'High-risk area analysis', 'Zone alerts', 'Safety app concept'],
        outcome: 'Voted the best app concept in the class',
        summary: 'An app concept that warns users when they enter high-risk areas, based on an SQL analysis of street data.',
        details: 'Designed an SQL database for the street data, analyzed it to find high-risk areas and safety patterns, and turned the findings into the features of the app concept.',
        challenges: [
            'Working with large-scale geographic and traffic data',
            'Identifying meaningful safety patterns from complex datasets',
            'Designing database schemas optimized for spatial queries',
            'Balancing feature richness with app simplicity and usability'
        ],
        results: 'My team\'s app concept was voted the best in the class.',
        tags: ['Python', 'SQL', 'Data Analysis', 'App Development'],
        links: []
    },
    {
        id: 'business-intelligence',
        title: 'SDG Data Analysis',
        type: 'university',
        diagram: ['Multiple data sources', 'Cleaning + transformation', 'Correlation analysis', 'Power BI dashboard'],
        outcome: 'Interactive dashboard of SDG metric correlations',
        summary: 'An interactive Power BI dashboard of the correlations between metrics related to the UN Sustainable Development Goals (SDGs).',
        details: 'Combined data from multiple sources, cleaned and transformed it, analyzed the correlations between the metrics and built the dashboard in Power BI.',
        challenges: [
            'Integrating data from multiple disparate sources with inconsistent formats',
            'Identifying the most relevant metrics related to my research questions',
            'Building a dashboard that was both comprehensive and intuitive for non-technical users'
        ],
        results: 'Stakeholders can explore the correlations interactively and draw their own conclusions.',
        tags: ['Python', 'Power BI', 'Data Analysis', 'Data Visualization'],
        links: []
    },
    {
        id: 'sme-research',
        title: 'Information Credibility Research for SMEs',
        type: 'university',
        diagram: ['Surveys', { step: 'Mixed-method analysis', input: 'interviews, focus groups' }, 'Papers + conference poster'],
        outcome: 'Research paper, policy paper and conference poster',
        summary: 'A mixed-method study, with surveys, interviews and focus groups, of how people judge the credibility of information from SMEs.',
        details: 'Designed and ran the study: quantitative surveys plus qualitative interviews and focus groups on attitudes, knowledge, acceptance and the perceived impact of AI.',
        challenges: [
            'Recruiting diverse SME participants for both surveys and interviews',
            'Balancing quantitative and qualitative methodologies effectively',
            'Analyzing complex stakeholder relationships and competing interests',
            'Translating academic research findings into actionable policy recommendations'
        ],
        results: 'The findings went into a research paper, a policy paper and a conference poster, for both academic and policy discussions.',
        tags: ['Research', 'Data Analysis', 'Mixed Methods', 'Policy Analysis'],
        links: []
    }
];
