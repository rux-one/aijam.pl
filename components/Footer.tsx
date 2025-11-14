import { Github, Linkedin, Mail, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-2xl font-bold mb-4">
              <Sparkles className="w-8 h-8 text-primary-400" />
              <span>AI Jam Łódź</span>
            </div>
            <p className="text-gray-400 mb-4">
              Społeczność entuzjastów sztucznej inteligencji w Łodzi.
              Dołącz do nas i rozwijaj swoją wiedzę o AI!
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="mailto:contact@aijam.pl"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Szybkie linki</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/meetups" className="text-gray-400 hover:text-white transition-colors">
                  Meetupy
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  O nas
                </Link>
              </li>
              <li>
                <Link href="/starter-pack" className="text-gray-400 hover:text-white transition-colors">
                  Starter Pack
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Kontakt</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Łódź, Polska</li>
              <li>contact@aijam.pl</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} AI Jam Łódź. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
}
