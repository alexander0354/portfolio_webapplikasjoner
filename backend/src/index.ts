import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Context, Next } from 'hono';

const app = new Hono();

app.use(cors());

const projects = [
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

// Middleware for å filtrere prosjekter basert på brukerens rolle
const roleBasedAccessMiddleware = async (c: Context, next: Next) => {
  const userRole = c.req.header('Cookie')?.split('; ').find(row => row.startsWith('user.role='))?.split('=')[1];
  console.log('User role from cookie:', userRole); // Feilsøkingslogg

  if (userRole !== 'admin') {
    const publicProjects = projects.filter((project) => project.public);
    console.log('Filtered projects for non-admin:', publicProjects); // Logg for ikke-admin brukere
    c.set('filteredProjects', publicProjects);
  } else {
    console.log('Admin access, all projects:', projects); // Logg for admin tilgang
    c.set('filteredProjects', projects);
  }

  await next();
};

app.use('/projects', roleBasedAccessMiddleware);

// Endepunkt for å hente prosjekter med tilgangssjekk
app.get('/projects', (c: Context) => {
  const filteredProjects = c.get('filteredProjects');
  return c.json(filteredProjects);
});

app.post('/projects', async (c: Context) => {
  const newProject = await c.req.json();
  projects.push(newProject);
  return c.json({ message: 'Project added successfully', project: newProject });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
