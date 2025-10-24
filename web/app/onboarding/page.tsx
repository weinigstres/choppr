'use client';

import { useState } from 'react';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [orgName, setOrgName] = useState('');
  const [orgDomain, setOrgDomain] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);

  const frameworks = [
    { id: 'itil4', name: 'ITIL 4' },
    { id: 'cobit', name: 'COBIT' },
    { id: 'iso27001', name: 'ISO 27001' },
    { id: 'itgc', name: 'ITGC' },
    { id: 'dora', name: 'DORA' },
    { id: 'eu_ai_act', name: 'EU AI Act' },
  ];

  const processes = [
    { id: 'incident', name: 'Incident Management' },
    { id: 'change', name: 'Change Management' },
    { id: 'problem', name: 'Problem Management' },
    { id: 'service_request', name: 'Service Request Management' },
    { id: 'asset', name: 'Asset Management' },
    { id: 'configuration', name: 'Configuration Management' },
  ];

  function handleNext() {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  function handleSaveAndContinue() {
    alert('Save functionality not implemented yet');
  }

  function toggleFramework(id: string) {
    setSelectedFrameworks((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  function toggleProcess(id: string) {
    setSelectedProcesses((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      {currentStep === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Organization Details</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="orgName" className="block text-sm font-medium mb-2">
                Organization Name
              </label>
              <input
                id="orgName"
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Acme Inc."
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
              />
            </div>
            <div>
              <label htmlFor="orgDomain" className="block text-sm font-medium mb-2">
                Domain
              </label>
              <input
                id="orgDomain"
                type="text"
                value={orgDomain}
                onChange={(e) => setOrgDomain(e.target.value)}
                placeholder="acme.com"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
              />
            </div>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Select Frameworks</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Choose the frameworks relevant to your organization
          </p>
          <div className="space-y-2">
            {frameworks.map((framework) => (
              <label
                key={framework.id}
                className="flex items-center p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedFrameworks.includes(framework.id)}
                  onChange={() => toggleFramework(framework.id)}
                  className="mr-3"
                />
                <span>{framework.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Core Processes</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Select the core processes to enable
          </p>
          <div className="space-y-2">
            {processes.map((process) => (
              <label
                key={process.id}
                className="flex items-center p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedProcesses.includes(process.id)}
                  onChange={() => toggleProcess(process.id)}
                  className="mr-3"
                />
                <span>{process.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8 pt-6 border-t">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <div className="flex gap-2">
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSaveAndContinue}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save & Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
