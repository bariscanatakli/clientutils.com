import React from 'react';

export default function Logo() {
  return (
    <div className="flex items-center select-none cursor-pointer group">
      {/* İsteğe bağlı: Sol tarafına o küçük CU rozetini veya bir ikon ekleyebilirsin, 
          ama saf tipografik hali aşağıdadır */}
      <span className="text-2xl font-light tracking-tight text-slate-300 group-hover:text-white transition-colors">
        client
      </span>
      <span className="text-2xl font-medium tracking-tighter text-teal-400 group-hover:text-teal-300 transition-colors">
        utils
      </span>
    </div>
  );
}