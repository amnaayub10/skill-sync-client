'use client';

import { useState } from 'react';
import { authFetch } from '@/lib/auth';

const WEB_DEVELOPMENT_SKILLS = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js',
  'Node.js', 'Express', 'MongoDB', 'SQL', 'Git', 'Docker',
  'GraphQL', 'REST API', 'Tailwind CSS', 'Redux',
];

export default function SkillsPopup({
  userId,
  onClose,
  onSkillAdded,
}: {
  userId: number;
  onClose: () => void;
  onSkillAdded?: () => void;
}) {
  const [selectedSkill, setSelectedSkill] = useState('');
  const [type, setType] = useState<'OFFERED' | 'WANTED_TO_LEARN'>('OFFERED');
  const [proficiency, setProficiency] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'>('BEGINNER');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkill) return;

    setIsSubmitting(true);
    setError('');

    try {
      const skillResponse = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/skills`, {
        method: 'POST',
        body: JSON.stringify({ name: selectedSkill, description: `${selectedSkill} skill` }),
      });

      if (!skillResponse.ok) {
        const errorData = await skillResponse.json();
        throw new Error(errorData.message || 'Failed to create skill');
      }

      const skillData = await skillResponse.json();

      const userSkillResponse = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/skills/add-user-skill`, {
        method: 'POST',
        body: JSON.stringify({
          userId,
          skillId: skillData.id,
          type,
          proficiency,
          description,
        }),
      });

      if (!userSkillResponse.ok) {
        const errorData = await userSkillResponse.json();
        throw new Error(errorData.message || 'Failed to add user skill');
      }

      onSkillAdded?.();
      onClose();
    } catch (err) {
      console.error('Error adding skill:', err);
      setError(err instanceof Error ? err.message : 'Failed to add skill. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white text-gray-900 w-full max-w-md p-6 rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-600">Add New Skill</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Skill</label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-400"
              required
              disabled={isSubmitting}
            >
              <option value="">Select a skill</option>
              {WEB_DEVELOPMENT_SKILLS.map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-400"
              disabled={isSubmitting}
            >
              <option value="OFFERED">I offered this</option>
              <option value="WANTED_TO_LEARN">I want to learn this</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Proficiency</label>
            <select
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value as any)}
              className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-400"
              disabled={isSubmitting}
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-gray-300"
              placeholder="E.g. I’ve built full-stack apps using Next.js"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedSkill || isSubmitting}
              className={`flex-1 px-4 py-2 rounded text-white text-sm transition ${
                !selectedSkill || isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              }`}
            >
              {isSubmitting ? 'Adding...' : 'Add Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
