/** Ghana's 16 administrative regions — nationwide delivery */
export const ghanaRegions = [
  { id: "ahafo", label: "Ahafo" },
  { id: "ashanti", label: "Ashanti" },
  { id: "bono", label: "Bono" },
  { id: "bono-east", label: "Bono East" },
  { id: "central", label: "Central" },
  { id: "eastern", label: "Eastern" },
  { id: "greater-accra", label: "Greater Accra" },
  { id: "north-east", label: "North East" },
  { id: "northern", label: "Northern" },
  { id: "oti", label: "Oti" },
  { id: "savannah", label: "Savannah" },
  { id: "upper-east", label: "Upper East" },
  { id: "upper-west", label: "Upper West" },
  { id: "volta", label: "Volta" },
  { id: "western", label: "Western" },
  { id: "western-north", label: "Western North" },
] as const;

export type GhanaRegionId = (typeof ghanaRegions)[number]["id"];

export const GREATER_ACCRA_REGION_ID: GhanaRegionId = "greater-accra";
