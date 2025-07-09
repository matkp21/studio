// src/app/medico/cbme/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookMarked, Search, SlidersHorizontal } from 'lucide-react';
import { PageWrapper } from '@/components/layout/page-wrapper';


type Competency = {
  id: string;
  code: string;
  description: string;
  subject: string;
  system: string;
  integration?: string;
  certification?: string;
};

// Static data as per the plan
const competencies: Competency[] = [
  {
    id: '1',
    code: 'AN 5.1',
    description: 'Differentiate between blood vascular and lymphatic system',
    subject: 'Anatomy',
    system: 'Cardiovascular System',
    certification: 'HI Physiology',
  },
  {
    id: '2',
    code: 'AN 5.2',
    description: 'Differentiate between pulmonary and systemic circulation',
    subject: 'Anatomy',
    system: 'Cardiovascular System',
    certification: 'HI Physiology',
  },
  {
    id: '3',
    code: 'AN 5.4',
    description: 'Explain functional differences between elastic, muscular arteries and arterioles',
    subject: 'Anatomy',
    system: 'Cardiovascular System',
    certification: 'VI General Medicine',
  },
  {
    id: '4',
    code: 'AN 5.5',
    description: 'Describe portal system with examples',
    subject: 'Anatomy',
    system: 'Cardiovascular System',
    certification: 'VI General Medicine',
  },
   {
    id: '5',
    code: 'PY 7.1',
    description: 'Describe the physiological basis of ECG',
    subject: 'Physiology',
    system: 'Cardiovascular System',
    certification: 'HI Anatomy',
  },
];

const uniqueSubjects = [...new Set(competencies.map(c => c.subject))];
const uniqueSystems = [...new Set(competencies.map(c => c.system))];

export default function CBMEPage() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('');
  const [search, setSearch] = useState('');
  
  const filtered = competencies.filter(
    item =>
      (!selectedSubject || item.subject === selectedSubject) &&
      (!selectedSystem || item.system === selectedSystem) &&
      (item.description.toLowerCase().includes(search.toLowerCase()) || item.code.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <PageWrapper title="CBME Competency Browser">
        <Card className="shadow-lg rounded-xl mb-6">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <SlidersHorizontal className="h-6 w-6 text-primary"/>
                    Filter & Search
                </CardTitle>
                <CardDescription>
                    Select the subject and system, or search by keyword to find relevant competencies.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select onValueChange={setSelectedSubject} value={selectedSubject}>
                    <SelectTrigger><SelectValue placeholder="All Subjects"/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Subjects</SelectItem>
                        {uniqueSubjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setSelectedSystem} value={selectedSystem}>
                    <SelectTrigger><SelectValue placeholder="All Systems"/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Systems</SelectItem>
                        {uniqueSystems.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
                    <Input
                      type="text"
                      placeholder="Search by keyword..."
                      className="pl-10"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                </div>
            </CardContent>
        </Card>

        <h2 className="text-xl font-semibold mb-4 text-foreground">{selectedSystem || 'All Systems'} - {selectedSubject || 'All Subjects'}</h2>

        <div className="space-y-3">
            <AnimatePresence>
            {filtered.map(comp => (
                <motion.div
                key={comp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                >
                    <Card className="bg-card/80 shadow-md hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                        <CardContent className="p-4">
                            <div className="font-semibold text-primary">{comp.code}</div>
                            <div className="text-foreground/90 mt-1">{comp.description}</div>
                            {comp.certification && (
                                <div className="mt-2 text-xs text-muted-foreground">Certification: {comp.certification}</div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
            </AnimatePresence>
            {filtered.length === 0 && (
                 <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-10 text-muted-foreground bg-card p-6 rounded-xl shadow-md"
                >
                    <BookMarked className="h-12 w-12 mx-auto mb-3 text-primary/50" />
                    <p className="font-semibold">No competencies found.</p>
                    <p className="text-sm">Try adjusting your filters or search query.</p>
                </motion.div>
            )}
        </div>
    </PageWrapper>
  );
}
