import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { PrismaClient } from '@prisma/client';
import type { Context, Next } from 'hono';

const app = new Hono();
const prisma = new PrismaClient();

app.use(cors());

// Hardkodede prosjekter som fallback
const fallbackProjects = [
  {
    id: 1,
    title: 'Portefølje prosjekt',
    description: 'Laget en portefølje med React og Hono backend.',
    createdAt: '2024-09-25',
    status: 'published',
    publishedAt: '2024-10-01',
    tags: ['frontend', 'portfolio'],
    public: true,
    externalLink: 'https://example.com/portfolio',
    demos: [{ title: 'Demo 1', url: 'https://example.com/demo1' }]
  },
  {
    id: 2,
    title: 'Moviesearch app',
    description: 'Utviklet en filmsøking applikasjon med React',
    createdAt: '2023-07-18',
    status: 'draft',
    tags: ['react', 'movies'],
    public: true,
    externalLink: 'https://example.com/moviesearch',
    demos: [{ title: 'Demo A', url: 'https://example.com/demoA' }]
  },
  {
    id: 3,
    title: 'Webside',
    description: 'Nettside lagd i webutvikling om CMS og UU',
    createdAt: '2023-08-05',
    status: 'published',
    publishedAt: '2023-09-01',
    tags: ['cms', 'web'],
    public: true,
    externalLink: 'https://example.com/webside',
    demos: []
  }
];

// Funksjon for å hente prosjekter fra databasen og inkludere fallbackProsjekter
const getProjects = async () => {
  const dbProjects = await prisma.project.findMany();
  const allProjects = [...dbProjects.map(transformProject), ...fallbackProjects];
  return allProjects;
};

// Funksjon for å konvertere tags fra en kommaseparert streng til en array
const transformProject = (project: any) => {
  return {
    ...project,
    tags: project.tags ? project.tags.split(',') : [], // Konverter tags til array
  };
};

// Middleware for å filtrere prosjekter basert på brukerens rolle
const roleBasedAccessMiddleware = async (c: Context, next: Next) => {
  const userRole = c.req.header('Cookie')?.split('; ').find(row => row.startsWith('user.role='))?.split('=')[1];
  console.log('User role from cookie:', userRole); // Feilsøkingslogg

  // Hent prosjekter fra databasen eller bruk fallback
  const allProjects = await getProjects();

  if (userRole !== 'admin') {
    // Filtrer kun offentlige prosjekter for ikke-admin brukere
    const publicProjects = allProjects.filter((project) => project.public);
    c.set('filteredProjects', publicProjects);
  } else {
    // Gi admin tilgang til alle prosjekter
    c.set('filteredProjects', allProjects);
  }

  await next();
};

app.use('/projects', roleBasedAccessMiddleware);

// Endepunkt for å hente prosjekter med tilgangssjekk
app.get('/projects', (c: Context) => {
  const filteredProjects = c.get('filteredProjects');
  return c.json(filteredProjects);
});

// Endepunkt for å opprette et nytt prosjekt
app.post('/projects', async (c: Context) => {
  const data = await c.req.json();

  // Lagre prosjektet i databasen med tags som en kommaseparert streng
  const newProject = await prisma.project.create({
    data: {
      title: data.title,
      description: data.description,
      createdAt: new Date(),
      status: data.status || 'draft',
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      tags: data.tags.join(','), // Konverter array til kommaseparert streng
      public: data.public || false,
      externalLink: data.externalLink || null,
    },
  });

  return c.json({ message: 'Project added successfully', project: transformProject(newProject) });
});

// Endepunkt for å hente et spesifikt prosjekt
app.get('/projects/:id', async (c: Context) => {
  const projectId = parseInt(c.req.param('id'), 10);
  const project = await prisma.project.findUnique({
    where: { id: projectId }
  });

  if (project) {
    return c.json(transformProject(project));
  } else {
    return c.json({ error: 'Project not found' }, 404);
  }
});

// Endepunkt for å oppdatere et prosjekt
app.put('/projects/:id', async (c: Context) => {
  const projectId = parseInt(c.req.param('id'), 10);
  const data = await c.req.json();

  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      tags: data.tags.join(','), // Konverter array til kommaseparert streng
      public: data.public,
      externalLink: data.externalLink,
    },
  });

  return c.json({ message: 'Project updated successfully', project: transformProject(updatedProject) });
});

// Endepunkt for å slette et prosjekt
app.delete('/projects/:id', async (c: Context) => {
  const projectId = parseInt(c.req.param('id'), 10);
  await prisma.project.delete({
    where: { id: projectId },
  });

  return c.json({ message: 'Project deleted successfully' });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
