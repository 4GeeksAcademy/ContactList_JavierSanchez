import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DeleteContact } from "./DeleteContact";

export const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);
    const navigate = useNavigate();

    // Check if the agenda exists, and create it if it doesn't
    async function checkAgenda() {
        try {
            const response = await fetch("https://playground.4geeks.com/contact/agendas/JavierAgenda");
            if (!response.ok) {
                // If agenda doesn't exist, create it
                const createResponse = await fetch("https://playground.4geeks.com/contact/agendas/JavierAgenda", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                if (createResponse.ok) {
                    console.log("Agenda JavierAgenda created successfully");
                } else {
                    console.error("Error creating agenda:", createResponse.statusText);
                }
            } else {
                console.log("Agenda JavierAgenda already exists");
            }
        } catch (error) {
            console.error("Error checking agenda:", error);
        }
    }

    // Obtain the list of contacts from the backend API
    async function fetchContacts() {
        try {
            const response = await fetch("https://playground.4geeks.com/contact/agendas/JavierAgenda/contacts");
            const data = await response.json();
            // Añadir las fotos desde localStorage
            const contactsWithPhotos = (data.contacts || []).map(contact => ({
                ...contact,
                photoUrl: localStorage.getItem(`contact_photo_${contact.id}`) || ""
            }));
            setContacts(contactsWithPhotos);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    }

    // Handle delete contact action (open modal)
    function handleDelete(contactId) {
        setContactToDelete(contactId);
        setDeleteOpen(true);
    }

    // Confirm deletion of contact
    async function confirmDeleteContact() {
        try {
            const response = await fetch(`https://playground.4geeks.com/contact/agendas/JavierAgenda/contacts/${contactToDelete}`, {
                method: "DELETE",
            });
            if (response.ok) {
                // Eliminar la foto de localStorage
                localStorage.removeItem(`contact_photo_${contactToDelete}`);
                // Refresh the contact list after deletion
                fetchContacts();
                setDeleteOpen(false);
                setContactToDelete(null);
            }
        } catch (error) {
            console.error("Error deleting contact:", error);
        }
    }

    // Fetch contacts when the component mounts
    useEffect(() => {
        checkAgenda();
        fetchContacts();
    }, []);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Contact List</h2>
                {/* Button to navigate to the create contact view */}
                <Link to="/create" className="btn btn-primary">Create Contact</Link>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        {/* Main columns */}
                        <th>Photo</th>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map(c => (
                        <tr key={c.id}>
                            <td>
                                {c.photoUrl ? (
                                    <img src={c.photoUrl} alt={c.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "50%" }} />
                                ) : (
                                    <div style={{ width: "50px", height: "50px", backgroundColor: "#ddd", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <span>👤</span>
                                    </div>
                                )}
                            </td>
                            <td>{c.name}</td>
                            <td>{c.phone}</td>
                            <td>{c.email}</td>
                            <td>{c.address}</td>
                            <td>
                                {/* Button to delete: shows the modal */}
                                <button className="btn btn-danger btn-sm me-2" onClick={() => handleDelete(c.id)}>Delete</button>
                                {/* Button to edit: navigates to the edit route */}
                                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(`/edit/${c.id}`)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Confirmation modal for deletion */}
            <DeleteContact
                show={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={confirmDeleteContact}
                message="Are you sure you want to delete this contact?"
            />
        </div>
    );
}
