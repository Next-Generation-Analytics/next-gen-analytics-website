export interface TeamMember {
    id: string;
    name: string;
    role: string;
    image: string;
    bio: string;
    specialties: string[];
    social?: {
        linkedin?: string;
        twitter?: string;
        github?: string;
    }
}
