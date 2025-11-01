import React, { useState, useMemo } from 'react';
import { Pet, PetStatus } from '../types';
import { HomeIcon } from './icons/HomeIcon';
import { MapPinIcon } from './icons/MapPinIcon';

interface MapViewProps {
  pet: Pet;
}

// Helper to generate a random number in a range
const getRandomInRange = (min: number, max: number, decimals: number) => {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
};

const MapView: React.FC<MapViewProps> = ({ pet }) => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const mainPetWithCoords = useMemo(() => ({
    ...pet,
    coordinates: pet.coordinates ?? { lat: 50, lng: 50 },
  }), [pet]);

  const nearbyPets = useMemo<Pet[]>(() => {
    // This simulates finding other pets in a database
    const baseLat = mainPetWithCoords.coordinates.lat;
    const baseLng = mainPetWithCoords.coordinates.lng;

    return [
      {
        name: 'Friendly Golden Retriever',
        status: PetStatus.Found,
        species: 'Dog',
        breed: 'Golden Retriever',
        color: 'Golden',
        photo: 'https://via.placeholder.com/150/f0e68c/808080?Text=Found+Dog',
        location: 'Near park',
        date: new Date().toISOString(),
        coordinates: { lat: getRandomInRange(baseLat - 15, baseLat + 15, 0), lng: getRandomInRange(baseLng - 15, baseLng + 15, 0) },
        // other fields omitted for brevity
      },
       {
        name: 'Small Tabby Cat',
        status: PetStatus.Found,
        species: 'Cat',
        breed: 'Tabby',
        color: 'Grey and black',
        photo: 'https://via.placeholder.com/150/d3d3d3/808080?Text=Found+Cat',
        location: 'Downtown area',
        date: new Date().toISOString(),
        coordinates: { lat: getRandomInRange(baseLat - 15, baseLat + 15, 0), lng: getRandomInRange(baseLng - 15, baseLng + 15, 0) },
      },
    ].map(p => ({
        ...p,
        // Ensure coordinates are within bounds [0, 100]
        coordinates: {
            lat: Math.max(0, Math.min(100, p.coordinates.lat)),
            lng: Math.max(0, Math.min(100, p.coordinates.lng)),
        }
    })) as Pet[];
  }, [mainPetWithCoords.coordinates]);

  const allPetsOnMap = [mainPetWithCoords, ...nearbyPets];

  const handleMarkerClick = (p: Pet) => {
    setSelectedPet(p);
  };
  
  const handleClosePopup = () => {
    setSelectedPet(null);
  }

  return (
    <div className="relative w-full h-80 bg-indigo-50 border-2 border-indigo-200 rounded-lg overflow-hidden" onClick={handleClosePopup}>
      {/* Render simulated pets */}
      {allPetsOnMap.map((p, index) => {
        const isMainPet = p === mainPetWithCoords;
        return (
          <button
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-full focus:outline-none"
            style={{ 
              left: `${p.coordinates!.lng}%`, 
              top: `${p.coordinates!.lat}%`,
              zIndex: selectedPet === p ? 30 : (isMainPet ? 20 : 10)
            }}
            onClick={(e) => { e.stopPropagation(); handleMarkerClick(p); }}
            aria-label={`Location of ${p.name}`}
          >
            {isMainPet ? <HomeIcon /> : <MapPinIcon />}
          </button>
        );
      })}

      {/* Render popup for selected pet */}
      {selectedPet && (
        <div
          className="absolute bg-white p-3 rounded-lg shadow-xl border w-60 transform -translate-x-1/2"
          style={{
            left: `${selectedPet.coordinates!.lng}%`,
            top: `${selectedPet.coordinates!.lat}%`,
            marginTop: '-5.5rem',
            zIndex: 40,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={handleClosePopup} className="absolute top-1 right-1 text-gray-500 hover:text-gray-800">&times;</button>
          <img src={selectedPet.photo ?? ''} alt={selectedPet.name} className="w-full h-24 object-cover rounded-md mb-2" />
          <h5 className="font-bold text-sm">{selectedPet.name}</h5>
          <p className="text-xs text-gray-600">{selectedPet.location}</p>
          <span className={`text-xs font-semibold ${selectedPet.status === PetStatus.Found ? 'text-green-600' : 'text-red-600'}`}>
            {selectedPet.status}
          </span>
        </div>
      )}
      <div className="absolute bottom-2 right-2 bg-white/70 p-1 rounded-md text-xs text-gray-600">
        Click pins to see details. This is a visual representation.
      </div>
    </div>
  );
};

export default MapView;