"use client";
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

  const handleNumClassesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNumClasses(value);

    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue <= 0) {
      setClasses([]);
      return;
    }

    const newClasses = Array(numValue).fill(null).map(() => ({ name: '', level: 4, grade: '' }));
    setClasses(newClasses);
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
    setClasses(newClasses);
  };

  const calculateGPA = (e: FormEvent) => {
    e.preventDefault();
    let totalGPA = 0;
    let validClassesCount = 0;

    classes.forEach((c) => {
      const grade = parseFloat(c.grade);
      if (!isNaN(grade)) {
        const cgpa = c.level - 0.05 * (100 - grade);
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
          Each point lost counts as -0.05 GPA points for that specific class, and the final GPA is the average of all classes.
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
          </div>
          {parseInt(numClasses) > 0 && Array.from({ length: parseInt(numClasses) }, (_, i) => (
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
              </div>
            </div>
          ))}
          {parseInt(numClasses) > 0 && areAllFieldsFilled() && (
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