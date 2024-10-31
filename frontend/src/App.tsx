import React, { useState, useEffect } from 'react';
import { Projects } from './components/Projects';
import ContactForm from './components/ContactForm';
import CreateProject from './components/CreateProject';
import './App.css';

// Definer typer for erfaring og prosjekt
type ExperienceData = {
  title: string;
  description: string;
};

type ProjectData = {
  id: number; // Generer som en tilfeldig streng
  title: string;
  description: string;
  createdAt: string; // Brukermanual input
};

const experiencesData: ExperienceData[] = [
  { title: "Erfaring 1", description: "Beskrivelse1" },
  { title: "Erfaring 2", description: "Beskrivelse2" }
];

// Experience-komponenten som bruker children 
export function Experience({ children }: { children: React.ReactNode }) {
  return <div className="experience-item">{children}</div>;
}

// Experiences-komponenten som bruker .map() for å vise en liste over erfaringer
export function Experiences({ experiences }: { experiences: ExperienceData[] }) { 
  return ( 
    <div className="experiences">
      {experiences.length === 0 ? (
        <p>Ingen erfaringer enda</p>
      ) : (
        experiences.map((exp, index) => (
          <Experience key={index}>
            <h4>{exp.title}</h4>
            <p>{exp.description}</p>
          </Experience>
        ))
      )}
    </div>
  );
}

// App-komponenten som binder alt sammen
function App() {
  const student = {
    name: "Halgeir Geirson",
    degree: "Bachelor IT",
    points: 180,
    email: "student@hiof.no",
    experiences: experiencesData,
  };

  const [projects, setProjects] = useState<ProjectData[]>([]);

  // useEffect for å hente prosjekter fra backend
  useEffect(() => {
    fetch('http://localhost:3000/projects')  // Pass på at portnummeret stemmer
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));
  }, []); // Kjør kun én gang ved mount

  const handleContactClick = () => {
    alert(`Studentens e-post: ${student.email}`);
  };

  const handleCreateProject = (newProject: Omit<ProjectData, 'id'>) => {
    const projectWithId: ProjectData = {
      ...newProject,
      id: Math.floor(Math.random() * 1000000), // Generer en tilfeldig ID
    };

    // Oppdater state med det nye prosjektet
    setProjects([...projects, projectWithId]);

    // Send prosjektet til backend
    fetch('http://localhost:3000/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectWithId),
    }).catch((error) => console.error('Error adding project to backend:', error));
  };

  return (
    <div>
      <header>
        <h1 className="main-header">Min Portefølje</h1>
      </header>
      <main>
        <section className="content-wrapper">
          <div className="experiences-container">
            <h2>Erfaringer</h2>
            <Experiences experiences={student.experiences} />
          </div>
          <div className="projects-container">
            <h2>Mine Prosjekter</h2>
            <Projects projects={projects} />
          </div>
        </section>
        <aside className="create-project-container">
          <CreateProject onCreate={handleCreateProject} />
        </aside>
        <section className="contact-section">
          <button onClick={handleContactClick} className="contact-button">Kontakt student</button>
          <h2>Kontakt meg!</h2>
          <ContactForm />
        </section>
      </main>
    </div>
  );
}

export default App;
