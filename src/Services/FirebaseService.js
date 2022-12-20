import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, browserLocalPersistence, setPersistence, signInWithEmailAndPassword, signOut } from '@firebase/auth';

import { createContext, useContext, useEffect, useState } from 'react';

export const FirebaseApp = initializeApp({
    apiKey: "AIzaSyDlkYzxvtlwIUtPi5o1NDYBCP9aZXbwHGk",
    authDomain: "minecraft-mod-manager-28bdf.firebaseapp.com",
    projectId: "minecraft-mod-manager-28bdf",
    storageBucket: "minecraft-mod-manager-28bdf.appspot.com",
    messagingSenderId: "83269284570",
    appId: "1:83269284570:web:b2e686f28d2bdf3547abe3",
    measurementId: "G-TP274XLBHL"
});

export const AuthContext = createContext();
export const AuthContextProvider = props => {
    const [ user, setUser ] = useState();
    const [ error, setError ] = useState();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), setUser, setError);
        return () => unsubscribe();
    }, []);

    return <AuthContext.Provider value={{ user, error }} {...props}/>
}

export const useAuthState = () => {
    const auth = useContext(AuthContext);
    return { ...auth, isAuthenticated: auth.user != null };
}

export const getAuthState = () => {
    return getAuth().currentUser != null;
}

export const LoginWithEmail = (email, pass) => {
    return setPersistence(getAuth(), browserLocalPersistence).then(() => {
        return signInWithEmailAndPassword(getAuth(), email, pass).then(userCredentials => {
            return { success: true, error: null };
        }).catch(err => { return { success: false, error: parseErrorMessage(err.code) } })
    }).catch(err => { return { success: false, error: parseErrorMessage(err.code) } })
}

export const LogoutUser = () => {
    signOut(getAuth());
}

export const parseErrorMessage = errorCode => {
    let msg = undefined;

    switch(errorCode) {
        case 'auth/user-not-found':
            msg = `There is no account on record with that email address.`;
            break;
        case 'auth/wrong-password':
            msg = `The password you have entered is incorrect.`;
            break;
        case 'auth/user-disabled':
            msg = `That account is currently disabled.`;
            break;
        default:
            msg = `An unknown error has occurred.`
            break;
    }

    return msg;
}