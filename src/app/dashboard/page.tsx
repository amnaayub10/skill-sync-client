'use client';

import { useState, useMemo } from 'react';

type Skill = {
  id: string;
  name: string;
  category: string;
};

type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

type SkillSelection = {
  skillId: string;
  type: 'offered' | 'wanted';
  proficiency?: ProficiencyLevel;
};

export default function SkillsForm() {
  const [selectedSkillId, setSelectedSkillId] = useState<string>('');
  const [skillSelections, setSkillSelections] = useState<SkillSelection[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const skills: Skill[] = [
    { id: '1', name: "HTML5", category: "Frontend Development" },
    { id: '2', name: "CSS3", category: "Frontend Development" },
    { id: '3', name: "JavaScript", category: "Frontend Development" },
    { id: '4', name: "Node.js", category: "Backend Development" },
    { id: '5', name: "MongoDB", category: "Database Management" },
    { id: '6', name: "Git", category: "Version Control" },
    { id: '7', name: "Docker", category: "DevOps & Deployment" },
    { id: '8', name: "Jest", category: "Testing & Debugging" }
  ];

  const selectedSkill = useMemo(
    () => skills.find(skill => skill.id === selectedSkillId),
    [selectedSkillId]
  );

  const currentSelection = useMemo(
    () => skillSelections.find(s => s.skillId === selectedSkillId),
    [selectedSkillId, skillSelections]
  );

  const handleSkillChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSkillId(e.target.value);
  };

  const handleTypeChange = (type: 'offered' | 'wanted') => {
    if (!selectedSkillId) return;

    const newSelection: SkillSelection = {
      skillId: selectedSkillId,
      type,
      proficiency: type === 'offered' ? 'beginner' : undefined
    };

    setSkillSelections(prev => [
      ...prev.filter(s => s.skillId !== selectedSkillId),
      newSelection
    ]);
  };

  const handleProficiencyChange = (proficiency: ProficiencyLevel) => {
    if (!selectedSkillId) return;

    setSkillSelections(prev =>
      prev.map(skill =>
        skill.skillId === selectedSkillId
          ? { ...skill, proficiency }
          : skill
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (skillSelections.length === 0) {
      setSubmitMessage('Please select at least one skill');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would do something like:
      // const response = await fetch('/api/skills', {
      //   method: 'POST',
      //   body: JSON.stringify(skillSelections)
      // });
      
      setSubmitMessage('Skills submitted successfully!');
      setSkillSelections([]);
      setSelectedSkillId('');
    } catch (error) {
      setSubmitMessage('Error submitting skills');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 my-8">
      <h1 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-6">
        Skills Selection Form
      </h1>

      <div className="space-y-6">
        <div>
          <label htmlFor="skill-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select a skill:
          </label>
          <select
            id="skill-select"
            value={selectedSkillId}
            onChange={handleSkillChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select a skill from the list"
          >
            <option value="">-- Select a skill --</option>
            {skills.map(skill => (
              <option key={skill.id} value={skill.id}>
                {skill.name} ({skill.category})
              </option>
            ))}
          </select>
        </div>

        {selectedSkillId && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800">
              {selectedSkill?.name} ({selectedSkill?.category})
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                I want to:
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handleTypeChange('offered')}
                  aria-label={`Offer ${selectedSkill?.name} skill`}
                  className={`px-4 py-2 rounded-md ${
                    currentSelection?.type === 'offered'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Offer this skill
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('wanted')}
                  aria-label={`Learn ${selectedSkill?.name} skill`}
                  className={`px-4 py-2 rounded-md ${
                    currentSelection?.type === 'wanted'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Learn this skill
                </button>
              </div>
            </div>

            {currentSelection?.type === 'offered' && (
              <div>
                <label htmlFor="proficiency" className="block text-sm font-medium text-gray-700 mb-1">
                  Proficiency level:
                </label>
                <select
                  id="proficiency"
                  value={currentSelection?.proficiency || ''}
                  onChange={(e) => handleProficiencyChange(
                    e.target.value as ProficiencyLevel
                  )}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Select your proficiency level"
                >
                  <option value="">Select your level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            )}
          </div>
        )}

        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-800 mb-2">Selected Skills:</h3>
          {skillSelections.length === 0 ? (
            <p className="text-gray-500">No skills selected yet</p>
          ) : (
            <ul className="space-y-2">
              {skillSelections.map((selection) => {
                const skill = skills.find(s => s.id === selection.skillId);
                return (
                  <li key={selection.skillId} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <div>
                      <span className="font-medium">{skill?.name}</span> - 
                      {selection.type === 'offered' 
                        ? ` Offering (${selection.proficiency})` 
                        : ' Want to learn'}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSkillSelections(prev => prev.filter(s => s.skillId !== selection.skillId))}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Remove ${skill?.name} skill`}
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {submitMessage && (
          <div className={`p-3 rounded-md ${
            submitMessage.includes('successfully') 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {submitMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || skillSelections.length === 0}
          aria-busy={isSubmitting}
          className={`w-full px-4 py-2 rounded-lg text-white font-medium ${
            isSubmitting || skillSelections.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          } transition-colors duration-200`}
        >
          {isSubmitting ? (
            <>
              <span className="inline-block animate-spin mr-2">↻</span>
              Submitting...
            </>
          ) : (
            'Submit Skills'
          )}
        </button>
      </div>
    </form>
  );
}