"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Search, AlertTriangle, Info } from "lucide-react";
import { pediatricDrugDB, type PediatricDrug } from "@/lib/pediatric-drug-database";

interface DosageResult {
  dosage: number;
  frequency: string;
  maxDailyDose?: number;
  warnings: string[];
  contraindications?: string[];
  sideEffects?: string[];
}

export default function PediaDose() {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [selectedMedication, setSelectedMedication] = useState("");
  const [dosageResult, setDosageResult] = useState<DosageResult | null>(null);
  const [medications, setMedications] = useState<PediatricDrug[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMedications, setFilteredMedications] = useState<PediatricDrug[]>([]);

  useEffect(() => {
    // Load common pediatric medications
    const commonMeds = pediatricDrugDB.getCommonPediatricDrugs();
    setMedications(commonMeds);
    setFilteredMedications(commonMeds);
  }, []);

  useEffect(() => {
    // Filter medications based on search query
    if (searchQuery.trim() === "") {
      setFilteredMedications(medications);
    } else {
      const filtered = pediatricDrugDB.searchDrugs(searchQuery);
      setFilteredMedications(filtered);
    }
  }, [searchQuery, medications]);

  const calculateDosage = () => {
    if (!weight || !age || !selectedMedication) {
      return;
    }

    const weightNum = parseFloat(weight);
    const ageNum = parseInt(age);
    
    const result = pediatricDrugDB.calculateDosage(selectedMedication, weightNum, ageNum);
    setDosageResult(result);
  };

  const getSelectedDrug = (): PediatricDrug | undefined => {
    return selectedMedication ? pediatricDrugDB.getDrugByName(selectedMedication) : undefined;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <h1 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12">
          Pedia-Dose
        </h1>
        <div className="flex w-12 items-center justify-end">
          <Button variant="ghost" size="icon" className="h-12 w-12 p-0">
            <Settings className="h-6 w-6 text-[#111518]" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pb-4">
        {/* Weight Input */}
        <div className="mb-4">
          <Input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="h-14 bg-[#f0f3f4] border-none placeholder:text-[#637988] text-base"
          />
        </div>

        {/* Age Input */}
        <div className="mb-4">
          <Input
            type="number"
            placeholder="Age (months)"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="h-14 bg-[#f0f3f4] border-none placeholder:text-[#637988] text-base"
          />
        </div>

        {/* Medication Selection */}
        <div className="mb-6">
          <h3 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em] mb-4">
            Medication
          </h3>
          
          {/* Search Input */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#637988]" />
            <Input
              placeholder="Search medications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 bg-[#f0f3f4] border-none placeholder:text-[#637988] text-base pl-10"
            />
          </div>

          <Select value={selectedMedication} onValueChange={setSelectedMedication}>
            <SelectTrigger className="h-14 bg-[#f0f3f4] border-none text-base">
              <SelectValue placeholder="Select Medication" />
            </SelectTrigger>
            <SelectContent className="max-h-64 overflow-y-auto">
              {filteredMedications.map((medication) => (
                <SelectItem key={medication.id} value={medication.name}>
                  <div>
                    <div className="font-medium">{medication.name}</div>
                    {medication.drugClass && (
                      <div className="text-xs text-[#637988]">{medication.drugClass}</div>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dosage Results */}
        {dosageResult && (
          <Card className="mb-6">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em]">
                Dosage
              </h3>
              
              {dosageResult.dosage > 0 ? (
                <>
                  <div className="text-center">
                    <p className="text-[#111518] text-base font-normal leading-normal">
                      Total Dosage: {dosageResult.dosage}mg
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-[#111518] text-base font-normal leading-normal">
                      Frequency: {dosageResult.frequency}
                    </p>
                  </div>

                  {dosageResult.maxDailyDose && (
                    <div className="text-center">
                      <p className="text-[#637988] text-sm font-normal leading-normal">
                        Maximum Daily Dose: {dosageResult.maxDailyDose}mg
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <p className="text-red-600 text-base font-normal leading-normal">
                    {dosageResult.warnings[0] || 'Unable to calculate dosage'}
                  </p>
                </div>
              )}

              {/* Warnings */}
              {dosageResult.warnings && dosageResult.warnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <div className="font-medium mb-1">Warnings:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {dosageResult.warnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Drug Information */}
              {getSelectedDrug() && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <div className="font-medium mb-1">Drug Information:</div>
                      
                      {getSelectedDrug()?.indications && getSelectedDrug()?.indications!.length > 0 && (
                        <div className="mb-2">
                          <div className="font-medium text-xs">Indications:</div>
                          <div className="text-xs">
                            {getSelectedDrug()?.indications?.slice(0, 2).join(', ')}
                            {getSelectedDrug()?.indications! && getSelectedDrug()?.indications!.length > 2 && '...'}
                          </div>
                        </div>
                      )}

                      {getSelectedDrug()?.dosageForm && getSelectedDrug()?.dosageForm!.length > 0 && (
                        <div className="mb-2">
                          <div className="font-medium text-xs">Available Forms:</div>
                          <div className="text-xs">
                            {getSelectedDrug()?.dosageForm?.slice(0, 2).join(', ')}
                            {getSelectedDrug()?.dosageForm! && getSelectedDrug()?.dosageForm!.length > 2 && '...'}
                          </div>
                        </div>
                      )}

                      {getSelectedDrug()?.specialNotes && getSelectedDrug()?.specialNotes!.length > 0 && (
                        <div>
                          <div className="font-medium text-xs">Special Notes:</div>
                          <div className="text-xs">
                            {getSelectedDrug()?.specialNotes?.[0]}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Contraindications */}
              {dosageResult.contraindications && dosageResult.contraindications.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-800">
                      <div className="font-medium mb-1">Contraindications:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {dosageResult.contraindications.slice(0, 3).map((contraindication, index) => (
                          <li key={index} className="text-xs">{contraindication}</li>
                        ))}
                        {dosageResult.contraindications.length > 3 && (
                          <li className="text-xs italic">+{dosageResult.contraindications.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Side Effects */}
              {dosageResult.sideEffects && dosageResult.sideEffects.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-orange-800">
                      <div className="font-medium mb-1">Potential Side Effects:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {dosageResult.sideEffects.slice(0, 3).map((sideEffect, index) => (
                          <li key={index} className="text-xs">{sideEffect}</li>
                        ))}
                        {dosageResult.sideEffects.length > 3 && (
                          <li className="text-xs italic">+{dosageResult.sideEffects.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Calculate Button */}
      <div className="p-4 pb-8">
        <Button 
          onClick={calculateDosage}
          disabled={!weight || !age || !selectedMedication}
          className="w-full h-12 bg-[#1994e6] hover:bg-[#1478cc] text-white text-base font-bold leading-normal tracking-[0.015em] rounded-xl"
        >
          Calculate
        </Button>
      </div>
    </div>
  );
}