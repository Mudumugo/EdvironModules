import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useCommunications } from "@/hooks/useCommunications";
import { CommunicationsHeader } from "@/components/communications/CommunicationsHeader";
import { CommunicationForm } from "@/components/communications/CommunicationForm";
import { CommunicationList } from "@/components/communications/CommunicationList";
import { CommunicationStats } from "@/components/communications/CommunicationStats";
import { CommunicationDetails } from "@/components/communications/CommunicationDetails";

export default function CommunicationsPage() {
  const { user } = useAuth();
  const {
    activeView,
    setActiveView,
    selectedCommunication,
    setSelectedCommunication,
    showCreateDialog,
    setShowCreateDialog,
    showDetailsDialog,
    setShowDetailsDialog,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    searchTerm,
    setSearchTerm,
    communications,
    allCommunications,
    isLoading,
    createCommunication,
    updateCommunication,
    deleteCommunication,
    sendCommunication,
    isCreating,
    isUpdating,
    isDeleting,
    isSending
  } = useCommunications();

  return (
    <div className="space-y-6">
      <CommunicationsHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        onCreateNew={() => setShowCreateDialog(true)}
      />

      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value={activeView} className="space-y-6">
          <CommunicationStats communications={allCommunications} />
          <CommunicationList
            communications={communications}
            isLoading={isLoading}
            onCommunicationSelect={(comm) => {
              setSelectedCommunication(comm);
              setShowDetailsDialog(true);
            }}
            onSend={sendCommunication}
            onDelete={deleteCommunication}
            isSending={isSending}
            isDeleting={isDeleting}
          />
        </TabsContent>
      </Tabs>

      {showCreateDialog && (
        <CommunicationForm
          onSubmit={createCommunication}
          onCancel={() => setShowCreateDialog(false)}
          isSubmitting={isCreating}
        />
      )}

      {showDetailsDialog && selectedCommunication && (
        <CommunicationDetails
          communication={selectedCommunication}
          onClose={() => setShowDetailsDialog(false)}
          onEdit={(comm) => {
            setSelectedCommunication(comm);
            setShowCreateDialog(true);
            setShowDetailsDialog(false);
          }}
          onSend={sendCommunication}
          onDelete={deleteCommunication}
        />
      )}
    </div>
  );
}