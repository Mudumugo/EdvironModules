import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Phone, Mail, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Lead, LEAD_STATUSES, PRIORITY_LEVELS } from "./types";

interface LeadListProps {
  leads: Lead[];
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onCall: (lead: Lead) => void;
  onEmail: (lead: Lead) => void;
  onSchedule: (lead: Lead) => void;
}

export function LeadList({ leads, onView, onEdit, onCall, onEmail, onSchedule }: LeadListProps) {
  const getStatusInfo = (status: string) => {
    return LEAD_STATUSES.find(s => s.value === status) || LEAD_STATUSES[0];
  };

  const getPriorityInfo = (priority: string) => {
    return PRIORITY_LEVELS.find(p => p.value === priority) || PRIORITY_LEVELS[1];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
        <p className="text-gray-600">Create your first lead to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => {
        const statusInfo = getStatusInfo(lead.status);
        const priorityInfo = getPriorityInfo(lead.priority);

        return (
          <Card key={lead.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{lead.schoolName}</CardTitle>
                    <Badge className={`bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
                      {statusInfo.label}
                    </Badge>
                    <Badge variant="outline" className={`text-${priorityInfo.color}-600 border-${priorityInfo.color}-200`}>
                      {priorityInfo.label}
                    </Badge>
                  </div>
                  
                  <div className="text-gray-600 space-y-1">
                    <p><strong>Contact:</strong> {lead.contactName}</p>
                    <p><strong>Email:</strong> {lead.email}</p>
                    <p><strong>Phone:</strong> {lead.phone}</p>
                    {lead.estimatedValue && (
                      <p><strong>Value:</strong> {formatCurrency(lead.estimatedValue)}</p>
                    )}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(lead)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(lead)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Lead
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCall(lead)}>
                      <Phone className="w-4 h-4 mr-2" />
                      Make Call
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEmail(lead)}>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSchedule(lead)}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>Source: {lead.source}</span>
                  <span>Created: {formatDate(lead.createdAt)}</span>
                  {lead.expectedCloseDate && (
                    <span>Expected Close: {formatDate(lead.expectedCloseDate)}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => onCall(lead)}>
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onEmail(lead)}>
                    <Mail className="w-3 h-3 mr-1" />
                    Email
                  </Button>
                  <Button size="sm" onClick={() => onView(lead)}>
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>

              {lead.notes && (
                <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                  <strong>Notes:</strong> {lead.notes}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}