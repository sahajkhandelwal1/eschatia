import { useNavigate } from 'react-router-dom';

export default function DestinationCard({ destination }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/destination/${destination.id}`)}
      className="group relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-white/10 hover:border-gold/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/50"
    >
      {/* Image */}
      <div className="absolute inset-0 bg-space-800">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500"
          loading="lazy"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-space-950/95 via-space-950/30 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
        <p className="text-gold text-xs uppercase tracking-widest font-medium mb-1">
          {destination.type}
        </p>
        <h3 className="text-white text-lg font-medium leading-tight mb-1">
          {destination.name}
        </h3>
        <p className="text-white/50 text-xs">{destination.distance}</p>
      </div>

      {/* Hover enter indicator */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-gold text-xs uppercase tracking-widest">Enter →</span>
      </div>
    </button>
  );
}
