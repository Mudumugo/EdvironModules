import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Download, Settings } from "lucide-react";

interface ExtensionTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  installedExtensions: any[];
}

export function ExtensionTabs({ activeTab, setActiveTab, installedExtensions }: ExtensionTabsProps) {
  const tabs = [
    {
      id: 'browse',
      name: 'Browse Extensions',
      icon: Download,
      description: 'Discover new extensions',
      count: null
    },
    {
      id: 'installed',
      name: 'Installed Extensions',
      icon: Phone,
      description: 'Manage your extensions',
      count: installedExtensions.length
    },
    {
      id: 'settings',
      name: 'Global Settings',
      icon: Settings,
      description: 'System preferences',
      count: null
    }
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-0">
        <div className="flex border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant="ghost"
                className={`flex-1 h-auto p-6 rounded-none border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.name}</span>
                    {tab.count !== null && (
                      <Badge variant="secondary" className="ml-2">
                        {tab.count}
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{tab.description}</span>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}