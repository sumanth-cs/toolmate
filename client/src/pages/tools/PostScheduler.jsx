import { useState } from 'react';
import { CalendarDays, Clock, Plus, Trash2, CheckCircle2, Share2 } from 'lucide-react';
import { cn } from '../../utils/cn';









export default function PostScheduler() {
  const [posts, setPosts] = useState([
  { id: '1', content: 'Excited to announce our new product launch! 🚀', platform: 'twitter', date: '2026-03-15', time: '10:00' },
  { id: '2', content: 'Here are 5 tips for better productivity...', platform: 'linkedin', date: '2026-03-16', time: '14:30' }]
  );
  const [newPost, setNewPost] = useState({ content: '', platform: 'twitter', date: '', time: '' });

  const handleSchedule = () => {
    if (!newPost.content || !newPost.date || !newPost.time) return;

    setPosts([...posts, { ...newPost, id: Math.random().toString(36).substr(2, 9) }]);
    setNewPost({ content: '', platform: 'twitter', date: '', time: '' });
  };

  const deletePost = (id) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500">
                    <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Post Scheduler</h1>
                    <p className="text-muted-foreground">Draft and schedule your social media posts all in one place.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Plus className="w-4 h-4 text-brand-500" />
                            Create New Post
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Select Platform</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['twitter', 'linkedin', 'instagram'].map((p) =>
                  <button
                    key={p}
                    onClick={() => setNewPost({ ...newPost, platform: p })}
                    className={cn(
                      "p-2 rounded-xl border text-xs font-medium capitalize transition-all",
                      newPost.platform === p ?
                      "bg-brand-500/10 border-brand-500 text-brand-500" :
                      "bg-background border-input text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}>
                    
                                            {p}
                                        </button>
                  )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Post Content</label>
                                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="What do you want to share?"
                  className="w-full h-32 p-4 rounded-xl bg-background border border-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none resize-none text-foreground placeholder:text-muted-foreground text-sm shadow-sm" />
                
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                                    <input
                    type="date"
                    value={newPost.date}
                    onChange={(e) => setNewPost({ ...newPost, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-background border border-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-foreground text-sm shadow-sm" />
                  
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Time</label>
                                    <input
                    type="time"
                    value={newPost.time}
                    onChange={(e) => setNewPost({ ...newPost, time: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-background border border-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-foreground text-sm shadow-sm" />
                  
                                </div>
                            </div>

                            <button
                onClick={handleSchedule}
                disabled={!newPost.content || !newPost.date || !newPost.time}
                className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 mt-2">
                
                                <CheckCircle2 className="w-4 h-4" /> Schedule Post
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="glass-card rounded-2xl p-6 h-full min-h-[500px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <Clock className="w-4 h-4 text-brand-500" />
                                Upcoming Posts ({posts.length})
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {posts.length > 0 ?
              posts.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()).map((post) =>
              <div key={post.id} className="bg-background/30 rounded-xl p-4 border border-border/50 hover:border-brand-500/30 transition-all group">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-brand-500/10 text-brand-500">
                                                        {post.platform}
                                                    </span>
                                                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                                        <CalendarDays className="w-3 h-3" /> {new Date(post.date).toLocaleDateString()} at {post.time}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-foreground whitespace-pre-wrap">{post.content}</p>
                                            </div>
                                            <button
                    onClick={() => deletePost(post.id)}
                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
              ) :

              <div className="h-48 flex flex-col items-center justify-center text-muted-foreground/50 border-2 border-dashed border-border/50 rounded-xl">
                                    <Share2 className="w-10 h-10 mb-3 opacity-20" />
                                    <p className="text-sm">No posts scheduled yet.</p>
                                </div>
              }
                        </div>
                    </div>
                </div>
            </div>
        </div>);

}