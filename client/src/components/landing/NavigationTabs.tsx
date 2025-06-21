import { Button } from "@/components/ui/button";

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navigationTabs: string[];
}

export function NavigationTabs({ activeTab, setActiveTab, navigationTabs }: NavigationTabsProps) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto">
          {navigationTabs.map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              className={`
                whitespace-nowrap px-6 py-3 text-sm font-medium rounded-none border-b-2 transition-all duration-200
                ${activeTab === tab 
                  ? "border-blue-500 text-blue-600 bg-blue-50" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}