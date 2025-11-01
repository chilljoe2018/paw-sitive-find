import React, { useState, useCallback, useEffect } from 'react';
import { Pet, AppView, PetStatus } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import PetForm from './components/PetForm';
import Dashboard from './components/Dashboard';
import { auth, googleProvider } from './services/firebase';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { addPet } from './services/petService';

const Hero: React.FC<{ onReport: (status: PetStatus) => void; user: User | null }> = ({ onReport, user }) => (
  <div className="text-center py-20 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-lg">
    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
      Find Your Lost Pet. <span className="text-indigo-600">Reunite Families.</span>
    </h1>
    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
      {user 
        ? "We know how stressful this is. Our platform is designed to be simple, fast, and effective. Let's create a report and start the search together."
        : "Please sign in to create a report. Your account lets you manage your listings and receive notifications."
      }
    </p>
    <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
      <button
        onClick={() => onReport(PetStatus.Lost)}
        disabled={!user}
        className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
      >
        I Lost a Pet
      </button>
      <button
        onClick={() => onReport(PetStatus.Found)}
        disabled={!user}
        className="w-full sm:w-auto bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
      >
        I Found a Pet
      </button>
    </div>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.Home);
  const [petProfile, setPetProfile] = useState<Pet | null>(null);
  const [initialStatus, setInitialStatus] = useState<PetStatus>(PetStatus.Lost);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigateToHome();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleReport = useCallback((status: PetStatus) => {
    if (user) {
      setInitialStatus(status);
      setView(AppView.Form);
    } else {
      alert("Please sign in to create a report.");
    }
  }, [user]);

  const handleFormSubmit = useCallback(async (petData: Omit<Pet, 'id'>, photoFile: File | null) => {
    if (!user) {
      alert("You must be logged in to submit a report.");
      return;
    }
    try {
      const petId = await addPet(petData, photoFile, user.uid);
      const newPetProfile = { ...petData, id: petId, userId: user.uid, photo: petData.photo }; // photo is base64 for preview
      setPetProfile(newPetProfile);
      setView(AppView.Dashboard);
    } catch (error) {
      console.error("Failed to save pet profile:", error);
      alert("There was an error saving your report. Please try again.");
    }
  }, [user]);
  
  const navigateToHome = useCallback(() => {
    setPetProfile(null);
    setView(AppView.Home);
  }, []);

  const renderContent = () => {
    if (isLoading) {
        return <div className="text-center py-20">Loading...</div>;
    }
    switch (view) {
      case AppView.Form:
        return <PetForm initialStatus={initialStatus} onSubmit={handleFormSubmit} />;
      case AppView.Dashboard:
        return petProfile ? <Dashboard pet={petProfile} onNewReport={navigateToHome} /> : <Hero onReport={handleReport} user={user} />;
      case AppView.Home:
      default:
        return <Hero onReport={handleReport} user={user} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Header onLogoClick={navigateToHome} user={user} onSignIn={handleSignIn} onSignOut={handleSignOut} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;