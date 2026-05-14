export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin">
        <div className="w-8 h-8 border-4 border-slate-600 border-t-blue-500 rounded-full"></div>
      </div>
    </div>
  );
}
