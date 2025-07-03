


export type SkillType = {
  id: number,
  name: string;
};

export type Proficiency = {
  id: number,
  name: string;
};

export type Skill = {
  id: number,
  name: string,
  description: string | null;
};

export type UserSkill = {
  id: number;
  userId: number;
  skillId: number;
  type: 0 | 1,
  proficiency: 0 | 1 | 2 | 3,
  description: string | number;
  createdAt: string,
  updatedAt: string;
};