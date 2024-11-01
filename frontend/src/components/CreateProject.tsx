import React, { useState } from "react";

type ProjectData = {
  title: string;
  description: string;
  status: string;
  publishedAt: string | null;
  tags: string[];
  public: boolean;
  externalLink: string | null;
  demos: { title: string; url: string }[];
};

type CreateProjectProps = {
  onCreate: (project: ProjectData) => void;
};

export default function CreateProject({ onCreate }: CreateProjectProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [tags, setTags] = useState<string>("");
  const [publicProject, setPublicProject] = useState(false);
  const [externalLink, setExternalLink] = useState<string | null>(null);
  const [demos, setDemos] = useState<{ title: string; url: string }[]>([]);

  const handleAddDemo = () => {
    setDemos([...demos, { title: "", url: "" }]);
  };

  const handleDemoChange = (index: number, field: "title" | "url", value: string) => {
    const newDemos = demos.slice();
    newDemos[index][field] = value;
    setDemos(newDemos);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      title,
      description,
      status,
      publishedAt,
      tags: tags.split(",").map((tag) => tag.trim()), // Split tags by comma
      public: publicProject,
      externalLink,
      demos,
    });
    // Reset form fields after submit
    setTitle("");
    setDescription("");
    setStatus("draft");
    setPublishedAt(null);
    setTags("");
    setPublicProject(false);
    setExternalLink(null);
    setDemos([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      <div>
        <label>Published At:</label>
        <input type="date" onChange={(e) => setPublishedAt(e.target.value)} />
      </div>
      <div>
        <label>Tags (comma-separated):</label>
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., react, web" />
      </div>
      <div>
        <label>Public:</label>
        <input type="checkbox" checked={publicProject} onChange={(e) => setPublicProject(e.target.checked)} />
      </div>
      <div>
        <label>External Link:</label>
        <input type="url" value={externalLink || ""} onChange={(e) => setExternalLink(e.target.value)} />
      </div>
      <div>
        <h5>Demos</h5>
        {demos.map((demo, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Demo title"
              value={demo.title}
              onChange={(e) => handleDemoChange(index, "title", e.target.value)}
            />
            <input
              type="url"
              placeholder="Demo URL"
              value={demo.url}
              onChange={(e) => handleDemoChange(index, "url", e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddDemo}>
          Add Demo
        </button>
      </div>
      <button type="submit">Create Project</button>
    </form>
  );
}
