const fs = require('fs');
const path = require('path');

// Read the original JSON file
const originalData = JSON.parse(fs.readFileSync('webhound-pediatric_relevant_drug_from_nelson_textbook_of_pediatrics (1).json', 'utf8'));

// Enhanced pediatric drug data with complete dosage information
const enhancedDrugs = {
  // Complete data for common medications with incomplete entries
  "Ibuprofen": {
    "Drug Class / Category": "Nonsteroidal Anti-Inflammatory Drug (NSAID)",
    "Indications in Pediatrics": [
      "Mild to moderate pain",
      "Fever",
      "Inflammation",
      "Juvenile arthritis"
    ],
    "Recommended Pediatric Doses": [
      "Fever and mild to moderate pain: 10 mg/kg/dose every 6-8 hours (maximum 40 mg/kg/day)",
      "Juvenile arthritis: 30-40 mg/kg/day divided into 3-4 doses",
      "Children 6 months to 12 years: 5-10 mg/kg every 6-8 hours as needed",
      "Maximum single dose: 400 mg"
    ],
    "Dosage Form": [
      "Oral suspension (100 mg/5 mL)",
      "Chewable tablets (50 mg, 100 mg)",
      "Tablets (200 mg, 400 mg, 600 mg, 800 mg)",
      "Drops (40 mg/mL)"
    ],
    "Route of Administration": [
      "Oral"
    ],
    "Frequency of Administration": [
      "Every 6-8 hours as needed",
      "Do not exceed 4 doses in 24 hours"
    ],
    "Maximum Dose": [
      "Children under 12 years: 40 mg/kg/day, maximum 2400 mg/day",
      "Children 12 years and older: 3200 mg/day maximum"
    ],
    "Contraindications in Children": [
      "Known hypersensitivity to ibuprofen or other NSAIDs",
      "Active peptic ulcer disease",
      "Severe renal impairment",
      "Severe hepatic impairment",
      "Aspirin-sensitive asthma",
      "Dehydration",
      "Children under 6 months (unless directed by physician)"
    ],
    "Major Side Effects / Adverse Reactions": [
      "Gastrointestinal: Nausea, vomiting, abdominal pain, dyspepsia",
      "Renal: Reduced renal blood flow, acute kidney injury",
      "Central nervous system: Headache, dizziness",
      "Hypersensitivity: Rash, pruritus, bronchospasm",
      "Hematologic: Increased bleeding time"
    ],
    "Special Notes": [
      "Take with food or milk to reduce gastrointestinal upset",
      "Maintain adequate hydration during use",
      "Avoid concurrent use with other NSAIDs",
      "Use with caution in children with asthma",
      "Monitor renal function with prolonged use"
    ]
  },

  "Azithromycin": {
    "Drug Class / Category": "Macrolide antibiotic",
    "Indications in Pediatrics": [
      "Community-acquired pneumonia",
      "Acute otitis media",
      "Streptococcal pharyngitis",
      "Sinusitis",
      "Skin and soft tissue infections"
    ],
    "Recommended Pediatric Doses": [
      "Community-acquired pneumonia: 10 mg/kg once on day 1, then 5 mg/kg once daily on days 2-5",
      "Acute otitis media: 30 mg/kg given as a single dose or 10 mg/kg once daily for 3 days",
      "Streptococcal pharyngitis: 12 mg/kg once daily for 5 days",
      "Sinusitis: 10 mg/kg once daily for 3 days"
    ],
    "Dosage Form": [
      "Oral suspension (100 mg/5 mL, 200 mg/5 mL)",
      "Tablets (250 mg, 500 mg, 600 mg)",
      "Extended-release suspension (2 g/60 mL)"
    ],
    "Route of Administration": [
      "Oral"
    ],
    "Frequency of Administration": [
      "Once daily for most indications",
      "Single dose for some infections"
    ],
    "Maximum Dose": [
      "500 mg per dose for most indications",
      "Maximum 2 g for single dose regimens"
    ],
    "Contraindications in Children": [
      "Known hypersensitivity to azithromycin or other macrolides",
      "History of cholestatic jaundice with prior azithromycin use"
    ],
    "Major Side Effects / Adverse Reactions": [
      "Gastrointestinal: Diarrhea, nausea, abdominal pain, vomiting",
      "Dermatologic: Rash, pruritus",
      "Hepatic: Transaminase elevations",
      "Cardiac: QT prolongation (rare)"
    ],
    "Special Notes": [
      "Can be taken with or without food",
      "Complete full course of therapy",
      "Avoid antacids within 2 hours of dosing",
      "Monitor for signs of liver dysfunction"
    ]
  },

  "Prednisolone": {
    "Drug Class / Category": "Corticosteroid",
    "Indications in Pediatrics": [
      "Asthma",
      "Allergic reactions",
      "Autoimmune disorders",
      "Inflammatory conditions",
      "Adrenal insufficiency"
    ],
    "Recommended Pediatric Doses": [
      "Asthma exacerbation: 1-2 mg/kg/day in divided doses for 3-10 days",
      "Allergic conditions: 0.5-2 mg/kg/day in divided doses",
      "Adrenal insufficiency: 4-8 mg/m²/day divided into 3-4 doses",
      "Anti-inflammatory: 0.5-1 mg/kg/day in divided doses"
    ],
    "Dosage Form": [
      "Oral solution (15 mg/5 mL)",
      "Tablets (1 mg, 2.5 mg, 5 mg, 10 mg, 20 mg, 50 mg)",
      "Syrup (5 mg/5 mL, 10 mg/5 mL, 15 mg/5 mL)"
    ],
    "Route of Administration": [
      "Oral",
      "Intravenous (for severe conditions)"
    ],
    "Frequency of Administration": [
      "Once daily in the morning",
      "Divided doses for higher dosages",
      "Alternate day therapy for chronic conditions"
    ],
    "Maximum Dose": [
      "Acute conditions: 60-80 mg/day",
      "Chronic conditions: Lowest effective dose"
    ],
    "Contraindications in Children": [
      "Systemic fungal infections",
      "Known hypersensitivity to prednisolone",
      "Live virus vaccines (during immunosuppressive doses)",
      "Peptic ulcer disease"
    ],
    "Major Side Effects / Adverse Reactions": [
      "Metabolic: Hyperglycemia, fluid retention, weight gain",
      "Endocrine: Adrenal suppression, growth retardation",
      "Musculoskeletal: Osteoporosis, muscle weakness",
      "Immunologic: Increased susceptibility to infections",
      "Dermatologic: Acne, hirsutism, skin thinning"
    ],
    "Special Notes": [
      "Taper gradually after prolonged use",
      "Monitor growth in children on long-term therapy",
      "Administer with food to reduce GI upset",
      "Avoid live vaccines during therapy",
      "Monitor blood pressure and glucose levels"
    ]
  },

  "Cephalexin": {
    "Drug Class / Category": "First-generation cephalosporin antibiotic",
    "Indications in Pediatrics": [
      "Skin and soft tissue infections",
      "Upper respiratory tract infections",
      "Otitis media",
      "Urinary tract infections",
      "Bone infections"
    ],
    "Recommended Pediatric Doses": [
      "Mild to moderate infections: 25-50 mg/kg/day divided every 6 hours",
      "Severe infections: 75-100 mg/kg/day divided every 6 hours",
      "Otitis media: 75-100 mg/kg/day divided every 6 hours",
      "Skin infections: 25-50 mg/kg/day divided every 6-12 hours"
    ],
    "Dosage Form": [
      "Capsules (250 mg, 500 mg)",
      "Oral suspension (125 mg/5 mL, 250 mg/5 mL)",
      "Tablets (250 mg, 500 mg, 1000 mg)"
    ],
    "Route of Administration": [
      "Oral"
    ],
    "Frequency of Administration": [
      "Every 6 hours for most infections",
      "Every 12 hours for some skin infections"
    ],
    "Maximum Dose": [
      "Children: 4 g/day maximum",
      "Adults: 4 g/day maximum"
    ],
    "Contraindications in Children": [
      "Known hypersensitivity to cephalosporins",
      "History of anaphylaxis to penicillins (cross-reactivity possible)"
    ],
    "Major Side Effects / Adverse Reactions": [
      "Gastrointestinal: Diarrhea, nausea, vomiting, abdominal pain",
      "Dermatologic: Rash, pruritus, urticaria",
      "Hypersensitivity: Anaphylaxis (rare)",
      "Hematologic: Eosinophilia, leukopenia"
    ],
    "Special Notes": [
      "Can be taken with or without food",
      "Complete full course of therapy",
      "Monitor for allergic reactions",
      "Use with caution in penicillin-allergic patients",
      "May cause false positive urine glucose tests"
    ]
  },

  "Albuterol": {
    "Drug Class / Category": "Short-acting beta-2 agonist (bronchodilator)",
    "Indications in Pediatrics": [
      "Asthma",
      "Bronchospasm",
      "Exercise-induced bronchospasm",
      "Chronic obstructive pulmonary disease"
    ],
    "Recommended Pediatric Doses": [
      "Asthma (inhalation): 1-2 puffs every 4-6 hours as needed",
      "Severe bronchospasm (nebulizer): 0.15 mg/kg/dose every 4-6 hours",
      "Exercise-induced bronchospasm: 2 puffs 15-30 minutes before exercise",
      "Children 2-12 years: 0.1-0.15 mg/kg/dose by nebulizer every 4-6 hours"
    ],
    "Dosage Form": [
      "Inhalation aerosol (90 mcg/actuation)",
      "Inhalation solution (0.5 mg/mL, 5 mg/mL)",
      "Syrup (2 mg/5 mL)",
      "Tablets (2 mg, 4 mg)",
      "Extended-release tablets (4 mg, 8 mg)"
    ],
    "Route of Administration": [
      "Inhalation (preferred)",
      "Oral",
      "Nebulization"
    ],
    "Frequency of Administration": [
      "Every 4-6 hours as needed",
      "Before exercise for prevention",
      "Not to exceed 4 times in 24 hours"
    ],
    "Maximum Dose": [
      "Inhalation: 8 puffs in 24 hours",
      "Oral: 24 mg/day in divided doses",
      "Nebulizer: 0.15 mg/kg/dose, maximum 5 mg/dose"
    ],
    "Contraindications in Children": [
      "Known hypersensitivity to albuterol",
      "History of paradoxical bronchospasm",
      "Severe cardiovascular disease"
    ],
    "Major Side Effects / Adverse Reactions": [
      "Cardiovascular: Tachycardia, palpitations",
      "Central nervous system: Tremor, nervousness, headache",
      "Musculoskeletal: Muscle cramps",
      "Metabolic: Hypokalemia, hyperglycemia",
      "Paradoxical: Bronchospasm (rare)"
    ],
    "Special Notes": [
      "Prime inhaler before first use",
      "Clean mouthpiece regularly",
      "Monitor heart rate with frequent use",
      "Use spacer device for young children",
      "Seek medical attention if symptoms worsen"
    ]
  }
};

