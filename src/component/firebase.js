import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  setDoc,
  deleteDoc,
  collectionGroup
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  getBytes,
  deleteObject,
} from "firebase/storage";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
export const storage = getStorage();



// agregar nuevo elemento a la base de firebase
export async function insertNewProduct(product) {
  try {
    const docRef = collection(db, 'product');
    const res = await addDoc(docRef, product);
    return res;
  } catch (error) {
    console.error(error);
  }
}

export async function insertCart(product) {
  try {
    const docRef = collection(db, 'carrito');
    const res = await addDoc(docRef, product);
    return res;
  } catch (error) {
    console.error(error);
  }
}


// obtener los datos de la tabla
export async function getProduct() {
  const products = []
  try {
    const collectioRef = collection(db, 'product')
    const querySnapshot = await getDocs(collectioRef)
    querySnapshot.forEach(async (doc) => {
      const pro = { ...doc.data() }
      pro.docId = doc.id
      products.push(pro)
    })
    return products
  } catch (error) {
    console.error(error)
  }
}

export async function updateProduct(docId, product){
  try {
    const docRef = doc(db,'product',docId);
    const res = await setDoc(docRef, product);
    return res;
  } catch (error) {
    console.error(error)
  }
}


export async function deleteProduct(docId){
  try {
    const docRef = doc(db, 'product',docId);
    const  res = await deleteDoc(docRef);
    return res;
  } catch (error) {
    console.error(error)
  }
}


export async function ProfilePhoto(uid,file){
  const imageRef = ref(storage, `images/${uid}`);
  return await uploadBytes(imageRef, file)
}

export async function getUrl(path){
  const imageRef = ref(storage,path)
  const url = await getDownloadURL(imageRef)
  return url
}

export async function Deletefile(file){
  const imageRef = ref(storage, file)
  return await deleteObject(imageRef)
}


export async function getUserInfo(uid){
  try {
    const docRef = doc(db, 'users', uid);
    const document = await getDoc(docRef);
    return document.data();
  } catch (error) {
    console.error(error)
  }
}

export async function existsUsername(username){
  const user = [];
  const docsRef = collection(db, 'user');
  const q = query(docsRef, where('email', '==', username));
  const querySnapshot = await getDoc(q);
  querySnapshot.forEach( doc => {
    user.push(doc.data());
  });
  return user
}

export async function insertNewUser(user) {
  try {
    const docRef = collection(db, 'user');
    const res = await addDoc(docRef, user);
    return res;
  } catch (error) {
    console.error(error);
  }
}

export async function updateUser(docId, user){
  try {
    const docRef = doc(db,'user',docId);
    const res = await setDoc(docRef, user);
    return res;
  } catch (error) {
    console.error(error)
  }
}


export async function deleteUser(docId){
  try {
    const docRef = doc(db, 'user',docId);
    const  res = await deleteDoc(docRef);
    return res;
  } catch (error) {
    console.error(error)
  }
}

export async function getUser() {
  const products = []
  try {
    const collectioRef = collection(db, 'user')
    const querySnapshot = await getDocs(collectioRef)
    querySnapshot.forEach(async (doc) => {
      const pro = { ...doc.data() }
      pro.docId = doc.id
      products.push(pro)
    })
    return products
  } catch (error) {
    console.error(error)
  }
}

export async function photo(uid,file){
  const imageRef = ref(storage, `user/${uid}`);
  return await uploadBytes(imageRef, file)
}
