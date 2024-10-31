// Projects.tsx
import React, { useEffect, useState } from "react";
import { formatDate } from '../utils/dataUtils';

type Demo = {
  title: string;
  url: string;
};

type Project = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  status: string;
  publishedAt: string | null;
  tags: string[];
  public: boolean;
  externalLink: string | null;
  demos: Demo[];
};

export function Project({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/projects')
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error i fetch av prosjekter:', error));
  }, []);
  
  return <div>{children}</div>;
}

// Projects-komponenten som bruker .map() for å liste prosjekter dynamisk
export function Projects({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.length === 0 ? (
        <p>Ingen prosjekter enda!</p>
      ) : (
        projects.map((project, index) => (
          <div key={index} className="project-item">
            <h4>{project.title}</h4>
            <p>{project.description}</p>
            <small>Opprettet: {formatDate(project.createdAt)}</small>
            {project.status === 'published' && project.publishedAt && (
              <small>Publisert: {formatDate(project.publishedAt)}</small>
            )}
            <p>Status: {project.status}</p>
            <p>Tags: {project.tags.join(', ')}</p>
            {project.public ? (
              <p>Prosjektet er offentlig</p>
            ) : (
              <p>Prosjektet er privat</p>
            )}
            {project.externalLink && (
              <a href={project.externalLink} target="_blank" rel="noopener noreferrer">
                Ekstern link
              </a>
            )}
            {/* Liste over demoer */}
            {project.demos.length > 0 && (
              <div className="demos-section">
                <h5>Demoer</h5>
                <ul>
                  {project.demos.map((demo, demoIndex) => (
                    <li key={demoIndex}>
                      <a href={demo.url} target="_blank" rel="noopener noreferrer">
                        {demo.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}