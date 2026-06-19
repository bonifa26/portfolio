function ContactForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const contactData = {
      name: e.target.name.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      suggestion: e.target.suggestion.value,
    };

    const res = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    });

    const data = await res.json();

    if (data.success) {
      alert("Message saved successfully");
      e.target.reset();
    } else {
      alert(data.message);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <form className="contact-form" onSubmit={handleSubmit}>
        <h2>Get In Touch</h2>

        <input type="text" name="name" placeholder="Enter your name" required />

        <input type="text" name="phone" placeholder="Enter your phone number" required />

        <input type="email" name="email" placeholder="Enter your email" required />

        <textarea name="suggestion" placeholder="Enter your suggestion" required></textarea>

        <button type="submit">Send Message</button>
      </form>
    </section>
  );
}

export default ContactForm;