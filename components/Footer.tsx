
import React from 'react';

const Footer: React.FC = () => {
  const footerLinks = [
    "Terms of Service", "Privacy Policy", "User Guidelines", "FAQ", "Report a Bug", "Save to Desktop"
  ];

  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center text-center gap-x-6 gap-y-2">
          {footerLinks.map(link => (
            <a key={link} href="#" className="text-sm hover:text-white transition-colors">{link}</a>
          ))}
        </div>
        <div className="text-center text-xs text-gray-500 mt-6">
          <p>This service is designed to assist in reuniting pets with their families. We do not guarantee outcomes. Please exercise caution and follow local laws when dealing with lost or found animals.</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} Paw-sitive Find. All Rights Reserved. Proprietary License.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
