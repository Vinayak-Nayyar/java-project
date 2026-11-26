import React, { useState, useEffect } from 'react';
import { companyService } from '../services/companyService';
import { Company } from '../types/Company';

export const ManageCompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Modal and Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    website: '',
    contactEmail: '',
    description: ''
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'danger'>('success');

  const showNotification = (msg: string, type: 'success' | 'danger' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load companies on mount
  const loadCompanies = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await companyService.getCompanies();
      setCompanies(data);
    } catch (err: any) {
      console.error('[ManageCompaniesPage] Error loading companies:', err);
      setFetchError(err.message || 'Failed to load companies from backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: '',
      industry: '',
      location: '',
      website: '',
      contactEmail: '',
      description: ''
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleOpenEdit = (company: Company) => {
    setIsEditing(true);
    setEditingId(company.id);
    setFormData({
      name: company.name,
      industry: company.industry,
      location: company.location,
      website: company.website,
      contactEmail: company.contactEmail,
      description: company.description
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleDelete = async (id: number, name: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${name}" from MySQL?\n\nThis will also remove any job postings associated with this company.`
    );

    if (!confirmed) return;

    try {
      setIsLoading(true);
      await companyService.deleteCompany(id);
      showNotification(`✓ Company "${name}" successfully deleted from MySQL database.`, 'success');
      // Refresh list
      await loadCompanies();
    } catch (err: any) {
      console.error('[ManageCompaniesPage] Delete error:', err);
      showNotification(`Failed to delete company: ${err.message}`, 'danger');
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.industry.trim() || !formData.location.trim() || !formData.contactEmail.trim()) {
      setFormError('Please fill in Company Name, Industry, Location, and Contact Email.');
      return;
    }

    if (!formData.contactEmail.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      if (isEditing && editingId !== null) {
        // UPDATE OPERATION (PUT /api/companies/{id})
        await companyService.updateCompany(editingId, formData);
        showNotification(`✓ Company "${formData.name}" successfully updated in MySQL database.`, 'success');
      } else {
        // INSERT OPERATION (POST /api/companies)
        await companyService.createCompany(formData);
        showNotification(`✓ New recruiting partner "${formData.name}" saved to MySQL database.`, 'success');
      }

      setShowModal(false);
      await loadCompanies();
    } catch (err: any) {
      console.error('[ManageCompaniesPage] Save error:', err);
      setFormError(err.message || 'Operation failed. Please check backend connectivity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`alert alert-${toastType} border-2 border-dark rounded-3 position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg`}
          style={{ zIndex: 1060, maxWidth: '90%' }}
        >
          <div className="d-flex align-items-center gap-2">
            <span>{toastType === 'success' ? '✓' : '⚠️'}</span>
            <span className="fw-semibold small">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2 border-bottom border-2 border-dark">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
            <span className="badge-pill-yellow">Admin Directory</span>
            <span className="badge-pill-green">Spring Boot REST API</span>
          </div>
          <h2 className="fw-bolder mb-0" style={{ color: '#0F4A37' }}>
            Manage Recruiting Partners
          </h2>
          <p className="text-muted small mb-0">
            Full-stack CRUD operations backed by Spring Boot REST APIs and MySQL database.
          </p>
        </div>
        <div className="mt-3 mt-md-0 d-flex gap-2">
          <button
            className="btn btn-outline-dark rounded-pill fw-bold small px-3"
            onClick={loadCompanies}
            disabled={isLoading}
            title="Refresh from MySQL"
          >
            {isLoading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
          <button className="nexus-btn-primary" onClick={handleOpenAdd}>
            + Add New Company
          </button>
        </div>
      </div>

      {/* ERROR BANNER IF FETCH FAILED */}
      {fetchError && (
        <div className="alert alert-warning border-2 border-dark rounded-3 mb-4 d-flex justify-content-between align-items-center">
          <div>
            <strong>Backend Connection Note:</strong> {fetchError}
          </div>
          <button className="btn btn-sm btn-dark rounded-pill fw-bold" onClick={loadCompanies}>
            Retry Connection
          </button>
        </div>
      )}

      {/* COMPANIES TABLE CARD */}
      <div className="nexus-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">
            Registered Companies ({companies.length})
          </h5>
          <span className="small text-muted">
            {isLoading ? 'Synchronizing with MySQL...' : 'Persisted in MySQL'}
          </span>
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success mb-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="text-muted small">Loading company directory from backend...</div>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-5 bg-light rounded-3 border border-1 border-secondary-subtle">
            <span className="fs-1">🏢</span>
            <h5 className="fw-bold mt-2">No companies found</h5>
            <p className="text-muted small mb-3">
              No recruiting partners are currently registered in the database.
            </p>
            <button className="nexus-btn-primary py-2 px-4 small" onClick={handleOpenAdd}>
              + Register First Company
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light border-bottom border-2 border-dark small">
                <tr>
                  <th>ID</th>
                  <th>Company Name</th>
                  <th>Industry Sector</th>
                  <th>Location</th>
                  <th>Contact Email</th>
                  <th>Website</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id}>
                    <td className="fw-bold text-muted">#{company.id}</td>
                        <td style={{ minWidth: '160px' }}>
                          <div className="fw-bold text-dark text-break-word">{company.name}</div>
                          <small className="text-muted d-block text-break-word" style={{ maxWidth: '280px' }}>
                            {company.description || 'Corporate recruitment partner.'}
                          </small>
                        </td>
                        <td className="cell-nowrap">
                          <span className="badge-pill-lilac">{company.industry}</span>
                        </td>
                          <td className="small" style={{ minWidth: '110px' }}>{company.location}</td>
                          <td className="small text-muted" style={{ minWidth: '140px', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                            {company.contactEmail}
                          </td>
                          <td className="small" style={{ minWidth: '120px', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                            {company.website ? (
                              <a
                                href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-decoration-none text-success fw-semibold"
                              >
                                {company.website.replace(/^https?:\/\//, '')}
                              </a>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                            <td className="text-end" style={{ whiteSpace: 'nowrap' }}>
                              <div className="d-flex justify-content-end gap-2">
                                <button
                                  className="btn btn-sm btn-outline-dark rounded-pill fw-bold px-3"
                                  onClick={() => handleOpenEdit(company)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-danger rounded-pill fw-bold px-3"
                                  onClick={() => handleDelete(company.id, company.name)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                ))}
                        </tbody>
                      </table>
                    </div>
        )}
                  </div>

      {/* ADD / EDIT COMPANY MODAL */ }
      { showModal && (
                    <div
                      className="modal show d-block"
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                      tabIndex={-1}
                      role="dialog"
                    >
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-2 border-dark rounded-4 shadow-lg">
                          <div className="modal-header border-bottom border-2 border-dark bg-light rounded-top-4">
                            <h5 className="modal-title fw-bolder text-dark">
                              {isEditing ? '✏️ Edit Company Details' : '🏢 Register New Company'}
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              onClick={() => setShowModal(false)}
                              disabled={isSubmitting}
                            />
                          </div>

                          <form onSubmit={handleSave}>
                            <div className="modal-body p-4">
                              {formError && (
                                <div className="alert alert-danger border-2 border-dark rounded-3 py-2 small mb-3">
                                  ⚠️ {formError}
                                </div>
                              )}

                              <div className="mb-3">
                                <label className="form-label small fw-bold">Company Name *</label>
                                <input
                                  type="text"
                                  className="form-control border-2 border-dark rounded-3"
                                  placeholder="e.g. Acme Innovations Inc."
                                  value={formData.name}
                                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                  required
                                />
                              </div>

                              <div className="row g-2 mb-3">
                                <div className="col-md-6">
                                  <label className="form-label small fw-bold">Industry Sector *</label>
                                  <input
                                    type="text"
                                    className="form-control border-2 border-dark rounded-3"
                                    placeholder="e.g. Cloud & SaaS"
                                    value={formData.industry}
                                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                    required
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label small fw-bold">Location *</label>
                                  <input
                                    type="text"
                                    className="form-control border-2 border-dark rounded-3"
                                    placeholder="e.g. Bengaluru, Karnataka"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                  />
                                </div>
                              </div>

                              <div className="row g-2 mb-3">
                                <div className="col-md-6">
                                  <label className="form-label small fw-bold">Contact Email *</label>
                                  <input
                                    type="email"
                                    className="form-control border-2 border-dark rounded-3"
                                    placeholder="campus@company.com"
                                    value={formData.contactEmail}
                                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                    required
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label small fw-bold">Website</label>
                                  <input
                                    type="url"
                                    className="form-control border-2 border-dark rounded-3"
                                    placeholder="https://company.com"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                  />
                                </div>
                              </div>

                              <div className="mb-2">
                                <label className="form-label small fw-bold">Company Description</label>
                                <textarea
                                  rows={3}
                                  className="form-control border-2 border-dark rounded-3"
                                  placeholder="Brief overview of core products and business domain..."
                                  value={formData.description}
                                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="modal-footer border-top border-2 border-dark bg-light rounded-bottom-4">
                              <button
                                type="button"
                                className="btn btn-outline-dark rounded-pill fw-bold px-4"
                                onClick={() => setShowModal(false)}
                                disabled={isSubmitting}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="nexus-btn-primary px-4"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <span>Saving to MySQL...</span>
                                ) : isEditing ? (
                                  'Update in MySQL'
                                ) : (
                                  'Save to MySQL'
                                )}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
              );
};
