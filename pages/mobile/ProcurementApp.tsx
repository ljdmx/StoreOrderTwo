
import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, 
  User, 
  Search, 
  ChevronRight, 
  Home, 
  ShoppingBag, 
  Calendar, 
  Package, 
  Store, 
  Bell, 
  MapPin, 
  Check, 
  X, 
  FileText,
  Settings,
  LogOut,
  TrendingUp,
  Download,
  Users,
  Lock,
  Edit3,
  AlertCircle,
  QrCode,
  ArrowRight,
  Clock,
  CheckCircle,
  LayoutGrid
} from 'lucide-react';
import { MOCK_ORDERS, MOCK_PRODUCTS } from '../../services/mockData';
import { Order, OrderStatus } from '../../types';

const ProcurementApp: React.FC = () => {
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'order' | 'purchase' | 'profile'>('home');
  const [orderTab, setOrderTab] = useState<OrderStatus>(OrderStatus.Submitted);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Stats
  const stats = {
    pending: MOCK_ORDERS.filter(o => o.status === OrderStatus.Submitted).length,
    auditing: MOCK_ORDERS.filter(o => o.status === OrderStatus.Auditing).length,
    approved: MOCK_ORDERS.filter(o => o.status === OrderStatus.Approved).length,
    notOrdered: 3, 
  };

  // Helper
  const getProductImage = (productId: string) => MOCK_PRODUCTS.find(p => p.id === productId)?.imageUrl || '';

  // Purchase Summary
  const purchaseSummary = useMemo(() => {
    const productMap = new Map<string, { id: string, name: string, category: string, totalQty: number, storeCount: number, image: string }>();
    MOCK_ORDERS.forEach(order => {
        order.items.forEach(item => {
            if (!productMap.has(item.productId)) {
                productMap.set(item.productId, {
                    id: item.productId,
                    name: item.productName,
                    category: '蔬菜', 
                    totalQty: 0,
                    storeCount: 0,
                    image: getProductImage(item.productId)
                });
            }
            const entry = productMap.get(item.productId)!;
            entry.totalQty += (item.quantityApproved ?? item.quantityOrdered);
            entry.storeCount += 1; 
        });
    });
    return Array.from(productMap.values());
  }, []);

  // --- Login Screen ---
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-full bg-white relative overflow-hidden font-sans selection:bg-orange-100">
        <div className="flex-1 flex flex-col items-center justify-center p-8 z-10 animate-in fade-in duration-700">
           <div className="w-24 h-24 bg-gradient-to-tr from-[#165DFF] to-[#3B92FF] rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/30 ring-4 ring-blue-50">
              <ClipboardList size={40} className="text-white drop-shadow-sm" strokeWidth={2} />
           </div>
           <h1 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">日新达采购端</h1>
           <p className="text-gray-400 text-sm text-center mb-12">精准审核 · 数据驱动</p>
           
           <div className="w-full space-y-4">
              <div className="space-y-3 mb-8">
                <input type="text" placeholder="工号" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#165DFF]/20 transition-all outline-none" />
                <input type="password" placeholder="密码" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#165DFF]/20 transition-all outline-none" />
              </div>

              <button 
                onClick={() => setIsLoggedIn(true)}
                className="w-full bg-[#165DFF] text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all hover:bg-[#0E42D2]"
              >
                登录工作台
              </button>
              <div className="text-center">
                  <span className="text-gray-400 text-sm">忘记密码请联系管理员</span>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- Main App ---

  const renderHome = () => (
    <div className="flex flex-col h-full bg-[#F7F8FA] font-sans">
      {/* Sticky Header */}
      <div className="px-6 pt-14 pb-4 bg-white/80 backdrop-blur-xl sticky top-0 z-30 border-b border-gray-50/50">
        <div className="flex justify-between items-center mb-5">
           <div>
             <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none">您好，张审核员</h1>
             <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-2">
               <MapPin size={12} strokeWidth={2.5} /> <span className="truncate max-w-[200px] font-medium">云南昆明区域采购中心</span>
             </div>
           </div>
           <div className="relative p-2.5 bg-white rounded-full shadow-sm border border-gray-100 active:scale-90 transition-transform cursor-pointer">
             <Bell size={20} className="text-gray-600" strokeWidth={2} />
             <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#F53F3F] rounded-full border border-white"></span>
           </div>
        </div>
        
        <div className="bg-gray-50 rounded-2xl flex items-center px-4 py-3.5 transition-all hover:bg-white hover:shadow-sm focus-within:bg-white focus-within:ring-2 focus-within:ring-[#165DFF]/10 focus-within:shadow-md">
           <Search size={18} className="text-gray-400 mr-3" />
           <input type="text" placeholder="单号 / 门店 / 商品" className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-28 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {/* Tile Dashboard - Modern Layout */}
        <div className="mt-6 mb-8">
            <div className="flex justify-between items-center mb-4 px-1">
                 <h3 className="font-bold text-gray-900 text-lg">工作台</h3>
                 <span className="text-xs text-gray-400 font-medium bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-sm">实时数据</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {/* Pending - Highlighted */}
               <div 
                  className="bg-[#1D2129] rounded-[32px] p-6 relative overflow-hidden group shadow-[0_15px_30px_rgba(0,0,0,0.15)] cursor-pointer active:scale-[0.98] transition-all" 
                  onClick={() => setActiveTab('order')}
               >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <div className="relative z-10 flex flex-col h-full justify-between">
                     <div>
                        <span className="text-white/60 text-xs font-bold uppercase tracking-wider">待审核订单</span>
                        <div className="text-5xl font-extrabold text-white mt-2 mb-1 group-hover:scale-105 transition-transform origin-left">{stats.pending}</div>
                     </div>
                     <div className="flex items-center text-green-400 text-[11px] gap-1 bg-white/10 w-fit px-2 py-1 rounded-lg backdrop-blur-sm">
                        <TrendingUp size={12} /> +2 新增
                     </div>
                  </div>
                  <div className="absolute bottom-6 right-6 text-white/10 group-hover:text-white/30 transition-colors">
                     <ArrowRight size={24} />
                  </div>
               </div>

               {/* Grid of smaller stats */}
               <div className="grid grid-rows-2 gap-4">
                  <div className="bg-white rounded-[24px] p-5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-white hover:shadow-md transition-shadow">
                      <div>
                         <span className="text-gray-400 text-xs font-medium block mb-1">审核中</span>
                         <span className="text-2xl font-bold text-blue-600 block">{stats.auditing}</span>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                         <ClipboardList size={18} />
                      </div>
                  </div>
                  <div className="bg-white rounded-[24px] p-5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-white hover:shadow-md transition-shadow">
                      <div>
                         <span className="text-gray-400 text-xs font-medium block mb-1">今日已审</span>
                         <span className="text-2xl font-bold text-[#00B42A] block">{stats.approved}</span>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                         <Check size={18} strokeWidth={3} />
                      </div>
                  </div>
               </div>
            </div>
            
            {/* Warning Card */}
            <div className="mt-4 bg-orange-50 rounded-[24px] p-5 flex items-center justify-between border border-orange-100/50 relative overflow-hidden">
                <div className="absolute -left-4 -top-4 w-16 h-16 bg-orange-100 rounded-full blur-xl opacity-50"></div>
                <div className="flex items-center gap-4 relative z-10">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm border border-orange-100">
                      <Store size={22} />
                   </div>
                   <div>
                      <div className="text-orange-900 font-bold text-base">未下单门店</div>
                      <div className="text-orange-700/60 text-xs font-medium mt-0.5">截止 10:00 仍未提交</div>
                   </div>
                </div>
                <div className="text-3xl font-extrabold text-orange-600 mr-2">{stats.notOrdered}</div>
            </div>
        </div>

        {/* Daily Summary */}
        <div className="mt-8">
           <div className="flex justify-between items-center mb-5 px-1">
              <h3 className="font-bold text-gray-900 text-lg">每日自动汇总</h3>
              <span className="text-green-600 text-xs font-bold bg-green-50 px-3 py-1.5 rounded-full cursor-pointer hover:bg-green-100 transition-colors" onClick={() => setActiveTab('purchase')}>查看详情</span>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              {[
                  { label: '商品总件数', value: '4,520', icon: Package, color: 'text-blue-600 bg-blue-50' },
                  { label: '下单门店数', value: '128', icon: Store, color: 'text-purple-600 bg-purple-50' }
              ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-[28px] shadow-sm border border-white flex flex-col items-center justify-center gap-4 py-8 cursor-pointer active:scale-95 transition-all hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)]" onClick={() => setActiveTab('purchase')}>
                     <div className={`w-16 h-16 ${item.color} rounded-[20px] flex items-center justify-center mb-1 shadow-sm`}>
                        <item.icon size={32} strokeWidth={1.5} />
                     </div>
                     <div className="text-center">
                        <div className="font-extrabold text-gray-900 text-3xl tracking-tight leading-none mb-2">{item.value}</div>
                        <div className="text-xs text-gray-400 font-bold tracking-wide uppercase">{item.label}</div>
                     </div>
                  </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );

  const renderOrder = () => (
     <div className="flex flex-col h-full bg-[#F7F8FA]">
        <div className="bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm border-b border-gray-50/50">
           <div className="pt-14 pb-2 px-6 flex justify-between items-center">
               <div className="flex items-center gap-2">
                   <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">审核订单</h1>
               </div>
               <div className="p-2.5 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"><Search size={20} /></div>
           </div>
           <div className="px-6 flex mt-2 relative">
               {[OrderStatus.Submitted, OrderStatus.Auditing, OrderStatus.Approved].map(st => (
                 <button 
                   key={st}
                   onClick={() => setOrderTab(st)}
                   className={`mr-8 py-3 text-sm font-bold transition-colors relative z-10 ${orderTab===st ? 'text-gray-900' : 'text-gray-400'}`}
                 >
                   {st === OrderStatus.Submitted ? '待审核' : st === OrderStatus.Auditing ? '审核中' : '已审核'}
                   {orderTab===st && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-gray-900 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.2)]"></div>}
                 </button>
               ))}
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
           {MOCK_ORDERS.filter(o => o.status === orderTab).map(order => {
              const isLocked = order.status === OrderStatus.Auditing && order.auditorName !== '张审核员'; 

              return (
                 <div 
                   key={order.id} 
                   className={`bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-white transition-all relative overflow-hidden ${!isLocked ? 'active:scale-[0.98] hover:shadow-md cursor-pointer' : ''}`}
                   onClick={() => !isLocked && setSelectedOrder(order)}
                 >
                    {isLocked && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center border border-orange-100 rounded-[24px]">
                             <div className="bg-white/90 text-orange-600 px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg border border-orange-50 animate-in fade-in zoom-in duration-300">
                                <Lock size={16} /> 正在被李审核员锁定
                             </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-4">
                       <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 font-extrabold text-sm border border-gray-100">
                             {order.storeName.charAt(0)}
                          </span>
                          <div>
                             <h3 className="font-bold text-gray-900 text-base">{order.storeName}</h3>
                             <span className="text-[10px] text-gray-400 font-mono tracking-wide">#{order.id.slice(-6)}</span>
                          </div>
                       </div>
                       <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-lg">{order.orderDate.split(' ')[1]}</span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-2xl p-4 mb-4 flex justify-between items-center border border-gray-100/50">
                        <div className="text-xs text-gray-500">
                           <span className="block mb-1 font-medium">商品种类</span>
                           <span className="text-lg font-bold text-gray-900">{order.itemCount} <span className="text-xs text-gray-400 font-normal">种</span></span>
                        </div>
                        <div className="w-[1px] h-8 bg-gray-200"></div>
                        <div className="text-xs text-gray-500 text-right">
                           <span className="block mb-1 font-medium">申请总数</span>
                           <span className="text-lg font-bold text-gray-900">{order.totalQuantity} <span className="text-xs text-gray-400 font-normal">件</span></span>
                        </div>
                    </div>

                    <div className="flex justify-end">
                       {!isLocked && (
                          <button className={`text-white text-xs font-bold px-6 py-3 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2 ${order.status === OrderStatus.Approved ? 'bg-gray-800' : 'bg-[#165DFF] shadow-blue-500/20'}`}>
                             {order.status === OrderStatus.Approved ? '查看详情' : '进入审核'}
                             <ChevronRight size={14} />
                          </button>
                       )}
                    </div>
                 </div>
              );
           })}
        </div>
     </div>
  );

  const renderPurchase = () => (
     <div className="flex flex-col h-full bg-[#F7F8FA]">
        <div className="bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm border-b border-gray-50">
           <div className="pt-14 pb-2 px-6 flex justify-between items-center">
               <div className="flex items-center gap-2">
                   <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">采购单</h1>
               </div>
               <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-full text-xs font-bold text-gray-600 flex items-center gap-1.5 shadow-sm">
                  <Calendar size={14} /> 2023-11-26
               </div>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
           {/* Summary Bar */}
           <div className="bg-[#1D2129] p-6 rounded-[32px] flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.15)] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <span className="text-sm font-bold opacity-80 relative z-10 flex items-center gap-2"><LayoutGrid size={16}/> 今日汇总</span>
              <div className="text-right relative z-10">
                 <span className="text-[10px] text-gray-400 font-medium block mb-1 uppercase tracking-wider">商品总需求量</span>
                 <span className="text-[#00B42A] font-extrabold text-3xl tracking-tight">{purchaseSummary.reduce((a,b)=>a+b.totalQty,0)}</span>
              </div>
           </div>

           {/* List */}
           <div className="space-y-4">
              {purchaseSummary.map(item => (
                 <div key={item.id} className="bg-white p-4 rounded-[24px] flex gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-white active:scale-[0.99] transition-all hover:shadow-md">
                    <div className="w-20 h-20 rounded-[18px] bg-gray-50 overflow-hidden relative shadow-inner shrink-0 border border-gray-100">
                       <img src={item.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center gap-2">
                       <h4 className="font-bold text-gray-900 leading-tight text-[15px]">{item.name}</h4>
                       
                       {/* Visual Bar for Stores */}
                       <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full rounded-full" style={{width: `${Math.min(100, item.storeCount * 10)}%`}}></div>
                       </div>
                       
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 font-medium">涉及门店</span>
                          <span className="text-xs font-bold text-gray-700">{item.storeCount} 家</span>
                       </div>
                    </div>
                    <div className="flex flex-col justify-center items-end min-w-[3rem] pl-2 border-l border-gray-50 border-dashed">
                       <span className="font-extrabold text-gray-900 text-2xl">{item.totalQty}</span>
                       <span className="text-[10px] text-gray-400 font-bold uppercase">件</span>
                    </div>
                 </div>
              ))}
           </div>
        </div>
        
        {/* Footer Action */}
        <div className="bg-white p-6 border-t border-gray-50 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-20">
           <div className="flex gap-4">
              <button className="flex-1 bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                 <Download size={18} /> 导出表格
              </button>
              <button className="flex-1 bg-[#165DFF] text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all hover:bg-[#0E42D2]">
                 生成采购单
              </button>
           </div>
        </div>
     </div>
  );

  const renderAuditDetail = () => {
     if (!selectedOrder) return null;
     
     const canEdit = selectedOrder.status !== OrderStatus.Approved;

     return (
       <div className="absolute inset-0 z-50 bg-[#F7F8FA] flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="bg-white pt-14 pb-4 px-4 flex items-center justify-between shadow-sm sticky top-0 z-20 border-b border-gray-50">
             <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center">
                <ChevronRight size={24} className="rotate-180" />
             </button>
             <h1 className="text-base font-bold text-gray-900">审核详情</h1>
             <div className="w-8"></div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pb-32 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
             <div className="bg-white p-6 rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-6 border border-white">
                <h3 className="font-extrabold text-gray-900 text-xl mb-3">{selectedOrder.storeName}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md"><Clock size={12}/> {selectedOrder.orderDate}</span>
                    <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md"><User size={12}/> {selectedOrder.auditorName || '未分配'}</span>
                </div>
             </div>

             <div className="flex items-center justify-between mb-4 px-1">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">商品列表 ({selectedOrder.items.length})</h4>
                <div className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-md">编辑模式</div>
             </div>

             <div className="space-y-4">
                {selectedOrder.items.map((item, idx) => (
                   <div key={idx} className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                      <div className="flex gap-4 mb-5">
                         <div className="w-16 h-16 rounded-2xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                            <img src={getProductImage(item.productId)} className="w-full h-full object-cover" alt="" />
                         </div>
                         <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-base">{item.productName}</h4>
                            <div className="text-xs text-gray-500 mt-1 font-medium bg-gray-50 w-fit px-1.5 py-0.5 rounded">{item.spec}</div>
                            <div className="flex items-center gap-2 mt-3">
                                <span className="text-[10px] text-gray-400 font-bold uppercase">申请量</span>
                                <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-sm min-w-[2rem] text-center">{item.quantityOrdered}</span>
                            </div>
                         </div>
                      </div>
                      
                      {/* Audit Input - Enhanced Interaction */}
                      <div className="bg-gray-50/80 p-5 rounded-[20px] border border-gray-100 backdrop-blur-sm">
                         <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                                <CheckCircle size={14} className="text-[#00B42A]" strokeWidth={2.5}/> 审核通过数量
                            </span>
                            <div className="flex items-center gap-4 bg-white p-1 rounded-full shadow-sm border border-gray-100">
                               <button 
                                 className={`w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-90 transition-transform ${!canEdit && 'opacity-50'}`} 
                                 disabled={!canEdit}
                               >
                                 <span className="text-lg font-bold text-gray-400 mb-0.5">-</span>
                               </button>
                               <span className={`font-bold text-xl min-w-[2rem] text-center ${canEdit ? 'text-[#00B42A]' : 'text-gray-900'}`}>{item.quantityApproved ?? item.quantityOrdered}</span>
                               <button 
                                 className={`w-8 h-8 flex items-center justify-center rounded-full bg-[#00B42A] text-white shadow-lg shadow-green-500/20 active:scale-90 transition-transform ${!canEdit && 'opacity-50'}`} 
                                 disabled={!canEdit}
                               >
                                 <span className="text-lg font-bold mb-0.5">+</span>
                               </button>
                            </div>
                         </div>
                         <div className="relative group">
                            <input 
                              type="text" 
                              placeholder="添加审核备注..." 
                              className="w-full text-xs bg-white border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#00B42A]/20 transition-all placeholder:text-gray-400 shadow-sm group-focus-within:shadow-md"
                              disabled={!canEdit}
                              defaultValue={item.remark}
                            />
                            <Edit3 size={14} className="absolute right-3 top-3 text-gray-300 group-focus-within:text-[#00B42A] transition-colors" />
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {canEdit && (
            <div className="bg-white p-6 border-t border-gray-50 flex gap-4 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
                <button className="flex-1 bg-white text-[#F53F3F] border border-red-100 py-4 rounded-2xl font-bold text-sm hover:bg-red-50 transition-colors active:scale-95">
                   驳回订单
                </button>
                <button className="flex-[2] bg-[#165DFF] text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all hover:bg-[#0E42D2]" onClick={() => setSelectedOrder(null)}>
                   确认审核通过
                </button>
            </div>
          )}
       </div>
     );
  }

  const renderProfile = () => (
    <div className="flex flex-col h-full bg-[#F7F8FA]">
       <div className="bg-white pt-20 pb-12 px-6 rounded-b-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative z-10 mb-6">
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 rounded-[24px] bg-gradient-to-tr from-gray-100 to-gray-200 p-1 shadow-inner">
                <img src="https://picsum.photos/id/1005/200/200" className="w-full h-full rounded-[20px] object-cover border-2 border-white shadow-sm" alt="" />
             </div>
             <div>
                <h2 className="text-2xl font-extrabold text-gray-900">张审核员</h2>
                <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-bold">高级审核</span>
                    <span className="text-gray-300">|</span>
                    <span className="font-mono">ID: 8902</span>
                </div>
             </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex mt-10 gap-4">
              {[
                  { label: '累计审核', val: '2,405', color: 'text-gray-900' },
                  { label: '通过率', val: '98.5%', color: 'text-[#00B42A]' },
                  { label: '管理门店', val: '12', color: 'text-blue-600' },
              ].map((s,i) => (
                  <div key={i} className="flex-1 bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-100">
                      <div className={`text-lg font-extrabold ${s.color}`}>{s.val}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{s.label}</div>
                  </div>
              ))}
          </div>
       </div>

       <div className="px-5 space-y-4 flex-1 overflow-y-auto">
          <div className="bg-white rounded-[28px] shadow-sm p-2">
             {[
               { icon: Users, label: '公司通讯录', color: 'text-blue-600 bg-blue-50' },
               { icon: Store, label: '门店联系人', color: 'text-purple-600 bg-purple-50' },
               { icon: Settings, label: '个人设置', color: 'text-gray-600 bg-gray-50' }
             ].map((item,i) => (
                <div key={i} className="flex items-center p-4 rounded-2xl hover:bg-gray-50 active:scale-[0.99] cursor-pointer group transition-all">
                   <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shadow-sm`}>
                      <item.icon size={18} strokeWidth={2.5} />
                   </div>
                   <span className="flex-1 text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">{item.label}</span>
                   <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
                </div>
             ))}
          </div>

          <div className="bg-white rounded-[28px] shadow-sm p-2">
              <div className="flex items-center p-4 rounded-2xl hover:bg-gray-50 active:scale-[0.99] cursor-pointer group transition-all">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <AlertCircle size={18} strokeWidth={2.5} />
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
       {/* Details Overlay */}
       {selectedOrder && renderAuditDetail()}

       {/* Content */}
       <div className="flex-1 overflow-hidden relative">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'order' && renderOrder()}
          {activeTab === 'purchase' && renderPurchase()}
          {activeTab === 'profile' && renderProfile()}
       </div>

       {/* Custom Tab Bar - Clean Minimalist */}
       <div className="h-[96px] bg-white/95 backdrop-blur-2xl border-t border-gray-100 flex items-center justify-around pb-8 shrink-0 z-40 relative shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
          {[
              { id: 'home', icon: Home, label: '首页' },
              { id: 'order', icon: ClipboardList, label: '审核' },
              { id: 'purchase', icon: ShoppingBag, label: '采购' },
              { id: 'profile', icon: User, label: '我的' },
          ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`flex flex-col items-center gap-1.5 w-16 group transition-all duration-500 relative ${activeTab===tab.id ? 'text-[#165DFF]' : 'text-gray-300 hover:text-gray-400'}`}
              >
                  <div className={`relative p-1.5 rounded-2xl transition-all duration-500 ${activeTab===tab.id ? '-translate-y-2' : ''}`}>
                      <tab.icon size={26} strokeWidth={activeTab===tab.id ? 2.5 : 2} className={`transition-all duration-300`} />
                      {activeTab===tab.id && (
                           <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#165DFF] rounded-full shadow-[0_0_10px_#165DFF]"></div>
                      )}
                  </div>
                  <span className={`text-[10px] font-bold tracking-wide transition-all duration-300 absolute -bottom-3 ${activeTab===tab.id ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'}`}>
                      {tab.label}
                  </span>
              </button>
          ))}
       </div>
    </div>
  );
};

export default ProcurementApp;
