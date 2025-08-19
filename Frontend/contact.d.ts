declare global {
    interface Window {
        logout: () => void;
        openDetailsPopup: (id: string) => void;
        openEditPopup: (id: string) => void;
        showDeleteConfirmation: (id: string) => void;
        renderContacts: () => void;
    }
}
export {};
//# sourceMappingURL=contact.d.ts.map