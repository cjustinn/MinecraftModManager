import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, browserLocalPersistence, setPersistence, signInWithEmailAndPassword, signOut } from '@firebase/auth';

import { createContext, useContext, useEffect, useState } from 'react';

/*

    Initialize the Firebase app and connect it to the firebase project that I created.

    Initialization parameters should be either in stringified json stored in an env. variable, or individual env variables themselves,
    but given that this just needs to work for a little bit locally and nothing beyond that, it's fine for now.

*/
export const FirebaseApp = initializeApp({
    apiKey: "AIzaSyDlkYzxvtlwIUtPi5o1NDYBCP9aZXbwHGk",
    authDomain: "minecraft-mod-manager-28bdf.firebaseapp.com",
    projectId: "minecraft-mod-manager-28bdf",
    storageBucket: "minecraft-mod-manager-28bdf.appspot.com",
    messagingSenderId: "83269284570",
    appId: "1:83269284570:web:b2e686f28d2bdf3547abe3",
    measurementId: "G-TP274XLBHL"
});

// Create a React context and its provider to manage the user's authentication state
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

// Use the auth context to get an object containing user auth information.
export const useAuthState = () => {
    const auth = useContext(AuthContext);
    return { ...auth, isAuthenticated: auth.user != null };
}

// Checks if the user is authenticated directly in the firebase auth obj.
export const getAuthState = () => {
    return getAuth().currentUser != null;
}

// Take an email and password and attempt to use them to use the firebase auth to authenticate them. Returns a parsed error message if the login fails for whatever reason.
export const LoginWithEmail = (email, pass) => {
    return setPersistence(getAuth(), browserLocalPersistence).then(() => {
        return signInWithEmailAndPassword(getAuth(), email, pass).then(userCredentials => {
            return { success: true, error: null };
        }).catch(err => { return { success: false, error: parseErrorMessage(err.code) } })
    }).catch(err => { return { success: false, error: parseErrorMessage(err.code) } })
}

// Logs the user out using the firebase auth signOut function.
export const LogoutUser = () => {
    signOut(getAuth());
}

// Take a firebase error code and return a corresponding full-sentence error message.
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