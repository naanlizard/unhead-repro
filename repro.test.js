import { transformHtmlTemplate, createHead } from '@unhead/react/server';

describe('unhead regression reproduction', () => {
    it('should call transformHtmlTemplate without crashing on dynamic imports', async () => {
        const head = createHead();

        // This call will trigger the dynamic import('../parser') introduced in v2.0.18
        // If the environment is CJS and Babel is not transpiling import(), this will crash.
        try {
            await transformHtmlTemplate(head, '<html><body><div id="app"></div></body></html>');
            console.log('✅ transformHtmlTemplate executed successfully.');
        } catch (error) {
            if (error.code === 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG' ||
                error.message.includes('experimental-vm-modules')) {
                console.error('❌ Reproduced Dynamic Import Crash:', error.message);
                throw error; // Fail the test with the original error
            }

            // If it's another error (e.g. schema validation), it means the import succeeded
            console.log('✅ Dynamic import succeeded (ignoring unrelated error):', error.message);
        }
    });
});
