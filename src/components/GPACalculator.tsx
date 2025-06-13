"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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
  setNumClasses(value);

  const numValue = parseInt(value);
  if (isNaN(numValue) || numValue <= 0) {
    setClasses([]);
    localStorage.removeItem('classes');
    return;
  }

  const newClasses = Array(numValue)
    .fill(null)
    .map(() => ({ name: '', level: 4, grade: '' }));

  setClasses(newClasses);
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

  const areAllFieldsFilled = () => {
    return classes.every((c) => c.name.trim() !== '' && !isNaN(c.level) && c.grade.trim() !== '');
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* header title and stuff */}
      <div className="text-center mb-8 animate-fade-in-up">
        <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
          GPA Calculator
        </h1>
        <p className="text-base font-medium text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Calculate your GPA using the Allen ISD scale with precision and ease
        </p>
      </div>

      {/* main card with the calc */}
      <Card className="bg-card border border-border/30 shadow-lg rounded-2xl overflow-hidden transition-all duration-300 animate-fade-in-up">
        <CardHeader className="border-b border-border/20 pb-4">
          <CardDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
            This program calculates GPA on the Allen ISD scale. Input the number of classes, their name, level, and course grade.
            Allen ISD has on-level (4.0), pre AP/Advanced (4.5), and AP/IB (5.0) level classes.
          </CardDescription>
          <details className="group mt-4">
            <summary className="cursor-pointer text-sm font-medium text-turquoise hover:text-turquoise-dark transition-colors flex items-center gap-2">
              <span>View detailed calculation method</span>
              <svg className="w-3 h-3 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-3 text-xs font-medium text-muted-foreground leading-relaxed space-y-2 pl-3 border-l border-turquoise/30">
              <p>At a class grade of 100, you are awarded the full GPA of the class you selected. Every point away from 100 subtracts 0.05 from the total GPA.</p>
              <p>(i.e, a 95 in a AP/IB class would equate to a GPA of 4.75).</p>
              <p>GPA is calculated per semester, found by averaging the sum of the GPAs of each class.</p>
              <p>The two semester GPAs are then averaged to find the annual GPA.</p>
              <p>Likewise, the GPA for the entirety of one&apos;s Highschool Career is the average of the GPAs for each year from Freshman Year to Senior Year.</p>
              <a href="https://docs.google.com/document/d/1183yTpocWvplymSCg_oPGUHNXGq-FHSKSCnjMe9Gtfs/edit?tab=t.0"
                 className="text-turquoise hover:text-turquoise-dark underline transition-colors font-medium"
                 target="_blank"
                 rel="noopener noreferrer">
                For more detailed information, see documentation
              </a>
            </div>
          </details>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={calculateGPA} className="space-y-6">
            {/* input num classes */}
            <div className="space-y-2">
              <Label htmlFor="numClasses" className="text-sm font-semibold text-foreground">
                Number of Classes
              </Label>
              <Input
                type="number"
                id="numClasses"
                value={numClasses}
                onChange={handleNumClassesChange}
                placeholder="5-8 classes"
                className="h-10 text-sm font-medium border-border rounded-lg focus:ring-1 focus:ring-turquoise focus:border-turquoise transition-all duration-200"
              />
              {parseInt(numClasses) > 8 || parseInt(numClasses) < 5 ? (
                <div className="flex items-center space-x-2 text-destructive bg-destructive/5 p-2 rounded-md border border-destructive/20">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs font-medium">Must be between 5-8 classes</p>
                </div>
              ) : (
                <p className="text-xs font-medium text-muted-foreground">Enter 5-8 classes</p>
              )}
            </div>

            {/* semester tracking inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="semestersDone" className="text-sm font-semibold text-foreground">
                  Semesters Completed
                </Label>
                <Input
                  type="number"
                  id="semestersDone"
                  value={semestersDone}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSemestersDone(value);
                    localStorage.setItem('semestersDone', value);
                  }}
                  placeholder="0-8 semesters"
                  min="0"
                  max="8"
                  step="1"
                  className="h-10 text-sm font-medium border-border rounded-lg focus:ring-1 focus:ring-turquoise focus:border-turquoise transition-all duration-200"
                />
                {(parseInt(semestersDone) > 8 || parseInt(semestersDone) < 0) && semestersDone !== '' ? (
                  <div className="flex items-center space-x-2 text-destructive bg-destructive/5 p-2 rounded-md border border-destructive/20">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs font-medium">Must be 0-8 semesters</p>
                  </div>
                ) : (
                  <p className="text-xs font-medium text-muted-foreground">Optional: for cumulative GPA</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentGPA" className="text-sm font-semibold text-foreground">
                  Current GPA
                </Label>
                <Input
                  type="number"
                  id="currentGPA"
                  value={currentGPA}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCurrentGPA(value);
                    localStorage.setItem('currentGPA', value);
                  }}
                  placeholder="0.0000-5.0000"
                  min="0"
                  max="5"
                  step="0.0001"
                  className="h-10 text-sm font-medium border-border rounded-lg focus:ring-1 focus:ring-turquoise focus:border-turquoise transition-all duration-200"
                />
                {(parseFloat(currentGPA) > 5 || parseFloat(currentGPA) < 0) && currentGPA !== '' ? (
                  <div className="flex items-center space-x-2 text-destructive bg-destructive/5 p-2 rounded-md border border-destructive/20">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs font-medium">Must be 0.0000-5.0000</p>
                  </div>
                ) : (
                  <p className="text-xs font-medium text-muted-foreground">Optional: for cumulative GPA</p>
                )}
              </div>
            </div>

            {/* where you input the names and the grades */}
            {parseInt(numClasses) >= 5 && parseInt(numClasses) <= 8 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b border-border/20 pb-2">
                  Classes
                </h3>
                {Array.from({ length: parseInt(numClasses) }, (_, i) => (
                  <div key={i} className="bg-muted/20 rounded-lg p-4 space-y-3 border border-border/20 hover:border-turquoise/40 transition-all duration-200">
                    <Label htmlFor={`class_name_${i}`} className="text-xs font-semibold text-foreground flex items-center gap-2">
                      <span className="w-5 h-5 bg-turquoise/20 text-turquoise rounded-full flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      Class {i + 1}
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-1">
                        <Input
                          type="text"
                          id={`class_name_${i}`}
                          value={classes[i]?.name || ''}
                          onChange={(e) => handleClassChange(i, 'name', e.target.value)}
                          placeholder="Class name"
                          required
                          className="h-9 text-sm font-medium border-border rounded-md focus:ring-1 focus:ring-turquoise focus:border-turquoise transition-all duration-200"
                        />
                      </div>
                      <div>
                        <Select
                          onValueChange={(value: string | number) => handleClassChange(i, 'level', value)}
                          defaultValue={classes[i]?.level.toString() || "4"}
                        >
                          <SelectTrigger className="h-9 text-sm font-medium border-border rounded-md focus:ring-1 focus:ring-turquoise focus:border-turquoise transition-all duration-200">
                            <SelectValue placeholder="Level" />
                          </SelectTrigger>
                          <SelectContent className="rounded-md border-border">
                            <SelectItem value="5" className="font-medium text-sm">AP/IB (5.0)</SelectItem>
                            <SelectItem value="4.5" className="font-medium text-sm">Advanced (4.5)</SelectItem>
                            <SelectItem value="4" className="font-medium text-sm">On-Level (4.0)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Input
                          type="number"
                          value={classes[i]?.grade || ''}
                          onChange={(e) => handleClassChange(i, 'grade', e.target.value)}
                          placeholder="Grade"
                          required
                          className="h-9 text-sm font-medium border-border rounded-md focus:ring-1 focus:ring-turquoise focus:border-turquoise transition-all duration-200"
                        />
                      </div>
                    </div>
                    {(parseInt(classes[i]?.grade || '') < 0 || parseInt(classes[i]?.grade || '') > 100) && (
                      <div className="flex items-center space-x-2 text-destructive bg-destructive/5 p-2 rounded-md border border-destructive/20">
                        <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-xs font-medium">Grade must be 0-100</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* button to calc gpa */}
            {Array.from({length: parseInt(numClasses)}, (_,i) => parseInt(classes[i]?.grade)).every((grade)=>!isNaN(grade)&&grade<=100) && parseInt(numClasses) > 4 && parseInt(numClasses) <= 8 && areAllFieldsFilled() && (
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  className="h-10 px-8 text-sm font-semibold bg-turquoise hover:bg-turquoise-dark rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-white"
                >
                  Calculate GPA
                </Button>
              </div>
            )}
          </form>

          {/* the resulting gpa */}
          {finalGPA !== null && Array.from({length: parseInt(numClasses)}, (_,i) => parseInt(classes[i]?.grade)).every((grade)=>!isNaN(grade)&&grade<=100) && (
            <div className="mt-6 space-y-4">
              {/* sem gpa */}
              <div className="p-4 bg-turquoise/5 rounded-lg border border-turquoise/20 animate-fade-in-up">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 bg-turquoise/10 px-3 py-1 rounded-full">
                    <svg className="w-4 h-4 text-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-semibold text-turquoise">Semester GPA</p>
                  </div>
                  <p className="text-3xl font-bold text-turquoise tracking-tight font-mono">
                    {finalGPA.toFixed(4)}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    Based on Allen ISD grading scale
                  </p>
                </div>
              </div>

              {/* cumulative gpa */}
              {cumulativeGPA !== null && (
                <div className="p-4 bg-turquoise/10 rounded-lg border border-turquoise/30 animate-fade-in-up">
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 bg-turquoise/20 px-3 py-1 rounded-full">
                      <svg className="w-4 h-4 text-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <p className="text-sm font-semibold text-turquoise">Cumulative GPA After This Semester</p>
                    </div>
                    <p className="text-3xl font-bold text-turquoise tracking-tight font-mono">
                      {cumulativeGPA.toFixed(4)}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground">
                      After {parseInt(semestersDone) + 1} semester{parseInt(semestersDone) + 1 !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GPAcalculator;