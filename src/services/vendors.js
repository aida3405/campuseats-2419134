import { collection, doc, onSnapshot, query, where, writeBatch } from 'firebase/firestore'
import { db } from '../firebase.js'

//all subscribe function returns unsubsribe function for useEffect cleanup
export function subscribeToVendors(onData, onError) {
    return onSnapshot(
        collection(db, 'vendors'),
        (snapshot) => onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
        onError,
    )
}

export function subscribeToVendor(vendorId, onData, onError) {
    return onSnapshot(
        doc(db, 'vendors', vendorId),
        (snap) => onData(snap.exists() ? { id: snap.id, ...snap.data() }:null),
        onError,
    )
}

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

//one-off: copy public/api.vendors.json into Firestore. Batch writes all or nothing
export async function seedDemoData(vendors) {
    const batch = writeBatch(db)
    for (const { menu, id, ...vendor } of vendors) {
        batch.set(doc(db, 'vendors', id), vendor)
        for (const { id: itemId, ...item } of menu) {
            batch.set(doc(db, 'vendors', id, 'menu', itemId), item)
        }
    }
    await batch.commit()
}