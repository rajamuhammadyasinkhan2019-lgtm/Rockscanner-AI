
import { BasinContext } from './types';

export const BASINS: { id: BasinContext; name: string; description: string }[] = [
  { id: 'GLOBAL', name: 'Global Database', description: 'General geological patterns' },
  { id: 'SWAT', name: 'Swat River Basin', description: 'Metamorphic complexes of the Kohistan Arc' },
  { id: 'HUNZA', name: 'Hunza Valley', description: 'High-grade crystalline rocks and Karakoram sutures' },
  { id: 'ISLOT', name: 'Islamabad/Potwar', description: 'Cenozoic Siwalik molasses sequences' },
  { id: 'SOAN', name: 'Soan River', description: 'Quaternary alluvial and fan deposits' },
  { id: 'FLOOR', name: 'Oceanic Floor', description: 'Ophiolitic sequences and deep-sea sediments' }
];

export const MOHS_SCALE = ["1.0-2.0", "2.0-3.0", "3.0-4.0", "4.0-5.0", "5.0-6.0", "6.0-7.0", "7.0-8.0", "8.0+"];

export const GRAIN_SIZE_CLASSES = [
  { label: 'Fine', range: '< 0.18mm' },
  { label: 'Medium', range: '0.10 - 0.18mm' },
  { label: 'Coarse', range: '> 0.10mm' }
];
