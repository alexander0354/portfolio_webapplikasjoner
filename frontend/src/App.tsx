// App.tsx
import React from 'react';
import { Projects } from './components/Projects';
import ContactForm from './components/ContactForm';
import CreateProject from './components/CreateProject';
import useProjects from './hooks/useProjects';
import Layout from './components/Layout';
import './App.css';

type ExperienceData = {
  title: string;
  description: string;
};

const experiencesData: ExperienceData[] = [
  { title: "Erfaring 1", description: "Beskrivelse1" },
  { title: "Erfaring 2", description: "Beskrivelse2" }
];

// Experience-komponenten
export function Experience({ children }: { children: React.ReactNode }) {
  return <div className="experience-item">{children}</div>;
}

// Experiences-komponenten
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

// App-komponenten
function App() {
  const student = {
    name: "Halgeir Geirson",
    degree: "Bachelor IT",
    points: 180,
    email: "student@hiof.no",
    experiences: experiencesData,
  };

  const { projects, loading, error, addProject } = useProjects();

  const handleContactClick = () => {
    alert(`Studentens e-post: ${student.email}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Layout>
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
        <CreateProject onCreate={addProject} />
      </aside>
      <section className="contact-section">
        <button onClick={handleContactClick} className="contact-button">Kontakt student</button>
        <h2>Kontakt meg!</h2>
        <ContactForm />
      </section>
    </Layout>
  );
}

export default App;
