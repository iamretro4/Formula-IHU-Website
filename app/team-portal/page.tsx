export default function TeamPortalPage() {
  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Team Portal</h1>
          <p className="text-lg text-gray-600">
            Access your team dashboard, submit documents, and manage your registration.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
            Formula IHU 2026: Registration Quiz Guidelines
          </h2>
          
          <div className="space-y-6 text-left max-w-3xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Registration Process</h3>
              <p className="text-gray-700">
                Teams do not need to pre-register for the Formula IHU registration quiz. According to the handbook, you simply need to access the site, input your team details (Name, Email, and Vehicle Category), and begin the test. The quiz page will appear automatically at 13:00 CET on fihu.gr. The interface is similar to a Google Form. As long as you have an active Formula Student Germany (FSG) 2026 account, you are eligible.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Schedule & Access</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>Date:</strong> January 29, 2026</li>
                <li><strong>Time:</strong> 13:00 CET (Duration: 2 Hours)</li>
                <li><strong>Location:</strong> fihu.gr</li>
                <li><strong>Note:</strong> The quiz will appear automatically at 13:00 CET. If it does not, you may reload the page. However, do not refresh the page once you have started the quiz.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Required Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900 mb-1">When the quiz begins, you must input the following:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li><strong>Team Name:</strong> Official name as registered with your university.</li>
                    <li><strong>Team Email:</strong> Valid email for official communication.</li>
                    <li><strong>Vehicle Category:</strong> EV or CV.</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">When you submit the quiz, you must input the following:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li><strong>Team Numbers:</strong> Preferred and alternative choices (e.g., E88, C12).</li>
                    <li><strong>Fuel Type:</strong> (CV Teams only) RON98 or E85.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Scoring & Rules</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>Format:</strong> 10–20 Questions.</li>
                <li><strong>Submission:</strong> Only the first submission recorded is accepted. No edits allowed.</li>
                <li><strong>Scoring:</strong>
                  <ul className="list-circle list-inside ml-6 mt-1 space-y-1">
                    <li><strong>Correct:</strong> Full points.</li>
                    <li><strong>Incorrect:</strong> -50% of the question&apos;s points deducted.</li>
                    <li><strong>Unanswered:</strong> 0 points (no change).</li>
                  </ul>
                </li>
                <li><strong>Tie-Breaker:</strong> In the event of a tie, the team with the faster submission time wins.</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a
              href="/contact"
              className="px-6 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Contact Us
            </a>
            <a
              href="/team-portal/fihu-team"
              className="px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-lg transition-all transform hover:scale-105 text-center"
            >
              FIHU Team
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Team Dashboard</h3>
            <p className="text-gray-600 text-sm mb-4">
              View your team's registration status, scores, and competition schedule.
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Registration status</li>
              <li>• Competition schedule</li>
              <li>• Team scores and rankings</li>
              <li>• Important announcements</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Document Submission</h3>
            <p className="text-gray-600 text-sm mb-4">
              Submit required documents and track their approval status.
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Upload technical documents</li>
              <li>• Submit registration forms</li>
              <li>• Track document approval</li>
              <li>• Download templates</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Team Management</h3>
            <p className="text-gray-600 text-sm mb-4">
              Manage your team members and their roles.
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Add or remove team members</li>
              <li>• Assign roles and permissions</li>
              <li>• Update team information</li>
              <li>• Manage team profile</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Resources</h3>
            <p className="text-gray-600 text-sm mb-4">
              Access competition resources and guidelines.
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Competition rules</li>
              <li>• Technical guidelines</li>
              <li>• Event schedule</li>
              <li>• FAQ and support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

