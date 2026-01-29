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

