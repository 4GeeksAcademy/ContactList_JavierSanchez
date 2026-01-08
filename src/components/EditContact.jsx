import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const EditContact = () => {
    const { id } = useParams(); // Get contact ID from URL parameters
    const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", photoUrl: "" }); // State to hold form data
    const navigate = useNavigate();

    // Fetch existing contact data when component mounts
    useEffect(() => {
        async function fetchContact() {
            try {
                const response = await fetch(`https://playground.4geeks.com/contact/agendas/JavierAgenda/contacts`);
                const data = await response.json();
                const contact = data.contacts.find(c => c.id === parseInt(id));
                if (contact) {
                    // Obtener la foto desde localStorage
                    const savedPhoto = localStorage.getItem(`contact_photo_${id}`);
                    setForm({
                        name: contact.name || "",
                        email: contact.email || "",
                        phone: contact.phone || "",
                        address: contact.address || "",
                        photoUrl: savedPhoto || ""
                    });
                }
            } catch (error) {
                console.error("Error fetching contact:", error);
            }
        }
        fetchContact();
    }
        , [id]);

    // Handle form input changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch(`https://playground.4geeks.com/contact/agendas/JavierAgenda/contacts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    address: form.address,
                    agenda_slug: "JavierAgenda"
                }),
            });
            if (response.ok) {
                // Guardar la foto en localStorage
                if (form.photoUrl) {
                    localStorage.setItem(`contact_photo_${id}`, form.photoUrl);
                } else {
                    localStorage.removeItem(`contact_photo_${id}`);
                }
                navigate("/"); // Redirect to contact list after successful update
            }
        } catch (error) {
            console.error("Error updating contact:", error);
        }
    }

    return (
        <div className="container mt-4">
            <h2>Edit Contact</h2>
            {/* Form controlled with preloaded data */}
            <form onSubmit={handleSubmit}>
                <input className="form-control mb-2" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
                <input className="form-control mb-2" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
                <input className="form-control mb-2" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <input className="form-control mb-2" name="address" placeholder="Address" value={form.address} onChange={handleChange} />
                <input className="form-control mb-2" name="photoUrl" placeholder="Photo URL" value={form.photoUrl} onChange={handleChange} />
                <div className="d-flex gap-2">
                    <button className="btn btn-success" type="submit">Save Changes</button>
                    <button className="btn btn-secondary" type="button" onClick={() => navigate("/")}>Back</button>
                </div>
            </form>
        </div>
    );
}