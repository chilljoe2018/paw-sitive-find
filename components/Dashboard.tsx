import React, { useState, useEffect } from 'react';
import { Pet } from '../types';
import Flyer from './Flyer';
import MapView from './MapView';
import { ClockIcon } from './icons/ClockIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { QrCodeIcon } from './icons/QrCodeIcon';
import { ShareIcon } from './icons/ShareIcon';

interface DashboardProps {
  pet: Pet;
  onNewReport: () => void;
}

const statusMessages = [
  "Initializing search protocols...",
  "Scanning local shelter databases...",
  "Checking social media feeds for keywords...",
  "Cross-referencing with found pet reports in your area...",
  "Analyzing image for potential matches...",
];

const Dashboard: React.FC<DashboardProps> = ({ pet, onNewReport }) => {
  const [searchStatus, setSearchStatus] = useState(statusMessages[0]);
  const [showFlyer, setShowFlyer] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % statusMessages.length;
      setSearchStatus(statusMessages[index]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  
  const handlePrintFlyer = () => {
    window.print();
  };

  const publicPageUrl = window.location.href; // Mock public URL

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Your Active Report</h2>
        <p className="mt-2 text-lg text-gray-600">
          We're actively searching. Here are tools to help you spread the word.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Pet Details & Status */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col sm:flex-row gap-6">
              {pet.photo && (
                <img src={pet.photo} alt={pet.name} className="w-full sm:w-48 h-48 rounded-lg object-cover shadow-md" />
              )}
              <div>
                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${pet.status === 'Lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {pet.status.toUpperCase()}
                </span>
                <h3 className="text-4xl font-bold text-gray-800 mt-2">{pet.name || 'Unknown Pet'}</h3>
                <p className="text-gray-600">{pet.breed || pet.species}</p>
                <div className="mt-4 space-y-2 text-gray-700">
                  <p><strong>Last Seen:</strong> {pet.location} on {new Date(pet.date).toLocaleDateString()}</p>
                  <p><strong>Details:</strong> {pet.color}, {pet.age}, {pet.gender}</p>
                  <p><strong>Microchipped:</strong> {pet.isMicrochipped ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 border-t pt-4">
              <h4 className="font-semibold text-gray-800">Description</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{pet.description}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-bold text-gray-800 mb-4">Visual Location Search</h4>
             <MapView pet={pet} />
          </div>


          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-bold text-gray-800 mb-4">Search Status</h4>
            <div className="flex items-center gap-4">
              <div className="animate-spin text-indigo-600">
                <ClockIcon />
              </div>
              <p className="text-gray-700">{searchStatus}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div className="bg-indigo-600 h-2.5 rounded-full animate-pulse" style={{width: '75%'}}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Our system continuously scans local resources. We will notify you immediately if a potential match is found.</p>
          </div>
        </div>

        {/* Right Column: Action Center */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-bold text-gray-800 mb-4">Action Center</h4>
            <div className="space-y-4">
              <button onClick={() => setShowFlyer(true)} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                <DownloadIcon /> Generate Flyer
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                <ShareIcon /> Share on Social Media
              </button>
               <div className="border-t pt-4">
                <p className="text-sm font-semibold text-gray-700">Shareable Link:</p>
                <input type="text" readOnly value={publicPageUrl} className="w-full mt-1 p-2 border rounded-md bg-gray-100 text-sm" />
              </div>
              <div className="flex justify-center pt-2">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(publicPageUrl)}`} alt="QR Code" />
              </div>
            </div>
          </div>
           <button onClick={onNewReport} className="w-full bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors">
            Create a New Report
          </button>
        </div>
      </div>
      
      {showFlyer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-4xl w-full relative">
            <h3 className="text-2xl font-bold mb-4 no-print">Flyer Preview</h3>
            <div className="max-h-[70vh] overflow-y-auto">
              <Flyer pet={pet} />
            </div>
            <div className="mt-6 flex justify-end gap-4 no-print">
              <button onClick={() => setShowFlyer(false)} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Close</button>
              <button onClick={handlePrintFlyer} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                <DownloadIcon /> Download / Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;