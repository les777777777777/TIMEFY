import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Plus, 
  Search, 
  Share2, 
  Copy, 
  HandMetal, 
  TrendingUp, 
  Clock, 
  Check,
  ChevronRight,
  LogOut,
  UserPlus
} from 'lucide-react';
import { SocialService, UserProfile, Interaction } from '../services/socialService';
import { TimeMascot } from './TimeMascot';
import { auth } from '../lib/firebase';

export const FriendsView: React.FC = () => {
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [myProfile, setMyProfile] = useState<UserProfile | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<UserProfile | null>(null);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchMyProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const p = await SocialService.getUser(user.uid);
        setMyProfile(p);
      }
    };
    fetchMyProfile();

    const unsub = SocialService.subscribeToFriends((data) => {
      setFriends(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCopyId = () => {
    if (myProfile?.kairosId) {
      navigator.clipboard.writeText(myProfile.kairosId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSearch = async () => {
    if (!searchId.startsWith('@')) return;
    const result = await SocialService.getUserByKairosId(searchId);
    setSearchResult(result);
  };

  const handleAddFriend = async (uid: string) => {
    await SocialService.addFriend(uid);
    setIsSearchOpen(false);
    setSearchResult(null);
    setSearchId('');
  };

  const isUserActive = (lastActive: any) => {
    if (!lastActive) return false;
    const date = lastActive.toDate ? lastActive.toDate() : new Date(lastActive);
    const diff = (new Date().getTime() - date.getTime()) / 1000 / 60;
    return diff < 15;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="w-12 h-12 rounded-full border-t-2 border-sunset-orange animate-spin" />
      <p className="text-sunset-wine/40 font-bold">Invocando compañía...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-32 px-8 pt-12 overflow-y-auto max-h-[85vh] no-scrollbar">
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-sunset-wine tracking-tight">Compañía</h2>
          <div 
            onClick={handleCopyId}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <p className="text-sunset-orange font-black text-xs uppercase tracking-widest bg-sunset-orange/5 px-2 py-1 rounded-lg group-hover:bg-sunset-orange/10 transition-all">
              {myProfile?.kairosId || '@cargando...'}
            </p>
            {copied ? <Check size={12} className="text-mint" /> : <Copy size={12} className="text-sunset-wine/20" />}
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsInviteOpen(true)}
          className="px-6 py-3 sunset-gradient text-white rounded-2xl flex items-center gap-2 shadow-xl shadow-sunset-orange/20 font-black text-[10px] uppercase tracking-widest"
        >
          Invitar <Plus size={14} />
        </motion.button>
      </header>

      {/* Friends List */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-[10px] font-black text-sunset-wine/40 uppercase tracking-[0.2em]">Mis Acompañantes</h4>
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="text-[10px] font-black text-sunset-orange uppercase tracking-widest flex items-center gap-1"
          >
            Buscar <Search size={12} />
          </button>
        </div>

        {friends.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {friends.map((friend) => {
              const active = isUserActive(friend.lastActive);
              return (
                <motion.div 
                  key={friend.uid}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedFriend(friend)}
                  className={`glass-card p-5 flex items-center justify-between border-none shadow-xl cursor-pointer transition-all duration-500 rounded-[2rem] ${active ? 'bg-white/90' : 'bg-white/40 opacity-70'}`}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 sunset-gradient rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sunset-orange/20 relative overflow-hidden">
                       <div className="scale-[0.3]">
                          <TimeMascot streak={friend.streak} balance={friend.balance} />
                       </div>
                    </div>
                    <div>
                      <h3 className={`text-xl font-black ${active ? 'text-sunset-wine' : 'text-sunset-wine/40'}`}>{friend.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-sunset-orange/60 uppercase tracking-widest">{friend.kairosId}</span>
                        <div className="w-1 h-1 rounded-full bg-sunset-wine/20" />
                        <span className="text-[10px] font-bold text-sunset-wine/30 uppercase tracking-widest">Racha: {friend.streak}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-mint shadow-[0_0_12px_rgba(16,185,129,0.8)]' : 'bg-sunset-wine/10'}`} />
                    <p className="text-[9px] font-black text-sunset-wine/20 uppercase tracking-widest">{active ? 'En sintonía' : 'Ausente'}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 space-y-6">
            <div className="w-20 h-20 bg-white/40 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-sunset-orange/20">
              <Users size={32} className="text-sunset-wine/10" />
            </div>
            <p className="text-sm font-black text-sunset-wine/30 uppercase tracking-widest px-8">“No necesitas una red social,<br/>necesitas compañía.”</p>
          </div>
        )}
      </div>

      {/* MODAL: Invite Options */}
      <AnimatePresence>
        {isInviteOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsInviteOpen(false)}
              className="absolute inset-0 bg-sunset-wine/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm glass-card p-10 bg-white shadow-2xl border-none space-y-8 rounded-[3.5rem]"
            >
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-black text-sunset-wine">Invitar</h3>
                <p className="text-xs font-bold text-sunset-wine/40">Comparte tu presencia en Kairos</p>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={handleCopyId}
                  className="w-full p-6 bg-rose-50 rounded-[2rem] flex items-center justify-between px-8 text-sunset-wine group hover:bg-rose-100 transition-all font-black text-[11px] uppercase tracking-widest"
                >
                  {myProfile?.kairosId}
                  <Copy size={16} className="text-sunset-orange" />
                </button>
                <button 
                  className="w-full p-6 sunset-gradient rounded-[2rem] flex items-center justify-center gap-3 text-white shadow-xl shadow-sunset-orange/20 font-black text-[11px] uppercase tracking-widest"
                >
                  <Share2 size={18} />
                  Compartir Enlace
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Search/Add Friend */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-sunset-wine/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm glass-card p-10 bg-white shadow-2xl border-none space-y-6 rounded-[3.5rem]"
            >
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-sunset-wine">Buscar Amigo</h3>
                <p className="text-[10px] font-black text-sunset-wine/40 uppercase tracking-widest">Ingresa el ID @kairos_...</p>
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="@kairos_..."
                  className="flex-1 p-5 bg-rose-50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-sunset-orange/10 font-black text-sunset-wine uppercase tracking-widest"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value.toLowerCase())}
                />
                <button 
                  onClick={handleSearch}
                  className="w-16 h-16 sunset-gradient text-white rounded-[1.5rem] flex items-center justify-center shadow-lg"
                >
                  <Search size={24} />
                </button>
              </div>

              {searchResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-rose-50 rounded-[2rem] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-white">
                      <img src={searchResult.photoURL} alt="" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-sunset-wine">{searchResult.name}</p>
                      <p className="text-[8px] font-black text-sunset-orange uppercase tracking-widest">{searchResult.kairosId}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleAddFriend(searchResult.uid)}
                    className="p-2 bg-sunset-wine text-white rounded-xl shadow-lg"
                  >
                    <UserPlus size={16} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Interaction Actions */}
      <AnimatePresence>
        {selectedFriend && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center p-6 pb-20">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedFriend(null)}
              className="absolute inset-0 bg-sunset-wine/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 200, opacity: 0 }}
              className="relative w-full max-w-sm glass-card p-10 bg-white shadow-2xl border-none space-y-10 rounded-[4rem]"
            >
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-[2rem] sunset-gradient p-1 flex items-center justify-center relative shadow-xl shadow-sunset-orange/10">
                   <div className="w-full h-full bg-white rounded-[1.8rem] flex items-center justify-center overflow-hidden">
                      <div className="scale-[0.4]">
                         <TimeMascot streak={selectedFriend.streak} balance={selectedFriend.balance} />
                      </div>
                   </div>
                   <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white ${isUserActive(selectedFriend.lastActive) ? 'bg-mint' : 'bg-rose-200'}`} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-sunset-wine tracking-tight">{selectedFriend.name}</h3>
                  <p className="text-[10px] font-black text-sunset-orange uppercase tracking-[.2em] opacity-60">Compañía en sintonía</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <HandMetal />, label: 'Bien hecho', type: 'well_done' },
                  { icon: <TrendingUp />, label: 'Sigue así', type: 'keep_going' },
                  { icon: <Clock />, label: 'Descansa', type: 'rest' }
                ].map((action) => (
                  <motion.button 
                    key={action.type}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      SocialService.sendInteraction(selectedFriend.uid, action.type as any);
                      setSelectedFriend(null);
                    }}
                    className="p-5 flex flex-col items-center gap-3 bg-rose-50 rounded-[2rem] hover:bg-sunset-orange hover:text-white transition-all group shadow-sm"
                  >
                    <div className="text-sunset-wine group-hover:text-white transition-colors">{action.icon}</div>
                    <span className="text-[9px] font-black uppercase text-center leading-tight tracking-wider">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
