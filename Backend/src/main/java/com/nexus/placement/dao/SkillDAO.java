package com.nexus.placement.dao;

import com.nexus.placement.model.Skill;
import java.util.List;

/**
 * DAO interface managing skills catalogue and student-skills relationships.
 */
public interface SkillDAO {
    List<Skill> findAll();
    List<String> getSkillsByStudentId(int studentId);
    boolean syncStudentSkills(int studentId, List<String> skillNames);
}
