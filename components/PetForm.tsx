import React, { useState } from 'react';
import { Pet, PetStatus } from '../types';
import { generateDescription } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

interface PetFormProps {
  initialStatus: PetStatus;
  onSubmit: (pet: Omit<Pet, 'id'>, photoFile: File | null) => void;
}

const PetForm: React.FC<PetFormProps> = ({ initialStatus, onSubmit }) => {
  const [formData, setFormData] = useState<Omit<Pet, 'id' | 'status'>>({
    name: '',
    species: '',
    breed: '',
    color: '',
    age: '',
    gender: '',
    isMicrochipped: false,
    date: new Date().toISOString().split('T')[0],
    location: '',
    description: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    photo: null, // This will hold the base64 string for preview
  });
  const [status, setStatus] = useState<PetStatus>(initialStatus);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file); // Save the raw file for upload

      // Create a base64 preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, photo: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateDescription = async () => {
    setIsLoadingAI(true);
    try {
      const generated = await generateDescription({ ...formData, status });
      setFormData(prev => ({ ...prev, description: generated }));
    } catch (error) {
      console.error("Error generating description:", error);
      alert("Failed to generate description. Please try again or write your own.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, status }, photoFile);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Report a {status} Pet</h2>
      <p className="text-gray-600 mb-6">Please provide as much detail as possible. Every piece of information helps.</p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Pet Information Section */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Pet Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="name" placeholder="Pet's Name (if known)" value={formData.name} onChange={handleChange} className="p-3 border rounded-md" />
            <input type="text" name="species" placeholder="Species (e.g., Dog, Cat)" value={formData.species} onChange={handleChange} required className="p-3 border rounded-md" />
            <input type="text" name="breed" placeholder="Breed" value={formData.breed} onChange={handleChange} className="p-3 border rounded-md" />
            <input type="text" name="color" placeholder="Primary Color(s)" value={formData.color} onChange={handleChange} required className="p-3 border rounded-md" />
            <input type="text" name="age" placeholder="Approximate Age" value={formData.age} onChange={handleChange} className="p-3 border rounded-md" />
            <select name="gender" value={formData.gender} onChange={handleChange} className="p-3 border rounded-md bg-white">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
          <div className="mt-6 flex items-center">
            <input type="checkbox" id="isMicrochipped" name="isMicrochipped" checked={formData.isMicrochipped} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
            <label htmlFor="isMicrochipped" className="ml-2 block text-sm text-gray-900">Is the pet microchipped?</label>
          </div>
        </div>

        {/* Circumstances Section */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Circumstances</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date {status}</label>
              <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required className="w-full p-3 border rounded-md" />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Last Known Location / Area Found</label>
              <input type="text" id="location" name="location" placeholder="City, State or specific address" value={formData.location} onChange={handleChange} required className="w-full p-3 border rounded-md" />
            </div>
          </div>
        </div>
        
        {/* Description & Photo Section */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Description & Photo</h3>
          <div className="space-y-4">
            <textarea name="description" placeholder="Distinctive markings, collar, temperament, etc." rows={5} value={formData.description} onChange={handleChange} className="w-full p-3 border rounded-md"></textarea>
            <button type="button" onClick={handleGenerateDescription} disabled={isLoadingAI} className="flex items-center justify-center gap-2 bg-purple-100 text-purple-700 font-semibold py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <SparklesIcon />
              {isLoadingAI ? 'Generating...' : 'Generate with AI'}
            </button>
            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">Upload a clear photo</label>
              <input type="file" id="photo" name="photo" accept="image/*" onChange={handlePhotoChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
              {formData.photo && <img src={formData.photo} alt="Pet preview" className="mt-4 rounded-lg w-32 h-32 object-cover" />}
            </div>
          </div>
        </div>
        
        {/* Contact Information Section */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="contactName" placeholder="Your Name" value={formData.contactName} onChange={handleChange} required className="p-3 border rounded-md" />
            <input type="tel" name="contactPhone" placeholder="Phone Number" value={formData.contactPhone} onChange={handleChange} required className="p-3 border rounded-md" />
            <input type="email" name="contactEmail" placeholder="Email Address" value={formData.contactEmail} onChange={handleChange} required className="p-3 border rounded-md col-span-1 md:col-span-2" />
          </div>
        </div>
        
        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
          Create {status} Pet Report
        </button>
      </form>
    </div>
  );
};

export default PetForm;