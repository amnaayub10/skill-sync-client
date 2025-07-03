'use client';

import { useCallback, useEffect, useState } from 'react';
import SkillsPopup from '@/components/SkillsPopup';
import { authFetch } from '@/lib/auth';
import Swal from 'sweetalert2';

export type UserSkill = {
  id: string;
  skill: { name: string };
  type: 'OFFERED' | 'WANTED_TO_LEARN';
  proficiency?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  description?: string;
};

const Dashboard = ({ userId }: { userId: number }) => {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'OFFERED' | 'WANTED_TO_LEARN'>('ALL');

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/skills/user-skills?userId=${userId}`);
      const data: unknown = await res.json();
      if (Array.isArray(data)) {
        setSkills(data as UserSkill[]);
      }
    } catch (err) {
      console.error('Failed to fetch skills', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This skill will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/skills/user-skills/${id}`, {
        method: 'DELETE',
      });

      const result: { message?: string } = await res.json();

      if (res.ok) {
        setSkills((prev) => prev.filter((s) => s.id !== id));
        Swal.fire('Deleted!', 'Skill has been removed.', 'success');
      } else {
        Swal.fire('Error!', result.message || 'Failed to delete skill.', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error!', 'Something went wrong.', 'error');
    }
  };

  const filteredSkills = filter === 'ALL' ? skills : skills.filter((s) => s.type === filter);

  const badgeColor = (level?: string) => {
    if (!level) return 'bg-gray-300';
    if (level.toLowerCase().includes('expert')) return 'bg-green-500';
    if (level.toLowerCase().includes('intermediate')) return 'bg-yellow-400';
    if (level.toLowerCase().includes('beginner')) return 'bg-blue-400';
    return 'bg-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-indigo-900 to-blue-900 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl shadow-lg p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            ✨ My Skills Dashboard
          </h1>
          <div className="mt-4 sm:mt-0 flex items-center gap-4">
            <select
              value={filter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter(e.target.value as 'ALL' | 'OFFERED' | 'WANTED_TO_LEARN')}
              className="bg-white text-gray-800 border border-gray-300 rounded-lg px-3 py-2 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="ALL">All Types</option>
              <option value="OFFERED">Offered</option>
              <option value="WANTED_TO_LEARN">Wanted to Learn</option>
            </select>
            <button
              onClick={() => setShowPopup(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg transition-all duration-200"
            >
              ➕ Add Skill
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-lg animate-pulse">
            ⏳ Fetching your awesome skills...
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="text-center py-20 text-gray-300 text-lg">
            🚫 No skills found. Let’s add some and show off your abilities!
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-md">
            <table className="min-w-full table-auto text-sm text-white">
              <thead className="bg-gradient-to-r from-indigo-700 to-blue-700">
                <tr>
                  <th className="px-6 py-4 text-left">Skill</th>
                  <th className="px-6 py-4 text-left">Type</th>
                  <th className="px-6 py-4 text-left">Proficiency</th>
                  <th className="px-6 py-4 text-left">Description</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSkills.map((skill, index) => (
                  <tr
                    key={skill.id}
                    className={`${index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'} hover:bg-white/20 transition-colors`}
                  >
                    <td className="px-6 py-3">{skill.skill?.name || '—'}</td>
                    <td className="px-6 py-3 capitalize">{skill.type.toLowerCase().replaceAll('_', ' ')}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs px-3 py-1 rounded-full ${badgeColor(skill.proficiency)} text-white`}>
                        {skill.proficiency || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-3">{skill.description || '—'}</td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="text-red-400 hover:text-red-600 text-xs font-medium transition"
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showPopup && (
        <SkillsPopup
          userId={userId}
          onClose={() => setShowPopup(false)}
          onSkillAdded={fetchSkills}
        />
      )}
    </div>
  );
};

export default Dashboard;
