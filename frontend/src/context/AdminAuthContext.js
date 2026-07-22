import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, isFirebaseConfigured, ADMIN_UID } from "../lib/firebase";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return undefined;
    }
    const unsub = onAuthStateChanged(auth, (next) => {
      setUser(next);
      setLoading(false);
    });
    return unsub;
  }, []);

  const isAdmin = Boolean(user && user.uid === ADMIN_UID);

  const login = async (email, password) => {
    if (!auth) throw new Error("Firebase Auth is not configured.");
    const credential = await signInWithEmailAndPassword(auth, email, password);
    if (credential.user.uid !== ADMIN_UID) {
      await signOut(auth);
      throw new Error("This account is not authorized as an admin.");
    }
    return credential.user;
  };

  const logout = async () => {
    if (auth) await signOut(auth);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        adminUid: ADMIN_UID,
        authenticated: isAdmin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
