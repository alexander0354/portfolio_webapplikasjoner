// Hente prosjekter fra backend (Hono-server)
async function fetchProjects() {
    try {
        const response = await fetch('http://localhost:3999/json'); // Hent prosjekter fra backend
        const data = await response.json();
        displayProjects(data.prosjekter);
    } catch (error) {
        console.error('Kunne ikke hente prosjekter:', error);
    }
}

// Vise prosjektene i HTML
function displayProjects(projects) {
    const projectsContainer = document.querySelector('.projects');
    projectsContainer.innerHTML = ''; // Tømmer containeren før vi legger til nye prosjekter

    projects.forEach(project => {
        const article = document.createElement('article');
        article.innerHTML = `
            <h2>${project.tittel}</h2>
            <p>${project.beskrivelse}</p>
            <p><strong>Teknologier brukt:</strong> ${project.teknologier.join(', ')}</p>
            <p><strong>Repo:</strong> <a href="${project.repoLink}" target="_blank">Link til repo</a></p>
            <p><strong>Status:</strong> ${project.status}</p>
            <img src="${project.bilde}" alt="${project.tittel}" width="100%">
        `;
        projectsContainer.appendChild(article);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Hent og vis prosjekter ved start
    fetchProjects();

    // Håndterer skjemaets submit-hendelse for å legge til et nytt prosjekt
    const form = document.querySelector('.add-project form');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Henter verdiene fra skjemaet
        const newProject = {
            tittel: document.getElementById('title').value,
            beskrivelse: document.getElementById('description').value,
            teknologier: document.getElementById('technologies').value.split(','),
            repoLink: document.getElementById('repo-link').value,
            status: document.getElementById('status').value,
            bilde: "default.jpg" // Placeholder for bildet
        };

        // Sender prosjektet til backend (POST-forespørsel)
        try {
            const response = await fetch('http://localhost:3999/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProject)
            });

            const result = await response.json();
            console.log('Prosjekt lagt til:', result);

            // Oppdaterer prosjektlisten etter at et nytt prosjekt er lagt til
            fetchProjects();
        } catch (error) {
            console.error('Kunne ikke legge til prosjekt:', error);
        }

        // Tøm skjemaet etter innsending
        form.reset();
    });
});
