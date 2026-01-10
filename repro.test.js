
import { transformHtmlTemplate, createHead } from '@unhead/react/server';

describe('unhead regression reproduction', () => {
    it('should call transformHtmlTemplate without crashing due to dynamic imports', async () => {
        const head = createHead();
        // We just need to invoke the function to trigger the dynamic import
        // The specific arguments don't matter as much as triggering the import('../parser') line
        try {
            await transformHtmlTemplate(head, '<html><body></body></html>');
            console.log('Test PASSED: transformHtmlTemplate executed without dynamic import error');
        } catch (error) {
            console.log('Test CAUGHT ERROR:', error.message);
            if (error.code === 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG') {
                throw new Error('Reproduced ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG: Dynamic import failed in CJS environment');
            }
            // Ignore other errors (like invalid args) as we only care about the import crash
        }
    });
});
