import enhancedDrugDatabase from '@/webhound-pediatric_relevant_drug_from_nelson_textbook_of_pediatrics_enhanced.json';

export interface PediatricDrug {
  id: string;
  name: string;
  drugClass?: string;
  indications?: string[];
  recommendedDoses?: string[];
  dosageForm?: string[];
  route?: string[];
  frequency?: string[];
  maxDose?: string[];
  contraindications?: string[];
  sideEffects?: string[];
  specialNotes?: string[];
  sourceUrls?: string[];
}

export interface ParsedDosageInfo {
  dosagePerKg?: number;
  frequency?: string;
  maxDailyDose?: number;
  maxSingleDose?: number;
  ageRestrictions?: {
    min?: number; // in months
    max?: number; // in months
  };
  weightRestrictions?: {
    min?: number; // in kg
    max?: number; // in kg
  };
  warnings?: string[];
}

export class PediatricDrugDatabase {
  private drugs: PediatricDrug[] = [];
  private drugMap: Map<string, PediatricDrug> = new Map();

  constructor() {
    this.loadDatabase();
  }

  private loadDatabase() {
    try {
      const data = enhancedDrugDatabase as any;
      
      this.drugs = data.data.map((drug: any) => {
        const attributes = drug.attributes;
        return {
          id: drug.id,
          name: attributes["Drug Name"]?.value || '',
          drugClass: this.extractValue(attributes["Drug Class / Category"]),
          indications: this.extractValue(attributes["Indications in Pediatrics"]),
          recommendedDoses: this.extractValue(attributes["Recommended Pediatric Doses"]),
          dosageForm: this.extractValue(attributes["Dosage Form"]),
          route: this.extractValue(attributes["Route of Administration"]),
          frequency: this.extractValue(attributes["Frequency of Administration"]),
          maxDose: this.extractValue(attributes["Maximum Dose"]),
          contraindications: this.extractValue(attributes["Contraindications in Children"]),
          sideEffects: this.extractValue(attributes["Major Side Effects / Adverse Reactions"]),
          specialNotes: this.extractValue(attributes["Special Notes"]),
          sourceUrls: attributes["Drug Name"]?.source_urls || []
        };
      }).filter((drug: PediatricDrug) => drug.name && drug.name.trim() !== '');

      // Create map for quick lookup
      this.drugs.forEach(drug => {
        this.drugMap.set(drug.name.toLowerCase(), drug);
      });

      console.log(`Loaded ${this.drugs.length} pediatric medications into database`);
    } catch (error) {
      console.error('Error loading pediatric drug database:', error);
    }
  }

  private extractValue(field: any): string[] {
    if (!field || !field.value) return [];
    
    if (Array.isArray(field.value)) {
      return field.value.filter(v => v && v.trim() !== '');
    }
    
    if (typeof field.value === 'string' && field.value.trim() !== '') {
      return [field.value];
    }
    
    return [];
  }

  getAllDrugs(): PediatricDrug[] {
    return this.drugs.sort((a, b) => a.name.localeCompare(b.name));
  }

  getDrugByName(name: string): PediatricDrug | undefined {
    return this.drugMap.get(name.toLowerCase());
  }

  searchDrugs(query: string): PediatricDrug[] {
    const lowerQuery = query.toLowerCase();
    return this.drugs.filter(drug => 
      drug.name.toLowerCase().includes(lowerQuery) ||
      (drug.drugClass && drug.drugClass.toLowerCase().includes(lowerQuery)) ||
      (drug.indications && drug.indications.some(ind => ind.toLowerCase().includes(lowerQuery)))
    );
  }

