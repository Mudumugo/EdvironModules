import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, BookOpen, List, Target } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Subject {
  id: number;
  name: string;
  code: string;
  category: string;
  strands: string[];
  description?: string;
}

// Strand interface for future use
// interface Strand {
//   id: string;
//   name: string;
//   description: string;
//   subStrands: string[];
// }

export default function SubjectManager() {
  const queryClient = useQueryClient();
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddStrand, setShowAddStrand] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Form states
  const [newSubject, setNewSubject] = useState({
    name: "",
    code: "",
    category: "",
    description: "",
    strands: [] as string[]
  });

  const [newStrand, setNewStrand] = useState({
    name: "",
    description: "",
    subStrands: [] as string[]
  });

  // Fetch subjects
  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ["/api/assessment-book/subjects"],
  });

  // Add subject mutation
  const addSubjectMutation = useMutation({
    mutationFn: async (subjectData: any) => {
      const response = await fetch("/api/assessment-book/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subjectData),
      });
      if (!response.ok) throw new Error('Failed to add subject');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessment-book/subjects"] });
      setShowAddSubject(false);
      setNewSubject({ name: "", code: "", category: "", description: "", strands: [] });
    },
  });

  // Update subject mutation
  const updateSubjectMutation = useMutation({
    mutationFn: async (subjectData: any) => {
      const response = await fetch(`/api/assessment-book/subjects/${subjectData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subjectData),
      });
      if (!response.ok) throw new Error('Failed to update subject');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessment-book/subjects"] });
      setEditingSubject(null);
    },
  });

  const handleAddStrand = () => {
    if (selectedSubject && newStrand.name) {
      const updatedSubject = {
        ...selectedSubject,
        strands: [...selectedSubject.strands, newStrand.name]
      };
      updateSubjectMutation.mutate(updatedSubject);
      setNewStrand({ name: "", description: "", subStrands: [] });
      setShowAddStrand(false);
    }
  };

  // Pre-defined CBC subjects for Kenya
  const cbcSubjects = [
    { name: "Mathematics", code: "MATH", category: "Core", strands: ["Numbers", "Measurement", "Geometry", "Data Handling", "Money"] },
    { name: "English", code: "ENG", category: "Core", strands: ["Listening and Speaking", "Reading", "Writing", "Language Use"] },
    { name: "Kiswahili", code: "KIS", category: "Core", strands: ["Kusoma", "Kuandika", "Kusikiliza na Kuzungumza", "Matumizi ya Lugha"] },
    { name: "Science & Technology", code: "SCI", category: "Core", strands: ["Living Things", "Non-living Things", "Energy", "Technology"] },
    { name: "Social Studies", code: "SST", category: "Core", strands: ["Geography", "History", "Citizenship", "Economics"] },
    { name: "CRE", code: "CRE", category: "Religious", strands: ["Biblical Stories", "Christian Values", "Prayer and Worship", "Christian Living"] },
    { name: "Home Science", code: "HOME", category: "Practical", strands: ["Food and Nutrition", "Clothing", "Home Management", "Family Life"] },
    { name: "Agriculture", code: "AGRI", category: "Practical", strands: ["Crop Production", "Animal Husbandry", "Environmental Conservation", "Farm Tools"] }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Subject & Strand Management</h2>
          <p className="text-gray-600">Manage CBC subjects and their learning strands</p>
        </div>
        <Dialog open={showAddSubject} onOpenChange={setShowAddSubject}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Subject Name</label>
                  <Input
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    placeholder="e.g., Mathematics"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Subject Code</label>
                  <Input
                    value={newSubject.code}
                    onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                    placeholder="e.g., MATH"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={newSubject.category} onValueChange={(value) => setNewSubject({ ...newSubject, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Core">Core Subject</SelectItem>
                    <SelectItem value="Religious">Religious Education</SelectItem>
                    <SelectItem value="Practical">Practical Subject</SelectItem>
                    <SelectItem value="Co-curricular">Co-curricular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newSubject.description}
                  onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                  placeholder="Brief description of the subject"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => addSubjectMutation.mutate(newSubject)} disabled={addSubjectMutation.isPending}>
                  Add Subject
                </Button>
                <Button variant="outline" onClick={() => setShowAddSubject(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Add CBC Subjects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Quick Add CBC Subjects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">Add standard CBC subjects with pre-defined strands:</p>
          <div className="flex flex-wrap gap-2">
            {cbcSubjects.map((subject) => (
              <Button
                key={subject.code}
                variant="outline"
                size="sm"
                onClick={() => addSubjectMutation.mutate(subject)}
                disabled={subjects.some(s => s.code === subject.code)}
              >
                {subjects.some(s => s.code === subject.code) ? "✓ Added" : `+ ${subject.name}`}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subjects List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Strands</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{subject.name}</TableCell>
                  <TableCell>{subject.code}</TableCell>
                  <TableCell>
                    <Badge variant={subject.category === 'Core' ? 'default' : 'secondary'}>
                      {subject.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {subject.strands?.slice(0, 3).map((strand, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {strand}
                        </Badge>
                      ))}
                      {subject.strands?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{subject.strands.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedSubject(subject)}
                      >
                        <List className="h-4 w-4" />
                        Manage Strands
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingSubject(subject)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Strand Management Dialog */}
      {selectedSubject && (
        <Dialog open={!!selectedSubject} onOpenChange={() => setSelectedSubject(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Manage Strands - {selectedSubject.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Learning Strands</h3>
                <Dialog open={showAddStrand} onOpenChange={setShowAddStrand}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Strand
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Learning Strand</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Strand Name</label>
                        <Input
                          value={newStrand.name}
                          onChange={(e) => setNewStrand({ ...newStrand, name: e.target.value })}
                          placeholder="e.g., Numbers and Operations"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={newStrand.description}
                          onChange={(e) => setNewStrand({ ...newStrand, description: e.target.value })}
                          placeholder="Describe what this strand covers"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAddStrand}>Add Strand</Button>
                        <Button variant="outline" onClick={() => setShowAddStrand(false)}>Cancel</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid gap-3">
                {selectedSubject.strands?.map((strand, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{strand}</h4>
                      <p className="text-sm text-gray-600">Learning strand for {selectedSubject.name}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const updatedStrands = selectedSubject.strands.filter((_, i) => i !== index);
                        updateSubjectMutation.mutate({
                          ...selectedSubject,
                          strands: updatedStrands
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}