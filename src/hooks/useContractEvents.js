import { useEffect } from 'react';
import { SorobanRpc, scValToNative } from '@stellar/stellar-sdk';
import { CONTRACT_ID, RPC_URL } from '../config.js';

export function useContractEvents(onNewEvent) {
    useEffect(() => {
        // Only run if a valid contract ID exists
        if (!CONTRACT_ID || CONTRACT_ID === "YOUR_DEPLOYED_CONTRACT_ID_HERE") return;

        let latestLedger = null;
        let isPolling = false;

        const poll = async () => {
            if (isPolling) return;
            isPolling = true;

            try {
                const rpc = new SorobanRpc.Server(RPC_URL);

                // Get latest ledger if not set
                if (!latestLedger) {
                    const info = await rpc.getLatestLedger();
                    latestLedger = info.sequence - 100; // look back 100 ledgers on start
                }

                // Query for events specific to our contract
                const events = await rpc.getEvents({
                    startLedger: latestLedger,
                    filters: [{
                        type: "contract",
                        contractIds: [CONTRACT_ID], // match our deployed Soroban contract
                    }],
                });

                if (events.events && events.events.length > 0) {
                    // Update latest ledger tracker so we don't process these again
                    latestLedger = events.latestLedger + 1;

                    // Parse each event and fire callback
                    events.events.forEach(event => {
                        // event.topic is an array of scVals. First one is the event name (e.g. "increment")
                        const eventName = scValToNative(event.topic[0]);

                        // Parse values based on the event shape defined in Rust
                        let payload = {};
                        const nativeValue = scValToNative(event.value);

                        if (eventName === 'increment' && Array.isArray(nativeValue)) {
                            payload = {
                                user: nativeValue[0]?.toString() || "Unknown",
                                count: nativeValue[1]?.toString() || "0",
                            };
                        } else if (eventName === 'reset' && Array.isArray(nativeValue)) {
                            payload = {
                                user: nativeValue[0]?.toString() || "Unknown",
                            };
                        }

                        onNewEvent({
                            id: event.id,
                            type: eventName,
                            ledger: event.ledger,
                            timestamp: new Date().toISOString(), // Soroban events don't have block time natively attached to the event payload yet, so using local time
                            ...payload
                        });
                    });
                } else if (events.latestLedger) {
                    // Even if there are no events, advance the ledger marker 
                    // so we don't request the same huge range next time
                    latestLedger = events.latestLedger + 1;
                }
            } catch (err) {
                // Silently handle errors to avoid UI crashes
                // console.error("Error polling contract events:", err);
            } finally {
                isPolling = false;
            }
        };

        // Poll immediately, then every 5 seconds
        poll();
        const interval = setInterval(poll, 5000);
        return () => clearInterval(interval);

    }, [onNewEvent, CONTRACT_ID]);
}
