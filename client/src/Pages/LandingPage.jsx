import React from "react";
import { Outlet } from "react-router-dom";
import styles from "../Styles/Landing/Landing.module.css";
import Header from "../Components/Utils/Header";

function LandingPage() {
  return (
    <>
      <div data-spy="scroll" data-target=".navbar" data-offset="51">
        <Header />
        <div className="header" id="header">
          <div className="container">
            <h1>
              Welcome to <span>E Startup</span>
            </h1>
            <p>Powerful multipurpose landing page template</p>
            <a className="btn" href="">
              <i className="fas fa-link"></i> Read More
            </a>
          </div>
        </div>

        <div className="about" id="about">
          <div className="container">
            <div className="section-header">
              <h4>Learn more</h4>
              <h2>About Us</h2>
            </div>
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="about-img">
                  <img src={""} alt="About Image" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="about-content">
                  <h3>Our Story</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam elementum lobortis neque, et pellentesque risus
                    scelerisque porttitor. Pellentesque felis arcu
                  </p>
                </div>
                <div className="about-content">
                  <h3>Our Goal</h3>
                  <p>
                    Donec consequat risus a quam bibendum semper. Aliquam
                    dictum, nulla ullamcorper porttitor dignissim, mauris metus
                    dapibus felis, ac cursus est magna at diam
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="team" id="team">
          <div className="container">
            <div className="section-header">
              <h4>Meet our</h4>
              <h2>Team</h2>
            </div>

            <div className="row team-container">
              <div className="col-lg-3 col-md-4 col-sm-6 team-item">
                <div className="team-img">
                  <img
                    src="/images/landing/team-1.jpg"
                    className="img-fluid"
                    alt="Team Image"
                  />
                  <div className="team-link">
                    <a href="#" title="Twitter">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" title="Facebook">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" title="Linkedin">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" title="Instagram">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" title="Youtube">
                      <i className="fab fa-youtube"></i>
                    </a>
                  </div>
                </div>

                <div className="team-info">
                  <h4>Abigail Evans</h4>
                  <p>Web Developer</p>
                </div>
              </div>

              <div className="col-lg-3 col-md-4 col-sm-6 team-item">
                <div className="team-img">
                  <img
                    src="/images/landing/team-1.jpg"
                    className="img-fluid"
                    alt="Team Image"
                  />
                  <div className="team-link">
                    <a href="#" title="Twitter">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" title="Facebook">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" title="Linkedin">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" title="Instagram">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" title="Youtube">
                      <i className="fab fa-youtube"></i>
                    </a>
                  </div>
                </div>

                <div className="team-info">
                  <h4>Ryan Bennett</h4>
                  <p>Apps Developer</p>
                </div>
              </div>

              <div className="col-lg-3 col-md-4 col-sm-6 team-item">
                <div className="team-img">
                  <img
                    src="/images/landing/team-3.jpg"
                    className="img-fluid"
                    alt="Team Image"
                  />
                  <div className="team-link">
                    <a href="#" title="Twitter">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" title="Facebook">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" title="Linkedin">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" title="Instagram">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" title="Youtube">
                      <i className="fab fa-youtube"></i>
                    </a>
                  </div>
                </div>

                <div className="team-info">
                  <h4>Ella Bradley</h4>
                  <p>Digital Marketer</p>
                </div>
              </div>

              <div className="col-lg-3 col-md-4 col-sm-6 team-item">
                <div className="team-img">
                  <img
                    src="/images/landing/team-4.jpg"
                    className="img-fluid"
                    alt="Team Image"
                  />
                  <div className="team-link">
                    <a href="#" title="Twitter">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" title="Facebook">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" title="Linkedin">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" title="Instagram">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" title="Youtube">
                      <i className="fab fa-youtube"></i>
                    </a>
                  </div>
                </div>

                <div className="team-info">
                  <h4>Leo Fitzgerald</h4>
                  <p>SEO Expert</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="service" id="service">
          <div className="container">
            <div className="section-header">
              <span className="glyphicon glyphicon-asterisk"></span>
              <h4>World className</h4>
              <h2>Services</h2>
            </div>
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="service-img">
                  <img
                    src="/images/landing/service-1.jpg"
                    alt="Service Image"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="service-detail">
                  <h3>
                    <i className="fas fa-laptop"></i>Web Development
                  </h3>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      Lorem ipsum dolor sit amet
                    </li>
                    <li className="list-group-item">
                      Donec consequat risus a quam bibendum semper
                    </li>
                    <li className="list-group-item">
                      Aenean fermentum sit amet dui a iaculis
                    </li>
                    <li className="list-group-item">
                      Nulla mi dui vestibulum a accumsan a varius sed enim
                    </li>
                    <li className="list-group-item">
                      Duis scelerisque at eros
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-md-6 d-md-none d-sm-block">
                <div className="service-img">
                  <img
                    src="/images/landing/service-2.jpg"
                    alt="Service Image"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="service-detail">
                  <h3>
                    <i className="fas fa-mobile-alt"></i>Apps Development
                  </h3>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      Lorem ipsum dolor sit amet
                    </li>
                    <li className="list-group-item">
                      Donec consequat risus a quam bibendum semper
                    </li>
                    <li className="list-group-item">
                      Aenean fermentum sit amet dui a iaculis
                    </li>
                    <li className="list-group-item">
                      Nulla mi dui vestibulum a accumsan a varius sed enim
                    </li>
                    <li className="list-group-item">
                      Duis scelerisque at eros
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6 d-sm-none d-md-block">
                <div className="service-img">
                  <img
                    src="/images/landing/service-2.jpg"
                    alt="Service Image"
                  />
                </div>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="service-img">
                  <img
                    src="/images/landing/service-3.jpg"
                    alt="Service Image"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="service-detail">
                  <h3>
                    <i className="fas fa-shield-alt"></i>Online Security
                  </h3>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      Lorem ipsum dolor sit amet
                    </li>
                    <li className="list-group-item">
                      Donec consequat risus a quam bibendum semper
                    </li>
                    <li className="list-group-item">
                      Aenean fermentum sit amet dui a iaculis
                    </li>
                    <li className="list-group-item">
                      Nulla mi dui vestibulum a accumsan a varius sed enim
                    </li>
                    <li className="list-group-item">
                      Duis scelerisque at eros
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-md-6 d-md-none d-sm-block">
                <div className="service-img">
                  <img
                    src="/images/landing/service-4.jpg"
                    alt="Service Image"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="service-detail">
                  <h3>
                    <i className="fas fa-envelope-open-text"></i>Digital
                    Marketing
                  </h3>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      Lorem ipsum dolor sit amet
                    </li>
                    <li className="list-group-item">
                      Donec consequat risus a quam bibendum semper
                    </li>
                    <li className="list-group-item">
                      Aenean fermentum sit amet dui a iaculis
                    </li>
                    <li className="list-group-item">
                      Nulla mi dui vestibulum a accumsan a varius sed enim
                    </li>
                    <li className="list-group-item">
                      Duis scelerisque at eros
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6 d-sm-none d-md-block">
                <div className="service-img">
                  <img
                    src="/images/landing/service-4.jpg"
                    alt="Service Image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="call-to-action">
          <div className="container text-center">
            <div className="section-header">
              <h4>Call to action</h4>
              <h2>Call us</h2>
            </div>
            <a className="btn" href="#">
              <i className="fas fa-phone-alt"></i>Click to Call
            </a>
          </div>
        </div>

        <div className="portfolio" id="portfolio">
          <div className="container">
            <div className="section-header">
              <h4>Creative</h4>
              <h2>Works</h2>
            </div>

            <div className="row portfolio-container">
              <div className="col-lg-4 col-md-6 portfolio-item">
                <div className="portfolio-img">
                  <img
                    src="/images/landing/portfolio-1.jpg"
                    className="img-fluid"
                    alt="Portfolio"
                  />
                  <div className="portfolio-link">
                    <a
                      href="/images/landing/portfolio-1.jpg"
                      data-lightbox="portfolio"
                      data-title="Lorem ipsum dolor"
                      title="Preview"
                    >
                      <i className="fas fa-eye"></i>
                    </a>
                    <a href="" title="More Details">
                      <i className="fas fa-link"></i>
                    </a>
                  </div>
                </div>

                <div className="portfolio-info">
                  <h4>Lorem ipsum dolor sit</h4>
                  <p>Web Design</p>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 portfolio-item">
                <div className="portfolio-img">
                  <img
                    src="/images/landing/portfolio-2.jpg"
                    className="img-fluid"
                    alt="Portfolio"
                  />
                  <div className="portfolio-link">
                    <a
                      href="/images/landing/portfolio-2.jpg"
                      data-lightbox="portfolio"
                      data-title="Nulla ullamcorper pharetra"
                      title="Preview"
                    >
                      <i className="fas fa-eye"></i>
                    </a>
                    <a href="" title="More Details">
                      <i className="fas fa-link"></i>
                    </a>
                  </div>
                </div>

                <div className="portfolio-info">
                  <h4>Donec consequat risus</h4>
                  <p>Web Development</p>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 portfolio-item">
                <div className="portfolio-img">
                  <img
                    src="/images/landing/portfolio-3.jpg"
                    className="img-fluid"
                    alt="Portfolio"
                  />
                  <div className="portfolio-link">
                    <a
                      href="/images/landing/portfolio-3.jpg"
                      data-lightbox="portfolio"
                      data-title="Phasellus eget dictum"
                      title="Preview"
                    >
                      <i className="fas fa-eye"></i>
                    </a>
                    <a href="" title="More Details">
                      <i className="fas fa-link"></i>
                    </a>
                  </div>
                </div>

                <div className="portfolio-info">
                  <h4>Etiam aliquam scelerisque nisl</h4>
                  <p>App Design</p>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 portfolio-item">
                <div className="portfolio-img">
                  <img
                    src="/images/landing/portfolio-4.jpg"
                    className="img-fluid"
                    alt="Portfolio"
                  />
                  <div className="portfolio-link">
                    <a
                      href="/images/landing/portfolio-4.jpg"
                      data-lightbox="portfolio"
                      data-title="Lorem ipsum dolor"
                      title="Preview"
                    >
                      <i className="fas fa-eye"></i>
                    </a>
                    <a href="" title="More Details">
                      <i className="fas fa-link"></i>
                    </a>
                  </div>
                </div>

                <div className="portfolio-info">
                  <h4>Duis scelerisque at eros nec</h4>
                  <p>Cyber Security</p>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 portfolio-item">
                <div className="portfolio-img">
                  <img
                    src="/images/landing/portfolio-5.jpg"
                    className="img-fluid"
                    alt="Portfolio"
                  />
                  <div className="portfolio-link">
                    <a
                      href="/images/landing/portfolio-5.jpg"
                      data-lightbox="portfolio"
                      data-title="Nulla ullamcorper pharetra"
                      title="Preview"
                    >
                      <i className="fas fa-eye"></i>
                    </a>
                    <a href="" title="More Details">
                      <i className="fas fa-link"></i>
                    </a>
                  </div>
                </div>

                <div className="portfolio-info">
                  <h4>Nulla tempus mi quis rhoncus</h4>
                  <p>Digital Marketing</p>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 portfolio-item">
                <div className="portfolio-img">
                  <img
                    src="/images/landing/portfolio-6.jpg"
                    className="img-fluid"
                    alt="Portfolio"
                  />
                  <div className="portfolio-link">
                    <a
                      href="/images/landing/portfolio-6.jpg"
                      data-lightbox="portfolio"
                      data-title="Phasellus eget dictum"
                      title="Preview"
                    >
                      <i className="fas fa-eye"></i>
                    </a>
                    <a href="" title="More Details">
                      <i className="fas fa-link"></i>
                    </a>
                  </div>
                </div>

                <div className="portfolio-info">
                  <h4>Aliquam blandit nisi</h4>
                  <p>SEO</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pricing" id="pricing">
          <div className="container">
            <div className="section-header">
              <h4>Creative</h4>
              <h2>Price Table</h2>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="price-content">
                  <div className="price-plan">
                    <h3>Basic</h3>
                    <p>for free</p>
                    <i className="fas fa-home"></i>
                  </div>
                  <ul className="price-details">
                    <li>HTML5 and CSS3</li>
                    <li>Responsive design</li>
                    <li>Google Font integrated</li>
                    <li>Font Awesome icon integrated</li>
                  </ul>
                  <a href="#" className="btn">
                    $0 / mo
                  </a>
                </div>
              </div>
              <div className="col-md-4">
                <div className="price-content">
                  <div className="price-plan">
                    <h3>Standard</h3>
                    <p>for small company</p>
                    <i className="fas fa-star"></i>
                  </div>
                  <ul className="price-details">
                    <li>HTML5 and CSS3</li>
                    <li>Responsive design</li>
                    <li>Google Font integrated</li>
                    <li>Font Awesome icon integrated</li>
                  </ul>
                  <a href="#" className="btn">
                    $49 / mo
                  </a>
                </div>
              </div>
              <div className="col-md-4">
                <div className="price-content">
                  <div className="price-plan">
                    <h3>Economy</h3>
                    <p>for agency</p>
                    <i className="fas fa-gift"></i>
                  </div>
                  <ul className="price-details">
                    <li>HTML5 and CSS3</li>
                    <li>Responsive design</li>
                    <li>Google Font integrated</li>
                    <li>Font Awesome icon integrated</li>
                  </ul>
                  <a href="#" className="btn">
                    $99 / mo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="contact" id="contact">
          <div className="container">
            <div className="section-header">
              <h4>24/hr Support</h4>
              <h2>Contact</h2>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="contact-form">
                  <form>
                    <div className="form-row">
                      <div className="form-group col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Your Name"
                        />
                      </div>
                      <div className="form-group col-sm-6">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Your Email"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Subject"
                      />
                    </div>
                    <div className="form-group">
                      <textarea
                        className="form-control"
                        rows="5"
                        placeholder="Message"
                      ></textarea>
                    </div>
                    <div>
                      <button className="btn" type="submit">
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer">
          <div className="container">
            <div className="row footer-top">
              <div className="col-md-4">
                <h2>Get in Touch</h2>
                <div className="contact-info">
                  <h4>E-mail:</h4>
                  <p>support@htmlcodex.com</p>
                  <h4>Phone:</h4>
                  <p>+123 456 7890</p>
                </div>
              </div>
              <div className="col-md-4">
                <h2>Stay connected</h2>
                <div className="social-links">
                  <a href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
              <div className="col-md-4">
                <h2>Stay updated</h2>
                <div className="subscribe">
                  <form>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Your email"
                    />
                    <button className="btn" type="submit">
                      Submit
                    </button>
                    <label>Don't worry we don't spam</label>
                  </form>
                </div>
              </div>
            </div>
            <div className="row footer-bottom">
              <div className="col-md-6 copyright">
                Copyright &copy; 2020{" "}
                <a href="https://htmlcodex.com">HTML Codex</a>. All Rights
                Reserved
              </div>
              <div className="col-md-6 credit">
                Template by <a href="https://htmlcodex.com">HTML Codex</a>
              </div>
            </div>
          </div>
        </div>

        <a href="#" className="back-to-top">
          <i className="fas fa-angle-up"></i>
        </a>
      </div>
    </>
  );
}

export default LandingPage;
