import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContactOption } from "./types";

interface ContactSupportProps {
  contactOptions: ContactOption[];
  onContactSelect: (option: ContactOption) => void;
}

export function ContactSupport({ contactOptions, onContactSelect }: ContactSupportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Support</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contactOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{option.title}</h4>
                    <p className="text-sm text-gray-600">{option.description}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {option.availability}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onContactSelect(option)}
                >
                  {option.action}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}