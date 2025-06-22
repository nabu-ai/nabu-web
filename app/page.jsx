"use client";

import React, { useState } from "react";

const DashboardPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-gray-50 text-gray-900 flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="bg-white shadow-md">
        <div className="container mx-5 flex justify-between items-center">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded bg-gray-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </button>
          <img className="h-20" src="/nabu-web/Nabu-Logo.jpg"></img>
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6">
            <a href="#" className="hover:text-blue-600">
              Features
            </a>
            <a href="#" className="hover:text-blue-600">
              Pricing
            </a>
            <a href="#" className="hover:text-blue-600">
              About
            </a>
            <a href="#" className="hover:text-blue-600">
              Contact
            </a>
          </nav>
        </div>
      </header>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden  p-4 flex flex-col items-center">
          <a href="#" className="py-2 hover:text-blue-600">
            Features
          </a>
          <a href="#" className="py-2 hover:text-blue-600">
            Pricing
          </a>
          <a href="#" className="py-2 hover:text-blue-600">
            About
          </a>
          <a href="#" className="py-2 hover:text-blue-600">
            Contact
          </a>
        </nav>
      )}

      {/* Hero Section */}
      <section className="container mx-auto flex flex-col items-center text-center py-16">
        <h2 className="text-4xl font-bold text-gray-800">
          Speak Locally, Connect Globally
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Seamless communication with AI-powered calling and messaging.
        </p>
       
      </section>

      {/* Features Section */}
      <section className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
        <div className="p-6 bg-white shadow rounded-lg text-center">
          <h3 className="text-xl font-bold text-gray-700">Multilingual Calling Solution</h3>
          <p className="mt-2 text-gray-600">
            Supports over 40 languages with transcriptions and translations.
          </p>
          <a href="/nabu-web/lobby" target="_blank">
            <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500">
              Get Started
            </button>
          </a>
        </div>
        <div className="p-6 bg-white shadow rounded-lg text-center">
          <h3 className="text-xl font-bold text-gray-700">Multilingual Messaging</h3>
          <p className="mt-2 text-gray-600">
            Instantly connect with team members and clients.
          </p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg text-center">
          <h3 className="text-xl font-bold text-gray-700">Translator</h3>
          <p className="mt-2 text-gray-600">
            Instantly translate your text to any of available 41 languages.
          </p>
          <a href="/nabu-web/translator">
          <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500">
            Try now
          </button>
        </a>
        </div>
        <div className="p-6 bg-white shadow rounded-lg text-center">
          <h3 className="text-xl font-bold text-gray-700">Integrations</h3>
          <p className="mt-2 text-gray-600">
            Seamlessly integrate with your favorite business tools.
          </p>
        </div>
      </section>
      <div className="flex-grow"></div>
      {/* Footer at Bottom */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; {new Date().getFullYear()} Nabu</p>
      </footer>
    </div>
  );
};

export default DashboardPage;
