import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-white/5 font-poppins">
      <div className="container mx-auto px-6 flex flex-row justify-between items-center text-foreground/40 text-sm">

        {/* Left — name + copyright */}
        <div>
          <p className="font-bold text-foreground/80 text-lg mb-1">Antony Francis</p>
          <p>© {currentYear} All rights reserved.</p>
        </div>

        {/* Right — location + email */}
        <div className="flex flex-col items-end space-y-1">
          <p>Alappuzha | Kerala | India</p>
          <p>antonyjinson332@gmail.com</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
