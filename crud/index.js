const { initializeApp } = require('firebase/app');
const { writeBatch } = require("firebase/firestore");
const {
    getFirestore,
    collection,
    doc,
    setDoc,
    addDoc,
    query,
    where,
    getDocs,
    getDoc,
    deleteDoc
} = require('firebase/firestore/lite');

const firebaseConfig = {
    apiKey: "AIzaSyD4Z5WOMpWjilACiycmcwLRLAF2toPSaFs",
    authDomain: "pedidos-camilly-vitoria.firebaseapp.com",
    projectId: "pedidos-camilly-vitoria",
    storageBucket: "pedidos-camilly-vitoria.appspot.com",
    messagingSenderId: "726861670908",
    appId: "1:726861670908:web:2421ba75420924eacb6a79",
    measurementId: "G-92RZ33EQ8E"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

async function save(Tablename, id, dado) {
    if (id) {
        const referenceEntity = await setDoc(doc(db, Tablename, id), dado);
        const savedData = {
            ...dado,
            id: id
        }
        return savedData;
    } else {
        const referenceEntity = await addDoc(collection(db, Tablename), dado);
        const savedData = {
            ...dado,
            id: referenceEntity.id
        }
        return savedData;
    }
}

async function get(Tablename) {
    const TableRef = collection(db, Tablename);

    const q = query(TableRef);

    const querySnapshot = await getDocs(q);

    const lista = [];

    querySnapshot.forEach((doc) => {
        const data = {
            ...doc.data(),
            id: doc.id
        }
        lista.push(data);

    });
    return lista;
}

async function getWithFilter(Tablename, property, operator, value) {
    const TableRef = collection(db, Tablename);

    const q = query(TableRef, where(property, operator, value));

    const querySnapshot = await getDocs(q);

    const lista = [];

    querySnapshot.forEach((doc) => {
        const data = {
            ...doc.data(),
            id: doc.id
        }
        lista.push(data);

    });
    return lista;
}

async function getById(Tablename, id) {
    const docRef = doc(db, Tablename, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        throw new Error("404 - not found");
    }

}

async function remove(Tablename, id) {
    const dado = await deleteDoc(doc(db, Tablename, id));
    return {
        message: `${id} deleted`
    }
}

module.exports = {
    save,
    get,
    getById,
    remove,
    getWithFilter
}