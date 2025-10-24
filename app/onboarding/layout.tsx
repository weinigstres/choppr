'use client';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const steps = [
    { number: 1, name: 'Organization' },
    { number: 2, name: 'Frameworks' },
    { number: 3, name: 'Core Processes' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome to Choppr</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Let&apos;s set up your IT governance platform
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium mb-2">
                    {step.number}
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-[2px] bg-gray-200 dark:bg-gray-700 mx-4 mb-6" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
