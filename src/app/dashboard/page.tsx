'use client';

import { useState } from 'react';

type Skill = {
  id: string;
  name: string;
  description: string;
  category: string;
};

type SkillSelection = {
  skillId: string;
  type: 'offered' | 'wanted' | null;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null;
};

export default function SkillsDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<SkillSelection[]>([]);

  const skillCategories = [
    "Frontend Development",
    "Backend Development",
    "Database Management",
    "DevOps & Deployment",
    "Version Control",
    "Testing & Debugging"
  ];

  const skills: Skill[] = [
    { id: '1', name: "HTML5", description: "Semantic markup, accessibility, modern APIs", category: "Frontend Development" },
    { id: '2', name: "CSS3", description: "Flexbox, Grid, animations, preprocessors", category: "Frontend Development" },
    { id: '3', name: "JavaScript", description: "ES6+, React, Vue, TypeScript", category: "Frontend Development" },
    { id: '4', name: "Node.js", description: "Express, REST APIs, authentication", category: "Backend Development" },
    { id: '5', name: "MongoDB", description: "NoSQL database, aggregation pipelines", category: "Database Management" },
    { id: '6', name: "Git", description: "Version control, GitHub, GitLab", category: "Version Control" },
    { id: '7', name: "Docker", description: "Containerization, deployment", category: "DevOps & Deployment" },
    { id: '8', name: "Jest", description: "Unit testing, test coverage", category: "Testing & Debugging" }
  ];

  const filteredSkills = selectedCategory
    ? skills.filter(skill => skill.category === selectedCategory)
    : skills;

  const handleSkillTypeChange = (skillId: string, type: 'offered' | 'wanted') => {
    setSelectedSkills(prev => {
      const existing = prev.find(s => s.skillId === skillId);
      if (existing) {
        return prev.map(s => 
          s.skillId === skillId 
            ? { ...s, type, proficiency: type === 'offered' ? 'beginner' : null }
            : s
        );
      }
      return [...prev, { skillId, type, proficiency: type === 'offered' ? 'beginner' : null }];
    });
  };

  const handleProficiencyChange = (skillId: string, proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert') => {
    setSelectedSkills(prev => 
      prev.map(s => 
        s.skillId === skillId ? { ...s, proficiency } : s
      )
    );
  };

  const getSkillSelection = (skillId: string) => {
    return selectedSkills.find(s => s.skillId === skillId) || 
           { skillId, type: null, proficiency: null };
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 my-8">
      <h1 className="text-3xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-6">
        Web Developer Skills Dashboard
      </h1>

      <div className="relative flex items-center gap-4 mb-8">
        <div className="relative w-72">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex justify-between items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors duration-200"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            {selectedCategory || 'All Technical Skills'}
            <svg 
              className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg overflow-hidden">
              <ul className="py-1 max-h-60 overflow-auto">
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setIsOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 hover:bg-blue-50 ${!selectedCategory ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`}
                  >
                    All Skills
                  </button>
                </li>
                {skillCategories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-blue-50 ${selectedCategory === category ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill) => {
          const selection = getSkillSelection(skill.id);
          
          return (
            <div 
              key={skill.id} 
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{skill.name}</h3>
                <p className="text-gray-600 mb-4">{skill.description}</p>
                <span className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded mb-4">
                  {skill.category}
                </span>

                <div className="mt-4 space-y-3">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Select type:</label>
                    <select
                      value={selection.type || ''}
                      onChange={(e) => handleSkillTypeChange(
                        skill.id, 
                        e.target.value as 'offered' | 'wanted'
                      )}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select an option</option>
                      <option value="offered">I can offer this skill</option>
                      <option value="wanted">I want to learn this</option>
                    </select>
                  </div>

                  {selection.type === 'offered' && (
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">Proficiency level:</label>
                      <select
                        value={selection.proficiency || ''}
                        onChange={(e) => handleProficiencyChange(
                          skill.id, 
                          e.target.value as 'beginner' | 'intermediate' | 'advanced' | 'expert'
                        )}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select proficiency</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}