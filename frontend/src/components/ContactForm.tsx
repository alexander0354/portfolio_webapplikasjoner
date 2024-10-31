import { useState } from "react";

export default function ContactForm() {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [submittedData, setSubmittedData] = useState<{name: string; message: string} | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (name && message) {
            setSubmittedData({name, message});
            setName("");
            setMessage("");
        } else {
            alert("Begge felt må fylles ut!")
        }
    };

    return (
        <div>
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Navn:</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Navn" />
            <label htmlFor="message">Melding:</label>
            <textarea value={message} id="message" onChange={(e) => setMessage(e.target.value)} placeholder="Melding"></textarea>
            <button type="submit">Send inn</button>
        </form>
        {submittedData && (
        <pre>{JSON.stringify(submittedData, null, 2)}</pre>
      )}
        </div>
    );
}