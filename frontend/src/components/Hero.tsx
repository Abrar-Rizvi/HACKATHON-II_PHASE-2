import React from 'react';
import Link from 'next/link';
import Button from './Button';

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

const Hero: React.FC<HeroProps> = ({
  title = 'Manage Your Tasks with Ease',
  subtitle = 'A simple and intuitive todo application to help you stay organized and productive.',
  ctaText = 'Get Started',
  ctaLink = '/signup',
  secondaryCtaText = 'Learn More',
  secondaryCtaLink = '/about'
}) => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          {title}
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href={ctaLink}>
            <Button variant="primary" size="lg">
              {ctaText}
            </Button>
          </Link>
          <Link href={secondaryCtaLink}>
            <Button variant="outline" size="lg">
              {secondaryCtaText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;