import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About Our Todo Application</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              Welcome to our Todo Application - a simple and intuitive task management solution designed to help you stay organized and productive.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              Our mission is to provide a clean, efficient, and user-friendly platform that helps individuals and teams manage their tasks effectively. We believe that staying organized should be simple and enjoyable.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Features</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Create and organize tasks with ease</li>
              <li>Track progress with completion indicators</li>
              <li>Simple and intuitive user interface</li>
              <li>Secure user authentication</li>
              <li>Cross-device synchronization</li>
              <li>Responsive design for all devices</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Our Story</h2>
            <p className="text-gray-700 mb-6">
              Founded with the vision of simplifying task management, our application was created to address the common challenges people face when trying to stay organized. We've focused on creating a tool that is both powerful and simple to use.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700">
              Have questions or feedback? We'd love to hear from you. Reach out to us at{' '}
              <a href="mailto:support@todoapp.com" className="text-blue-600 hover:underline">
                support@todoapp.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;