import { writable } from 'svelte/store';

export interface Project {
  title: string;
  description: string;
}

export interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  projects: Project[];
}

export interface Link extends d3.SimulationLinkDatum<Node> {
  value: number;
}

export const hoveredNode = writable<Node | null>(null);
export const selectedNode = writable<Node | null>(null);

export const nodes = writable<Node[]>([
  {
    id: "Next Gen Analytics",
    group: 0,
    projects: [
      {
        title: "Advanced Analytics",
        description: "Our team pushes the boundaries of analytical techniques to tackle complex biological challenges, delivering insights that drive innovation."
      },
      {
        title: "Multi-Omics Integration",
        description: "We combine genomics, proteomics, and other omics data to provide a holistic view of biological systems, enabling comprehensive solutions."
      },
      {
        title: "Precision Medicine",
        description: "By tailoring healthcare solutions to individual genetic profiles, we help advance personalized medicine, improving patient outcomes."
      },
      {
        title: "AI-Driven Discovery",
        description: "Leveraging artificial intelligence, our experts accelerate biomedical research and drug discovery, uncovering new therapeutic targets."
      },
      {
        title: "Data Visualization",
        description: "Our innovative visualization tools transform complex datasets into intuitive visuals, aiding decision-making and communication."
      }
    ]
  },
  {
    id: "Single-Cell Analysis",
    group: 1,
    projects: [
      {
        title: "Causal Protein-Signaling Networks",
        description: "Collaborated with leading biologists to map out protein-signaling networks at the single-cell level, revealing causal relationships that were previously obscured."
      },
      {
        title: "SPADE Algorithm",
        description: "Our team developed the SPADE algorithm, enabling researchers worldwide to extract meaningful hierarchies from high-dimensional cytometry data."
      },
      {
        title: "Mass Cytometry Data Normalization",
        description: "Worked alongside industry partners to create robust normalization techniques for mass cytometry data, ensuring consistency and reliability across experiments."
      },
      {
        title: "Dimensionality Reduction",
        description: "Implemented cutting-edge methods to simplify complex single-cell data, making analysis more accessible without losing critical information."
      }
    ]
  },
  {
    id: "Computational Biology",
    group: 1,
    projects: [
      {
        title: "Bayesian Network Approaches",
        description: "Developed sophisticated Bayesian models with our statisticians to decode intricate biological networks and predict cellular behaviors."
      },
      {
        title: "Machine Learning in Biology",
        description: "Applied machine learning algorithms to vast biological datasets, enabling predictive analytics and uncovering hidden patterns."
      },
      {
        title: "Network Inference",
        description: "Partnered with academic institutions to create algorithms that infer biological networks, facilitating new discoveries in systems biology."
      },
      {
        title: "Data Integration",
        description: "Combined efforts with bioinformaticians to integrate diverse datasets, providing unified platforms for comprehensive analysis."
      }
    ]
  },
  {
    id: "Systems Biology",
    group: 1,
    projects: [
      {
        title: "Cell Signaling Pathway Modeling",
        description: "Modeled complex cell signaling pathways, helping researchers understand dynamic processes and identify intervention points."
      },
      {
        title: "Regulatory Relationships",
        description: "Unveiled regulatory mechanisms in biomolecular systems through collaborative statistical analysis, advancing knowledge in gene regulation."
      },
      {
        title: "Cyclic Networks",
        description: "Explored causal cyclic networks, revealing feedback loops and cycles that are crucial in biological regulation."
      },
      {
        title: "Multi-scale Modeling",
        description: "Integrated data from molecular to cellular levels, providing multi-scale models that offer deeper insights into biological functions."
      }
    ]
  },
  {
    id: "Neurological Diseases",
    group: 1,
    projects: [
      {
        title: "Answer ALS",
        description: "Joined forces with neurologists and data scientists to build a comprehensive resource for ALS, aiding in the quest for effective treatments."
      },
      {
        title: "ALS Progression Patterns",
        description: "Analyzed patient data to identify progression patterns in ALS, contributing to personalized treatment approaches."
      },
      {
        title: "iPSC-derived Motor Neurons",
        description: "Collaborated with stem cell researchers to study motor neurons, shedding light on disease mechanisms at the cellular level."
      },
      {
        title: "Biomarker Discovery",
        description: "Discovered potential biomarkers for early detection of neurodegenerative diseases through integrative analysis."
      }
    ]
  },
  {
    id: "Cancer Research",
    group: 1,
    projects: [
      {
        title: "Acute Myeloid Leukemia",
        description: "Partnered with oncologists to study leukemia stem cells using single-cell techniques, identifying targets for new therapies."
      },
      {
        title: "NRAS Mutations",
        description: "Investigated the impact of NRAS mutations in blood cancers, providing insights that inform treatment strategies."
      },
      {
        title: "Hematopoietic Stem Cells",
        description: "Worked with hematologists to analyze stem cell heterogeneity, advancing our understanding of blood cell development."
      },
      {
        title: "Clonal Evolution",
        description: "Traced cancer cell evolution over time, aiding in the prediction of disease progression and resistance patterns."
      }
    ]
  },
  {
    id: "Immunology",
    group: 1,
    projects: [
      {
        title: "Hematopoietic Continuum",
        description: "Studied immune responses across different cell types, enhancing vaccine development and immunotherapy approaches."
      },
      {
        title: "Immune System Modeling",
        description: "Developed computational models of the immune system, providing tools for researchers to simulate responses to pathogens."
      },
      {
        title: "Cytokine Signaling",
        description: "Explored cytokine networks in collaboration with immunologists, revealing pathways that could be targeted in diseases."
      },
      {
        title: "Immune Cell Differentiation",
        description: "Mapped the differentiation paths of immune cells, contributing to our knowledge of immune system development."
      }
    ]
  },
  {
    id: "Data Visualization",
    group: 1,
    projects: [
      {
        title: "Visualization Techniques",
        description: "Designed interactive visualizations that make complex data understandable, supporting researchers in drawing meaningful conclusions."
      },
      {
        title: "Interactive Tools",
        description: "Developed user-friendly tools with our software engineers, enabling real-time data exploration and hypothesis testing."
      }
    ]
  }
]);

export const links = writable<Link[]>([
  { source: "Next Gen Analytics", target: "Single-Cell Analysis", value: 1 },
  { source: "Next Gen Analytics", target: "Computational Biology", value: 1 },
  { source: "Next Gen Analytics", target: "Systems Biology", value: 1 },
  { source: "Next Gen Analytics", target: "Neurological Diseases", value: 1 },
  { source: "Next Gen Analytics", target: "Cancer Research", value: 1 },
  { source: "Next Gen Analytics", target: "Immunology", value: 1 },
  { source: "Next Gen Analytics", target: "Data Visualization", value: 1 },
  { source: "Single-Cell Analysis", target: "Computational Biology", value: 1 },
  { source: "Single-Cell Analysis", target: "Systems Biology", value: 1 },
  { source: "Single-Cell Analysis", target: "Immunology", value: 1 },
  { source: "Computational Biology", target: "Systems Biology", value: 1 },
  { source: "Computational Biology", target: "Cancer Research", value: 1 },
  { source: "Systems Biology", target: "Cancer Research", value: 1 },
  { source: "Systems Biology", target: "Neurological Diseases", value: 1 },
  { source: "Neurological Diseases", target: "Cancer Research", value: 1 },
  { source: "Immunology", target: "Cancer Research", value: 1 },
  { source: "Data Visualization", target: "Single-Cell Analysis", value: 1 },
  { source: "Data Visualization", target: "Computational Biology", value: 1 }
]);
