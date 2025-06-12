

"use client";

console.log("SOMETHING")
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>GPA Calculator</CardTitle>
        <CardDescription>
          This program calculates GPA on the Allen ISD scale. Input the number of classes, their name, level, and course grade.
          Allen ISD has on-level (4.0), pre AP/Advanced (4.5), and AP/IB (5.0) level classes.
          At a class grade of 100, you are awarded the full GPA of the class you selected. Every point away from 100 subtracts 0.05 from the total GPA.
          (i.e, a 95 in a AP/IB class would equate to a GPA of 4.75).
          GPA is calculated per semester, found by averaging the sum of the GPAs of each class.
          The two semester GPAs are then averaged to find the annual GPA. 
          Likewise, the GPA for the entirety of one's Highschool Career is the average of the GPAs for each year from Freshman Year to Senior Year.

          For more detailed information, see https://docs.google.com/document/d/1183yTpocWvplymSCg_oPGUHNXGq-FHSKSCnjMe9Gtfs/edit?tab=t.0 

        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={calculateGPA} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numClasses">Number of Classes</Label>
            <Input
              type="number"
              id="numClasses"
              value={numClasses}
              onChange={handleNumClassesChange}
              placeholder="Enter number of classes"
            />
            {
              parseInt(numClasses) > 8 || parseInt(numClasses)< 5
                ? <p className="text-red-500">Your class count must be an integer between 5 and 8.</p>
                :<p className="text-gray-500">Enter your class count (5-8)</p>
            }
          
          {parseInt(numClasses) >= 5 && parseInt(numClasses) <=8 && Array.from({ length: parseInt(numClasses)}, (_, i) => (
            <div key={i} className="space-y-2">
              <Label htmlFor={`class_name_${i}`}>Class {i + 1}</Label>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                <Input
                  type="text"
                  id={`class_name_${i}`}
                  value={classes[i]?.name || ''}
                  onChange={(e) => handleClassChange(i, 'name', e.target.value)}
                  placeholder="Class Name"
                  required
                  className="flex-grow"
                />
                <Select
                  onValueChange={(value: string | number) => handleClassChange(i, 'level', value)}
                  defaultValue={classes[i]?.level.toString() || "4"}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">AP/IB</SelectItem>
                    <SelectItem value="4.5">Advanced</SelectItem>
                    <SelectItem value="4">On-Level</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={classes[i]?.grade || ''}
                  onChange={(e) => handleClassChange(i, 'grade', e.target.value)}
                  placeholder="Grade"
                  required
                  className="w-full sm:w-[100px]"
                />
                {parseInt(classes[i].grade ||'') < 0 || parseInt(classes[i].grade||'') > 100
                  ?<div className="mt-4 p-4 bg-red-100 rounded-md">
                    <p>Grades must be between 0 and 100.</p>
                  </div>
                  :<div></div>
                }
              </div>
            </div> 
          ))}
          </div>
          
          {parseInt(numClasses) > 4 && parseInt(numClasses) <= 8 && areAllFieldsFilled() && (
            <Button type="submit">Calculate GPA</Button>
          )}
        </form>
        {finalGPA !== null && (
          <div className="mt-4 p-4 bg-green-100 rounded-md">
            <p className="text-lg font-semibold">Final GPA: {finalGPA.toFixed(3)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GPAcalculator;