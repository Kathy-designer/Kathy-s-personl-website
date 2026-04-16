/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Folder, 
  Youtube, 
  Podcast, 
  Heart, 
  Share2, 
  X, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Globe,
  PenTool,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { ParticleBackground } from './components/ParticleBackground';
import { cn } from './lib/utils';

// --- Types ---

interface WorkExperience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: React.ReactNode;
  color: string;
  icon: React.ReactNode;
}

interface PodcastItem {
  id: string;
  title: string;
  description: string;
  link: string;
}

interface YouTuber {
  id: string;
  name: string;
  avatar: string;
  link: string;
}

interface Interest {
  id: string;
  title: string;
  image: string;
}

// --- Content Data ---

const WORK_EXPERIENCE: WorkExperience[] = [
  { 
    id: '1', 
    title: 'Business & Translation', 
    company: 'Exhibition & Trade', 
    period: '2023 - 2024', 
    icon: <Globe className="w-6 h-6" />,
    color: 'bg-[#B8E1FF]', // Macaron Blue
    description: (
      <ul className="space-y-2 list-disc pl-4">
        <li>135届春季广交会（新加坡品派饮品）：负责展位翻译与产品推销，收集60+潜在客户，协助成交1笔大单及8笔样品采购。</li>
        <li>136届秋季广交会：外围拓展外商资源，5天收集200+外商名片，储备大量潜在客户。</li>
        <li>国际编织展（广西那量编制）：产品翻译与客户对接，链接5+精准客户，协助促成土耳其客户15万元定制大单。</li>
        <li>亚洲泳池SPA博览会（中山中立照明）：中英商务翻译，精准传递产品参数，对接5位高质量客户，协助成交3笔订单，总金额超30万元。</li>
        <li>累计推动交易总额超70万元，擅长跨文化沟通、客户开发与订单促成。</li>
      </ul>
    )
  },
  { 
    id: '2', 
    title: 'Content & New Media', 
    company: 'Digital Marketing', 
    period: '2022 - 2024', 
    icon: <PenTool className="w-6 h-6" />,
    color: 'bg-[#FFD1DC]', // Macaron Pink
    description: (
      <ul className="space-y-2 list-disc pl-4">
        <li>新东方国际教育（新媒体运营）：用AIGC做雅思/GRE内容创作，平台投放吸引500+目标用户，账号涨粉3000+。</li>
        <li>广州威领有限公司（电商运营）：小红书图文/视频创作，单条内容曝光10w+、点赞3w+，运营2家店铺，单月GMV 1w+。</li>
        <li>小红书个人IP（英语学习博主）：从0到1搭建账号，粉丝1600+，总赞藏7.5w，11篇笔记播放破1w，最高13w。</li>
        <li>AI产品测评内容（观猹平台）：输出30+篇深度测评报告，打造专业内容，积累5000+AI爱好者关注。</li>
      </ul>
    )
  },
  { 
    id: '3', 
    title: 'Overseas Growth & KOC', 
    company: 'Growth Operation', 
    period: '2023', 
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'bg-[#FFF9C4]', // Macaron Yellow
    description: (
      <ul className="space-y-2 list-disc pl-4">
        <li>广州红圆点科技（海外增长运营）：负责海外KOC挖掘、建联与投放，1个月带来6000+新用户转化，ROI稳定在5。</li>
        <li>主导爆款内容策划，5条内容破百万播放，最高单平台400万。</li>
        <li>独立策划UGC增长，24小时0成本招募200+创作者。</li>
      </ul>
    )
  },
  { 
    id: '4', 
    title: 'AI Product & Evaluation', 
    company: 'AI Tech', 
    period: '2023 - Present', 
    icon: <Cpu className="w-6 h-6" />,
    color: 'bg-[#E1BEE7]', // Macaron Purple
    description: (
      <ul className="space-y-2 list-disc pl-4">
        <li>观猹平台（AI产品测评员）：体验国内外AI产品，输出30+篇测评报告，识别体验问题并提供优化建议。</li>
        <li>AI语音工具初创公司（产品运营）：跟进用户反馈迭代功能、交互体验优化建议，方案被纳入开发路线图。</li>
        <li>个人AI产品开发：用敏捷工具独立开发轻量AI应用TaskBite，完成产品设计、开发、测试全流程。</li>
      </ul>
    )
  },
];

