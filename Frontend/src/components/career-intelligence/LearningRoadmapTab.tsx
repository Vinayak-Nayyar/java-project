import React, { useState, useEffect } from 'react';
import { useAuth, DEFAULT_MOCK_STUDENT } from '../../context/AuthContext';
import {
  TARGET_ROLES,
  generateRoadmap,
  RoadmapStage
} from '../../services/careerIntelligenceService';
import { Badge } from '../Badge';

interface LearningRoadmapTabProps {
  initialRoleId?: string;
}

export const LearningRoadmapTab: React.FC<LearningRoadmapTabProps> = ({
  initialRoleId = 'backend-dev'
}) => {
  const { user } = useAuth();
  const student = (user && user.role === 'STUDENT') ? user : DEFAULT_MOCK_STUDENT;

  const [selectedRoleId, setSelectedRoleId] = useState<string>(initialRoleId);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [stages, setStages] = useState<RoadmapStage[]>([]);

  // Update stages when selected role changes
  useEffect(() => {
    const studentSkills = student.skills || [];
    const role = TARGET_ROLES.find((r) => r.id === selectedRoleId) || TARGET_ROLES[0];
    const missing = role.requiredSkills
      .filter((req) => !studentSkills.some((s) => s.toLowerCase() === req.name.toLowerCase()))
      .map((r) => r.name);

    const generated = generateRoadmap(selectedRoleId, missing);
    setStages(generated);

    // Load persisted progress from localStorage
    const storageKey = `nexus_roadmap_progress_${student.id || 3}_${selectedRoleId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setCompletedTaskIds(JSON.parse(saved));
      } catch {
        setCompletedTaskIds([]);
      }
    } else {
      // Default initial progress: stage 1 first task completed
      setCompletedTaskIds(['s1-t1']);
    }
  }, [selectedRoleId, student]);

  // Persist task completions
  const handleToggleTask = (taskId: string) => {
    const updated = completedTaskIds.includes(taskId)
      ? completedTaskIds.filter((id) => id !== taskId)
      : [...completedTaskIds, taskId];

    setCompletedTaskIds(updated);
    const storageKey = `nexus_roadmap_progress_${student.id || 3}_${selectedRoleId}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  // Calculate overall completion percent
  const allTasks = stages.flatMap((s) => s.tasks);
  const totalTasksCount = allTasks.length;
  const completedCount = completedTaskIds.filter((id) =>
    allTasks.some((t) => t.id === id)
  ).length;
  const progressPercent =
    totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0;

  const handleResetProgress = () => {
    if (window.confirm('Reset progress for this roadmap?')) {
      setCompletedTaskIds([]);
      const storageKey = `nexus_roadmap_progress_${student.id || 3}_${selectedRoleId}`;
      localStorage.removeItem(storageKey);
    }
  };

  return (
    <div className="py-2">
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom border-2 border-light">
        <div>
          <span className="badge-pill-yellow mb-2 d-inline-block">Milestone Execution Plan</span>
          <h4 className="fw-bolder mb-1 text-dark" style={{ color: '#0F4A37' }}>
            Personalized Learning Roadmap
          </h4>
          <p className="text-muted small mb-0">
            Follow a personalized learning plan designed to help you close your skill gaps and become placement-ready.
          </p>
        </div>
        <div className="mt-3 mt-md-0 d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-dark rounded-pill fw-bold px-3"
            onClick={handleResetProgress}
          >
            Reset Progress
          </button>
        </div>
      </div>

      {/* ROLE SELECTOR & PROGRESS HERO */}
      <div
        className="p-4 rounded-4 border border-2 border-dark mb-4 text-white"
        style={{
          backgroundColor: '#0F4A37',
          boxShadow: '4px 4px 0px #1E293B',
          backgroundImage: 'radial-gradient(circle at 95% 15%, rgba(254, 224, 84, 0.2) 0%, transparent 60%)'
        }}
      >
        <div className="row align-items-center gy-3">
          <div className="col-md-7">
            <label className="text-white-50 small fw-bold text-uppercase d-block mb-2">
              Current Target Roadmap:
            </label>
            <div className="d-flex flex-wrap gap-2 mb-2">
              {TARGET_ROLES.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  className={`btn btn-sm rounded-pill fw-bold ${role.id === selectedRoleId
                    ? 'btn-warning text-dark border border-2 border-dark'
                    : 'btn-outline-light text-white'
                    }`}
                  onClick={() => setSelectedRoleId(role.id)}
                >
                  {role.title}
                </button>
              ))}
            </div>
            <p className="text-white-50 small mb-0">
              Roadmap milestones dynamically adjust to address your specific verified skill gaps.
            </p>
          </div>

          <div className="col-md-5">
            <div className="p-3 bg-white text-dark rounded-4 border border-2 border-dark" style={{ boxShadow: '2px 2px 0px #1E293B' }}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fw-bold small">Roadmap Completion</span>
                <span className="fw-bolder text-success fs-5">{progressPercent}%</span>
              </div>
              <div className="progress mb-2" style={{ height: '9px' }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="d-flex justify-content-between small text-muted">
                <span>{completedCount} of {totalTasksCount} tasks verified</span>
                <span className="fw-semibold text-dark">
                  {progressPercent === 100 ? '🎉 Placement Ready' : 'In Progress'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROADMAP STAGES LIST */}
      <div className="d-flex flex-column gap-4">
        {stages.map((stage) => {
          const stageCompleted = stage.tasks.every((t) => completedTaskIds.includes(t.id));
          return (
            <div
              key={stage.id}
              className={`nexus-card p-4 position-relative ${stageCompleted ? 'border-success' : ''
                }`}
            >
              {/* Stage Header */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-2 mb-3 pb-2 border-bottom border-2 border-light">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="badge-pill-yellow fw-bold">Stage {stage.stageNumber}</span>
                    <span className="badge-pill-lilac">{stage.timeframe}</span>
                    {stageCompleted && <Badge variant="green">✓ Stage Complete</Badge>}
                  </div>
                  <h5 className="fw-bolder mb-1 text-dark">{stage.title}</h5>
                  <p className="text-muted small mb-0">{stage.focus}</p>
                </div>
                <div className="d-flex flex-wrap gap-1">
                  {stage.skillsToCover.map((s) => (
                    <span key={s} className="badge-pill-green small">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tasks Checklist */}
              <div className="row g-4">
                <div className="col-lg-7">
                  <h6 className="fw-bold small text-uppercase text-muted mb-2">
                    Actionable Milestones ({stage.tasks.filter((t) => completedTaskIds.includes(t.id)).length}/{stage.tasks.length})
                  </h6>
                  <div className="d-flex flex-column gap-2">
                    {stage.tasks.map((task) => {
                      const isChecked = completedTaskIds.includes(task.id);
                      return (
                        <div
                          key={task.id}
                          className={`p-3 rounded-3 border border-2 d-flex align-items-start gap-3 transition ${isChecked
                            ? 'bg-light border-success-subtle text-muted'
                            : 'bg-white border-dark'
                            }`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleToggleTask(task.id)}
                        >
                          <input
                            type="checkbox"
                            className="form-check-input mt-1 border-2 border-dark"
                            checked={isChecked}
                            onChange={() => handleToggleTask(task.id)}
                            style={{ cursor: 'pointer' }}
                          />
                          <div className="flex-grow-1" style={{ minWidth: 0 }}>
                            <div
                              className={`fw-semibold small ${isChecked ? 'text-decoration-line-through text-muted' : 'text-dark'
                                }`}
                            >
                              {task.description}
                            </div>
                            <div className="d-flex align-items-center gap-2 mt-1">
                              <span className="badge rounded-pill bg-light text-secondary border small" style={{ fontSize: '0.7rem' }}>
                                {task.resourceType}
                              </span>
                              <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                                🔗 {task.resource}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recommended Practical Project */}
                <div className="col-lg-5">
                  <div
                    className="p-3 rounded-4 border border-2 border-dark h-100 d-flex flex-column justify-content-between"
                    style={{ backgroundColor: '#F8FAF7' }}
                  >
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge-pill-lilac small">Hands-on Portfolio Project</span>
                      </div>
                      <h6 className="fw-bold text-dark mb-2">
                        {stage.recommendedProject.title}
                      </h6>
                      <p className="text-muted small mb-3" style={{ lineHeight: 1.45 }}>
                        {stage.recommendedProject.summary}
                      </p>
                    </div>

                    <div className="pt-2 border-top border-2 border-secondary-subtle d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <span className="text-muted small">Deliverable: GitHub PR</span>
                      <span className="badge-pill-yellow small">Showcase Asset</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
