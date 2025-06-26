"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ClassInfo {
  name: string;
  level: number;
  grade: string;
}

const GPAcalculator = () => {
  const [numClasses, setNumClasses] = useState<string>('');
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [finalGPA, setFinalGPA] = useState<number | null>(null);
  const [semestersDone, setSemestersDone] = useState<string>('');
  const [currentGPA, setCurrentGPA] = useState<string>('');
  const [cumulativeGPA, setCumulativeGPA] = useState<number | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

useEffect(() => {
  const savedNum = localStorage.getItem('numClasses');
  const savedClasses = localStorage.getItem('classes');
  const savedSemesters = localStorage.getItem('semestersDone');
  const savedCurrentGPA = localStorage.getItem('currentGPA');

  if (savedNum) {
    setNumClasses(savedNum);

    const numValue = parseInt(savedNum);
    if (!isNaN(numValue) && numValue > 0) {
      if (savedClasses) {
        try {
          setClasses(JSON.parse(savedClasses));
        } catch (e) {
          setClasses(Array(numValue).fill(null).map(() => ({ name: '', level: 4, grade: '' })));
        }
      } else {
        setClasses(Array(numValue).fill(null).map(() => ({ name: '', level: 4, grade: '' })));
      }
    }
  }

  if (savedSemesters) {
    setSemestersDone(savedSemesters);
  }

  if (savedCurrentGPA) {
    setCurrentGPA(savedCurrentGPA);
  }
}, []);

  const handleNumClassesChange = (e: ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  
  if(isNaN(+value)||+value<5&&value!=''||+value>8) {
    return;
  }
  setNumClasses(value);

  const numValue = parseInt(value);
  if (isNaN(numValue) || numValue < 0) {
    setClasses([]);
    localStorage.removeItem('classes');
    localStorage.removeItem('numClasses')
    return;
  }

  const savedClasses = [...classes];
  const newClasses = Array(numValue)
    .fill(null)
    .map((_, i) => savedClasses[i] || { name: '', level: 4, grade: '' });
  
  setClasses(newClasses);
  console.log(value);
  localStorage.setItem('numClasses', value);
  localStorage.setItem('classes', JSON.stringify(newClasses));
  
};

  const handleClassChange = (index: number, field: keyof ClassInfo, value: string | number) => {
    const newClasses = [...classes];
    if (field === 'level') {
      newClasses[index][field] = parseFloat(value as string);
    } else if (field === 'grade') {
      newClasses[index][field] = value as string;
    } else {
      newClasses[index][field] = value as string;
    }

    if(field==="grade") {
      newClasses[index][field] = value as string;
      const num = +value;
      if(isNaN(num)||num<0||num>100)return;
    }

    if(classes.length>0){
    localStorage.setItem('classes', JSON.stringify(newClasses));
    }
    setClasses(newClasses);
  };

  const calculateGPA = (e: FormEvent) => {
    e.preventDefault();
    let totalGPA = 0;
    let validClassesCount = 0;

    classes.forEach((c) => {
      const grade = parseFloat(c.grade);
      if (!isNaN(grade)&&(grade)>=70) {
        const cgpa = c.level - 0.05 * (100 - grade);
        totalGPA += cgpa;
        validClassesCount++;
      }else if (!isNaN(grade)&&(grade)<70) {
        const cgpa = 0
        totalGPA += cgpa;
        validClassesCount++;
      }
    });

    if (validClassesCount > 0) {
      const semesterGPA = parseFloat((totalGPA / validClassesCount).toFixed(4));
      setFinalGPA(semesterGPA);

      // calc cumulative gpa if semesters and current gpa are provided
      const semesters = parseFloat(semestersDone);
      const currentGPAValue = parseFloat(currentGPA);

      if (!isNaN(semesters) && !isNaN(currentGPAValue) && semesters >= 0 && semesters <= 8 && currentGPAValue >= 0 && currentGPAValue <= 5) {
        const totalGradePoints = (currentGPAValue * semesters) + semesterGPA;
        const totalSemesters = semesters + 1;
        const newCumulativeGPA = parseFloat((totalGradePoints / totalSemesters).toFixed(4));
        setCumulativeGPA(newCumulativeGPA);
      } else {
        setCumulativeGPA(null);
      }
    } else {
      setFinalGPA(null);
      setCumulativeGPA(null);
    }
  };


  const clear = (e: FormEvent) =>  {
    
    e.preventDefault();
    setNumClasses('');
    setClasses([]);
    setFinalGPA(null);
    setSemestersDone('');
    setCurrentGPA('');
    setCumulativeGPA(null);

    localStorage.removeItem('numClasses')
    localStorage.removeItem('classes')
    localStorage.removeItem('semestersDone')
    localStorage.removeItem('currentGPA')
  };

  const areAllFieldsFilled = () => {
    return classes.every((c) => !isNaN(c.level) && c.grade.trim() !== '');
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6">
      {/* header */}
      <div className="text-center mb-20">
        <h1 className="text-5xl font-thin tracking-wide text-slate-800 dark:text-slate-100 mb-3">
          GPA Calculator
        </h1>
        <p className="text-sm font-light text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          Allen ISD Scale
        </p>
      </div>

      {/* section */}
      <div className="mb-16">
        <details className="group">
          <summary className="cursor-pointer text-center text-xs font-light text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors uppercase tracking-widest">
            How it works
          </summary>
          <div className="mt-8 max-w-2xl mx-auto text-center space-y-4 text-sm font-light text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>This program calculates GPA on the Allen ISD scale. To find your GPA for the semester, input the number of classes, their name, level, and course grade. Allen ISD has on-level (4.0), pre AP/Advanced (4.5), and AP/IB (5.0) level classes.</p>
            <p>If you wish to find your cumulative GPA for your entire highschool career, additionally input the GPA listed in your most recent transcript as well as the grade and semester you are in (The transcript should be from your last semester.)</p>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs">At a class grade of 100, you are awarded the full GPA of the class you selected. Every point away from 100 subtracts 0.05 from the total GPA. (i.e, a 95 in a AP/IB class would equate to a GPA of 4.75). GPA per semester is found by averaging the sum of the GPAs of the classes. The final GPA is found by averaging the GPAs of each semester.</p>
              <a href="https://docs.google.com/document/d/1183yTpocWvplymSCg_oPGUHNXGq-FHSKSCnjMe9Gtfs/edit?tab=t.0"
                 className="inline-block mt-3 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline transition-colors"
                 target="_blank"
                 rel="noopener noreferrer">
                Official Allen Documentation
              </a>
            </div>
          </div>
        </details>
      </div>
      {/* form */}
      <form onSubmit={calculateGPA} className="space-y-16">

        {/* semester inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="block text-xs font-light text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Classes
            </label>
            <Input
              type="number"
              min="5"
              max="8"
              value={numClasses}
              onChange={handleNumClassesChange}
              onWheel={(e) => e.currentTarget.blur()}
              placeholder="5-8"
              className="h-12 text-center border-0 border-b border-slate-200 dark:border-slate-700 rounded-none bg-transparent focus:border-blue-500 focus:ring-0 text-lg font-light [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
            {parseInt(numClasses) > 8 || parseInt(numClasses) < 5 ? (
              <p className="text-xs text-red-500 font-light">5-8 classes required</p>
            ) : (
              <p className="text-xs text-slate-400 font-light">Number of classes</p>
            )}
          </div>


          <div className="space-y-2">
                    <label className="block text-xs font-light text-slate-400 uppercase tracking-widest">
                      Grade Level
                    </label>
                    <Select
                    onValueChange={(value) => {
                      localStorage.setItem('semestersDone', value);
                      setSemestersDone(localStorage.getItem('semestersDone')||value)
                    }}
                    value={localStorage.getItem('semestersDone')||'00'}>
                      <SelectTrigger className="h-12 border-0 border-b border-slate-200 dark:border-slate-700 rounded-none bg-transparent focus:border-blue-500 focus:ring-0 text-lg font-light">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="00">Select: </SelectItem>
                        <SelectItem value="0">Freshman (Fall)</SelectItem>
                        <SelectItem value="1">Freshman (Spring)</SelectItem>
                        <SelectItem value="2">Sophomore (Fall)</SelectItem>
                        <SelectItem value="3">Sophomore (Spring)</SelectItem>
                        <SelectItem value="4">Junior (Fall)</SelectItem>
                        <SelectItem value="5">Junior (Spring)</SelectItem>
                        <SelectItem value="6">Senior (Fall)</SelectItem>
                        <SelectItem value="7">Senior (Spring)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-400 font-light">Year and Semester (optional)</p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-light text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Current GPA
            </label>
            <Input
              type="number"
              value={currentGPA}
              onChange={(e) => {
                const value = e.target.value;
                if(isNaN(+value)||+value<0&&value!=''||+value>5) {
                  return;
                }else{
                  setCurrentGPA(value);
                }
                localStorage.setItem('currentGPA', value);
              }}
              onWheel={(e) => e.currentTarget.blur()}
              placeholder="0.0000"
              min="0"
              max="5"
              step="0.0001"
              className="h-12 text-center border-0 border-b border-slate-200 dark:border-slate-700 rounded-none bg-transparent focus:border-blue-500 focus:ring-0 text-lg font-light [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
            {(parseFloat(currentGPA) > 5 || parseFloat(currentGPA) < 0) && currentGPA !== '' ? (
              <p className="text-xs text-red-500 font-light">0.0000-5.0000</p>
            ) : (
              <p className="text-xs text-slate-400 font-light">From transcript (optional)</p>
            )}
          </div>
        </div>

        {/* grade inputs */}
        {parseInt(numClasses) >= 5 && parseInt(numClasses) <= 8 && (
          <div className="space-y-12">
            <h3 className="text-center text-xs font-light text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Class Details
            </h3>

            <div className="space-y-8">
              {Array.from({ length: parseInt(numClasses) }, (_, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-6 py-6 border-b border-slate-100 dark:border-slate-800 last:border-b-0">

                  <div className="space-y-2">
                    <label className="block text-xs font-light text-slate-400 uppercase tracking-widest">
                      {i + 1}. Name
                    </label>
                    <Input
                      type="text"
                      value={classes[i]?.name || ''}
                      onChange={(e) => handleClassChange(i, 'name', e.target.value)}
                      placeholder="Optional"
                      className="border-0 border-b border-slate-200 dark:border-slate-700 rounded-none bg-transparent focus:border-blue-500 focus:ring-0 text-sm font-light"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-light text-slate-400 uppercase tracking-widest">
                      Level
                    </label>
                    <Select
                      onValueChange={(value: string | number) => handleClassChange(i, 'level', value)}
                      value={classes[i]?.level.toString() || "4"}
                    >
                      <SelectTrigger className="border-0 border-b border-slate-200 dark:border-slate-700 rounded-none bg-transparent focus:border-blue-500 focus:ring-0 text-sm font-light">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">AP/IB (5.0)</SelectItem>
                        <SelectItem value="4.5">Advanced (4.5)</SelectItem>
                        <SelectItem value="4">On-Level (4.0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-light text-slate-400 uppercase tracking-widest">
                      Grade
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={classes[i]?.grade || ''}
                      onChange={(e) => handleClassChange(i, 'grade', e.target.value)}
                      onWheel={(e) => e.currentTarget.blur()}
                      placeholder="0-100"
                      className="border-0 border-b border-slate-200 dark:border-slate-700 rounded-none bg-transparent focus:border-blue-500 focus:ring-0 text-sm font-light [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                    />
                    {(parseInt(classes[i]?.grade || '') < 0 || parseInt(classes[i]?.grade || '') > 100) && classes[i]?.grade && (
                      <p className="text-xs text-red-500 font-light">0-100 required</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-light text-slate-400 uppercase tracking-widest">
                      GPA
                    </label>
                    <div className="text-sm font-light text-slate-600 dark:text-slate-400 py-3">
                      {(() => {
                        const grade = parseFloat(classes[i]?.grade || '0');
                        const level = classes[i]?.level || 4;
                        if (isNaN(grade) || grade < 70) return '0.00';
                        return (level - 0.05 * (100 - grade)).toFixed(2);
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* buttons */}
        <div className="flex items-center justify-center gap-8 pt-12">
          {Array.from({length: parseInt(numClasses)}, (_,i) => parseInt(classes[i]?.grade)).every((grade)=>!isNaN(grade)&&grade<=100) && parseInt(numClasses) > 4 && parseInt(numClasses) <= 8 && areAllFieldsFilled() ? (
            <>
              <Button
                type="submit"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-light text-sm rounded-none border-0 transition-colors"
              >
                Calculate GPA
              </Button>

              <Button
                type="button"
                onClick={(e) => clear(e)}
                variant="outline"
                className="px-8 py-3 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-light text-sm rounded-none bg-transparent transition-colors"
              >
                Clear All
              </Button>
            </>
          ) : (
            <Button
              type="button"
              onClick={(e) => clear(e)}
              variant="outline"
              className="px-8 py-3 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-light text-sm rounded-none bg-transparent transition-colors"
            >
              Clear All
            </Button>
          )}
        </div>
      </form>

      {/* results */}
      {finalGPA !== null && Array.from({length: parseInt(numClasses)}, (_,i) => parseInt(classes[i]?.grade)).every((grade)=>!isNaN(grade)&&grade<=100) && (
        <div className="mt-20 pt-16 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

            <div className="text-center space-y-4">
              <h3 className="text-xs font-light text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Semester GPA
              </h3>
              <div className="text-4xl font-thin text-slate-800 dark:text-slate-100 tracking-wide">
                {finalGPA.toFixed(4)}
              </div>
              <p className="text-xs font-light text-slate-400">
                Allen ISD Scale
              </p>
            </div>

            {cumulativeGPA !== null && (
              <div className="text-center space-y-4">
                <h3 className="text-xs font-light text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Cumulative GPA
                </h3>
                <div className="text-4xl font-thin text-slate-800 dark:text-slate-100 tracking-wide">
                  {cumulativeGPA.toFixed(4)}
                </div>
                <p className="text-xs font-light text-slate-400">
                  After {parseInt(semestersDone) + 1} semester{parseInt(semestersDone) + 1 !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GPAcalculator;