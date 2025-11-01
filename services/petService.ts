import { db, storage } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Pet } from '../types';

export const addPet = async (
  petData: Omit<Pet, 'id' | 'photo' | 'userId'>,
  photoFile: File | null,
  userId: string
): Promise<string> => {
  let photoUrl: string | null = null;

  // 1. Upload photo to Cloud Storage if it exists
  if (photoFile) {
    const storageRef = ref(storage, `pets/${userId}/${Date.now()}_${photoFile.name}`);
    const uploadResult = await uploadBytes(storageRef, photoFile);
    photoUrl = await getDownloadURL(uploadResult.ref);
  }

  // 2. Add pet data to Firestore
  const petDoc: Omit<Pet, 'id'> = {
    ...petData,
    photo: photoUrl,
    userId: userId,
    createdAt: serverTimestamp(),
  } as any; // Using 'as any' for serverTimestamp

  const docRef = await addDoc(collection(db, 'pets'), petDoc);
  
  return docRef.id;
};