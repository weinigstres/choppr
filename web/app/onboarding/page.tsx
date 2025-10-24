'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { linkFrameworksToOrg } from '@/lib/api';
import { starterProcesses } from '@/data/starter-processes';

interface Framework {
  id: string;
  code: string;
  label: string;
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [orgName, setOrgName] = useState('');
  const [country, setCountry] = useState('');
  const [sizeBucket, setSizeBucket] = useState('');
  const [itRole, setItRole] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [frameworks, setFrameworks] = useState<Framework[]>([]);

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    }
    getUser();
  }, []);

  useEffect(() => {
    async function loadFrameworks() {
      if (currentStep === 2) {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('frameworks')
            .select('*')
            .order('label');

          if (error) throw error;

          setFrameworks(data || []);
        } catch (err: any) {
          setError(err.message || 'Failed to load frameworks');
        } finally {
          setLoading(false);
        }
      }
    }
    loadFrameworks();
  }, [currentStep]);

  const router = useRouter();

  const valueStreamOrder: Record<string, number> = {
    Strategy2Portfolio: 0,
    Requirement2Deploy: 1,
    Request2Fulfill: 2,
    Detect2Correct: 3,
  };

  async function handleNext() {
    if (currentStep === 1) {
      await handleStep1Submit();
    } else if (currentStep === 2) {
      await handleStep2Submit();
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  }

  async function handleStep1Submit() {
    if (!orgName.trim()) {
      setError('Organization name is required');
      return;
    }
    if (!userId) {
      setError('User session not found');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: org, error: orgError } = await supabase
        .from('orgs')
        .insert({
          name: orgName,
          country: country || null,
          size_bucket: sizeBucket || null,
          it_role: itRole || null,
          owner_user_id: userId,
        })
        .select()
        .single();

      if (orgError) throw orgError;

      const { error: memberError } = await supabase
        .from('org_members')
        .upsert({
          org_id: org.id,
          user_id: userId,
          role: 'ADMIN',
        });

      if (memberError) throw memberError;

      setOrgId(org.id);
      setCurrentStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  }

  async function handleStep2Submit() {
    if (!orgId) {
      setError('Organization not found');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await linkFrameworksToOrg(orgId, selectedFrameworks);
      setCurrentStep(3);
    } catch (err: any) {
      setError(err.message || 'Failed to save frameworks');
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  async function handleSaveAndContinue() {
    if (!orgId) {
      setError('Organization not found');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const processesToInsert = selectedProcesses.map((key) => {
        const process = starterProcesses.find((p) => p.key === key);
        if (!process) return null;

        const streamIndex = valueStreamOrder[process.value_stream] || 0;
        const processesInStream = starterProcesses.filter(
          (p) => p.value_stream === process.value_stream
        );
        const rowIndex = processesInStream.findIndex((p) => p.key === key);

        return {
          org_id: orgId,
          key: process.key,
          name: process.name,
          value_stream: process.value_stream,
          x: streamIndex * 300,
          y: rowIndex * 120,
        };
      }).filter(Boolean);

      if (processesToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('canvas_processes')
          .insert(processesToInsert);

        if (insertError) throw insertError;
      }

      router.push('/app/canvas');
    } catch (err: any) {
      setError(err.message || 'Failed to create processes');
    } finally {
      setLoading(false);
    }
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
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {currentStep === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Organization Details</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="orgName" className="block text-sm font-medium mb-2">
                Organization Name *
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
              <label htmlFor="country" className="block text-sm font-medium mb-2">
                Country
              </label>
              <input
                id="country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="United States"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
              />
            </div>
            <div>
              <label htmlFor="sizeBucket" className="block text-sm font-medium mb-2">
                Organization Size
              </label>
              <select
                id="sizeBucket"
                value={sizeBucket}
                onChange={(e) => setSizeBucket(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
              >
                <option value="">Select size</option>
                <option value="<50">Less than 50</option>
                <option value="50-250">50-250</option>
                <option value="250-1000">250-1000</option>
                <option value="1000+">1000+</option>
              </select>
            </div>
            <div>
              <label htmlFor="itRole" className="block text-sm font-medium mb-2">
                IT Role
              </label>
              <input
                id="itRole"
                type="text"
                value={itRole}
                onChange={(e) => setItRole(e.target.value)}
                placeholder="e.g. Utility, Differentiator, Responder"
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
          {loading && frameworks.length === 0 ? (
            <div className="text-center py-8">Loading frameworks...</div>
          ) : (
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
                  <span>{framework.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Core Processes</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Select the starter processes to enable
          </p>
          <div className="space-y-2">
            {starterProcesses.map((process) => (
              <label
                key={process.key}
                className="flex items-center p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedProcesses.includes(process.key)}
                  onChange={() => toggleProcess(process.key)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">{process.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {process.key} - {process.value_stream}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8 pt-6 border-t">
        <button
          onClick={handleBack}
          disabled={currentStep === 1 || loading}
          className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <div className="flex gap-2">
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Next'}
            </button>
          ) : (
            <button
              onClick={handleSaveAndContinue}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save & Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
