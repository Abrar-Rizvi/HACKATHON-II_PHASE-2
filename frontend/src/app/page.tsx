import Hero from '@/components/Hero';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero
        title="Manage Your Tasks with Ease"
        subtitle="A simple and intuitive todo application to help you stay organized and productive."
        ctaText="Sign Up Now"
        ctaLink="/signup"
        secondaryCtaText="Learn More"
        secondaryCtaLink="/about"
      />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple & Powerful Task Management</h2>
          <p className="text-lg text-gray-600 mb-8">
            Our todo application helps you organize your tasks, set priorities, and stay on track with your goals.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Create Tasks</h3>
              <p className="text-gray-600">Easily add and organize your tasks with our intuitive interface.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor your progress and stay motivated with completion tracking.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Stay Organized</h3>
              <p className="text-gray-600">Keep your tasks organized and accessible across all your devices.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}