  getCommonPediatricDrugs(): PediatricDrug[] {
    // List of commonly prescribed pediatric medications
    const commonDrugNames = [
      'Amoxicillin',
      'Ibuprofen', 
      'Acetaminophen',
      'Azithromycin',
      'Prednisolone',
      'Cephalexin',
      'Albuterol',
      'Amoxicillin and Clavulanate',
      'Cefdinir',
      'Ceftriaxone',
      'Diphenhydramine',
      'Loratadine',
      'Montelukast',
      'Fluticasone',
      'Ondansetron',
      'Ranitidine',
      'Hydrocortisone',
      'Methylphenidate',
      'Sertraline',
      'Fluoxetine'
    ];

    return commonDrugNames
      .map(name => this.getDrugByName(name))
      .filter((drug): drug is PediatricDrug => drug !== undefined);
  }

  parseDosageInfo(drug: PediatricDrug): ParsedDosageInfo {
    const dosageInfo: ParsedDosageInfo = {};

    if (!drug.recommendedDoses || drug.recommendedDoses.length === 0) {
      return dosageInfo;
    }

    // Parse dosage information from text
    drug.recommendedDoses.forEach(doseText => {
      // Extract mg/kg dosage
      const mgKgMatch = doseText.match(/(\d+(?:\.\d+)?)\s*mg\/kg/i);
      if (mgKgMatch) {
        dosageInfo.dosagePerKg = parseFloat(mgKgMatch[1]);
      }

      // Extract frequency
      const frequencyPatterns = [
        /every\s*(\d+)\s*hours?/i,
        /(\d+)\s*times?\s*daily/i,
        /once\s*daily/i,
        /twice\s*daily/i,
        /three\s*times?\s*daily/i,
        /four\s*times?\s*daily/i
      ];

      for (const pattern of frequencyPatterns) {
        const match = doseText.match(pattern);
        if (match) {
          if (match[1]) {
            dosageInfo.frequency = `Every ${match[1]} hours`;
          } else if (doseText.includes('once daily')) {
            dosageInfo.frequency = 'Once daily';
          } else if (doseText.includes('twice daily')) {
            dosageInfo.frequency = 'Every 12 hours';
          } else if (doseText.includes('three times')) {
            dosageInfo.frequency = 'Every 8 hours';
          } else if (doseText.includes('four times')) {
            dosageInfo.frequency = 'Every 6 hours';
          }
          break;
        }
      }

      // Extract maximum daily dose
      const maxDailyMatch = doseText.match(/maximum\s*(\d+(?:\.\d+)?)\s*mg/i);
      if (maxDailyMatch) {
        dosageInfo.maxDailyDose = parseFloat(maxDailyMatch[1]);
      }

      // Extract maximum single dose
      const maxSingleMatch = doseText.match(/maximum\s*single\s*dose[:\s]*(\d+(?:\.\d+)?)\s*mg/i);
      if (maxSingleMatch) {
        dosageInfo.maxSingleDose = parseFloat(maxSingleMatch[1]);
      }

      // Extract age restrictions
      const agePatterns = [
        /children?\s*(under|over|more\s*than)\s*(\d+)\s*(months?|years?)/i,
        /(\d+)\s*(months?|years?)\s*(and\s*older|older)/i,
        /children?\s*(\d+)\s*months?\s*to\s*(\d+)\s*years?/i
      ];

      for (const pattern of agePatterns) {
        const match = doseText.match(pattern);
        if (match) {
          const age = parseInt(match[2]);
          const unit = match[3].toLowerCase();
          
          if (!dosageInfo.ageRestrictions) {
            dosageInfo.ageRestrictions = {};
          }

          if (unit.includes('month')) {
            if (match[1]?.includes('over') || match[4]?.includes('older')) {
              dosageInfo.ageRestrictions.min = age;
            } else if (match[1]?.includes('under')) {
              dosageInfo.ageRestrictions.max = age;
            }
          }
        }
      }
    });

    // Parse maximum dose information
    if (drug.maxDose && drug.maxDose.length > 0) {
      drug.maxDose.forEach(maxText => {
        const maxDailyMatch = maxText.match(/(\d+(?:\.\d+)?)\s*mg/i);
        if (maxDailyMatch && !dosageInfo.maxDailyDose) {
          dosageInfo.maxDailyDose = parseFloat(maxDailyMatch[1]);
        }
      });
    }

    return dosageInfo;
  }

