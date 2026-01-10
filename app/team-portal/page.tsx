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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
            Authentication Required
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Please log in to access the team portal. If you don&apos;t have an account, 
            please contact us to register your team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://hub.fihu.gr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-center"
            >
              Log In
            </a>
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

