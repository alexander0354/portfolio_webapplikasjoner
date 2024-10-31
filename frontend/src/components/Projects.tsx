import React, { useEffect, useState } from "react";

type Project = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
};

// Enkel Project-komponent som viser tittel og beskrivelse, fleksibel med children
export function Project({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Hent data fra serveren
    fetch('http://localhost:3000/projects')
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));
  }, []); // Kjør en gang ved mount
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
          <Project key={index}>
            <h4>{project.title}</h4>
            <p>{project.description}</p>
            <small>Opprettet: {project.createdAt}</small>
          </Project>
        ))
      )}
    </div>
  );
}
