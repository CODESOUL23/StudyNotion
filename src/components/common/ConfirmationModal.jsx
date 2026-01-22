import IconBtn from "./IconBtn"

export default function ConfirmationModal({ modalData }) {
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-11/12 max-w-[400px] rounded-2xl border border-richblack-600 bg-richblack-800 p-8 shadow-2xl shadow-black/50 animate-scaleIn">
        <p className="text-2xl font-bold text-richblack-5">
          {modalData?.text1}
        </p>
        <p className="mt-3 mb-6 leading-relaxed text-richblack-200">
          {modalData?.text2}
        </p>
        <div className="flex items-center gap-x-4">
          <IconBtn
            onclick={modalData?.btn1Handler}
            text={modalData?.btn1Text}
          />
          <button
            className="cursor-pointer rounded-lg bg-richblack-600 py-2.5 px-5 font-semibold text-richblack-5 
            hover:bg-richblack-500 transition-all duration-200 border border-richblack-500"
            onClick={modalData?.btn2Handler}
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
      `}</style>
    </div>
  )
}
