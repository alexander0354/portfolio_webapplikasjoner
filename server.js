// Importerer nødvendige moduler
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from 'node:fs/promises';

// Oppretter en ny Hono-applikasjon
const app = new Hono();

// Aktiverer CORS for alle ruter
app.use("/*", cors());

// Setter opp statisk filbetjening for filer i "public"-mappen
app.use("/static/*", serveStatic({ root: "./public" }));

// Variabel for å holde prosjekter i minnet
let projects = [];

// Hente prosjekter fra data.json
app.get("/json", async (c) => {
    if (projects.length === 0) { // Hvis listen er tom, les fra JSON-filen
        const data = await fs.readFile('./public/data.json', 'utf8');
        projects = JSON.parse(data).prosjekter;
    }
    return c.json({ prosjekter: projects });
});

// Legge til et nytt prosjekt
app.post("/add", async (c) => {
    const newProject = await c.req.json();
    newProject.id = crypto.randomUUID(); // Legg til en unik ID til prosjektet
    projects.push(newProject); // Legg til prosjektet i minne-listen
    return c.json(projects, { status: 201 });
});

// Definerer porten serveren skal lytte på
const port = 3999;

console.log(`Server is running on port ${port}`);

// Starter serveren
serve({
    fetch: app.fetch,
    port,
});
