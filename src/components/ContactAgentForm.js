import { useState } from "react";

const ContactAgentForm = ({ onClose, title = "Contact Agent" }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format.";
    if (!message.trim()) newErrors.message = "Message is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      alert("Message submitted successfully!");
      onClose();
    }
  };

  return (
    <div className="form-modal">
      <form className="contact-form" onSubmit={handleSubmit}>
        <h3>{title}</h3>

        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <span className="error">{errors.name}</span>}

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <label>Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        {errors.message && <span className="error">{errors.message}</span>}

        <button type="submit">Send</button>
        <button type="button" onClick={onClose} className="cancel">Cancel</button>
      </form>
    </div>
  );
};

export default ContactAgentForm;