const PODCASTS: PodcastItem[] = [
  { id: '1', title: 'Latent Space', description: 'The podcast by and for AI Engineers', link: 'https://www.youtube.com/@LatentSpacePod' },
  { id: '2', title: 'AI & I', description: 'Learn how the smartest people in the world are using AI', link: 'https://www.youtube.com/@EveryInc' },
  { id: '3', title: 'Google DeepMind', description: 'Interview with Google\'s AI leaders', link: 'https://www.youtube.com/@googledeepmind' },
  { id: '4', title: 'The AI Daily Brief', description: 'AI news with an opinion; saves Twitter scrolls', link: 'https://www.youtube.com/@AIDailyBrief' },
  { id: '5', title: 'TBPN', description: 'Technology\'s daily show', link: 'https://www.youtube.com/@TBPNLive' },
  { id: '6', title: 'Training Data', description: 'Sequoia Capital partners host conversations with leading AI builders', link: 'https://www.youtube.com/@sequoiacapital' },
  { id: '7', title: 'Lenny\'s Podcast', description: 'Interviews with world-class product leaders', link: 'https://www.youtube.com/@LennysPodcast' },
  { id: '8', title: 'The Psychology of your 20s', description: 'Everything is psychology, including your 20s.', link: 'https://www.youtube.com/@thepsychologyofyour20s' },
  { id: '9', title: '纵横四海', description: '心理、认识、自我成长', link: 'https://podcasts.apple.com/cn/search?term=%E7%BA%B5%E6%A8%AA%E5%9B%9B%E6%B5%B7' },
  { id: '10', title: '42章经', description: '互联网、AI、创业与投资', link: 'https://podcasts.apple.com/cn/podcast/42%E7%AB%A0%E7%BB%8F/id1700299886' },
  { id: '11', title: '温柔一刀', description: '品牌商业、消费趋势', link: 'https://podcasts.apple.com/cn/podcast/42%E7%AB%A0%E7%BB%8F/id1700299886' },
  { id: '12', title: '知行小酒馆', description: '理财投资、人生生活', link: 'https://podcasts.apple.com/cn/podcast/%E7%9F%A5%E8%A1%8C%E5%B0%8F%E9%85%92%E9%A6%86/id1559695855' },
];

const YOUTUBERS: YouTuber[] = [
  { id: '1', name: 'Greg Isenberg', avatar: 'https://picsum.photos/seed/greg/200/200', link: 'https://www.youtube.com/@GregIsenberg' },
  { id: '2', name: 'Tina Huang', avatar: 'https://picsum.photos/seed/tina/200/200', link: 'https://www.youtube.com/@TinaHuang1' },
  { id: '3', name: 'Silicon Valley Girl', avatar: 'https://picsum.photos/seed/svgirl/200/200', link: 'https://www.youtube.com/@SiliconValleyGirl' },
  { id: '4', name: 'Lenny\'s podcast', avatar: 'https://picsum.photos/seed/lenny/200/200', link: 'https://www.youtube.com/@LennysPodcast' },
  { id: '5', name: 'Xuan酱', avatar: 'https://picsum.photos/seed/xuan/200/200', link: 'https://www.youtube.com/@Xuan2333' },
  { id: '6', name: '秋芝2046', avatar: 'https://picsum.photos/seed/qiuzhi/200/200', link: 'https://www.youtube.com/@qiuzhi2046' },
  { id: '7', name: '影视飓风', avatar: 'https://picsum.photos/seed/storm/200/200', link: 'https://www.youtube.com/@mediastorm6801' },
  { id: '8', name: '小Lin说', avatar: 'https://picsum.photos/seed/xiaolin/200/200', link: 'https://www.youtube.com/@xiao_lin_shuo' },
  { id: '9', name: 'HTX Studio', avatar: 'https://picsum.photos/seed/hetongxue/200/200', link: 'https://www.youtube.com/@hetongxue' },
];

