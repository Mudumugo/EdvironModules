import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCRM } from "@/hooks/useCRM";
import { CRMHeader } from "@/components/crm/CRMHeader";
import { LeadForm } from "@/components/crm/LeadForm";
import { LeadList } from "@/components/crm/LeadList";
import { CRMStats } from "@/components/crm/CRMStats";

export default function CRM() {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    selectedLead,
    setSelectedLead,
    showLeadForm,
    setShowLeadForm,
    editingLead,
    setEditingLead,
    leads,
    allLeads,
    demoRequests,
    activities,
    leadsLoading,
    demosLoading,
    createLead,
    updateLead,
    deleteLead,
    addActivity,
    createDemoRequest,
    isCreatingLead,
    isUpdatingLead,
    isDeletingLead
  } = useCRM();

  return (
    <div className="space-y-6">
      <CRMHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        onCreateNew={() => setShowLeadForm(true)}
      />

      <Tabs defaultValue="leads" className="space-y-6">
        <TabsList>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="demos">Demo Requests</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-6">
          <CRMStats leads={allLeads} />
          <LeadList
            leads={leads}
            isLoading={leadsLoading}
            onLeadSelect={setSelectedLead}
            onLeadEdit={setEditingLead}
            onLeadDelete={deleteLead}
          />
        </TabsContent>

        <TabsContent value="activities">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900">Activity Timeline</h3>
            <p className="text-gray-500">View and manage lead activities</p>
          </div>
        </TabsContent>

        <TabsContent value="demos">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900">Demo Requests</h3>
            <p className="text-gray-500">Manage scheduled demonstrations</p>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900">CRM Analytics</h3>
            <p className="text-gray-500">Performance metrics and insights</p>
          </div>
        </TabsContent>
      </Tabs>

      {showLeadForm && (
        <LeadForm
          lead={editingLead}
          onSubmit={editingLead ? updateLead : createLead}
          onCancel={() => {
            setShowLeadForm(false);
            setEditingLead(null);
          }}
          isSubmitting={isCreatingLead || isUpdatingLead}
        />
      )}
    </div>
  );
}