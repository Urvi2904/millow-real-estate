/**
 * ContactAgentForm
 *
 * A modal form that lets users send a message to an agent.
 * Includes input validation for name, email, and message fields.
 * Displays inline error messages. Calls `onClose()` when submitted or cancelled.
 */

import { useState } from 'react';

const ContactAgentForm = ({ onClose, title = 'Contact Agent' }) => {
  // Form input state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Email format validation
  const validateEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  // Handles form submission and validation
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation rules, required fields
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!email.trim()) newErrors.email = 'Email is required.';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email format.';
    if (!message.trim()) newErrors.message = 'Message is required.';

    // Show errors if any, otherwise "submit"
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      alert('Message submitted successfully!');
      onClose();
    }
  };

  return (
    <div className="form-modal">
      <form className="contact-form" onSubmit={handleSubmit}>
        <h3>{title || 'Contact an Agent'}</h3>

        {/* Name input */}
        <label htmlFor="contact-name">Name</label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <span className="error">{errors.name}</span>}

        {/* Email input */}
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <span className="error">{errors.email}</span>}

        {/* Message input */}
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        {errors.message && <span className="error">{errors.message}</span>}

        <button type="submit">Send</button>
        <button type="button" onClick={onClose} className="cancel">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ContactAgentForm;
