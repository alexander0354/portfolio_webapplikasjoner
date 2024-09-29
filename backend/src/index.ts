import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors';

const app = new Hono()

app.use(cors());

const projects = [
  {
    id: 1,
    title: 'Porteføje prosjekt',
    description: 'Laget en portefølje med React og Hono backend.',
    createdAt: '2024-09-25',
  },
  {
    id: 2,
    title: 'Moviesearch app',
    description: 'Utviklet en filmsøking applikasjon med React',
    createdAt: '2023-07-18',
  },
  {
    id: 3,
    title: 'Webside',
    description: 'Nettside lagd i webutvikling om CMS og UU',
    createdAt: '2023-08-05',
  }
];

app.get('/projects', (c) => {
  return c.json(projects)
});

app.post('/projects', async (c) => {
  const newProject = await c.req.json();
  projects.push(newProject); 
  return c.json({ message: 'Project added successfully', project: newProject });
});

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
