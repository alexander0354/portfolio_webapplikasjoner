import { useState, useEffect } from 'react';
import { fetchProjects, createProject } from '../services/apiService';

function useProjects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await fetchProjects();
                setProjects(data); // Sett prosjekter fra backend
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError(String(err));
                }
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, []);

    const addProject = async (newProject: any) => {
        try {
            const savedProject = await createProject(newProject);
            setProjects([...projects, savedProject.project]); // Legg til det nye prosjektet
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
        }
    };

    return { projects, loading, error, addProject };
}

export default useProjects;
