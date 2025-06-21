import { useSecurityCallSystem } from "@/hooks/useSecurityCallSystem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Phone, PhoneCall, PhoneOff, Clock, AlertTriangle, Volume2 } from "lucide-react";

export default function SecurityCallSystem() {
  const {
    activeCall,
    currentIncident,
    isDialPadOpen,
    dialNumber,
    callHistory,
    isRecording,
    isMuted,
    callVolume,
    contacts,
    incidents,
    incidentTypes,
    severityLevels,
    contactsLoading,
    incidentsLoading,
    isStartingCall,
    isEndingCall,
    startCall,
    endCall,
    toggleMute,
    adjustVolume,
    toggleRecording,
    setIsDialPadOpen,
    dialDigit,
    clearDialNumber,
    dialEmergencyNumber,
    triggerEmergencyAlert,
    callAllContacts,
    sendEmergencyMessage,
    getContactAvailability,
    hasActiveCall,
    activeIncidentsCount,
    availableContactsCount,
    emergencyContacts,
    formatCallDuration
  } = useSecurityCallSystem();

  if (contactsLoading || incidentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Call System</h1>
          <p className="text-gray-600">Emergency communication and incident management</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant={activeIncidentsCount > 0 ? "destructive" : "secondary"}>
            {activeIncidentsCount} Active Incidents
          </Badge>
          <Badge variant="outline">
            {availableContactsCount} Contacts Available
          </Badge>
        </div>
      </div>

      {/* Active Call Interface */}
      {hasActiveCall && activeCall && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <PhoneCall className="h-5 w-5" />
              <span>Active Call</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium">Connected to Emergency Contact</p>
                <p className="text-sm text-gray-600">Duration: {formatCallDuration(120)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={isMuted ? "destructive" : "outline"}
                  size="sm"
                  onClick={toggleMute}
                >
                  {isMuted ? "Unmute" : "Mute"}
                </Button>
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  onClick={toggleRecording}
                >
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={endCall}
                  disabled={isEndingCall}
                >
                  <PhoneOff className="h-4 w-4 mr-1" />
                  End Call
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Volume2 className="h-4 w-4" />
              <input
                type="range"
                min="0"
                max="100"
                value={callVolume}
                onChange={(e) => adjustVolume(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm">{callVolume}%</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {incidentTypes.map((type) => (
          <Button
            key={type.value}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-red-50 hover:border-red-300"
            onClick={() => triggerEmergencyAlert(type.value as any)}
          >
            <AlertTriangle className={`h-6 w-6 text-${type.color}-600`} />
            <span className="text-sm font-medium">{type.label}</span>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Emergency Contacts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emergencyContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.role}</p>
                    <p className="text-sm text-gray-500">{contact.phone}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={getContactAvailability(contact.id) ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {getContactAvailability(contact.id) ? "Available" : "Busy"}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => startCall(contact.id)}
                      disabled={isStartingCall || hasActiveCall}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t flex space-x-2">
              <Button 
                onClick={callAllContacts}
                disabled={hasActiveCall}
                className="flex-1"
              >
                Call All Contacts
              </Button>
              <Button 
                variant="outline"
                onClick={() => sendEmergencyMessage("Emergency assistance required")}
                className="flex-1"
              >
                Send Alert Message
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Recent Incidents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {incidents.slice(0, 5).map((incident) => (
                <div key={incident.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium">{incident.title}</p>
                    <Badge 
                      variant={incident.severity === 'critical' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {incident.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{incident.location}</span>
                    <span>{new Date(incident.reportedAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dial Pad Modal */}
      <Dialog open={isDialPadOpen} onOpenChange={setIsDialPadOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="fixed bottom-6 right-6">
            <Phone className="h-5 w-5 mr-2" />
            Dial
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Emergency Dial Pad</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Input
              value={dialNumber}
              readOnly
              placeholder="Enter number..."
              className="text-center text-lg"
            />
            
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                <Button
                  key={digit}
                  variant="outline"
                  size="lg"
                  onClick={() => dialDigit(digit)}
                  className="h-12"
                >
                  {digit}
                </Button>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={clearDialNumber} variant="outline" className="flex-1">
                Clear
              </Button>
              <Button 
                onClick={() => dialEmergencyNumber(dialNumber)}
                disabled={!dialNumber}
                className="flex-1"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">Quick Dial:</p>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => dialEmergencyNumber("999")}
                  className="text-red-600"
                >
                  999 - Police
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => dialEmergencyNumber("911")}
                  className="text-red-600"
                >
                  911 - Emergency
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => dialEmergencyNumber("100")}
                  className="text-red-600"
                >
                  100 - Fire
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}