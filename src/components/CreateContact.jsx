import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CreateContact = () => {
    const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", photoUrl: "" }); // State to hold form data
    const navigate = useNavigate();

    // Handle form input changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch("https://playground.4geeks.com/contact/agendas/JavierAgenda/contacts", {
                method: "POST",
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
                const newContact = await response.json();
                // Guardar la foto en localStorage
                if (form.photoUrl) {
                    localStorage.setItem(`contact_photo_${newContact.id}`, form.photoUrl);
                }
                navigate("/"); // Redirect to contact list after successful creation
            }
        } catch (error) {
            console.error("Error creating contact:", error);
        }
    }

    return (
        <div className="container mt-4">
            <h2>Create Contact</h2>
            <form onSubmit={handleSubmit}>
                <input className="form-control mb-2" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
                <input className="form-control mb-2" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
                <input className="form-control mb-2" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <input className="form-control mb-2" name="address" placeholder="Address" value={form.address} onChange={handleChange} />
                <input className="form-control mb-2" name="photoUrl" placeholder="Photo URL" value={form.photoUrl} onChange={handleChange} />
                <div className="d-flex gap-2">
                    <button className="btn btn-success" type="submit">Save</button>
                    <button className="btn btn-secondary" type="button" onClick={() => navigate("/")}>Back</button>
                </div>
            </form>
        </div>
    );
}