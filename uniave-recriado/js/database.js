const LocalDatabase = (() => {
  const DB_NAME = "uniave-local";
  const DB_VERSION = 1;
  const STORES = ["contacts", "orders", "preferences"];

  function open() {
    return new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) {
        reject(new Error("IndexedDB não está disponível neste navegador."));
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        STORES.forEach((store) => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: "id", autoIncrement: true });
          }
        });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function transaction(storeName, mode, operation) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      const request = operation(store);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
      tx.onerror = () => reject(tx.error);
    });
  }

  return {
    add(storeName, record) {
      return transaction(storeName, "readwrite", (store) => store.add({
        ...record,
        createdAt: new Date().toISOString()
      }));
    },
    getAll(storeName) {
      return transaction(storeName, "readonly", (store) => store.getAll());
    },
    put(storeName, record) {
      return transaction(storeName, "readwrite", (store) => store.put(record));
    },
    delete(storeName, id) {
      return transaction(storeName, "readwrite", (store) => store.delete(id));
    }
  };
})();
