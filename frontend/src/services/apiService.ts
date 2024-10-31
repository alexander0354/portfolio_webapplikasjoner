import { API_URL } from "../config/config";
import { projectSchema } from "../schemas/projectSchema";

export async function fetchProjects() {
    const response = await fetch(`${API_URL}/projects`);
    if (!response.ok) {
        throw new Error('Kunne ikke hente prosjekter');
    } 
    return await response.json();
}

export async function createProject(newProject: any) {
    projectSchema.parse(newProject); //validering

    const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
    });
    if (!response.ok) {
        throw new Error('Failed to create project');
    }
    return await response.json();
}