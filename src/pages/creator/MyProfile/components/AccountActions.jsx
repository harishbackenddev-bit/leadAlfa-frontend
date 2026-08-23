import React, { useEffect, useState } from 'react';

export default function AccountActions() {
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const locked = showDeactivateModal || showDeleteModal;
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showDeactivateModal, showDeleteModal]);

  const handleConfirmDeactivate = () => {
    console.log('Account deactivated');
    alert('Account deactivated (mock)');
    setShowDeactivateModal(false);
  };

  const handleConfirmDelete = () => {
    console.log('Account deleted');
    alert('Account deleted (mock)');
    setShowDeleteModal(false);
  };

  return (
    <div className="bg-white font-anton rounded-lg p-6 mb-6">
      <h4 className="text-2xl font-anton text-gray-900 mb-6">Account Actions</h4>

      <div className="space-y-4">
          <div className="bg-white border border-gray-300 rounded-lg p-4 flex flex-col items-center text-center space-y-3 md:flex-row md:items-center md:justify-between md:text-left md:space-y-0">
            <div className="w-full md:w-auto">
              <div className="font-anton text-gray-900 text-lg whitespace-nowrap truncate">Deactivate Account</div>
              <div className="text-xs pt-2 text-gray-500">Temporarily disable your account. You can reactivate it anytime by logging back in.</div>
            </div>
            <div className="w-full md:w-auto">
              <div className="mt-2 flex justify-center md:justify-end">
                <button
                  onClick={() => setShowDeactivateModal(true)}
                  className="px-5 py-2 font-medium rounded-full border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Deactivate
                </button>
              </div>
            </div>
          </div>

        <div className="bg-[#fff5f5] rounded-lg border border-red-200 p-4 flex flex-col items-center text-center space-y-3 md:flex-row md:items-center md:justify-between md:text-left md:space-y-0">
              <div className="w-full md:w-3/4 md:pr-6">
                <div className="flex items-center gap-2 justify-center md:justify-start font-anton text-red-600">
                  <svg className="w-4 h-4 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l5.454 9.691c.75 1.333-.213 2.91-1.742 2.91H4.545c-1.53 0-2.492-1.577-1.742-2.91L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-.993.883L9 6v4a1 1 0 001.993.117L11 10V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-anton text-red-600 whitespace-nowrap truncate">Delete Account</span>
                </div>
                <div className="text-xs pt-2 text-gray-500">Permanently remove your account and all associated data. This action cannot be undone.</div>
              </div>
              <div className="w-full md:w-auto">
                <div className="mt-2 flex justify-center md:justify-end">
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-8 py-2 font-medium rounded-full border border-red-600 text-sm text-red-600 bg-white hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
          </div>
      </div>

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowDeactivateModal(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 z-10">
            <h3 className="text-lg font-anton text-gray-900 mb-2">Deactivate Account</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to deactivate your account? You can reactivate it anytime.</p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeactivate}
                className="px-4 py-2 rounded-lg text-sm text-white bg-[#1E60DB] hover:opacity-95"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 z-10">
            <h3 className="text-lg font-anton text-red-600 mb-2">Delete Account</h3>
            <p className="text-sm text-gray-600 mb-6">This action is permanent and cannot be undone. Are you sure you want to delete your account?</p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-md text-sm text-white bg-red-600 hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
