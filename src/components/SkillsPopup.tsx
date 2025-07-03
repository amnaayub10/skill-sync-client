'use client';

import { useState } from 'react';
import { authFetch } from '@/lib/auth';

type Skill = {
  id: string;
  name: string;
  type: 'OFFERED' | 'WANTED_TO_LEARN';
  proficiency?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  description?: string;
};

const WEB_DEVELOPMENT_SKILLS = [
  'HTML',
  'CSS',
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Express',
  'MongoDB',
  'SQL',
  'Git',
  'Docker',
  'GraphQL',
  'REST API',
  'Tailwind CSS',
  'Redux',
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
        body: JSON.stringify({
          name: selectedSkill,
          description: `${selectedSkill} skill`,
        }),
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
      let errorMessage = 'Failed to add skill. Please try again.';
      if (err instanceof Error) errorMessage = err.message;
      else if (typeof err === 'string') errorMessage = err;
      else if (typeof err === 'object' && err !== null && 'message' in err) errorMessage = String((err as any).message);

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add Skill</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Skill</label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isSubmitting}
            >
              <option value="">Select a skill</option>
              {WEB_DEVELOPMENT_SKILLS.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'OFFERED' | 'WANTED_TO_LEARN')}
              className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              <option value="OFFERED">I offered this</option>
              <option value="WANTED_TO_LEARN">I want to learn this</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Proficiency</label>
            <select
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value as any)}
              className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="E.g. Currently working at Google, can teach DSA to crack any FANG interview"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm text-gray-700"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedSkill || isSubmitting}
              className={`flex-1 px-4 py-2 rounded text-white text-sm transition-all duration-200 ${
                !selectedSkill || isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
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
