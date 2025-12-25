import { useRegisterSW } from 'virtual:pwa-register/react';
import { WifiOff, RefreshCcw, X } from 'lucide-react';

export default function ReloadPrompt() {

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 p-4 bg-white border border-gray-200 rounded-xl shadow-2xl animate-scale-in max-w-sm" dir="rtl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {offlineReady ? (
            <div className="p-2 bg-green-100 text-green-600 rounded-full">
              <WifiOff size={20} />
            </div>
          ) : (
            <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
              <RefreshCcw size={20} />
            </div>
          )}
          <div>
            <h3 className="font-bold text-gray-800 text-sm">
              {offlineReady ? 'جاهز للعمل بدون إنترنت' : 'تحديث جديد متوفر'}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {offlineReady
                ? 'يمكنك الآن استخدام التطبيق حتى بدون اتصال.'
                : 'تتوفر نسخة جديدة من التطبيق. قم بالتحديث الآن.'}
            </p>
          </div>
        </div>
        <button onClick={close} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>

      {needRefresh && (
        <button
          onClick={() => updateServiceWorker(true)}
          className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
        >
          تحديث الصفحة
        </button>
      )}
    </div>
  );
}