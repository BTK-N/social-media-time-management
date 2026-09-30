/**
 * ⚠️ BACKEND IS FROZEN. 
 * FastAPI currently exposes ONLY /predict_and_consult and /chat.
 * 
 * Auth, Goals, and History are stored locally in the browser. 
 * When the backend grows new endpoints (e.g. SQLite -> PostgreSQL), 
 * implement a `FastAPIAdapter` with the `StorageAdapter` interface,
 * and simply swap the export on this line. 
 * 
 * NO React component will need to change, as they all depend on this contract.
 */
import { LocalStorageAdapter } from './local';
import { StorageAdapter } from './types';

// Active Adapter
export const storage: StorageAdapter = new LocalStorageAdapter();