const INTERESTS: Interest[] = [
  { id: '1', title: 'Surfing', image: 'https://cdn.jsdelivr.net/gh/Kathy-designer/pic/img/img_v3_0210q_192315fb-7c43-41e7-af20-548c7f02bf9g.jpg' },
  { id: '2', title: 'Nature & Travel', image: 'https://cdn.jsdelivr.net/gh/Kathy-designer/pic/img/img_v3_0210q_ff9a029a-0d17-4ddd-bb1a-a179f9ed7b7g.jpg' },
  { id: '3', title: 'Cat', image: 'https://cdn.jsdelivr.net/gh/Kathy-designer/pic/img/img_v3_0210q_a826c432-8dda-45c1-a33d-9caef6da9cfg.jpg' },
  { id: '4', title: 'Exhibitions', image: 'https://cdn.jsdelivr.net/gh/Kathy-designer/pic/img/img_v3_0210q_b23ba5c8-d691-4bfc-bf7e-7088f025afdg.jpg' },
  { id: '5', title: 'Life Moments', image: 'https://cdn.jsdelivr.net/gh/Kathy-designer/pic/img/img_v3_0210q_b5d020c8-b90e-4627-867b-994987cf8f5g.jpg' },
];

// --- Components ---

const Section: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({ children, className, id }) => (
  <section id={id} className={cn("min-h-screen flex flex-col items-center justify-center relative px-6 py-20", className)}>
    {children}
  </section>
);

