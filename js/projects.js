// All projects on the site. The order here is the order on the page.
//
//   type      'client' or 'university'
//   current   true shows the project in the hero as the one you are working on now
//   featured  true shows the project as a large card; the others are listed by type
//   org       optional client or partner name, shown after "Client" / "University"
//   diagram   the steps of the "how it works" diagram on the card and in the popup; the last step is the result
//   image     optional screenshot, shown at the bottom of the popup
//   links     [{ text: 'GitHub', url: 'https://...' }], shown as buttons in the popup
const PROJECTS = [
    {
        id: 'invoice-control',
        title: 'AI-Powered Invoice Checker',
        type: 'client',
        org: 'Dutch moving company',
        current: true,
        diagram: ['Invoice PDFs', 'OCR + LLM extraction', 'Match to planned job', 'Rate, hours + VAT checks', 'Findings for review'],
        summary: 'A review tool that checks subcontractor invoices against the agreed rates and the company\'s own hours and planning data before they are approved. Now in a pilot.',
        details: 'Invoices are read into a fixed structure with OCR and a language model (Mistral); all arithmetic and rate comparisons are done in plain Python. Each invoice is matched to the planned job it belongs to, using hours and planning data from the company\'s planning system, and then checked: the contractor, the agreed rates, line and total sums including VAT, billed hours against logged hours, break rules from the collective labour agreement, kilometres and volume. A Streamlit screen shows the findings in Dutch or English, the reviewer signs off, and the results can be exported or turned into a draft email to the contractor.',
        results: 'Running in a pilot.',
        tags: ['Python', 'Streamlit', 'Mistral OCR', 'LLM', 'Docker'],
        links: []
    },
    {
        id: 'invoice-processing',
        title: 'Invoice PDF Processing System',
        type: 'client',
        org: 'Ceban Pharmaceuticals',
        featured: true,
        diagram: ['Invoice PDFs', 'Text extraction + OCR', 'Validation rules', 'Excel', 'Power BI dashboard'],
        summary: 'Developed script to extract data from invoice PDFs to Excel, which was then connected to a Power BI dashboard for Ceban Pharmaceuticals.',
        details: 'Built an end-to-end automation solution for Ceban Pharmaceuticals that extracts invoice data from PDF files, processes and validates the information, and integrates it with Excel and Power BI for reporting and analysis. The system eliminated manual data entry and enabled enhanced financial tracking.',
        challenges: [
            'Handling varying PDF formats and layouts from different vendors',
            'Ensuring high accuracy in data extraction to avoid financial errors',
            'Implementing validation rules for pharmaceutical industry compliance',
            'Creating seamless integration with existing Excel and Power BI workflows'
        ],
        results: 'Cleared backlog of a large volume of invoices and helped the company identify cost-saving opportunities.',
        tags: ['Python', 'PDF Processing', 'OCR', 'Power BI', 'Automation'],
        links: []
    },
    {
        id: 'review-clustering',
        title: 'Review Comment Clustering',
        type: 'client',
        featured: true,
        image: 'images/clustering.png',
        diagram: ['Review comments', 'Text cleaning', 'Unsupervised clustering', 'Human-in-the-loop labels', 'Themes for decisions'],
        summary: 'Implemented machine learning algorithms to cluster and analyze review comments, reducing manual analysis time and providing actionable insights for decision-making.',
        details: 'Built a machine learning system to automatically cluster and categorize analytical review comments. The tool uses unsupervised learning to identify patterns and themes in large volumes of review feedback, with an interactive Streamlit interface for exploration and analysis. Additionally included a semi-supervised module with a human-in-the-loop interface for refining clusters.',
        challenges: [
            'Processing and cleaning unstructured text data from various sources',
            'Selecting appropriate clustering algorithms for comment categorization',
            'Determining optimal number of clusters for meaningful groupings',
            'Creating an intuitive interface for non-technical users to explore results'
        ],
        results: 'Delivered a working clustering system that helps teams quickly identify common themes in review feedback. The Streamlit interface enables users to assign categories manually and refine the clustering model over time, improving accuracy and relevance of insights.',
        tags: ['Python', 'Machine Learning', 'NLP', 'Clustering', 'Streamlit'],
        links: []
    },
    {
        id: 'app-deployment',
        title: 'MLOps & Cloud Model Deployment',
        type: 'university',
        featured: true,
        image: 'images/projects/block2d.png',
        diagram: ['Automated training', 'Automated tests', 'Docker container', 'CI/CD to Azure', 'Rootify app, monitored'],
        summary: 'Converted the root segmentation model from the plant inoculation project into a fully deployed application, which used a production-grade ML system with automated training pipelines, CI/CD deployment, and monitoring systems on cloud platforms.',
        details: 'Created a fully deployed version of the root segmentation model from an earlier project. This involved setting up a production-grade ML system with automated training pipelines, CI/CD deployment, and monitoring systems on cloud platforms. The solution included version control, automated testing, and monitoring to ensure model performance and reliability in production. The end application allowed users to upload images and receive segmentation results through a user-friendly Streamlit-powered interface. The application was containerized using Docker and deployed on Azure.',
        challenges: [
            'Setting up robust CI/CD pipelines for automated model training and deployment',
            'Implementing effective monitoring to detect model performance degradation',
            'Ensuring scalability and reliability of the deployed application on cloud infrastructure',
            'Containerizing the application for consistent deployment across environments'
        ],
        results: 'Successfully deployed a production-grade ML application that allowed users to upload images and receive segmentation results. The system featured automated training pipelines, CI/CD deployment, and monitoring to ensure ongoing performance. The project demonstrated the full MLOps lifecycle from model development to production deployment. I received a grade of 9.0 for the project.',
        tags: ['Python', 'MLOps', 'Cloud', 'CI/CD', 'Docker'],
        links: []
    },
    {
        id: 'accounting-integration',
        title: 'Automated Accounting Data Integration',
        type: 'client',
        org: 'FreshBrains',
        diagram: ['E-boekhouden API', 'Python sync in Docker', 'Data transformation', 'Power BI dashboard'],
        summary: 'Created API-based solution to automatically connect accounting data from E-boekhouden to a Power BI dashboard.',
        details: 'Built an automated integration system that connects the accounting platform to Power BI through API calls in Python. The solution runs in Docker containers, automatically pulling financial data and updating Power BI dashboards to provide real-time visibility into company finances.',
        challenges: [
            'Integrating with third-party accounting API documentation and rate limits',
            'Designing a reliable system for continuous data synchronization',
            'Handling data transformations between accounting and BI formats',
            'Deploying and maintaining the solution in Docker'
        ],
        results: 'Eliminated manual financial data updates and enabled real-time financial reporting for FreshBrains. The automated system now runs continuously, ensuring Power BI dashboards always reflect current financial data without manual intervention.',
        tags: ['Python', 'Power BI', 'API', 'Docker', 'Automation'],
        links: []
    },
    {
        id: 'pqr-generator',
        title: 'AI-Supported Quality Report Generator',
        type: 'client',
        org: 'Ceban Pharmaceuticals',
        diagram: ['Input data + documents', 'OpenAI API summaries', 'Word template', 'Draft PQR'],
        summary: 'Created AI-powered template generation system for product quality report templates at Ceban Pharmaceuticals, in order to streamline documentation processes.',
        details: 'Developed an AI-powered system leveraging the OpenAI API to generate product quality report (PQRs) templates in Microsoft Word. The system generates an initial draft based on structured input data, with some of the sections using AI-generated summaries of other documents.',
        challenges: [
            'Ensuring AI-generated summaries are accurate and contextually relevant',
            'Designing prompts that produce consistent, high-quality output',
            'Integrating AI generation with Word document formatting and templates',
            'Implementing review workflows to maintain quality assurance'
        ],
        results: 'While the system successfully generated the PQR templates, the company decided not to continue due to internal policy changes. However, the project demonstrated the potential of AI to streamline complex documentation tasks and provided a foundation for future automation efforts.',
        tags: ['Python', 'OpenAI API', 'Microsoft Word', 'Automation'],
        links: []
    },
    {
        id: 'lab-time-logging',
        title: 'Lab Time Logging Application',
        type: 'client',
        diagram: ['Mobile Power Apps form', 'Input validation', 'SharePoint list', 'Reports'],
        summary: 'Built Power Apps solution for efficient lab time tracking and management, improving workflow and data collection.',
        details: 'Developed a low-code Power Apps solution for laboratory time tracking and management. The application streamlined the process of logging lab hours, tracking projects, and generating reports, replacing manual spreadsheet-based workflows with an intuitive mobile-friendly interface connected to a SharePoint list.',
        challenges: [
            'Designing an interface simple enough for quick daily logging',
            'Implementing data validation to ensure accurate time tracking',
            'Integrating with existing data systems and reporting requirements'
        ],
        results: 'Successfully deployed a user-friendly time logging application that improved data accuracy and reduced administrative overhead. Lab personnel adopted the system quickly, and management gained better visibility into lab resource utilization.',
        tags: ['Power Apps', 'Low-Code', 'Workflow Automation'],
        links: []
    },
    {
        id: 'cv-robotics',
        title: 'Computer Vision & Robotics for Plant Inoculation',
        type: 'university',
        diagram: ['Petri-dish images', 'Root segmentation (DL)', 'Root-tip detection', 'RL control agent', 'Simulated inoculation'],
        summary: 'Implemented traditional computer vision methods, object detection, image segmentation models, deep learning, and reinforcement learning for robotic control.',
        details: 'Trained a deep learning model for root segmentation in petri dish images, implemented traditional computer vision techniques for object detection and tracking, and developed reinforcement learning agents for robotic control tasks. The project involved locating root tips and guiding a robotic arm to perform precise inoculation tasks in simulation.',
        challenges: [
            'Integrating traditional CV methods with modern deep learning approaches',
            'Training RL agents that could operate effectively in real-world conditions',
            'Ensuring accurate root tip detection and tracking in varying image conditions',
            'Combining deep learning segmentation with real-time robotic control'
        ],
        results: 'Successfully created an image-to-root predictions pipeline and trained RL agents capable of performing inoculation tasks in a simulated environment. The project demonstrated the feasibility of combining CV and RL for practical robotics applications. I received a grade of 7.5 for the project.',
        tags: ['Python', 'Computer Vision', 'Reinforcement Learning', 'Robotics'],
        links: []
    },
    {
        id: 'nac-football',
        title: 'Machine Learning Predictions for NAC Breda',
        type: 'university',
        org: 'NAC Breda',
        diagram: ['Player data', 'Cleaning + features', 'Model training', 'Evaluation', 'Value-for-money score'],
        summary: 'Developed a machine learning solution to help improve the player scouting process for NAC Breda.',
        details: 'Used ML techniques to create an ML prediction model based on player data. The project involved data collection, cleaning, feature engineering, model training, and evaluation in order to provide actionable insights for NAC Breda\'s player scouting strategy.',
        challenges: [
            'Working with limited and unstructured sports business data',
            'Balancing technical complexity with stakeholder understanding',
            'Ensuring the model provided actionable insights rather than just predictions'
        ],
        results: 'Created a functional ML model that predicted a player\'s value for money (calculated through comparing market value with performance metrics). I received a grade of 8.3 for the project.',
        tags: ['Python', 'Machine Learning', 'Business Analytics'],
        links: []
    },
    {
        id: 'image-classification',
        title: 'Deep Learning Image Classification',
        type: 'university',
        image: 'images/projects/block1c.PNG',
        diagram: ['Custom image dataset', 'CNN training', 'Explainable AI', 'Prototype app', 'Clean / not clean'],
        summary: 'Created a custom deep learning model for image classification with a real-world business application.',
        details: 'Developed an end-to-end deep learning solution for a kitchen cleanliness monitoring system. This included creating a custom image dataset, designing and training a CNN architecture, and building a user-centered prototype application. Additionally, Explainable AI techniques were applied to enhance model interpretability.',
        challenges: [
            'Collecting and labeling a high-quality custom image dataset',
            'Designing a model architecture that balanced accuracy with interpretability',
            'Ensuring the model could generalize well beyond the training data',
            'Creating a prototype that was both functional and user-friendly for non-technical users'
        ],
        results: 'Successfully delivered a working image classification system with strong business value. The model achieved high accuracy on unseen data, and the prototype application demonstrated practical usability. I received a grade of 8.8 for the project.',
        tags: ['Python', 'Computer Vision', 'Deep Learning', 'CNN'],
        links: []
    },
    {
        id: 'nlp-pipeline',
        title: 'NLP Video Processing Pipeline',
        type: 'university',
        diagram: ['French video', 'Transcribe', 'Translate to English', 'Classify emotion', 'Emotion-tagged transcript'],
        summary: 'Built an end-to-end pipeline for video transcription, translation to English, and emotion tagging using traditional NLP methods.',
        details: 'Developed a complete NLP pipeline that takes video input and outputs transcribed, translated, and emotion-tagged text. The system handles video-to-text conversion, french-to-english language translation, and per-sentence emotion classification using traditional NLP techniques rather than large language models.',
        challenges: [
            'Ensuring accurate transcription across different audio qualities and accents',
            'Maintaining context and meaning during translation',
            'Developing reliable emotion detection that works across different speaking styles',
            'Integrating multiple NLP components into a cohesive pipeline'
        ],
        results: 'Delivered a functional end-to-end pipeline capable of processing french-language videos and producing emotion-tagged English transcripts. The system successfully handled the complete workflow from audio extraction through emotion classification, demonstrating the effectiveness of traditional NLP approaches. I received a grade of 7.0 for the project.',
        tags: ['Python', 'NLP', 'Transcription', 'Emotion Analysis'],
        links: []
    },
    {
        id: 'road-safety-app',
        title: 'Road Safety Application',
        type: 'university',
        diagram: ['Street data', 'SQL database', 'High-risk area analysis', 'Zone alerts', 'Safety app concept'],
        summary: 'Designed a road safety app concept based on street data analysis, utilizing SQL for data management and analysis.',
        details: 'Conceptualized and designed a road safety application that leverages street data to improve traffic safety by identifying high-risk areas and alerting the user when they are entering these zones. The project involved SQL database design, data analysis to identify safety patterns, and developing the app concept with user-centered features.',
        challenges: [
            'Working with large-scale geographic and traffic data',
            'Identifying meaningful safety patterns from complex datasets',
            'Designing database schemas optimized for spatial queries',
            'Balancing feature richness with app simplicity and usability'
        ],
        results: 'Created a road safety app concept backed by solid data analysis. The SQL-based analysis revealed key safety insights that informed app feature design, resulting in a user-centered prototype with clear potential for real-world impact. I received a grade of 9.3 for the project, and my team\'s app concept was voted the best in the class.',
        tags: ['Python', 'SQL', 'Data Analysis', 'App Development'],
        links: []
    },
    {
        id: 'business-intelligence',
        title: 'SDG Data Analysis',
        type: 'university',
        image: 'images/projects/block1a.png',
        diagram: ['Multiple data sources', 'Cleaning + transformation', 'Correlation analysis', 'Power BI dashboard'],
        summary: 'Created interactive dashboard analyzing correlation between SDG (Sustainable Development Goals)-related metrics.',
        details: 'This project involved the complete data science lifecycle from understanding business requirements to delivering actionable insights. I worked with multiple data sources, performed comprehensive data cleaning and transformation, and built an interactive Power BI dashboard.',
        challenges: [
            'Integrating data from multiple disparate sources with inconsistent formats',
            'Identifying the most relevant metrics related to my research questions',
            'Building a dashboard that was both comprehensive and intuitive for non-technical users'
        ],
        results: 'Successfully delivered a comprehensive BI solution that showcased the correlations between various SDG-related metrics. The dashboard enabled stakeholders to explore the data interactively and derive insights that informed strategic decisions. I received a grade of 9.2 for the project.',
        tags: ['Python', 'Power BI', 'Data Analysis', 'Data Visualization'],
        links: []
    },
    {
        id: 'sme-research',
        title: 'Information Credibility Research for SMEs',
        type: 'university',
        diagram: ['Surveys', 'Interviews + focus groups', 'Mixed-method analysis', 'Papers + conference poster'],
        summary: 'Conducted a mixed-method research study combining surveys and interviews to analyze credibility perceptions of SME-provided information.',
        details: 'Designed and executed a comprehensive research study exploring how people perceive the credibility of information provided by SMEs. The project combined quantitative survey data with qualitative interviews and focus groups to understand attitudes, knowledge, acceptance, and perceived impact of AI. Results were synthesized into a research paper, policy paper, and conference poster.',
        challenges: [
            'Recruiting diverse SME participants for both surveys and interviews',
            'Balancing quantitative and qualitative methodologies effectively',
            'Analyzing complex stakeholder relationships and competing interests',
            'Translating academic research findings into actionable policy recommendations'
        ],
        results: 'Produced comprehensive insights into information credibility perceptions among SMEs. The mixed-method approach provided a nuanced understanding of attitudes and challenges, informing both academic and policy discussions.',
        tags: ['Research', 'Data Analysis', 'Mixed Methods', 'Policy Analysis'],
        links: []
    }
];
