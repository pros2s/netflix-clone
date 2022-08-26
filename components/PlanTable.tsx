import { CheckIcon } from '@heroicons/react/outline';
import { FC } from 'react';
import { Plan } from '../types';

interface PlanTableProps {
  plans: Plan[];
  selectedPlan: Plan | null;
}

const PlanTable: FC<PlanTableProps> = ({ plans, selectedPlan }) => {
  const tableRowsNames = [
    'Monthly price',
    'Video quality',
    'Resolution',
    'Watch on your TV, computer, mobile phone and tablet',
  ];

  return (
    <table>
      <tbody className='divide-y divide-[gray]'>
        {tableRowsNames.map((rowName, i) => (
          <tr className='tableRow'>
            <td className='tableDataTitle'>{rowName}</td>
            {plans.map((plan) => (
              <td
                className={`tableDataFeature ${
                  selectedPlan?.id === plan.id ? 'text-[#E50914]' : 'text-[gray]'
                }`}
                key={plan.id}>
                {i === 0 && <p>AED{plan.price}</p>}
                {i === 1 && <p>{plan.quality}</p>}
                {i === 2 && <p>{plan.resolution}</p>}
                {i === 3 && <CheckIcon className='inline-block h-8 w-8' />}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PlanTable;
