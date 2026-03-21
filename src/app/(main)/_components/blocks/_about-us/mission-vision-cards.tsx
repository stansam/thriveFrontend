export function MissionVisionCards() {
    return (
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#202e44] text-white p-8 rounded-xl">
                <h3 className="text-xl font-bold mb-3 text-[#88734C]">Our Mission</h3>
                <p className="text-white/80 leading-relaxed">
                    To provide affordable, reliable, and stress‑free travel services with excellence, transparency, and world‑class service.
                </p>
            </div>
            <div className="bg-[#f0f0f0] text-[#202e44] p-8 rounded-xl border border-[#A9BBC8]/30">
                <h3 className="text-xl font-bold mb-3 text-[#88734C]">Our Vision</h3>
                <p className="text-[#202e44]/80 leading-relaxed">
                    To become a recognized and trusted travel service brand known for professionalism and convenience.
                </p>
            </div>
        </div>
    )
}
