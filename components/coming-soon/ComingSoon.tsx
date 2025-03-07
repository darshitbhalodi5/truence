export default function ComingSoon() {
  return (
    <div className="bg-[#0A0F29] p-6 mt-6 rounded-lg shadow-xl">
      <div className="text-center max-w-2xl mx-auto py-8">
        {/* Animated pulse dot */}
        <div className="relative flex justify-center items-center m-8">
          <div className="w-5 h-5 bg-[#e46b43] rounded-full animate-ping absolute opacity-75"></div>
          <div className="w-5 h-5 bg-[#E06137] rounded-full"></div>
        </div>

        {/* Main heading */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#FAFCA3] mb-6 tracking-wide">
          Program Details Coming Soon
        </h1>

        {/* Description */}
        <div className="text-white/80 text-lg space-y-6 mb-12 leading-relaxed">
          <p>
            An exciting new opportunity is on its way! We are finalizing the
            details and will share them with you soon.
          </p>
          <p>Stay tuned for updates and announcements about the program!</p>
        </div>
      </div>
    </div>
  );
}