const ArtGallery: React.FC<{ items: Interest[] }> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div className="relative w-full max-w-6xl h-[700px] flex flex-col items-center justify-center overflow-hidden">
      {/* Browser-like UI Bar (Reference Style) */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-2xl z-30 px-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 flex items-center justify-between shadow-2xl">
          <div className="flex gap-2">
            <button onClick={prev} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ChevronDown className="w-4 h-4 rotate-90" />
            </button>
            <button onClick={next} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>
          <div className="flex-1 mx-4 bg-black/5 rounded-lg py-1.5 px-4 flex items-center gap-2">
            <Globe className="w-3 h-3 text-black/40" />
            <span className="text-[10px] text-black/40 font-medium">ArtMuseum.com</span>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-lg bg-black/5" />
            <div className="w-8 h-8 rounded-lg bg-black/5" />
          </div>
        </div>
      </div>

      {/* 3D Gallery Stage */}
      <div className="relative w-full h-full flex items-center justify-center perspective-2000">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => {
            const offset = index - currentIndex;
            const absOffset = Math.abs(offset);
            
            // Only show current and neighbors for performance and visual clarity
            if (absOffset > 2) return null;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8, x: offset * 400, rotateY: offset * -45 }}
                animate={{ 
                  opacity: 1 - absOffset * 0.3, 
                  scale: 1 - absOffset * 0.1,
                  x: offset * 350,
                  z: -absOffset * 200,
                  rotateY: offset * -35,
                  zIndex: 10 - absOffset
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={cn(
                  "absolute w-[350px] md:w-[450px] aspect-[4/5] preserve-3d cursor-pointer",
                  currentIndex === index && "z-20"
                )}
                onClick={() => currentIndex === index && setIsExpanded(true)}
              >
                <div className="w-full h-full bg-white rounded-[2rem] p-4 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-black/5 overflow-hidden group">
                  <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Card Content (Reference Style) */}
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <h3 className="text-2xl font-serif italic mb-2">{item.title}</h3>
                      <p className="text-[10px] uppercase tracking-widest opacity-60">Collection 2024</p>
                    </div>

                    {/* Expand Button (Reference Style) */}
                    {currentIndex === index && (
                      <motion.button
                        layoutId="expand-btn"
                        className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full flex items-center gap-2 text-white text-[10px] uppercase tracking-widest font-bold"
                      >
                        <Share2 className="w-3 h-3" /> Expand
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Expanded View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-white/90 backdrop-blur-2xl flex items-center justify-center p-6"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              layoutId={`card-${items[currentIndex].id}`}
              className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src={items[currentIndex].image} 
                  alt={items[currentIndex].title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-8">
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="p-4 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="space-y-4">
                  <h2 className="text-6xl font-serif italic leading-tight">{items[currentIndex].title}</h2>
                  <p className="text-black/40 leading-relaxed font-light">
                    "I look at the moments and with all my being feel that I am a part of these stories."
                  </p>
                </div>
                <div className="pt-8 border-t border-black/5 flex gap-12">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-black/30 mb-1">Medium</p>
                    <p className="text-sm font-medium">Digital Photography</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-black/30 mb-1">Year</p>
                    <p className="text-sm font-medium">2024</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls (Reference Style) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-sm z-30">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 flex items-center justify-between shadow-xl">
          <button onClick={prev} className="p-3 hover:bg-black/5 rounded-xl transition-colors">
            <ChevronDown className="w-4 h-4 rotate-90" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-black/10">
              <img src="https://picsum.photos/seed/kathy/100/100" alt="Artist" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-tight">Kathy</p>
              <p className="text-[8px] text-black/40 uppercase tracking-widest">Indefinable Soul</p>
            </div>
          </div>
          <button onClick={next} className="p-3 hover:bg-black/5 rounded-xl transition-colors">
            <ChevronDown className="w-4 h-4 -rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [selectedWork, setSelectedWork] = useState<WorkExperience | null>(null);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const sections = ['hero', 'work', 'podcasts', 'youtube', 'interests', 'xiaohongshu'];
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sections.indexOf(entry.target.id);
          if (index !== -1) setActiveSection(index);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (index: number) => {
    const sections = ['hero', 'work', 'podcasts', 'youtube', 'interests', 'xiaohongshu'];
    const element = document.getElementById(sections[index]);
    element?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(index);
  };

  return (
    <div className="bg-[#f8f7f4] text-[#1a1a1a] selection:bg-black selection:text-white font-sans overflow-x-hidden">
      <ParticleBackground />

      {/* Navigation */}
      <nav className="fixed top-1/2 right-8 -translate-y-1/2 z-50 hidden md:flex flex-col gap-6">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              activeSection === i ? "bg-black scale-150" : "bg-black/10 hover:bg-black/30"
            )}
          />
        ))}
      </nav>

      {/* Hero Section */}
      <Section id="hero" className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8 overflow-hidden">
            <motion.h1 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-[120px] font-serif italic leading-none tracking-tight"
            >
              Know about Kathy
            </motion.h1>
          </div>
          <p className="text-black/40 text-xs uppercase tracking-[0.8em] mb-12 font-medium">
            AN INDEFINABLE SOUL
          </p>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => scrollTo(1)}
          >
            <span className="text-[10px] uppercase tracking-widest text-black/20">Explore Journey</span>
            <ChevronDown className="w-4 h-4 text-black/20" />
          </motion.div>
        </motion.div>
      </Section>

      {/* Work Section (Folders) */}
      <Section id="work">
        <div className="relative w-full max-w-4xl aspect-square md:aspect-video flex items-center justify-center">
          {/* Central Photo */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="relative z-10 w-48 h-64 md:w-64 md:h-80 bg-white border border-black/5 p-2 shadow-2xl rotate-2"
          >
            <img 
              src="https://cdn.jsdelivr.net/gh/Kathy-designer/pic/img/img_v3_0210q_2d4b82a9-b7b7-45a6-9106-47725847c15g.jpg" 
              alt="Kathy" 
              className="w-full h-full object-cover transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
              <h2 className="text-2xl font-serif italic tracking-tight">Kathy</h2>
            </div>
          </motion.div>

          {/* Folders */}
          {WORK_EXPERIENCE.map((work, index) => {
            const angle = (index / WORK_EXPERIENCE.length) * Math.PI * 2 - Math.PI / 2;
            const radius = 280;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={work.id}
                initial={{ x: 0, y: 0, opacity: 0 }}
                whileInView={{ x, y, opacity: 1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                onClick={() => setSelectedWork(work)}
                className="absolute cursor-pointer flex flex-col items-center gap-2 group z-20"
              >
                <div className={cn("p-5 rounded-2xl shadow-sm transition-all duration-300 border border-black/5", work.color)}>
                  <Folder className="w-8 h-8 text-black/60 group-hover:text-black" />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-black/30 group-hover:text-black transition-colors max-w-[100px] text-center">
                  {work.title}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Work Detail Modal */}
        <AnimatePresence>
          {selectedWork && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/80 backdrop-blur-md"
              onClick={() => setSelectedWork(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white border border-black/5 p-10 max-w-2xl w-full relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedWork(null)}
                  className="absolute top-6 right-6 text-black/20 hover:text-black transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-4 mb-6">
                  <div className={cn("p-3 rounded-xl", selectedWork.color)}>
                    {selectedWork.icon}
                  </div>
                  <div>
                    <h3 className="text-3xl font-serif italic">{selectedWork.title}</h3>
                    <p className="text-black/40 text-xs uppercase tracking-widest">{selectedWork.company} | {selectedWork.period}</p>
                  </div>
                </div>
                <div className="text-black/70 leading-relaxed font-light text-sm max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                  {selectedWork.description}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Section>

      {/* Podcast Section */}
      <Section id="podcasts">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-serif italic tracking-tight mb-4">Podcast Library</h2>
          <p className="text-black/30 text-[10px] uppercase tracking-[0.5em] font-medium">Insights from the AI Frontier</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {PODCASTS.map((podcast) => (
            <motion.a
              key={podcast.id}
              href={podcast.link}
              whileHover={{ y: -5 }}
              className="group p-8 bg-white border border-black/5 hover:border-black/20 transition-all duration-300 flex flex-col justify-between aspect-video"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <Podcast className="w-5 h-5 text-black/20 group-hover:text-black transition-colors" />
                  <ExternalLink className="w-4 h-4 text-black/10 group-hover:text-black/40" />
                </div>
                <h3 className="text-xl font-serif italic mb-2">{podcast.title}</h3>
                <p className="text-black/40 text-xs leading-relaxed">{podcast.description}</p>
              </div>
              <div className="mt-6 pt-6 border-t border-black/5">
                <span className="text-[9px] uppercase tracking-widest font-bold text-black/20 group-hover:text-black/60">Listen Now</span>
              </div>
            </motion.a>
          ))}
        </div>
      </Section>

      {/* YouTube Section */}
      <Section id="youtube" className="overflow-hidden">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-serif italic tracking-tight mb-4">YouTube Inspiration</h2>
          <p className="text-black/30 text-[10px] uppercase tracking-[0.5em] font-medium">Creators I Follow</p>
        </div>
        
        <div className="relative w-full max-w-5xl h-[600px] flex flex-col items-center justify-end pb-10">
          {/* Central Figure (Bottom Center) */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10 w-64 md:w-80"
          >
            <img 
              src="https://cdn.jsdelivr.net/gh/Kathy-designer/pic/img/img_v3_0210q_953b0114-42fa-4393-a632-ca7b3acf4fcg.png" 
              alt="Kathy Illustration" 
              className="w-full h-auto"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* YouTubers (Floating Bubbles Above) */}
          {YOUTUBERS.map((yt, index) => {
            // Manual positioning to match the reference image's organic "bubble" layout
            const positions = [
              { x: -350, y: -350, size: 110 }, // Top Left 1
              { x: -200, y: -420, size: 90 },  // Top Left 2
              { x: -120, y: -280, size: 100 }, // Mid Left
              { x: -280, y: -180, size: 95 },  // Bottom Left
              { x: 50, y: -450, size: 115 },   // Top Center
              { x: 220, y: -380, size: 105 },  // Top Right 1
              { x: 380, y: -430, size: 95 },   // Top Right 2
              { x: 180, y: -250, size: 110 },  // Mid Right
              { x: 320, y: -150, size: 100 },  // Bottom Right
            ];
            
            const pos = positions[index % positions.length];

            return (
              <motion.a
                key={yt.id}
                href={yt.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                whileInView={{ 
                  x: pos.x, 
                  y: pos.y, 
                  opacity: 1, 
                  scale: 1,
                }}
                animate={{
                  y: [pos.y, pos.y - 15, pos.y],
                }}
                transition={{
                  initial: { duration: 0.8, delay: index * 0.1 },
                  animate: {
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                whileHover={{ scale: 1.1, zIndex: 20 }}
                className="absolute flex flex-col items-center gap-3 group"
                style={{ width: pos.size, height: pos.size }}
              >
                <div className="w-full h-full rounded-full border-2 border-white shadow-xl overflow-hidden bg-white p-1 transition-all duration-500 group-hover:border-black/20 group-hover:shadow-2xl">
                  <img 
                    src={yt.avatar} 
                    alt={yt.name} 
                    className="w-full h-full object-cover rounded-full transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-8 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-black/60 bg-white/80 backdrop-blur-sm px-2 py-1 rounded">
                    {yt.name}
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </Section>

      {/* Interests Section - 3D Gallery */}
      <Section id="interests">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-serif italic tracking-tight mb-4">Life & Interests</h2>
          <p className="text-black/30 text-[10px] uppercase tracking-[0.5em] font-medium">Beyond the Screen</p>
        </div>
        <ArtGallery items={INTERESTS} />
      </Section>

      {/* Social Section */}
      <Section id="xiaohongshu">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white border border-black/5 p-12 md:p-20 shadow-sm">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-red-50 rounded-full">
                <Share2 className="w-4 h-4 text-red-400" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-red-500">Social Presence</span>
              </div>
              <h2 className="text-5xl font-serif italic">Connect with Me</h2>
            </div>
            
            <div className="space-y-6">
              <a 
                href="https://www.xiaohongshu.com/user/profile/5ac21ff14eacab5469a63ebb" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 border border-black/5 hover:border-black/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white">
                    <span className="font-bold text-xs">小</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Xiaohongshu</h3>
                    <p className="text-black/40 text-xs">English Learning & Lifestyle</p>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-black/10 group-hover:text-black transition-colors" />
              </a>

              <a 
                href="https://watcha.cn/@10005314" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 border border-black/5 hover:border-black/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    <span className="font-bold text-xs">观</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Watcha (观猹)</h3>
                    <p className="text-black/40 text-xs">AI Product Evaluation</p>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-black/10 group-hover:text-black transition-colors" />
              </a>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-black/5 -rotate-3 z-0"></div>
            <div className="relative z-10 bg-white p-3 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
              <img 
                src="https://cdn.jsdelivr.net/gh/Kathy-designer/pic/img/img_v3_0210q_2d4b82a9-b7b7-45a6-9106-47725847c15g.jpg" 
                alt="Kathy Social" 
                className="w-full aspect-[4/5] object-cover transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-20 text-center border-t border-black/5">
        <p className="text-[10px] uppercase tracking-[0.8em] text-black/20 font-bold">
          &copy; 2024 KATHY. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
