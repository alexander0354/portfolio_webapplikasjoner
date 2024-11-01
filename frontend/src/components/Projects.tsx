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
  demos?: Demo[];
};

export function ProjectItem({ project }: { project: Project }) {
  return (
    <div className="project-item">
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
      {project.demos && project.demos.length > 0 && (
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
  );
}

export function Projects({ projects = [] }: { projects: Project[] }) {
  return (
    <div>
      {projects.length === 0 ? (
        <p>Ingen prosjekter enda!</p>
      ) : (
        projects.map((project) => <ProjectItem key={project.id} project={project} />)
      )}
    </div>
  );
}
