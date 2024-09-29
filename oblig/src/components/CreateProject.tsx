import { useState } from "react";

type ProjectData = {
  title: string;
  description: string;
  createdAt: string; 
}

export default function CreateProject({ onCreate }: { onCreate: (project: ProjectData) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createdAt, setCreatedAt] = useState(""); // Legg til state for createdAt

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description && createdAt) {
      onCreate({ title, description, createdAt }); // Send createdAt til onCreate
      setTitle("");
      setDescription("");
      setCreatedAt(""); // Nullstill feltet etter submit
    } else {
      alert("Alle felt må fylles ut!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h2>Nytt prosjekt</h2>
        <label>Tittel:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Beskrivelse:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div>
        <label>Opprettelsesdato:</label>
        <input type="date" value={createdAt} onChange={(e) => setCreatedAt(e.target.value)} required />
      </div>
      <button type="submit">Opprett prosjekt</button>
    </form>
  );
}
