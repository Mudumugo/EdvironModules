import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  KENYAN_COUNTIES, 
  getAllCountyNames, 
  getConstituenciesByCounty, 
  getWardsByConstituency 
} from "@shared/data/kenya-locations";

interface LocationSelectorProps {
  onLocationChange: (location: {
    county: string;
    constituency: string;
    ward: string;
  }) => void;
  defaultCounty?: string;
  defaultConstituency?: string;
  defaultWard?: string;
  showWards?: boolean;
  required?: boolean;
  className?: string;
}

export function LocationSelector({
  onLocationChange,
  defaultCounty = "",
  defaultConstituency = "",
  defaultWard = "",
  showWards = true,
  required = false,
  className = ""
}: LocationSelectorProps) {
  const [selectedCounty, setSelectedCounty] = useState(defaultCounty);
  const [selectedConstituency, setSelectedConstituency] = useState(defaultConstituency);
  const [selectedWard, setSelectedWard] = useState(defaultWard);

  const counties = getAllCountyNames();
  const constituencies = selectedCounty ? getConstituenciesByCounty(selectedCounty) : [];
  const wards = selectedCounty && selectedConstituency 
    ? getWardsByConstituency(selectedCounty, selectedConstituency) 
    : [];

  useEffect(() => {
    onLocationChange({
      county: selectedCounty,
      constituency: selectedConstituency,
      ward: selectedWard
    });
  }, [selectedCounty, selectedConstituency, selectedWard, onLocationChange]);

  const handleCountyChange = (county: string) => {
    setSelectedCounty(county);
    setSelectedConstituency("");
    setSelectedWard("");
  };

  const handleConstituencyChange = (constituency: string) => {
    setSelectedConstituency(constituency);
    setSelectedWard("");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Label htmlFor="county">
          County {required && <span className="text-red-500">*</span>}
        </Label>
        <Select value={selectedCounty} onValueChange={handleCountyChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select county" />
          </SelectTrigger>
          <SelectContent>
            {counties.map((county) => (
              <SelectItem key={county} value={county}>
                {county}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCounty && (
        <div>
          <Label htmlFor="constituency">
            Constituency {required && <span className="text-red-500">*</span>}
          </Label>
          <Select value={selectedConstituency} onValueChange={handleConstituencyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select constituency" />
            </SelectTrigger>
            <SelectContent>
              {constituencies.map((constituency) => (
                <SelectItem key={constituency} value={constituency}>
                  {constituency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {showWards && selectedCounty && selectedConstituency && (
        <div>
          <Label htmlFor="ward">
            Ward {required && <span className="text-red-500">*</span>}
          </Label>
          <Select value={selectedWard} onValueChange={setSelectedWard}>
            <SelectTrigger>
              <SelectValue placeholder="Select ward" />
            </SelectTrigger>
            <SelectContent>
              {wards.map((ward) => (
                <SelectItem key={ward} value={ward}>
                  {ward}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}