function Hero() {
  return (
    <section className="hero">
      <div>
        <p className="tag">Full Stack Developer</p>

        <h1>Hi, I'm Bonifa</h1>

        <p>
          Computer Science Engineering Student |
          Full-Stack Developer |
          Spring Boot & MERN Enthusiast
        </p>

        <p>
          Passionate about building scalable web
          applications and solving real-world problems.
        </p>

        <a href="/resume.pdf"
            download="resume.pdf"
            className="resume-btn">

        <button>Download Resume</button>
        </a>
        </div>

      <div className="hero-image">
        <img src="/1.jpg.jfif" alt="Bonifa" />
      </div>
    </section>
  );
}

export default Hero;