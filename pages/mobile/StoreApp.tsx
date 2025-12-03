
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  ShoppingBag, 
  User, 
  Search, 
  Plus, 
  Minus, 
  ChevronRight, 
  Bell, 
  MapPin, 
  ClipboardList,
  AlertCircle,
  QrCode,
  Clock,
  ChevronLeft,
  Phone,
  LogOut,
  Info,
  FileText,
  Check,
  ArrowRight,
  TrendingUp,
  Package
} from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_ORDERS } from '../../services/mockData';
import { Product, OrderStatus } from '../../types';

interface CartItem extends Product {
  quantity: number;
}

const StoreApp: React.FC = () => {
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBinding, setIsBinding] = useState(false);

  // Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'orders' | 'profile'>('home');
  const [selectedCategory, setSelectedCategory] = useState('叶菜类');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderTimeTab, setOrderTimeTab] = useState<'today' | 'history'>('today');

  // Categories
  const categories = ['叶菜类', '根茎类', '豆类', '瓜果类', '菌菇类', '调味类', '肉禽蛋', '海鲜水产'];

  // Filter Products
  const filteredProducts = MOCK_PRODUCTS.filter(p => {
      if (selectedCategory === '全部') return true;
      if (['叶菜类', '根茎类', '菌菇类', '瓜果类'].includes(selectedCategory)) return p.category.includes('菜') || p.category.includes('根');
      if (selectedCategory === '肉禽蛋') return p.category === '肉类';
      if (selectedCategory === '海鲜水产') return p.category === '海鲜类';
      return p.category === selectedCategory;
  });
  const displayProducts = filteredProducts.length > 0 ? filteredProducts : MOCK_PRODUCTS.slice(0, 5);

  const cartTotal = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const updateCart = (product: Product, delta: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      const currentQty = existing ? existing.quantity : 0;
      const newQty = currentQty + delta;
      
      if (existing) {
        if (newQty <= 0) return prev.filter(item => item.id !== product.id);
        return prev.map(item => item.id === product.id ? { ...item, quantity: newQty } : item);
      } else {
        if (delta > 0) return [...prev, { ...product, quantity: delta }];
        return prev;
      }
    });
  };

  // --- Login Screen ---
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-full bg-[#F7F8FA] relative overflow-hidden font-sans selection:bg-green-100">
        <div className="flex-1 flex flex-col items-center justify-center p-8 z-10 animate-in fade-in duration-700">
           <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-8 shadow-[0_20px_40px_rgba(0,180,42,0.15)] ring-1 ring-green-50">
              <ShoppingBag size={40} className="text-[#00B42A]" strokeWidth={2} />
           </div>
           <h1 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">日新达门店端</h1>
           <p className="text-gray-400 text-sm text-center mb-12">高效订货 · 智能管理</p>
           
           {!isBinding ? (
             <div className="w-full space-y-4">
                <div className="space-y-4 mb-8">
                  <input type="text" placeholder="账号 / 手机号" className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm shadow-sm focus:ring-2 focus:ring-[#00B42A]/20 transition-all outline-none placeholder:text-gray-300" />
                  <input type="password" placeholder="密码" className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm shadow-sm focus:ring-2 focus:ring-[#00B42A]/20 transition-all outline-none placeholder:text-gray-300" />
                </div>
                
                <button 
                  onClick={() => setIsLoggedIn(true)}
                  className="w-full bg-[#00B42A] text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-green-500/30 active:scale-[0.98] transition-all hover:bg-[#009C25]"
                >
                  登录
                </button>
                <div className="text-center pt-2">
                  <button 
                    onClick={() => setIsBinding(true)}
                    className="text-[#00B42A] text-sm font-medium hover:text-[#009C25] transition-colors flex items-center justify-center gap-1 mx-auto"
                  >
                    <QrCode size={16} /> 扫码绑定新设备
                  </button>
                </div>
             </div>
           ) : (
             <div className="w-full bg-white p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.08)] text-center animate-in zoom-in duration-300">
                <h3 className="font-bold text-gray-900 text-lg mb-6">绑定设备</h3>
                <div className="w-56 h-56 bg-gray-900 mx-auto rounded-3xl flex items-center justify-center mb-6 relative overflow-hidden group cursor-pointer shadow-inner">
                    <QrCode size={120} className="text-white/20 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                       <span className="text-white font-medium text-sm bg-white/20 px-4 py-2 rounded-full border border-white/30 shadow-lg backdrop-blur-md">点击模拟扫码</span>
                    </div>
                    <button 
                      onClick={() => { setIsBinding(false); setIsLoggedIn(true); }}
                      className="absolute inset-0 w-full h-full z-10"
                    />
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-80 animate-[scan_2s_infinite]"></div>
                </div>
                <button onClick={() => setIsBinding(false)} className="text-gray-400 text-sm hover:text-gray-600 transition-colors">取消</button>
             </div>
           )}
        </div>
      </div>
    );
  }

  // --- Main App Components ---

  const renderHome = () => (
    <div className="flex flex-col h-full bg-[#F7F8FA] font-sans">
      {/* Sticky Header - Clean & Minimal */}
      <div className="px-6 pt-14 pb-2 bg-white/90 backdrop-blur-xl sticky top-0 z-30 transition-all shadow-sm">
        <div className="flex justify-between items-center mb-4">
           <div>
             <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none">您好，昆明门店</h1>
             <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1.5 font-medium">
               <MapPin size={12} strokeWidth={2.5} /> <span className="truncate max-w-[200px]">五华区翠湖路88号</span>
             </div>
           </div>
           <div className="relative p-2.5 bg-gray-50 rounded-full active:scale-95 transition-transform cursor-pointer hover:bg-gray-100">
             <Bell size={20} className="text-gray-600" strokeWidth={2} />
             <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#F53F3F] rounded-full border border-white"></span>
           </div>
        </div>
        
        <div className="bg-gray-50 rounded-2xl flex items-center px-4 py-3.5 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00B42A]/10 focus-within:shadow-sm">
           <Search size={18} className="text-gray-400 mr-3" />
           <input type="text" placeholder="搜索商品..." className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-28 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {/* Status Card - Elevated Cleanliness */}
        <div className="mt-6 bg-white rounded-[32px] p-1 relative shadow-[0_15px_40px_rgba(0,0,0,0.04)] overflow-hidden group">
           <div className="bg-white rounded-[28px] p-6 border border-gray-50 relative z-10">
               <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-lg">今日订货</h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mt-1">
                        <Clock size={12} /> 6月 24日 · <span className="text-[#00B42A]">营业中</span>
                    </div>
                  </div>
               </div>
               
               <div className="flex justify-between items-center mb-8 px-2">
                  {[
                      { label: '未下单', count: 1, color: 'text-gray-300', dot: 'bg-gray-200' },
                      { label: '审核中', count: 3, color: 'text-blue-500', dot: 'bg-blue-500' },
                      { label: '已审核', count: 12, color: 'text-[#00B42A]', dot: 'bg-[#00B42A]' }
                  ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center">
                         <div className="relative">
                            <span className={`text-2xl font-extrabold ${item.color} tracking-tight`}>{item.count}</span>
                            {item.count > 0 && item.label !== '未下单' && <div className={`absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full ${item.dot} ring-2 ring-white`}></div>}
                         </div>
                         <span className="text-[11px] text-gray-400 font-medium mt-1">{item.label}</span>
                      </div>
                  ))}
               </div>

               <button 
                 onClick={() => setActiveTab('shop')}
                 className="w-full bg-[#00B42A] text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-green-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-[#009C25]"
               >
                 开始订货 <ArrowRight size={18} />
               </button>
           </div>
        </div>

        {/* Categories - Breathing Icons */}
        <div className="mt-10">
           <div className="flex justify-between items-center mb-5 px-1">
              <h3 className="font-bold text-gray-900 text-lg">常用分类</h3>
              <span className="text-gray-400 text-xs font-medium active:text-[#00B42A] transition-colors cursor-pointer hover:text-gray-600" onClick={() => setActiveTab('shop')}>全部分类</span>
           </div>
           <div className="grid grid-cols-4 gap-4">
              {[
                  { name: '水果', icon: '🍇', bg: 'bg-purple-50', text: 'text-purple-600' },
                  { name: '蔬菜', icon: '🥦', bg: 'bg-green-50', text: 'text-green-600' },
                  { name: '乳制品', icon: '🥛', bg: 'bg-blue-50', text: 'text-blue-600' },
                  { name: '肉类', icon: '🥩', bg: 'bg-red-50', text: 'text-red-600' }
              ].map((cat, i) => (
                 <div key={cat.name} className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => { setSelectedCategory(i===1?'叶菜类':'全部'); setActiveTab('shop'); }}>
                    <div className={`w-[72px] h-[72px] rounded-[24px] flex items-center justify-center text-2xl transition-all duration-300 group-active:scale-95 ${cat.bg} group-hover:shadow-md group-hover:-translate-y-1`}>
                        <span className="group-hover:scale-110 transition-transform">{cat.icon}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium group-hover:text-gray-900 transition-colors">{cat.name}</span>
                 </div>
              ))}
           </div>
        </div>

        {/* Recommended - Clean Cards */}
        <div className="mt-10 pb-6">
           <h3 className="font-bold text-gray-900 text-lg mb-5 px-1">热销推荐</h3>
           <div className="grid grid-cols-2 gap-4">
              {MOCK_PRODUCTS.slice(0, 2).map((p, i) => (
                 <div key={p.id} className="bg-white p-3 rounded-[24px] shadow-[0_8px_20px_rgba(0,0,0,0.03)] active:scale-[0.98] transition-all cursor-pointer hover:shadow-[0_12px_25px_rgba(0,0,0,0.06)] group border border-gray-50" onClick={() => updateCart(p, 1)}>
                    <div className="aspect-square bg-[#F7F8FA] rounded-[20px] mb-3 overflow-hidden relative">
                       <img src={p.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-multiply" alt="" />
                       {i===0 && (
                           <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                             TOP 1
                           </div>
                       )}
                       <div className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#00B42A] opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-sm">
                          <Plus size={16} strokeWidth={3} />
                       </div>
                    </div>
                    <div className="px-1.5 pb-1">
                        <div className="font-bold text-gray-900 mb-1 truncate text-[15px]">{p.name}</div>
                        <div className="flex justify-between items-end">
                            <span className="text-gray-900 font-extrabold text-lg"><span className="text-xs font-normal text-gray-400 mr-0.5">¥</span>{p.price}</span>
                        </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );

  const renderShop = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="pt-14 pb-4 px-4 bg-white/95 backdrop-blur-xl flex items-center justify-between z-20 sticky top-0 border-b border-gray-50">
         <button onClick={() => setActiveTab('home')} className="p-2 -ml-2 text-gray-800 active:text-gray-400 transition-colors hover:bg-gray-50 rounded-full"><ChevronLeft size={24} /></button>
         <h1 className="text-base font-bold text-gray-900">商品下单</h1>
         <div className="p-2 -mr-2 text-gray-800 hover:bg-gray-50 rounded-full cursor-pointer"><Search size={22} strokeWidth={2} /></div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
         {/* Sidebar - Capsule Style */}
         <div className="w-[92px] bg-[#F7F8FA] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] py-4 space-y-2">
            {categories.map(cat => (
               <div 
                 key={cat} 
                 onClick={() => setSelectedCategory(cat)}
                 className={`mx-2 rounded-2xl py-4 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer relative ${selectedCategory === cat ? 'bg-white shadow-sm ring-1 ring-gray-100' : 'text-gray-400 hover:bg-gray-100/50'}`}
               >
                  <div className={`w-1.5 h-1.5 rounded-full mb-1 transition-all ${selectedCategory === cat ? 'bg-[#00B42A] scale-125' : 'bg-transparent'}`}></div>
                  <span className={`text-[11px] font-medium transition-colors ${selectedCategory === cat ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>{cat}</span>
               </div>
            ))}
         </div>

         {/* Product List */}
         <div className="flex-1 overflow-y-auto p-5 pb-32 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {displayProducts.map(p => {
               const qty = cart.find(i => i.id === p.id)?.quantity || 0;
               return (
                  <div key={p.id} className="flex gap-4 mb-8 group animate-in slide-in-from-bottom-2 duration-500">
                     <div className="w-24 h-24 rounded-[20px] bg-gray-50 overflow-hidden shrink-0 relative shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-100">
                        <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                     </div>
                     <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                           <h4 className="font-bold text-gray-900 text-[16px] leading-tight mb-2">{p.name}</h4>
                           <div className="flex items-center flex-wrap gap-1.5">
                              <span className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md font-medium border border-gray-100">{p.spec}</span>
                              {p.maxOrder < 999 && (
                                <span className="text-[10px] text-orange-600 px-2 py-0.5 rounded-md font-medium bg-orange-50 border border-orange-100">
                                   限 {p.maxOrder}
                                </span>
                              )}
                           </div>
                        </div>
                        <div className="flex justify-between items-end">
                           <div className="flex items-baseline gap-0.5">
                              <span className="text-xs font-bold text-[#00B42A]">¥</span>
                              <span className="text-[#00B42A] font-extrabold text-xl">{p.price.toFixed(2)}</span>
                              <span className="text-gray-400 text-xs font-normal ml-1">/{p.unit}</span>
                           </div>
                           
                           {/* Stepper - Invisible Borders */}
                           {qty > 0 ? (
                             <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-full">
                                <button onClick={() => updateCart(p, -1)} className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 active:scale-90 transition-transform hover:bg-gray-50">
                                   <Minus size={14} strokeWidth={3} />
                                </button>
                                <span className="text-sm font-bold w-4 text-center tabular-nums text-gray-900">{qty}</span>
                                <button onClick={() => updateCart(p, 1)} className="w-7 h-7 rounded-full bg-[#00B42A] flex items-center justify-center text-white active:scale-90 transition-transform shadow-lg shadow-green-500/30 hover:bg-[#009C25]">
                                   <Plus size={14} strokeWidth={3} />
                                </button>
                             </div>
                           ) : (
                             <button onClick={() => updateCart(p, 1)} className="w-8 h-8 rounded-full bg-[#00B42A] flex items-center justify-center text-white active:scale-90 transition-transform shadow-lg shadow-green-500/20 hover:bg-[#009C25]">
                                <Plus size={16} strokeWidth={3} />
                             </button>
                           )}
                        </div>
                     </div>
                  </div>
               )
            })}
         </div>
      </div>

      {/* Cart Floating Bar - Glassmorphism */}
      {cartCount > 0 && (
         <div className="absolute bottom-6 left-5 right-5 z-30 animate-in slide-in-from-bottom-4 duration-300">
             <div className="bg-[#1D2129]/90 backdrop-blur-xl text-white p-2 pl-6 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.25)] flex items-center justify-between border border-white/10 ring-1 ring-white/5">
                <div className="flex flex-col">
                   <div className="text-lg font-bold leading-none flex items-baseline gap-1">
                      <span className="text-xs text-gray-400">¥</span>{cartTotal.toFixed(2)}
                   </div>
                   <div className="text-[10px] text-gray-400 mt-0.5 font-medium">已选 {cartCount} 件商品</div>
                </div>
                <button className="bg-[#00B42A] hover:bg-[#00a326] text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-lg shadow-green-500/30 active:scale-95 transition-all">
                   去结算
                </button>
             </div>
         </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="flex flex-col h-full bg-[#F7F8FA]">
       {/* Header */}
       <div className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-50/50 transition-all">
          <div className="pt-14 pb-2 px-6 flex justify-between items-center">
             <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">订单列表</h1>
             <div className="p-2.5 bg-white border border-gray-100 rounded-full text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"><Search size={20} /></div>
          </div>
          <div className="flex px-6 mt-2 relative">
             {['today', 'history'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setOrderTimeTab(tab as any)}
                  className={`mr-8 py-3 text-sm font-bold transition-colors relative z-10 ${orderTimeTab === tab ? 'text-[#00B42A]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {tab === 'today' ? '今日订单' : '历史订单'}
                  {orderTimeTab === tab && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#00B42A] rounded-full shadow-[0_2px_8px_rgba(0,180,42,0.4)]"></div>}
                </button>
             ))}
          </div>
       </div>

       <div className="flex-1 overflow-y-auto p-6 space-y-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {MOCK_ORDERS.map((order, index) => {
             const isModifiedDemo = index === 1; 
             
             let statusConfig = { bg: "bg-green-100/50", text: "text-green-700", label: "已审核", icon: Check };
             if (order.status === OrderStatus.Auditing) {
                statusConfig = { bg: "bg-blue-100/50", text: "text-blue-700", label: "审核中", icon: Clock };
             } else if (order.status === OrderStatus.Rejected) {
                statusConfig = { bg: "bg-red-100/50", text: "text-red-700", label: "已驳回", icon: AlertCircle };
             }

             return (
               <div key={order.id} className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-transparent active:scale-[0.99] transition-all hover:shadow-[0_12px_40px_rgba(0,0,0,0.05)] group relative overflow-hidden">
                  <div className="flex justify-between items-center mb-5 relative z-10">
                     <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${statusConfig.bg} ${statusConfig.text}`}>
                            <statusConfig.icon size={18} strokeWidth={3} />
                        </div>
                        <div>
                            <div className="text-gray-900 font-bold text-[15px]">{order.storeName}</div>
                            <div className="text-xs text-gray-400 font-mono mt-0.5">{order.orderDate}</div>
                        </div>
                     </div>
                     <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${statusConfig.bg.replace('50','100')} ${statusConfig.text} border-transparent`}>{statusConfig.label}</span>
                  </div>

                  {isModifiedDemo ? (
                     <div className="mb-5 bg-orange-50/50 rounded-2xl p-4 border border-orange-100/50 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-2">
                           <span className="font-bold text-gray-900 text-sm">土豆 (15kg)</span>
                           <ArrowRight size={14} className="text-orange-400" />
                           <span className="font-bold text-orange-600 text-sm bg-white px-2 py-0.5 rounded shadow-sm border border-orange-100">12kg</span>
                        </div>
                        <div className="flex items-start gap-1.5 text-xs text-orange-700/70">
                           <Info size={14} className="shrink-0 mt-0.5" />
                           <span>库存不足，为您调整</span>
                        </div>
                     </div>
                  ) : (
                     <div className="mb-5 pl-2 border-l-2 border-gray-100 py-1">
                        <div className="flex items-baseline gap-1.5 mb-1">
                            <span className="text-xs text-gray-400 font-medium">总计</span>
                            <span className="text-xl font-extrabold text-gray-900 tracking-tight">¥{(order.totalQuantity * 45).toFixed(0)}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                            共 <span className="font-medium text-gray-700">{order.totalQuantity}</span> 件商品 · {order.itemCount} 种品类
                        </div>
                     </div>
                  )}

                  <div className="flex justify-end pt-2 border-t border-gray-50">
                     <button className="bg-gray-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-gray-900/10 active:scale-95 transition-all hover:bg-black flex items-center gap-2 group-hover:pr-4">
                        查看详情 <ChevronRight size={14} className="opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto transition-all" />
                     </button>
                  </div>
               </div>
             );
          })}
          
          <div className="py-12 flex flex-col items-center justify-center text-gray-300 gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <ClipboardList size={24} className="text-gray-300" />
              </div>
              <span className="text-xs font-medium">暂无更多订单</span>
          </div>
       </div>
    </div>
  );

  const renderProfile = () => (
    <div className="flex flex-col h-full bg-[#F7F8FA]">
       <div className="bg-white pt-20 pb-10 px-6 rounded-b-[40px] shadow-[0_15px_40px_rgba(0,0,0,0.03)] relative z-10 mb-6 border-b border-gray-50">
          <div className="flex items-center gap-6">
             <div className="relative group cursor-pointer">
                 <div className="w-20 h-20 rounded-full p-1 border-2 border-gray-50 group-hover:border-[#00B42A] transition-colors">
                    <img src="https://picsum.photos/id/64/200/200" className="w-full h-full rounded-full object-cover" alt="" />
                 </div>
                 <div className="absolute bottom-1 right-1 w-6 h-6 bg-[#00B42A] rounded-full border-4 border-white flex items-center justify-center shadow-md">
                    <Check size={10} className="text-white" strokeWidth={4} />
                 </div>
             </div>
             <div>
                <h2 className="text-2xl font-extrabold text-gray-900">李经理</h2>
                <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                    <span className="bg-gray-100 px-2.5 py-1 rounded-md text-gray-600 font-bold">采购经理</span>
                    <span className="text-gray-300">|</span>
                    <span>幸福超市 (中山路店)</span>
                </div>
             </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex mt-10 divide-x divide-gray-100">
             <div className="flex-1 text-center">
                <div className="text-xl font-extrabold text-gray-900">28</div>
                <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">本月订单</div>
             </div>
             <div className="flex-1 text-center">
                <div className="text-xl font-extrabold text-gray-900">12.8k</div>
                <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">订货金额</div>
             </div>
             <div className="flex-1 text-center">
                <div className="text-xl font-extrabold text-[#00B42A]">96%</div>
                <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">通过率</div>
             </div>
          </div>
       </div>

       <div className="px-5 space-y-4 flex-1 overflow-y-auto">
          <div className="bg-white rounded-[28px] shadow-sm p-2 border border-white">
             {[
                 { icon: FileText, label: '账单明细', color: 'text-blue-600 bg-blue-50' },
                 { icon: MapPin, label: '收货地址', color: 'text-orange-600 bg-orange-50' }, 
                 { icon: Phone, label: '通讯录', color: 'text-green-600 bg-green-50' },
             ].map((item,i) => (
                <div key={i} className="flex items-center p-4 rounded-2xl hover:bg-gray-50 active:scale-[0.99] cursor-pointer group transition-all">
                   <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                      <item.icon size={18} strokeWidth={2.5} />
                   </div>
                   <span className="flex-1 text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">{item.label}</span>
                   <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
                </div>
             ))}
          </div>

          <div className="bg-white rounded-[28px] shadow-sm p-2 border border-white">
              <div className="flex items-center p-4 rounded-2xl hover:bg-gray-50 active:scale-[0.99] cursor-pointer group transition-all">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Info size={18} strokeWidth={2.5} />
                  </div>
                  <span className="flex-1 text-sm font-bold text-gray-700">版本信息</span>
                  <span className="text-xs text-gray-400 mr-2 font-medium bg-gray-50 px-2 py-1 rounded-md">v2.0.1</span>
              </div>
          </div>
          
          <button 
             onClick={() => setIsLoggedIn(false)}
             className="w-full bg-white text-[#F53F3F] py-4 rounded-[24px] font-bold text-sm flex items-center justify-center gap-2 shadow-sm mt-4 border border-white hover:bg-red-50 active:scale-[0.98] transition-all"
          >
             <LogOut size={18} /> 退出登录
          </button>
       </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white w-full relative">
       {/* Main Content Area */}
       <div className="flex-1 overflow-hidden relative">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'shop' && renderShop()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'profile' && renderProfile()}
       </div>

       {/* Custom Tab Bar - Clean Minimalist */}
       {activeTab !== 'shop' && (
         <div className="h-[96px] bg-white/95 backdrop-blur-2xl border-t border-gray-100 flex items-center justify-around pb-8 shrink-0 z-40 relative">
            {[
                { id: 'home', icon: Home, label: '首页' },
                { id: 'shop', icon: ShoppingBag, label: '下单' },
                { id: 'orders', icon: ClipboardList, label: '订单' },
                { id: 'profile', icon: User, label: '我的' },
            ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)} 
                  className={`flex flex-col items-center gap-1.5 w-16 group transition-all duration-500 relative ${activeTab===tab.id ? 'text-[#00B42A]' : 'text-gray-300 hover:text-gray-400'}`}
                >
                    <div className={`relative p-1.5 rounded-2xl transition-all duration-500 ${activeTab===tab.id ? '-translate-y-2' : ''}`}>
                        <tab.icon size={26} strokeWidth={activeTab===tab.id ? 2.5 : 2} className={`transition-all duration-300`} />
                        {activeTab===tab.id && (
                             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#00B42A] rounded-full shadow-[0_0_10px_#00B42A]"></div>
                        )}
                    </div>
                    <span className={`text-[10px] font-bold tracking-wide transition-all duration-300 absolute -bottom-3 ${activeTab===tab.id ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'}`}>
                        {tab.label}
                    </span>
                </button>
            ))}
         </div>
       )}
    </div>
  );
};

export default StoreApp;
