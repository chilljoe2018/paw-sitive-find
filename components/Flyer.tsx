
import React from 'react';
import { Pet } from '../types';

interface FlyerProps {
  pet: Pet;
}

const Flyer: React.FC<FlyerProps> = ({ pet }) => {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}`;

  return (
    <div className="printable-area bg-white p-8 font-sans" id="flyer">
      <div className="text-center border-8 border-red-600 p-4">
        <h1 className="text-8xl font-extrabold text-red-600 tracking-wider">
          {pet.status === 'Lost' ? 'LOST' : 'FOUND'}
        </h1>
        <h2 className="text-4xl font-bold text-black mt-2">
          HAVE YOU SEEN {pet.status === 'Lost' ? 'ME' : 'THIS PET'}?
        </h2>
      </div>

      <div className="mt-8 flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1">
          {pet.photo && (
            <img 
              src={pet.photo} 
              alt={pet.name} 
              className="w-full h-auto object-cover border-4 border-black"
            />
          )}
        </div>

        <div className="flex-1 space-y-4 text-2xl">
          <div className="text-center">
            <p className="text-5xl font-bold uppercase">{pet.name || 'Unknown'}</p>
            <p className="text-3xl">{pet.breed}</p>
          </div>
          <ul className="list-disc list-inside space-y-2 pl-4 text-left">
            <li><strong>Color:</strong> {pet.color}</li>
            <li><strong>Age:</strong> {pet.age}</li>
            <li><strong>Gender:</strong> {pet.gender}</li>
            <li><strong>Date {pet.status}:</strong> {new Date(pet.date).toLocaleDateString()}</li>
            <li><strong>Location:</strong> {pet.location}</li>
            {pet.isMicrochipped && <li><strong>Microchipped:</strong> Yes</li>}
          </ul>
          <p className="mt-4 text-left bg-yellow-200 p-4 border border-black">{pet.description}</p>
        </div>
      </div>

      <div className="mt-8 text-center border-t-4 border-black pt-4">
         <p className="text-3xl font-bold">CONTACT:</p>
         <p className="text-4xl font-bold my-2">{pet.contactPhone}</p>
         <p className="text-2xl">{pet.contactEmail}</p>
      </div>

      <div className="mt-8 flex justify-between items-center text-center">
        <div>
            <p className="font-bold">Scan for digital flyer</p>
            <img src={qrCodeUrl} alt="QR Code" className="w-24 h-24 mx-auto"/>
        </div>
        <p className="text-sm">Created with Paw-sitive Find</p>
      </div>
    </div>
  );
};

export default Flyer;