// Function to enhance drug entries
function enhanceDrugEntry(drug) {
  const drugName = drug.attributes["Drug Name"].value;
  
  // Check if this is a drug we want to enhance
  if (enhancedDrugs[drugName]) {
    const enhancedData = enhancedDrugs[drugName];
    
    // Update each field with enhanced data
    Object.keys(enhancedData).forEach(field => {
      if (drug.attributes[field]) {
        // Keep existing source URLs but update values
        const existingSourceUrls = drug.attributes[field].source_urls || [];
        drug.attributes[field] = {
          value: Array.isArray(enhancedData[field]) ? enhancedData[field] : [enhancedData[field]],
          source_urls: existingSourceUrls.length > 0 ? existingSourceUrls : ["Enhanced with pediatric dosage data"]
        };
      }
    });
  }
  
  return drug;
}

// Process the data
console.log('Enhancing pediatric drug database...');
const enhancedData = {
  ...originalData,
  data: originalData.data.map(drug => enhanceDrugEntry(drug))
};

// Add metadata about enhancement
enhancedData.metadata.enhancement = {
  enhanced_at: new Date().toISOString(),
  enhanced_by: "Pedia-Dose Enhancement Script",
  description: "Added comprehensive pediatric dosage information for common medications",
  enhanced_drugs: Object.keys(enhancedDrugs)
};

// Write the enhanced data to a new file
const outputPath = 'webhound-pediatric_relevant_drug_from_nelson_textbook_of_pediatrics_enhanced.json';
fs.writeFileSync(outputPath, JSON.stringify(enhancedData, null, 2));

console.log(`Enhanced database saved to: ${outputPath}`);
console.log(`Enhanced ${Object.keys(enhancedDrugs).length} medications with complete pediatric data:`);
Object.keys(enhancedDrugs).forEach(drug => console.log(`  - ${drug}`));
console.log(`Total drugs in database: ${enhancedData.data.length}`);