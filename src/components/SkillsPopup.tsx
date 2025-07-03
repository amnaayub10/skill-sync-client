import { auth } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Label from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Skill } from '@/types/skills';
import { proficiencyLevels, skillTypes } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from 'react';
import { Loader2, Loader2Icon } from 'lucide-react';


const getSkills = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/skills`;
  const response = await axios.get<Skill[]>(url, auth());
  return response.data;
};

export function SkillsPopup() {
  const [isOpen, setIsOpen] = useState(false);


  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['skills'],
    queryFn: getSkills,
    enabled: isOpen
  });


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg transition-all duration-200">
        Add Your Skill
      </DialogTrigger>
      <DialogContent
        onPointerDownOutside={(e: Event) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add your skill to dashboard</DialogTitle>
        </DialogHeader>
        {isLoading && <Loader2 className='animate-spin' />}
        {isSuccess && (
          <form id='add-skill'
            className='p-4 space-y-10'
          >
            <section className=''>

              <div className='my-4 space-y-2'>
                <Label> Select Skill </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.map(skill => (
                      <SelectItem
                        key={skill.id}
                        value={skill.name}
                      >
                        {skill.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='my-4 space-y-2'>
                <Label> Select Type </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillTypes.map(skill => (
                      <SelectItem
                        key={skill.id}
                        value={skill.name}
                      >
                        {skill.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='my-4 space-y-2'>
                <Label> Select Proficiency level </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {proficiencyLevels.map(skill => (
                      <SelectItem
                        key={skill.id}
                        value={skill.name}
                      >
                        {skill.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='my-4 space-y-2'>
                <Label> Description </Label>
                <Textarea
                  placeholder='Helping learners master DSA | X yrs @ABC'
                />
              </div>

            </section>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant={'outline'}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type='submit'
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}