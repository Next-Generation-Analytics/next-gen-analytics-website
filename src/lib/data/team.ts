import type { TeamMember } from '$lib/types/team';

export const teamMembers: TeamMember[] = [
    {
        id: "karen-sachs",
        name: "Karen Sachs",
        role: "Founder, Chief Scientist",
        image: "/team/karen-sachs.jpg", // Corrected path
        bio: "Dr. Karen Sachs is among the pioneers structuring causal models for studying biomolecular networks. As the Founder and Chief Scientist of our team, she brings experts together across disciplines to understand biological systems in health and disease.",
        specialties: [
            "Computational Biology",
            "Immunology",
            "Single-Cell Analysis",
            "Machine Learning",
            "Data Integration",
            "Network Inference",
            "Systems Biology",
            "Cancer Biology",
            "Causal Modeling",
            "Data Visualization",
        ],
        social: {
            linkedin: "https://www.linkedin.com/in/karen-sachs-b174313/", // Verify and update if necessary
            // Add other social profiles if available and appropriate
        }
    },
    {
        id: "eric-mockler",
        name: "Eric Jing Mockler",
        role: "Bioinformatics Scientist",
        image: "/team/eric-mockler.png", // Corrected path
        bio: "Eric Jing Mockler is a multidisciplinary researcher with a focus on bioinformatics, systems biology, and neuroscience. He applies advanced machine learning and statistical methods to integrate complex biological datasets, driving the discovery of therapeutic targets and biomarkers.",
        specialties: [
            "Computational Biology",
            "Neuroscience",
            "Bioinformatics",
            "Systems Biology",
            "Machine Learning",
            "Data Integration",
            "Data Visualization",
            "Software Engineering",
            "Deep Learning",
            "Computer Vision"
        ],
        social: {
            linkedin: "https://www.linkedin.com/in/ejmockler/", // Verify and update if necessary
            github: "https://github.com/ejmockler"
        }
    },
    // ... other team members
];
