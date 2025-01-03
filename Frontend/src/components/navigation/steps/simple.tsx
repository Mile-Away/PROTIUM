export interface StepProps {
  id: string;
  name: string;
  href: string;
  status: 'complete' | 'current' | 'upcoming';
}

export default function Example({ steps }: { steps: StepProps[] }) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step) => (
          <li key={step.name} className="md:flex-1">
            {step.status === 'complete' ? (
              <div className="group flex flex-col border-l-4 border-indigo-600 py-2 pl-4 hover:border-indigo-800 dark:border-indigo-400 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-800 dark:text-indigo-400 dark:group-hover:text-indigo-200">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            ) : step.status === 'current' ? (
              <div
                className="flex flex-col border-l-4 border-indigo-600 py-2 pl-4 dark:border-indigo-400 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                aria-current="step"
              >
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            ) : (
              <a
                href={step.href}
                className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 hover:border-gray-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
              >
                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
