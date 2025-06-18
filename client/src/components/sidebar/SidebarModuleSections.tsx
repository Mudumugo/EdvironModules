import { 
  BookOpen,
  Presentation,
  School,
  Monitor,
  Shield
} from "lucide-react";
import { SidebarModuleSection } from "./SidebarModuleSection";

interface ModulesByCategory {
  core: any[];
  educational: any[];
  administrative: any[];
  technical: any[];
  security: any[];
}

interface SidebarModuleSectionsProps {
  modulesByCategory: ModulesByCategory;
  onClose?: () => void;
}

export function SidebarModuleSections({ modulesByCategory, onClose }: SidebarModuleSectionsProps) {
  return (
    <>
      {/* Core Modules */}
      <SidebarModuleSection
        title="ESSENTIALS"
        modules={modulesByCategory.core}
        sectionIcon={BookOpen}
        onClose={onClose}
      />
      
      {/* Educational Modules */}
      <SidebarModuleSection
        title="TEACHING"
        modules={modulesByCategory.educational}
        sectionIcon={Presentation}
        onClose={onClose}
      />
      
      {/* Administrative Modules */}
      <SidebarModuleSection
        title="ADMINISTRATION"
        modules={modulesByCategory.administrative}
        sectionIcon={School}
        onClose={onClose}
      />
      
      {/* Technical Modules */}
      <SidebarModuleSection
        title="TECHNICAL"
        modules={modulesByCategory.technical}
        sectionIcon={Monitor}
        onClose={onClose}
      />
      
      {/* Security Modules */}
      <SidebarModuleSection
        title="SECURITY"
        modules={modulesByCategory.security}
        sectionIcon={Shield}
        onClose={onClose}
      />
    </>
  );
}