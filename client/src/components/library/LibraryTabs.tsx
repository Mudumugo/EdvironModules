import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  User
} from "lucide-react";

interface LibraryBorrowing {
  id: number;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;
  status: string;
  renewalCount: number;
  maxRenewals: number;
  resource: {
    id: number;
    title: string;
    author?: string;
    type: string;
    thumbnailUrl?: string;
  };
}

interface LibraryReservation {
  id: number;
  reservedAt: string;
  expiresAt: string;
  status: string;
  priority: number;
  resource: {
    id: number;
    title: string;
    author?: string;
    type: string;
    thumbnailUrl?: string;
    availableCopies: number;
  };
}

interface LibraryTabsProps {
  borrowings: LibraryBorrowing[];
  reservations: LibraryReservation[];
  onReturnBook?: (borrowingId: number) => void;
  onRenewBook?: (borrowingId: number) => void;
  onCancelReservation?: (reservationId: number) => void;
}

export function LibraryTabs({
  borrowings,
  reservations,
  onReturnBook,
  onRenewBook,
  onCancelReservation
}: LibraryTabsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "overdue": return "bg-red-100 text-red-800";
      case "due-soon": return "bg-yellow-100 text-yellow-800";
      case "returned": return "bg-gray-100 text-gray-800";
      case "pending": return "bg-blue-100 text-blue-800";
      case "ready": return "bg-green-100 text-green-800";
      case "expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Tabs defaultValue="borrowed" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="borrowed" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Borrowed ({borrowings.length})
        </TabsTrigger>
        <TabsTrigger value="reserved" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Reserved ({reservations.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="borrowed" className="space-y-4">
        {borrowings.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No borrowed items</p>
            </CardContent>
          </Card>
        ) : (
          borrowings.map((borrowing) => {
            const daysUntilDue = getDaysUntilDue(borrowing.dueDate);
            const isOverdue = daysUntilDue < 0;
            const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;
            
            return (
              <Card key={borrowing.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {borrowing.resource.thumbnailUrl ? (
                        <img
                          src={borrowing.resource.thumbnailUrl}
                          alt={borrowing.resource.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-16 bg-gray-100 rounded flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg">{borrowing.resource.title}</CardTitle>
                        {borrowing.resource.author && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <User className="h-3 w-3" />
                            {borrowing.resource.author}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{borrowing.resource.type}</Badge>
                          <Badge className={getStatusColor(borrowing.status)}>
                            {borrowing.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Borrowed</p>
                        <p className="text-muted-foreground">{formatDate(borrowing.borrowedAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Due Date</p>
                        <p className={`${isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                          {formatDate(borrowing.dueDate)}
                          {isOverdue && ` (${Math.abs(daysUntilDue)} days overdue)`}
                          {isDueSoon && !isOverdue && ` (${daysUntilDue} days left)`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Renewals: {borrowing.renewalCount}/{borrowing.maxRenewals}
                    </div>
                    <div className="flex gap-2">
                      {borrowing.status === "active" && borrowing.renewalCount < borrowing.maxRenewals && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRenewBook?.(borrowing.id)}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Renew
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => onReturnBook?.(borrowing.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Return
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </TabsContent>

      <TabsContent value="reserved" className="space-y-4">
        {reservations.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No reservations</p>
            </CardContent>
          </Card>
        ) : (
          reservations.map((reservation) => (
            <Card key={reservation.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {reservation.resource.thumbnailUrl ? (
                      <img
                        src={reservation.resource.thumbnailUrl}
                        alt={reservation.resource.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-gray-100 rounded flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-lg">{reservation.resource.title}</CardTitle>
                      {reservation.resource.author && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <User className="h-3 w-3" />
                          {reservation.resource.author}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{reservation.resource.type}</Badge>
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status}
                        </Badge>
                        <Badge variant="outline">
                          Priority #{reservation.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Reserved</p>
                      <p className="text-muted-foreground">{formatDate(reservation.reservedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Expires</p>
                      <p className="text-muted-foreground">{formatDate(reservation.expiresAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Available copies: {reservation.resource.availableCopies}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCancelReservation?.(reservation.id)}
                  >
                    Cancel Reservation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>
    </Tabs>
  );
}