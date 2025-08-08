"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

interface Medication {
  id: string;
  name: string;
  dosagePerKg: number;
  frequency: string;
  maxDailyDose?: number;
  minAge?: number;
  maxAge?: number;
}

const medications: Medication[] = [
  {
    id: "amoxicillin",
    name: "Amoxicillin",
    dosagePerKg: 25,
    frequency: "Every 8 hours",
    maxDailyDose: 2000,
    minAge: 0,
    maxAge: 216
  },
  {
    id: "ibuprofen",
    name: "Ibuprofen",
    dosagePerKg: 5,
    frequency: "Every 6 hours",
    maxDailyDose: 1200,
    minAge: 6,
    maxAge: 216
  },
  {
    id: "acetaminophen",
    name: "Acetaminophen",
    dosagePerKg: 15,
    frequency: "Every 4 hours",
    maxDailyDose: 3000,
    minAge: 0,
    maxAge: 216
  },
  {
    id: "azithromycin",
    name: "Azithromycin",
    dosagePerKg: 10,
    frequency: "Once daily",
    maxDailyDose: 500,
    minAge: 6,
    maxAge: 216
  },
  {
    id: "prednisolone",
    name: "Prednisolone",
    dosagePerKg: 1,
    frequency: "Once daily",
    maxDailyDose: 60,
    minAge: 0,
    maxAge: 216
  }
];

interface DosageResult {
  recommendedDosage: number;
  totalDosage: number;
  frequency: string;
  maxDailyDose?: number;
  warning?: string;
}

export default function PediaDose() {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [selectedMedication, setSelectedMedication] = useState("");
  const [dosageResult, setDosageResult] = useState<DosageResult | null>(null);

  const calculateDosage = () => {
    if (!weight || !age || !selectedMedication) {
      return;
    }

    const weightNum = parseFloat(weight);
    const ageNum = parseInt(age);
    const medication = medications.find(med => med.id === selectedMedication);

    if (!medication) {
      return;
    }

    // Check age restrictions
    if (medication.minAge && ageNum < medication.minAge) {
      setDosageResult({
        recommendedDosage: medication.dosagePerKg,
        totalDosage: 0,
        frequency: medication.frequency,
        warning: `This medication is not recommended for children under ${medication.minAge} months.`
      });
      return;
    }

    if (medication.maxAge && ageNum > medication.maxAge) {
      setDosageResult({
        recommendedDosage: medication.dosagePerKg,
        totalDosage: 0,
        frequency: medication.frequency,
        warning: `This medication is not recommended for children over ${medication.maxAge} months.`
      });
      return;
    }

    const totalDosage = weightNum * medication.dosagePerKg;
    
    // Check maximum daily dose
    let warning = "";
    if (medication.maxDailyDose && totalDosage > medication.maxDailyDose) {
      warning = `Warning: Calculated dose exceeds maximum daily dose of ${medication.maxDailyDose}mg. Please consult a healthcare provider.`;
    }

    setDosageResult({
      recommendedDosage: medication.dosagePerKg,
      totalDosage: Math.round(totalDosage * 10) / 10,
      frequency: medication.frequency,
      maxDailyDose: medication.maxDailyDose,
      warning: warning || undefined
    });
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
          <Select value={selectedMedication} onValueChange={setSelectedMedication}>
            <SelectTrigger className="h-14 bg-[#f0f3f4] border-none text-base">
              <SelectValue placeholder="Select Medication" />
            </SelectTrigger>
            <SelectContent>
              {medications.map((medication) => (
                <SelectItem key={medication.id} value={medication.id}>
                  {medication.name}
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
              
              <div className="text-center">
                <p className="text-[#111518] text-base font-normal leading-normal">
                  Recommended Dosage: {dosageResult.recommendedDosage}mg/kg
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-[#111518] text-base font-normal leading-normal">
                  Total Dosage: {dosageResult.totalDosage}mg
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

              {dosageResult.warning && (
                <div className="text-center">
                  <p className="text-red-600 text-sm font-normal leading-normal">
                    {dosageResult.warning}
                  </p>
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