import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Badge } from './Badge';

interface ModalContent {
  title: string;
  category: string;
  body: React.ReactNode;
}

export const Footer: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeModal, setActiveModal] = useState<ModalContent | null>(null);

  const openModal = (title: string, category: string, body: React.ReactNode) => {
    setActiveModal({ title, category, body });
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <footer className="mt-auto bg-white border-top border-2 border-dark pt-5 pb-3">
        <div className="container">
          {/* MAIN 4-COLUMN FOOTER GRID */}
          <div className="row g-4 pb-4">
            {/* ========================================================
                SECTION A: BRAND IDENTITY
                ======================================================== */}
            <div className="col-12 col-lg-4 pe-lg-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: '#0F4A37',
                    borderRadius: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FEE054',
                    fontWeight: 800,
                    fontSize: '1.15rem',
                    border: '2px solid #1E293B',
                    boxShadow: '2px 2px 0px #1E293B'
                  }}
                >
                  N
                </div>
                <span className="brand-text fs-4" style={{ color: '#0F4A37' }}>
                  NEXUS
                </span>
                <span className="badge-pill-yellow ms-1">v1.2</span>
              </div>

              <p className="fw-bold text-dark mb-2" style={{ fontSize: '0.95rem' }}>
                Connecting Talent with Opportunity.
              </p>
              <p className="text-muted small mb-4" style={{ lineHeight: 1.6, maxWidth: '340px' }}>
                A unified placement platform that connects students, recruiters and placement
                administrators through a streamlined recruitment experience.
              </p>

              {/* Status Pill */}
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 bg-light rounded-pill border border-2 border-dark small">
                <span
                  className="rounded-circle"
                  style={{ width: '8px', height: '8px', backgroundColor: '#10b981' }}
                ></span>
                <span className="fw-bold text-dark" style={{ fontSize: '0.75rem' }}>
                  System Active & Operational
                </span>
              </div>
            </div>

            {/* ========================================================
                SECTION B: QUICK LINKS
                ======================================================== */}
            <div className="col-6 col-md-4 col-lg-2">
              <h6 className="fw-bolder text-dark mb-3 text-uppercase" style={{ fontSize: '0.82rem', letterSpacing: '0.5px' }}>
                Navigation
              </h6>
              <nav aria-label="Quick links">
                <ul className="list-unstyled d-flex flex-column gap-2 small mb-0">
                  <li>
                    <Link to="/student/jobs" className="text-decoration-none text-muted fw-semibold hover-dark">
                      Home / Vacancies
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="btn btn-link p-0 text-muted fw-semibold text-decoration-none small text-start hover-dark"
                      onClick={() =>
                        openModal(
                          'About NEXUS Placement System',
                          'Platform Overview',
                          <>
                            <p>
                              <strong>NEXUS</strong> is a Smart Placement and Job Management System
                              engineered for universities and corporate recruitment teams.
                            </p>
                            <p>
                              The system eliminates fragmented placement drives by providing a clean,
                              layered database architecture, verifiable student profiles, and real-time
                              application tracking.
                            </p>
                            <ul>
                              <li>Layered Java + JDBC Backend with clean DAO segregation.</li>
                              <li>Type-safe React + TypeScript interface with responsive neo-editorial design.</li>
                              <li>Relational 3NF MySQL database with automated referential integrity.</li>
                            </ul>
                          </>
                        )
                      }
                    >
                      About Us
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="btn btn-link p-0 text-muted fw-semibold text-decoration-none small text-start hover-dark"
                      onClick={() =>
                        openModal(
                          'Contact Placement Cell',
                          'Campus Relations',
                          <>
                            <p>
                              Have inquiries regarding ongoing recruitment schedules, corporate partnerships,
                              or student eligibility? Reach out to our campus placement office:
                            </p>
                            <p className="mb-1"><strong>Official Email:</strong> placement@nexus.edu</p>
                            <p className="mb-1"><strong>Helpdesk Line:</strong> +91 (080) 4123-4567</p>
                            <p className="mb-1"><strong>Office Hours:</strong> Monday – Friday, 9:00 AM – 6:00 PM IST</p>
                            <p><strong>Physical Address:</strong> Placement Cell, Academic Block 4, NEXUS Campus, Bengaluru</p>
                          </>
                        )
                      }
                    >
                      Contact Us
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="btn btn-link p-0 text-muted fw-semibold text-decoration-none small text-start hover-dark"
                      onClick={() =>
                        openModal(
                          'Help & Support Center',
                          'User Assistance',
                          <>
                            <p>Frequently asked questions for candidates and recruiters:</p>
                            <h6>How do I update my CGPA or Resume?</h6>
                            <p className="small text-muted">
                              Go to <strong>My Profile</strong> in the top navigation, click <strong>Edit Profile</strong>,
                              and upload your latest PDF resume and academic standing.
                            </p>
                            <h6>How are dream job packages classified?</h6>
                            <p className="small text-muted">
                              Openings offering ₹14.0+ LPA are tagged as Dream Packages with specialized branch cut-offs.
                            </p>
                          </>
                        )
                      }
                    >
                      Help & Support
                    </button>
                  </li>
                </ul>
              </nav>
            </div>

            {/* ========================================================
                SECTION C: PLACEMENT RESOURCES (AUTHENTICATION-AWARE)
                ======================================================== */}
            <div className="col-6 col-md-4 col-lg-3">
              <h6 className="fw-bolder text-dark mb-3 text-uppercase" style={{ fontSize: '0.82rem', letterSpacing: '0.5px' }}>
                Placement Resources
              </h6>
              <nav aria-label="Placement Resources">
                <ul className="list-unstyled d-flex flex-column gap-2 small mb-0">
                  {/* LOGGED OUT USERS */}
                  {!isAuthenticated && (
                    <>
                      <li>
                        <Link to="/student/jobs" className="text-decoration-none text-muted fw-semibold hover-dark">
                          Browse Campus Jobs
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/companies" className="text-decoration-none text-muted fw-semibold hover-dark">
                          Visiting Companies
                        </Link>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="btn btn-link p-0 text-muted fw-semibold text-decoration-none small text-start hover-dark"
                          onClick={() =>
                            openModal(
                              'Campus Recruitment Policy',
                              'Institutional Guidelines',
                              <>
                                <p>Rules governing campus placement participation:</p>
                                <ul>
                                  <li>Students may submit applications only for roles matching branch and CGPA requirements.</li>
                                  <li>One-Offer Rule: Once an offer is marked as Accepted, subsequent applications are frozen.</li>
                                  <li>A verified PDF resume must be uploaded before submitting placement applications.</li>
                                </ul>
                              </>
                            )
                          }
                        >
                          Placement Guidelines
                        </button>
                      </li>
                      <li>
                        <Link to="/login" className="text-decoration-none text-muted fw-semibold hover-dark">
                          Student & Admin Sign In
                        </Link>
                      </li>
                    </>
                  )}

                  {/* STUDENT USER */}
                  {isAuthenticated && user?.role === 'STUDENT' && (
                    <>
                      <li>
                        <Link to="/student/dashboard" className="text-decoration-none text-muted fw-semibold hover-dark">
                          Student Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link to="/student/jobs" className="text-decoration-none text-muted fw-semibold hover-dark">
                          Browse Openings
                        </Link>
                      </li>
                      <li>
                        <Link to="/student/dashboard" className="text-decoration-none text-muted fw-semibold hover-dark">
                          My Applications ({user.name})
                        </Link>
                      </li>
                      <li>
                        <Link to="/profile" className="text-decoration-none text-muted fw-semibold hover-dark">
                          My Profile & Resume
                        </Link>
                      </li>
                    </>
                  )}

                  {/* ADMIN USER */}
                  {isAuthenticated && user?.role === 'ADMIN' && (
                    <>
                      <li>
                        <Link to="/admin/dashboard" className="text-decoration-none text-muted fw-semibold hover-dark">
                          Admin Analytics Console
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/companies" className="text-decoration-none text-muted fw-semibold hover-dark">
                          Manage Recruiting Partners
                        </Link>
                      </li>
                      <li>
                        <Link to="/student/jobs" className="text-decoration-none text-muted fw-semibold hover-dark">
                          Review Active Vacancies
                        </Link>
                      </li>
                      <li>
                        <Link to="/profile" className="text-decoration-none text-muted fw-semibold hover-dark">
                          Administrator Profile
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            </div>

            {/* ========================================================
                SECTION D: SUPPORT & CONTACT INFO
                ======================================================== */}
            <div className="col-12 col-md-4 col-lg-3">
              <h6 className="fw-bolder text-dark mb-3 text-uppercase" style={{ fontSize: '0.82rem', letterSpacing: '0.5px' }}>
                Placement Cell Office
              </h6>
              <div className="d-flex flex-column gap-2 small text-muted">
                <div className="d-flex align-items-start gap-2">
                  <span className="text-dark">📍</span>
                  <span>Block 4, Career Development Centre, NEXUS Campus, Bengaluru</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-dark">✉️</span>
                  <a href="mailto:placement@nexus.edu" className="text-decoration-none text-dark fw-semibold">
                    placement@nexus.edu
                  </a>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-dark">📞</span>
                  <span>+91 (080) 4123-4567</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-dark">⏰</span>
                  <span>Mon – Fri, 9:00 AM – 6:00 PM IST</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              SECTION E: BOTTOM COPYRIGHT BAR
              ======================================================== */}
          <div className="pt-3 border-top border-2 border-dark d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small">
            <div className="text-muted">
              © {new Date().getFullYear()} NEXUS. All rights reserved.
            </div>

            <div className="d-flex align-items-center gap-3">
              <button
                type="button"
                className="btn btn-link p-0 text-muted fw-semibold text-decoration-none small hover-dark"
                onClick={() =>
                  openModal(
                    'Privacy Policy',
                    'Data Protection',
                    <>
                      <p>
                        Your privacy and academic confidentiality are core to NEXUS.
                      </p>
                      <p>
                        Student contact details, academic transcripts, and resumes are strictly shared
                        only with verified corporate recruiters participating in approved campus recruitment drives.
                      </p>
                      <p className="small text-muted mb-0">
                        In compliance with university data protection regulations and fair placement guidelines.
                      </p>
                    </>
                  )
                }
              >
                Privacy Policy
              </button>
              <span className="text-muted">•</span>
              <button
                type="button"
                className="btn btn-link p-0 text-muted fw-semibold text-decoration-none small hover-dark"
                onClick={() =>
                  openModal(
                    'Terms & Conditions',
                    'Platform Agreement',
                    <>
                      <p>
                        By using the NEXUS Smart Placement System, students and recruiters agree to adhere to
                        standard academic recruitment decorum.
                      </p>
                      <ul>
                        <li>All information submitted in student profiles must be accurate and verifiable.</li>
                        <li>Falsification of CGPA or project credentials leads to immediate placement debarment.</li>
                        <li>Recruiters must conduct interviews per agreed campus schedules.</li>
                      </ul>
                    </>
                  )
                }
              >
                Terms & Conditions
              </button>
              <span className="text-muted">•</span>
              <Badge variant="green" className="py-1 px-2" style={{ fontSize: '0.7rem' }}>
                Secure Portal
              </Badge>
            </div>
          </div>
        </div>
      </footer>

      {/* INFORMATIONAL / LEGAL MODAL */}
      {activeModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1070 }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content border border-2 border-dark rounded-4 shadow-lg p-3"
              style={{ boxShadow: '6px 6px 0px #1E293B' }}
            >
              <div className="modal-header border-0 pb-0">
                <div>
                  <span className="badge-pill-lilac small mb-1">{activeModal.category}</span>
                  <h5 className="modal-title fw-bolder text-dark" style={{ color: '#0F4A37' }}>
                    {activeModal.title}
                  </h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body py-3 small text-muted" style={{ lineHeight: 1.6 }}>
                {activeModal.body}
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="nexus-btn-primary px-4 py-2 small"
                  onClick={closeModal}
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
