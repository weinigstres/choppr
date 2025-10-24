import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Choppr
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl">
            The definitive IT governance and operating-model platform
          </p>
        </header>

        <main className="space-y-12">
          <section className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-6">
              Get Started
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Login / Sign Up
              </Link>
              <Link
                href="/onboarding"
                className="inline-flex items-center px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium rounded-lg transition-colors"
              >
                Start Onboarding
              </Link>
              <Link
                href="/app/canvas"
                className="inline-flex items-center px-6 py-3 border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 text-slate-900 dark:text-white font-medium rounded-lg transition-colors"
              >
                View Canvas
              </Link>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-4">
              About Choppr
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
              A holistic, data-driven platform that unites IT4IT™, COBIT, and ITIL 4 into one interactive system.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Value Streams
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Interactive visualization of IT value chains from Strategy to Portfolio, Requirement to Deploy, Request to Fulfill, and Detect to Correct.
                </p>
              </div>
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Profile-Driven
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Adapt your IT operating model based on your enterprise profile: Utility, Responder, or Differentiator.
                </p>
              </div>
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Risk & Controls
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Built-in library of IT controls from ISO 27001, ITGC, DORA, and the EU AI Act linked to your processes.
                </p>
              </div>
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Governance Bodies
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Map organizational committees and approval workflows to ensure proper decision-making across IT processes.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              How It Works
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-slate-600 dark:text-slate-300">
              <li>Set up your organization profile</li>
              <li>Select your IT operating model (Utility, Responder, or Differentiator)</li>
              <li>Enable relevant processes for your organization</li>
              <li>Map value streams to your IT workflows</li>
              <li>Link governance bodies and controls to processes</li>
            </ol>
          </section>
        </main>
      </div>
    </div>
  );
}
