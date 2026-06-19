import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import Tools from "../components/Tools";
import ContactInfo from "../components/ContactInfo";
import ContactForm from "../components/ContactForm";

function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <section className="grid">

        <About />

        <div className="skills-experience">
          <Skills />
          <Experience />
        </div>

        <Projects />

        <div className="tools-contact">
          <Tools />
          <ContactInfo />
        </div>

      </section>

      <ContactForm />
    </>
  );
}

export default Home;