// Sample test data for Risk Matrix Visual
import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;

export const sampleRiskData = [
  { id: 'RISK-001', lInh: 3, cInh: 4, lRes: 2, cRes: 3, category: 'Operational' },
  { id: 'RISK-002', lInh: 5, cInh: 5, lRes: 4, cRes: 4, category: 'Financial' },
  { id: 'RISK-003', lInh: 2, cInh: 2, lRes: 1, cRes: 2, category: 'Technical' },
  { id: 'RISK-004', lInh: 4, cInh: 3, lRes: 3, cRes: 2, category: 'Operational' },
  { id: 'RISK-005', lInh: 1, cInh: 5, lRes: 1, cRes: 4, category: 'Compliance' },
  { id: 'RISK-006', lInh: 5, cInh: 2, lRes: 4, cRes: 2, category: 'Technical' },
  { id: 'RISK-007', lInh: 3, cInh: 3, lRes: 2, cRes: 2, category: 'Financial' }
];

export function createMockDataView(riskData: Array<{
  id: string;
  lInh?: number;
  cInh?: number;
  lRes?: number;
  cRes?: number;
  category?: string;
}>): DataView {
  const categories = [
    {
      source: {
        roles: { riskId: true },
        displayName: 'Risk ID',
        type: { text: true }
      },
      values: riskData.map(d => d.id),
      identity: riskData.map((_, i) => ({ key: `risk-${i}` }))
    }
  ];

  // Add category if present
  if (riskData.some(d => d.category)) {
    categories.push({
      source: {
        roles: { category: true } as any,
        displayName: 'Category',
        type: { text: true }
      },
      values: riskData.map(d => d.category || 'Unknown'),
      identity: riskData.map((_, i) => ({ key: `cat-${i}` }))
    });
  }

  const values: any[] = [];
  
  if (riskData.some(d => d.lInh !== undefined)) {
    values.push({
      source: { 
        roles: { likelihoodInh: true },
        displayName: 'Inherent Likelihood',
        type: { numeric: true }
      },
      values: riskData.map(d => d.lInh)
    });
  }
  
  if (riskData.some(d => d.cInh !== undefined)) {
    values.push({
      source: { 
        roles: { consequenceInh: true },
        displayName: 'Inherent Consequence',
        type: { numeric: true }
      },
      values: riskData.map(d => d.cInh)
    });
  }
  
  if (riskData.some(d => d.lRes !== undefined)) {
    values.push({
      source: { 
        roles: { likelihoodRes: true },
        displayName: 'Residual Likelihood',
        type: { numeric: true }
      },
      values: riskData.map(d => d.lRes)
    });
  }
  
  if (riskData.some(d => d.cRes !== undefined)) {
    values.push({
      source: { 
        roles: { consequenceRes: true },
        displayName: 'Residual Consequence',
        type: { numeric: true }
      },
      values: riskData.map(d => d.cRes)
    });
  }

  // Create a proper DataViewValueColumns mock with the grouped method
  const valuesWithGrouped = values as any;
  valuesWithGrouped.grouped = () => [];
  valuesWithGrouped.source = undefined;
  valuesWithGrouped.identityFields = undefined;

  return {
    categorical: {
      categories,
      values: valuesWithGrouped
    },
    metadata: {
      columns: []
    }
  } as unknown as DataView;
}

export const edgeCaseData = [
  // Risk with only inherent values
  { id: 'EDGE-001', lInh: 3, cInh: 4 },
  // Risk with only residual values
  { id: 'EDGE-002', lRes: 2, cRes: 3 },
  // Risk with extreme values (should be clamped)
  { id: 'EDGE-003', lInh: 0, cInh: 6, lRes: -1, cRes: 10 },
  // Risk with null/undefined values
  { id: 'EDGE-004', lInh: null as any, cInh: undefined, lRes: 2, cRes: 3 },
  // Risk with NaN values
  { id: 'EDGE-005', lInh: NaN, cInh: 2, lRes: NaN, cRes: 4 }
];

export const severityTestCases = [
  { score: 1, expected: '#388e3c', description: 'Low severity (1×1)' },
  { score: 4, expected: '#388e3c', description: 'Low severity boundary (2×2)' },
  { score: 5, expected: '#fbc02d', description: 'Moderate severity (1×5)' },
  { score: 9, expected: '#fbc02d', description: 'Moderate severity boundary (3×3)' },
  { score: 10, expected: '#f57c00', description: 'High severity (2×5)' },
  { score: 16, expected: '#f57c00', description: 'High severity boundary (4×4)' },
  { score: 17, expected: '#d32f2f', description: 'Extreme severity (4×5 approx)' },
  { score: 25, expected: '#d32f2f', description: 'Maximum extreme (5×5)' }
];