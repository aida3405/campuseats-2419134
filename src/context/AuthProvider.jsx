import { useEffect, useState } from 'react'
import {
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signInWithPopup, GoogleAuthProvider, signOut,
    onAuthStateChanged, updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase.js'
import { AuthContext } from './auth-context.js'
import { ensureUserProfile, subscribeToProfile } from '../services/users.js'

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true) // true until Firebase answers
    const [profile, setProfile] = useState(null)
    // Listen, don't ask: runs once on load and on every sign-in / sign-out.
    useEffect(() => {
        let stopProfile = () => {}
        const stopAuth = onAuthStateChanged(auth, async (firebaseUser) => {
            stopProfile()
            setUser(firebaseUser)
            if (!firebaseUser) { setProfile(null); setLoading(false); return }
            setLoading(true) // wait for role bfr show role-based pages
            try { await ensureUserProfile(firebaseUser) } catch (err)
            { console.error(err) }
            stopProfile = subscribeToProfile(
                firebaseUser.uid,
                (p) => { setProfile(p); setLoading(false) },
                () => setLoading(false),
            )
        })
    return () => { stopAuth(); stopProfile() } // 2 listeners, 2 cleanups
    }, [])
 
    async function register(name, email, password) {
        const credential = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(credential.user, { displayName: name })
        await ensureUserProfile(credential.user, name)

        const role = profile?.role ?? null
        const value = { user, profile, role, loading, register, login, loginWithGoogle, logout }
        setUser({ ...credential.user, displayName: name }) // show the name at once
    }
 
    function login(email, password) {
        // TODO 1: return signInWithEmailAndPassword(...)
        // Hint: it takes auth, email, password (same order as Part A).
        return signInWithEmailAndPassword(auth, email, password)
    }

    function loginWithGoogle() {
        return signInWithPopup(auth, new GoogleAuthProvider())
    }
 
    function logout() {
        // TODO 2: return signOut(...) Hint: it only needs auth.
        return signOut(auth)
    }
 
    const value = { user, loading, register, login, loginWithGoogle, logout }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
