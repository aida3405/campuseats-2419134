import { doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.js'

// users/{uid} holds profile and ROLE. Every new account starts as student
export async function ensureUserProfile(user, name) {
    const ref = doc(db, 'users', user.uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
        await setDoc(ref, {
            name: name ?? user.displayName ?? '',
            email: user.email,
            role: 'student',
            createAt: serverTimestamp(),            
        })
    } else if (name && !snap.data().name) {
        await updateDoc(ref, { name })
    }
}

export function subscribeToProfile(uid, onData, onError) {
    return onSnapshot(doc(db, 'users', uid), (snap) => onData(snap.exists() ?
    snap.data(): null), onError)
}