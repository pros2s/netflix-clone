import { Plan } from "../types";

export const subsBenefits = [
  'Watch all you want. Ad-free.',
  'Recommendations just for you.',
  'Change or cancel your plan anytime.',
];

export const subsPlans: Plan[] = [
  { name: 'Basic', price: 29, quality: 'Good', resolution: '480p', id: 1 },
  { name: 'Standart', price: 39, quality: 'Better', resolution: '1080p', id: 2 },
  { name: 'Premium', price: 59, quality: 'Best', resolution: '4K+HDR', id: 3 },
];
