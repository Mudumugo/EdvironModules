import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Printer, Download, X } from "lucide-react";

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  admissionNumber: string;
  upi: string;
  gradeLevel: string;
  className: string;
  profileImageUrl?: string;
  age: number;
}

interface ReportCardProps {
  student: Student;
  term: string;
  academicYear: string;
  onClose: () => void;
}

const performanceLevels = {
  "EE": { name: "Exceeds Expectations", points: 4, color: "bg-green-100 border-green-300" },
  "ME": { name: "Meets Expectations", points: 3, color: "bg-blue-100 border-blue-300" },
  "AE": { name: "Approaches Expectations", points: 2, color: "bg-yellow-100 border-yellow-300" },
  "BE": { name: "Below Expectations", points: 1, color: "bg-red-100 border-red-300" }
};

export default function ReportCard({ student, term, academicYear, onClose }: ReportCardProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  // Fetch all assessment data for the student
  const { data: reportData } = useQuery({
    queryKey: ["/api/assessment-book/report", student.id, term, academicYear],
    queryFn: async () => {
      const response = await fetch(`/api/assessment-book/report/${student.id}/${term}?academicYear=${academicYear}`);
      if (!response.ok) throw new Error('Failed to fetch report data');
      return response.json();
    },
  });

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/assessment-book/report/${student.id}/${term}/pdf?academicYear=${academicYear}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Failed to generate PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${student.firstName}_${student.lastName}_${term}_${academicYear}_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const getTermDisplay = (term: string) => {
    return term.replace('term', 'Term ').toUpperCase();
  };

  if (!reportData) {
    return <div className="flex justify-center items-center h-64">Loading report data...</div>;
  }

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .report-card-print, .report-card-print * { visibility: visible; }
          .report-card-print { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          .report-card-print { 
            width: 210mm; 
            min-height: 297mm; 
            margin: 0; 
            padding: 15mm; 
            font-size: 12px;
            line-height: 1.4;
          }
        }
      `}</style>

      {/* Action Buttons - Hidden in Print */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 no-print">
        <Button onClick={handlePrint} disabled={isPrinting}>
          <Printer className="h-4 w-4 mr-2" />
          Print Report
        </Button>
        <Button onClick={handleDownloadPDF} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button onClick={onClose} variant="outline" size="icon">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Report Card Content */}
      <div className="report-card-print min-h-screen bg-white">
        <div className="max-w-4xl mx-auto p-8">
          
          {/* Header Section */}
          <div className="text-center mb-8 border-b-4 border-double border-blue-500 pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">SCHOOL LOGO</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">EDVIRONS PRIMARY SCHOOL</h1>
            <h2 className="text-xl text-blue-600 mb-2">PROGRESS REPORT CARD</h2>
            <p className="text-lg">{getTermDisplay(term)}, {academicYear}</p>
          </div>

          {/* Student Information Grid */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-700">Student Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex">
                  <span className="font-semibold w-32">Name:</span>
                  <span>{student.firstName} {student.lastName}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-32">UPI Number:</span>
                  <span>{student.upi}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-32">Grade:</span>
                  <span>{student.gradeLevel}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-32">Stream:</span>
                  <span>{student.className}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-32">Class Teacher:</span>
                  <span>{reportData.classTeacher || 'Mr. Kamau'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-700">Term Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex">
                  <span className="font-semibold w-32">Term:</span>
                  <span>{term.replace('term', '')}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-32">Year:</span>
                  <span>{academicYear}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-32">Attendance:</span>
                  <span>{reportData.attendance || '95%'}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-32">Days Present:</span>
                  <span>{reportData.daysPresent || '85/90'}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-32">Days Absent:</span>
                  <span>{reportData.daysAbsent || '5'}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Student Photo */}
          <div className="float-right ml-4 mb-4">
            <div className="w-24 h-32 border-2 border-gray-300 flex items-center justify-center bg-gray-50">
              {student.profileImageUrl ? (
                <img src={student.profileImageUrl} alt="Student" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-xs text-center">STUDENT PHOTO</span>
              )}
            </div>
          </div>

          {/* Grading Key */}
          <div className="mb-6">
            <h2 className="bg-blue-500 text-white px-4 py-2 text-lg font-semibold mb-3">Grading Key</h2>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(performanceLevels).map(([grade, info]) => (
                <div key={grade} className={`border-2 rounded p-3 text-center ${info.color}`}>
                  <div className="font-bold">{grade} ({info.points})</div>
                  <div className="text-sm">{info.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Performance */}
          <div className="mb-6">
            <h2 className="bg-blue-500 text-white px-4 py-2 text-lg font-semibold mb-3">Academic Performance</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Subject</th>
                  <th className="border border-gray-300 p-2">Term 1</th>
                  <th className="border border-gray-300 p-2">Term 2</th>
                  <th className="border border-gray-300 p-2">Term 3</th>
                  <th className="border border-gray-300 p-2 text-left">Teacher's Comment</th>
                </tr>
              </thead>
              <tbody>
                {reportData.subjects?.map((subject: any, index: number) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="border border-gray-300 p-2 font-medium">{subject.name}</td>
                    <td className="border border-gray-300 p-2 text-center">{subject.term1 || '-'}</td>
                    <td className="border border-gray-300 p-2 text-center">{subject.term2 || '-'}</td>
                    <td className="border border-gray-300 p-2 text-center">{subject.term3 || '-'}</td>
                    <td className="border border-gray-300 p-2 text-sm">{subject.comment || 'Good progress shown'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mathematics Strand Performance */}
          {reportData.mathStrands && (
            <div className="mb-6">
              <h2 className="bg-blue-500 text-white px-4 py-2 text-lg font-semibold mb-3">Mathematics Strand Performance</h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Strand</th>
                    <th className="border border-gray-300 p-2">Term 1</th>
                    <th className="border border-gray-300 p-2">Term 2</th>
                    <th className="border border-gray-300 p-2 text-left">Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.mathStrands.map((strand: any, index: number) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="border border-gray-300 p-2">{strand.name}</td>
                      <td className="border border-gray-300 p-2 text-center">{strand.term1 || '-'}</td>
                      <td className="border border-gray-300 p-2 text-center">{strand.term2 || '-'}</td>
                      <td className="border border-gray-300 p-2 text-sm">{strand.comment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Behavioral Assessment */}
          {reportData.behavior && (
            <div className="mb-6">
              <h2 className="bg-blue-500 text-white px-4 py-2 text-lg font-semibold mb-3">Behavioral Assessment</h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Behavior</th>
                    <th className="border border-gray-300 p-2">Assessment</th>
                    <th className="border border-gray-300 p-2 text-left">Comment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-2">Considering for others</td>
                    <td className="border border-gray-300 p-2 text-center">{reportData.behavior.respectForOthers ? 'S' : 'I'}</td>
                    <td className="border border-gray-300 p-2 text-sm">Very kind to classmates</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-300 p-2">Organisation</td>
                    <td className="border border-gray-300 p-2 text-center">I</td>
                    <td className="border border-gray-300 p-2 text-sm">Sometimes forgets materials</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-2">Accepts responsibility</td>
                    <td className="border border-gray-300 p-2 text-center">S</td>
                    <td className="border border-gray-300 p-2 text-sm">Owns up to mistakes consistently</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-300 p-2">Works independently</td>
                    <td className="border border-gray-300 p-2 text-center">I</td>
                    <td className="border border-gray-300 p-2 text-sm">Needs occasional reminders</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-2">Works well with others</td>
                    <td className="border border-gray-300 p-2 text-center">S</td>
                    <td className="border border-gray-300 p-2 text-sm">Excellent team player</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Comments Section */}
          <div className="mb-8">
            <h2 className="bg-blue-500 text-white px-4 py-2 text-lg font-semibold mb-3">Comments</h2>
            
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Class Teacher's Remarks</h3>
              <div className="border border-gray-300 p-4 bg-gray-50 text-sm leading-relaxed">
                {reportData.classTeacherComment || `${student.firstName} is a diligent student who has shown consistent improvement this term. She demonstrates strong participation in class discussions and shows good leadership qualities. With continued hard work, ${student.firstName} will achieve even better results next term.`}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Head Teacher's Remarks</h3>
              <div className="border border-gray-300 p-4 bg-gray-50 text-sm leading-relaxed">
                {reportData.headTeacherComment || `${student.firstName} maintains good conduct and is respectful to both teachers and fellow students. We commend her for representing the school in the recent math contest.`}
              </div>
            </div>
          </div>

          {/* Footer with Signatures */}
          <div className="grid grid-cols-3 gap-8 mt-12 pt-6 border-t border-gray-300">
            <div className="text-center">
              <div className="border-t border-gray-400 w-32 mx-auto mb-2 mt-12"></div>
              <p className="text-sm font-medium">Class Teacher</p>
              <p className="text-xs text-gray-600">Signature/Date</p>
            </div>
            <div className="text-center">
              <div className="border-t border-gray-400 w-32 mx-auto mb-2 mt-12"></div>
              <p className="text-sm font-medium">Head Teacher</p>
              <p className="text-xs text-gray-600">Signature/Date</p>
            </div>
            <div className="text-center">
              <div className="border-t border-gray-400 w-32 mx-auto mb-2 mt-12"></div>
              <p className="text-sm font-medium">Parent's Acknowledgment</p>
              <p className="text-xs text-gray-600">Signature/Date</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}