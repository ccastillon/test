import Link from "next/link";

export default function Modal({ visible, onClose }: any) {
  if (!visible) return null;

  const handleOnClose = (e: any) => {
    if (e.target.id === "modalContainer") onClose();
  };

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div id="modalContainer" onClick={handleOnClose} className="flex min-h-full justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <div className="flex place-content-between">
                    <h5 className=" font-bold" id="modal-title">
                      Unsaved Changes
                    </h5>
                    <button type="button" className="btn btn-sm btn-circle btn-ghost inline-flex justify-center place-content-end" onClick={onClose}>
                      ✕
                    </button>
                  </div>
                  <div className="mt-2">
                    <p className="text-md">Are you sure you want to leave this page? Any changes you made won&apos;t be saved.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 mb-1 sm:flex sm:flex-row-reverse sm:px-6">
              <Link
                href="/account/info"
                className="inline-block px-8 py-3 font-bold text-center text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs bg-green-CUSTOM-600 leading-pro text-xs ease-soft-in-out tracking-tight-soft shadow-soft-md bg-x-25"
              >
                Leave
              </Link>
              <button
                onClick={onClose}
                type="button"
                className="inline-block px-8 py-3 font-bold text-center uppercase align-middle transition-all bg-transparent rounded-lg cursor-pointer leading-pro text-xs ease-soft-in tracking-tight-soft bg-150 bg-x-25 hover:scale-102 active:opacity-85 text-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
