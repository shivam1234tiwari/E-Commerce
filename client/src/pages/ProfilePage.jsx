import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { formatINR } from '../utils/currency';
import { Camera, Package, Heart, Settings, User, Save, Trash2, ShoppingBag } from 'lucide-react';

export default function ProfilePage() {
  const { user, login } = useContext(ShopContext);

  const [activeTab, setActiveTab] = useState('profile');
  const [avatar, setAvatar] = useState(
    user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300'
  );
  const [formData, setFormData] = useState({
    name: user?.name || 'Rahul Tiwari',
    email: user?.email || 'rahul@example.com',
    phone: '+91 9876543210',
    address: 'Pune, Maharashtra, India',
  });

  // Mock Orders Data
  const [orders] = useState([
    {
      id: 'ORD-98231',
      date: '2026-03-28',
      total: 149,
      status: 'Delivered',
      items: ['Wireless Headphone', 'Mechanical Keyboard'],
    },
    {
      id: 'ORD-77123',
      date: '2026-04-02',
      total: 89,
      status: 'In Transit',
      items: ['Ergonomic Leather Chair'],
    },
  ]);

  // Mock Wishlist Items
  const [wishlist, setWishlist] = useState([
    {
      id: '1',
      name: 'Wireless Noise-Canceling Headphones',
      price: 199,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    },
    {
      id: '2',
      name: 'Minimalist Mechanical Keyboard',
      price: 129,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300',
    },
  ]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
      login({ ...user, avatar: imageUrl }, 'token-12345');
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    login({ ...user, name: formData.name, email: formData.email, avatar }, 'token-12345');
    alert('Profile details saved successfully!');
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] text-slate-800 dark:text-slate-100">
      
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-6 mb-8">
        <div className="relative group">
          <img
            src={avatar}
            alt="Profile Avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-600 shadow-md"
          />
          <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full cursor-pointer shadow-lg active:scale-90 transition">
            <Camera className="w-4 h-4" />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>

        <div className="text-center sm:text-left space-y-1">
          <h1 className="text-2xl font-black">{formData.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{formData.email}</p>
          <span className="inline-block bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1 rounded-full mt-2">
            Verified Member
          </span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
        {[
          { id: 'profile', name: 'Edit Profile', icon: User },
          { id: 'orders', name: 'My Orders', icon: Package },
          { id: 'wishlist', name: 'Wishlist', icon: Heart },
          { id: 'settings', name: 'Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 px-2 text-sm font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                active
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.name}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Default Address</label>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm"
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </form>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div key={ord.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-600">{ord.id}</span>
                <h4 className="font-bold text-sm">{ord.items.join(', ')}</h4>
                <p className="text-xs text-slate-500">Ordered on {ord.date}</p>
              </div>
              <div className="text-right space-y-1">
                <span className="font-black text-sm">{formatINR(ord.total)}</span>
                <span className="block text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
                  {ord.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
              <div className="flex-1">
                <h4 className="font-bold text-xs line-clamp-1">{item.name}</h4>
                <p className="text-indigo-600 font-black text-xs mt-1">{formatINR(item.price)}</p>
              </div>
              <button
                onClick={() => setWishlist(wishlist.filter((w) => w.id !== item.id))}
                className="text-slate-400 hover:text-red-500 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl space-y-4">
          <h3 className="font-bold text-base">Account Settings</h3>
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm">Email Notifications</span>
            <input type="checkbox" defaultChecked className="accent-indigo-600" />
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm">SMS Order Updates</span>
            <input type="checkbox" defaultChecked className="accent-indigo-600" />
          </div>
        </div>
      )}

    </main>
  );
}