  calculateDosage(drugName: string, weight: number, age: number): {
    dosage: number;
    frequency: string;
    maxDailyDose?: number;
    warnings: string[];
    contraindications?: string[];
    sideEffects?: string[];
  } {
    const drug = this.getDrugByName(drugName);
    const warnings: string[] = [];

    if (!drug) {
      return {
        dosage: 0,
        frequency: '',
        warnings: ['Drug not found in database']
      };
    }

    const dosageInfo = this.parseDosageInfo(drug);

    // Check if we have dosage information
    if (!dosageInfo.dosagePerKg) {
      return {
        dosage: 0,
        frequency: '',
        warnings: ['No dosage information available for this medication']
      };
    }

    // Calculate dosage
    let dosage = weight * dosageInfo.dosagePerKg;

    // Check age restrictions
    if (dosageInfo.ageRestrictions) {
      if (dosageInfo.ageRestrictions.min && age < dosageInfo.ageRestrictions.min) {
        warnings.push(`This medication is not recommended for children under ${dosageInfo.ageRestrictions.min} months.`);
      }
      if (dosageInfo.ageRestrictions.max && age > dosageInfo.ageRestrictions.max) {
        warnings.push(`This medication is not recommended for children over ${dosageInfo.ageRestrictions.max} months.`);
      }
    }

    // Check maximum single dose
    if (dosageInfo.maxSingleDose && dosage > dosageInfo.maxSingleDose) {
      dosage = dosageInfo.maxSingleDose;
      warnings.push(`Calculated dose exceeds maximum single dose. Using maximum: ${dosageInfo.maxSingleDose}mg.`);
    }

    // Check maximum daily dose
    if (dosageInfo.maxDailyDose) {
      const dailyDosage = dosage * (this.getDailyMultiplier(dosageInfo.frequency) || 1);
      if (dailyDosage > dosageInfo.maxDailyDose) {
        warnings.push(`Warning: Daily dosage exceeds maximum recommended dose of ${dosageInfo.maxDailyDose}mg.`);
      }
    }

    return {
      dosage: Math.round(dosage * 10) / 10, // Round to 1 decimal place
      frequency: dosageInfo.frequency || 'As directed',
      maxDailyDose: dosageInfo.maxDailyDose,
      warnings,
      contraindications: drug.contraindications,
      sideEffects: drug.sideEffects
    };
  }

  private getDailyMultiplier(frequency?: string): number {
    if (!frequency) return 1;
    
    if (frequency.includes('4 hours')) return 6;
    if (frequency.includes('6 hours')) return 4;
    if (frequency.includes('8 hours')) return 3;
    if (frequency.includes('12 hours')) return 2;
    if (frequency.includes('once daily') || frequency.includes('daily')) return 1;
    if (frequency.includes('twice daily')) return 2;
    if (frequency.includes('three times')) return 3;
    if (frequency.includes('four times')) return 4;
    
    return 1;
  }

  // Check for contraindications based on patient conditions
  checkContraindications(drugName: string, patientConditions: string[]): string[] {
    const drug = this.getDrugByName(drugName);
    if (!drug || !drug.contraindications) return [];

    return drug.contraindications.filter(contraindication =>
      patientConditions.some(condition =>
        contraindication.toLowerCase().includes(condition.toLowerCase())
      )
    );
  }

  // Get special considerations for a drug
  getSpecialConsiderations(drugName: string): string[] {
    const drug = this.getDrugByName(drugName);
    if (!drug) return [];

    const considerations: string[] = [];
    
    if (drug.specialNotes) {
      considerations.push(...drug.specialNotes);
    }
    
    if (drug.sideEffects) {
      considerations.push(`Monitor for: ${drug.sideEffects.slice(0, 3).join(', ')}`);
    }
    
    return considerations;
  }
}

// Export singleton instance
export const pediatricDrugDB = new PediatricDrugDatabase();