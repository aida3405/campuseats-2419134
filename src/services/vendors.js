import { collection, doc, onSnapshot, query, where, addDoc, setDoc, updateDoc, 
    deleteDoc, writeBatch, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.js'

const list = (s) => s.docs.map((d) => ({ id: d.id, ...d.data() }))

//all subscribe function returns unsubsribe function for useEffect cleanup
//students only see approved stalls (and rules only allow that query)
export function subscribeToVendors(onData, onError) {
    const q = query(collection(db, 'vendors'), where('approved', '==', true))
    return onSnapshot(q, (s) => onData(list(s)), onError,)
}

export function subscribeToVendor(vendorId, onData, onError) {
    return onSnapshot(
        doc(db, 'vendors', vendorId),
        (snap) => onData(snap.exists() ? { id: snap.id, ...snap.data() }:null),
        onError,
    )
}

export function subscribeToMyVendor(uid, onData, onError) {
    const q = query(collection(db, 'vendors'), where('ownerUid', '==', uid))
    return onSnapshot(q, (s) => onData(list(s)[0] ?? null), onError)
}

export function subscribeToPendingVendors(onData, onError) {
    const q = query(collection(db, 'vendors'), where('approved', '==', false))
    return onSnapshot(q, (s) => onData(list(s)), onError)
}

export function applyAsVendor(user, { name, location, openHours }) {
    return addDoc(collection(db, 'vendors'), {
        name, location, openHours, isOpen: false,
        approved: false, ownerUid: user.uid, createdAt: serverTimestamp(),
    })
}

//approve the stall AND make its owner a vendor: both or neither
export async function approveVendor(vendor) {
    const batch = writeBatch(db)
    batch.update(doc(db, 'vendors', vendor.id), { approved:true })
    batch.update(doc(db, 'users', vendor.ownerUid), { role: 'vendor' })
    await batch.commit()
}

export const setVendorOpen = (vendorId, isOpen) => updateDoc(doc(db, 'vendors', vendorId), { isOpen })

//menus are subcollection: vendors/{vendorId}/menu/{itemId}
export function subscribeToMenu(vendorId, maxSpice, onData, onError) {
    const menuRef = collection(db, 'vendors', vendorId, 'menu')
    const q = query(menuRef, where('spiceLevel', '<=', Number(maxSpice ?? 3)))

    // TODO 1: copy subscribeToVendors, but listen to collection(db, 'vendors', vendorId, 'menu')
    // Hint: map each doc to ({ id: d.id, vendorId, ...d.data() }) so the cart knows the vendor.
    return onSnapshot(
        q, (snapshot) => onData(snapshot.docs.map((d) => ({ id: d.id, vendorId, ...d.data() }))),
        onError,
    )
}

export async function addMenuItem(vendorId, item) {
    const ref = doc(collection(db, 'vendors', vendorId, 'menu'))
    await setDoc(ref, { ...item, photoUrl: item.photoUrl || null, available: true })
}

export const setItemAvailable = (vendorId, itemId, available) =>
    updateDoc(doc(db, 'vendors', vendorId, 'menu', itemId), { available })

export const deleteMenuItem = (vendorId, itemId, available) =>
    deleteDoc(doc(db, 'vendors', vendorId, 'menu', itemId))

//one-off: copy public/api.vendors.json into Firestore. Batch writes all or nothing
export async function seedDemoData(vendors) {
    const batch = writeBatch(db)
    for (const { menu, id, ...vendor } of vendors) {
        batch.set(doc(db, 'vendors', id),{ ...vendor, approved: true, ownerUid: null })
        for (const { id: itemId, ...item } of menu) {
            batch.set(doc(db, 'vendors', id, 'menu', itemId), item)
        }
    }
    await batch.commit()
}