

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
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

useEffect(() => {
  const savedNum = localStorage.getItem('numClasses');
  const savedClasses = localStorage.getItem('classes');

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
      setFinalGPA(parseFloat((totalGPA / validClassesCount).toFixed(9)));
    } else {
      setFinalGPA(null);
    }
  };

  const areAllFieldsFilled = () => {
    return classes.every((c) => c.name.trim() !== '' && !isNaN(c.level) && c.grade.trim() !== '');
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* header title and stuff */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-thin text-gray-800 mb-4 tracking-wide">
          GPA Calculator
        </h1>
        <p className="text-lg font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Calculate your GPA using the Allen ISD scale with precision and ease
        </p>
      </div>

      {/* main card with the calc */}
      <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-2xl shadow-blue-100/50 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100/50 pb-8">
          <div className="space-y-4">
            <CardDescription className="text-sm font-light text-gray-600 leading-relaxed">
              This program calculates GPA on the Allen ISD scale. Input the number of classes, their name, level, and course grade.
              Allen ISD has on-level (4.0), pre AP/Advanced (4.5), and AP/IB (5.0) level classes.
            </CardDescription>
            <details className="group">
              <summary className="cursor-pointer text-sm font-light text-blue-600 hover:text-blue-700 transition-colors">
                View detailed calculation method
              </summary>
              <div className="mt-3 text-xs font-light text-gray-500 leading-relaxed space-y-2">
                <p>At a class grade of 100, you are awarded the full GPA of the class you selected. Every point away from 100 subtracts 0.05 from the total GPA.</p>
                <p>(i.e, a 95 in a AP/IB class would equate to a GPA of 4.75).</p>
                <p>GPA is calculated per semester, found by averaging the sum of the GPAs of each class.</p>
                <p>The two semester GPAs are then averaged to find the annual GPA.</p>
                <p>Likewise, the GPA for the entirety of one's Highschool Career is the average of the GPAs for each year from Freshman Year to Senior Year.</p>
                <a href="https://docs.google.com/document/d/1183yTpocWvplymSCg_oPGUHNXGq-FHSKSCnjMe9Gtfs/edit?tab=t.0"
                   className="text-blue-500 hover:text-blue-600 underline transition-colors"
                   target="_blank"
                   rel="noopener noreferrer">
                  For more detailed information, see documentation
                </a>
              </div>
            </details>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <form onSubmit={calculateGPA} className="space-y-8">
            {/* input num classes */}
            <div className="space-y-3">
              <Label htmlFor="numClasses" className="text-sm font-light text-gray-700">
                Number of Classes
              </Label>
              <Input
                type="number"
                id="numClasses"
                value={numClasses}
                onChange={handleNumClassesChange}
                placeholder="Enter number of classes (5-8)"
                className="h-12 text-base font-light border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
              {parseInt(numClasses) > 8 || parseInt(numClasses) < 5 ? (
                <div className="flex items-center space-x-2 text-red-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-light">Your class count must be an integer between 5 and 8.</p>
                </div>
              ) : (
                <p className="text-sm font-light text-gray-500">Enter your class count (5-8)</p>
              )}
            </div>

            {/* where you input the names and the grades */}
            {parseInt(numClasses) >= 5 && parseInt(numClasses) <= 8 && (
              <div className="space-y-6">
                <h3 className="text-lg font-light text-gray-700 border-b border-gray-100 pb-2">
                  Class Information
                </h3>
                {Array.from({ length: parseInt(numClasses) }, (_, i) => (
                  <div key={i} className="bg-gray-50/50 rounded-2xl p-6 space-y-4 border border-gray-100">
                    <Label htmlFor={`class_name_${i}`} className="text-sm font-light text-gray-700">
                      Class {i + 1}
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <Input
                          type="text"
                          id={`class_name_${i}`}
                          value={classes[i]?.name || ''}
                          onChange={(e) => handleClassChange(i, 'name', e.target.value)}
                          placeholder="Class Name"
                          required
                          className="h-12 text-base font-light border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <Select
                          onValueChange={(value: string | number) => handleClassChange(i, 'level', value)}
                          defaultValue={classes[i]?.level.toString() || "4"}
                        >
                          <SelectTrigger className="h-12 text-base font-light border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200">
                            <SelectValue placeholder="Select Level" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-gray-200">
                            <SelectItem value="5" className="font-light">AP/IB (5.0)</SelectItem>
                            <SelectItem value="4.5" className="font-light">Advanced (4.5)</SelectItem>
                            <SelectItem value="4" className="font-light">On-Level (4.0)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Input
                          type="number"
                          value={classes[i]?.grade || ''}
                          onChange={(e) => handleClassChange(i, 'grade', e.target.value)}
                          placeholder="Grade (0-100)"
                          required
                          className="h-12 text-base font-light border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                    {(parseInt(classes[i]?.grade || '') < 0 || parseInt(classes[i]?.grade || '') > 100) && (
                      <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-3 rounded-xl">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm font-light">Grades must be between 0 and 100.</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* button to calc gpa */}
            {parseInt(numClasses) > 4 && parseInt(numClasses) <= 8 && areAllFieldsFilled() && (
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  className="h-12 px-8 text-base font-light bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Calculate GPA
                </Button>
              </div>
            )}
          </form>

          {/* the resulting gpa */}
          {finalGPA !== null && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="text-center">
                <p className="text-sm font-light text-green-700 mb-2">Your Calculated GPA</p>
                <p className="text-4xl font-thin text-green-800 tracking-wide">
                  {finalGPA.toFixed(3)}
                </p>
                <p className="text-xs font-light text-green-600 mt-2">
                  Based on Allen ISD grading scale
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GPAcalculator;