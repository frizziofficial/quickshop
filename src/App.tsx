import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Menu, ShoppingBag, ChevronUp, ChevronDown, X, Plus, Minus, ArrowRight } from 'lucide-react';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

// Product type
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

// Cart item type
interface CartItem extends Product {
  quantity: number;
}

// Category type
interface Category {
  id: number;
  name: string;
  image: string;
  itemCount: number;
}

// Products data
const products: Product[] = [
  { id: 1, name: 'Leather Handbag', price: 299, image: '/images/product_1.jpg' },
  { id: 2, name: 'Designer Sunglasses', price: 189, image: '/images/product_2.jpg' },
  { id: 3, name: 'Premium Sneakers', price: 249, image: '/images/product_3.jpg' },
];

// Categories data
const categories: Category[] = [
  { id: 1, name: 'Clothing', image: '/images/category_clothing.jpg', itemCount: 245 },
  { id: 2, name: 'Accessories', image: '/images/category_accessories.jpg', itemCount: 128 },
  { id: 3, name: 'Women Skincare', image: '/images/category_women_skincare.jpg', itemCount: 86 },
  { id: 4, name: 'Men Grooming', image: '/images/category_men_grooming.jpg', itemCount: 64 },
  { id: 5, name: 'Footwear', image: '/images/category_footwear.jpg', itemCount: 152 },
  { id: 6, name: 'Bags', image: '/images/category_bags.jpg', itemCount: 93 },
  { id: 7, name: 'Jewelry', image: '/images/category_jewelry.jpg', itemCount: 178 },
  { id: 8, name: 'New Arrivals', image: '/images/category_new_arrivals.jpg', itemCount: 312 },
];

function App() {
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Refs for sections
  const heroRef = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const accessoriesRef = useRef<HTMLDivElement>(null);
  const footwearRef = useRef<HTMLDivElement>(null);
  const lifestyleRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // Cart functions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Product navigator
  const nextProduct = () => {
    setCurrentProductIndex((prev) => (prev + 1) % products.length);
  };

  const prevProduct = () => {
    setCurrentProductIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  // Initialize GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation (auto-play on load)
      const heroTl = gsap.timeline();
      
      heroTl.fromTo('.hero-bg', 
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
      )
      .fromTo('.hero-headline span',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo('.product-navigator',
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.6)' },
        '-=0.5'
      )
      .fromTo('.command-bar',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      )
      .fromTo('.nav-item',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05 },
        '-=0.4'
      );

      // Section 1: Hero - Scroll exit animation
      const heroScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            gsap.set('.hero-headline', { x: 0, opacity: 1 });
            gsap.set('.product-navigator', { x: 0, opacity: 1 });
            gsap.set('.command-bar', { y: 0, opacity: 1 });
          }
        }
      });

      heroScrollTl
        .fromTo('.hero-headline',
          { x: 0, opacity: 1 },
          { x: '-18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo('.product-navigator',
          { x: 0, opacity: 1 },
          { x: '18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo('.command-bar',
          { y: 0, opacity: 1 },
          { y: '10vh', opacity: 0, ease: 'power2.in' },
          0.75
        );

      // Section 2: Collection
      const collectionTl = gsap.timeline({
        scrollTrigger: {
          trigger: collectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      collectionTl
        .fromTo('.collection-left',
          { x: '-40vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'power2.out' },
          0
        )
        .fromTo('.collection-right',
          { x: '40vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'power2.out' },
          0
        )
        .fromTo('.collection-headline',
          { y: '30vh', opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
          0.05
        )
        .fromTo('.collection-navigator',
          { x: '20vw', opacity: 0, scale: 0.9 },
          { x: 0, opacity: 1, scale: 1, ease: 'power2.out' },
          0.1
        )
        .to('.collection-headline',
          { y: '-18vh', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .to('.collection-left',
          { x: '-18vw', opacity: 0.3, ease: 'power2.in' },
          0.7
        )
        .to('.collection-right',
          { x: '18vw', opacity: 0.3, ease: 'power2.in' },
          0.7
        )
        .to('.collection-navigator',
          { x: '18vw', opacity: 0, ease: 'power2.in' },
          0.75
        );

      // Section 3: Categories (Flowing section with reveal animations)
      gsap.fromTo('.categories-title',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: categoriesRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo('.category-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: categoriesRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Section 4: Detail
      const detailTl = gsap.timeline({
        scrollTrigger: {
          trigger: detailRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      detailTl
        .fromTo('.detail-bg',
          { scale: 1.08, opacity: 0.6 },
          { scale: 1, opacity: 1, ease: 'power2.out' },
          0
        )
        .fromTo('.detail-headline',
          { x: '40vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'power2.out' },
          0.05
        )
        .fromTo('.detail-navigator',
          { x: '20vw', opacity: 0, scale: 0.9 },
          { x: 0, opacity: 1, scale: 1, ease: 'power2.out' },
          0.1
        )
        .to('.detail-headline',
          { x: '18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .to('.detail-bg',
          { x: '-10vw', opacity: 0.4, ease: 'power2.in' },
          0.7
        )
        .to('.detail-navigator',
          { x: '18vw', opacity: 0, ease: 'power2.in' },
          0.75
        );

      // Section 5: Accessories
      const accessoriesTl = gsap.timeline({
        scrollTrigger: {
          trigger: accessoriesRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      accessoriesTl
        .fromTo('.accessories-bg',
          { x: '30vw', opacity: 0.5 },
          { x: 0, opacity: 1, ease: 'power2.out' },
          0
        )
        .fromTo('.accessories-headline',
          { x: '-40vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'power2.out' },
          0.05
        )
        .fromTo('.accessories-navigator',
          { x: '20vw', opacity: 0, scale: 0.9 },
          { x: 0, opacity: 1, scale: 1, ease: 'power2.out' },
          0.1
        )
        .to('.accessories-headline',
          { x: '-18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .to('.accessories-bg',
          { x: '10vw', opacity: 0.4, ease: 'power2.in' },
          0.7
        )
        .to('.accessories-navigator',
          { x: '18vw', opacity: 0, ease: 'power2.in' },
          0.75
        );

      // Section 6: Footwear
      const footwearTl = gsap.timeline({
        scrollTrigger: {
          trigger: footwearRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      footwearTl
        .fromTo('.footwear-bg',
          { scale: 1.1, opacity: 0.6 },
          { scale: 1, opacity: 1, ease: 'power2.out' },
          0
        )
        .fromTo('.footwear-headline',
          { x: '40vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'power2.out' },
          0.05
        )
        .fromTo('.footwear-navigator',
          { x: '20vw', opacity: 0, scale: 0.9 },
          { x: 0, opacity: 1, scale: 1, ease: 'power2.out' },
          0.1
        )
        .to('.footwear-headline',
          { y: '-18vh', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .to('.footwear-bg',
          { y: '10vh', opacity: 0.4, ease: 'power2.in' },
          0.7
        )
        .to('.footwear-navigator',
          { x: '18vw', opacity: 0, ease: 'power2.in' },
          0.75
        );

      // Section 7: Lifestyle
      const lifestyleTl = gsap.timeline({
        scrollTrigger: {
          trigger: lifestyleRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      lifestyleTl
        .fromTo('.lifestyle-bg',
          { x: '-30vw', opacity: 0.5 },
          { x: 0, opacity: 1, ease: 'power2.out' },
          0
        )
        .fromTo('.lifestyle-headline',
          { x: '-40vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'power2.out' },
          0.05
        )
        .fromTo('.lifestyle-navigator',
          { x: '20vw', opacity: 0, scale: 0.9 },
          { x: 0, opacity: 1, scale: 1, ease: 'power2.out' },
          0.1
        )
        .to('.lifestyle-headline',
          { x: '-18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .to('.lifestyle-bg',
          { scale: 1.05, opacity: 0.4, ease: 'power2.in' },
          0.7
        )
        .to('.lifestyle-navigator',
          { x: '18vw', opacity: 0, ease: 'power2.in' },
          0.75
        );

      // Section 8: Closing
      gsap.fromTo('.closing-headline',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: closingRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo('.closing-subhead',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.1,
          scrollTrigger: {
            trigger: closingRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo('.closing-cta',
        { y: 30, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay: 0.2,
          scrollTrigger: {
            trigger: closingRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Global snap for pinned sections
      const pinned = ScrollTrigger.getAll().filter(st => st.vars.pin).sort((a, b) => a.start - b.start);
      const maxScroll = ScrollTrigger.maxScroll(window);
      
      if (maxScroll && pinned.length > 0) {
        const pinnedRanges = pinned.map(st => ({
          start: st.start / maxScroll,
          end: (st.end ?? st.start) / maxScroll,
          center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
        }));

        ScrollTrigger.create({
          snap: {
            snapTo: (value: number) => {
              const inPinned = pinnedRanges.some(r => value >= r.start - 0.02 && value <= r.end + 0.02);
              if (!inPinned) return value;
              
              const target = pinnedRanges.reduce((closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
                pinnedRanges[0]?.center ?? 0
              );
              return target;
            },
            duration: { min: 0.15, max: 0.35 },
            delay: 0,
            ease: 'power2.out'
          }
        });
      }
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="relative">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Cart Overlay */}
      <div 
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold">Your Cart ({cartCount})</h2>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-white/50">
              <ShoppingBag size={64} strokeWidth={1} />
              <p className="mt-4">Your cart is empty</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-6 btn-primary"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 bg-white/5 rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-white/60">${item.price}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-white/10 rounded"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-white/10 rounded"
                        >
                          <Plus size={14} />
                        </button>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto p-1 hover:bg-white/10 rounded text-white/50 hover:text-white"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4 mt-4">
                <div className="flex justify-between mb-4">
                  <span className="text-white/60">Subtotal</span>
                  <span className="font-semibold">${cartTotal}</span>
                </div>
                <button className="w-full btn-primary">
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center">
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={32} />
          </button>
          <nav className="text-center space-y-8">
            {['Shop', 'Collections', 'About', 'Contact'].map((item) => (
              <a
                key={item}
                href="#"
                onClick={() => setIsMenuOpen(false)}
                className="block text-5xl md:text-7xl font-display font-bold uppercase hover:text-[#FF2D8D] transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Persistent Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-[4vw] py-4 flex items-center justify-between">
        <div className="nav-item text-xl font-bold tracking-tight">QuickShop</div>
        <nav className="hidden md:flex items-center gap-8">
          {['Shop', 'Collections', 'About'].map((item) => (
            <a 
              key={item}
              href="#" 
              className="nav-item micro-label text-white/70 hover:text-white transition-colors accent-underline"
            >
              {item}
            </a>
          ))}
        </nav>
      </header>

      {/* Section 1: Hero */}
      <section ref={heroRef} className="section-pinned z-10">
        <img 
          src="/images/hero_portrait.jpg" 
          alt="Fashion Hero"
          className="hero-bg bg-image"
        />
        <div className="bg-overlay" />
        <div className="vignette-overlay" />
        
        <div className="hero-headline absolute left-[6vw] top-1/2 -translate-y-1/2">
          <h1 className="headline-xl text-white" style={{ fontSize: 'clamp(48px, 9vw, 140px)' }}>
            <span className="block">Fashion</span>
            <span className="block">That</span>
            <span className="block">Moves</span>
            <span className="block">With You</span>
          </h1>
          <p className="mt-6 text-white/60 text-sm md:text-base">
            Free shipping over $75. Easy returns.
          </p>
        </div>

        <div className="product-navigator absolute right-[10vw] top-1/2 -translate-y-1/2 hidden lg:flex">
          <button 
            onClick={prevProduct}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronUp size={24} />
          </button>
          <div className="relative w-32 h-32 my-4">
            <img 
              src={products[currentProductIndex].image}
              alt={products[currentProductIndex].name}
              className="w-full h-full object-cover rounded-full transition-all duration-300"
            />
          </div>
          <button 
            onClick={nextProduct}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronDown size={24} />
          </button>
          <button 
            onClick={() => addToCart(products[currentProductIndex])}
            className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
          >
            View
          </button>
        </div>
      </section>

      {/* Section 2: Collection */}
      <section ref={collectionRef} className="section-pinned z-20">
        <div className="collection-left absolute left-0 top-0 w-[35vw] h-full">
          <img 
            src="/images/collection_left.jpg" 
            alt="Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="collection-right absolute right-0 top-0 w-[35vw] h-full">
          <img 
            src="/images/collection_right.jpg" 
            alt="Accessories"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        <div className="collection-headline absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <h2 className="headline-xl text-white" style={{ fontSize: 'clamp(40px, 8vw, 120px)' }}>
            <span className="block">New</span>
            <span className="block">Drops</span>
            <span className="block">Same</span>
            <span className="block">Energy</span>
          </h2>
          <a href="#" className="inline-flex items-center gap-2 mt-6 text-white/70 hover:text-white transition-colors">
            Browse the drop <ArrowRight size={16} />
          </a>
        </div>

        <div className="collection-navigator product-navigator absolute right-[10vw] top-1/2 -translate-y-1/2 hidden lg:flex">
          <button 
            onClick={prevProduct}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronUp size={24} />
          </button>
          <div className="relative w-32 h-32 my-4">
            <img 
              src={products[currentProductIndex].image}
              alt={products[currentProductIndex].name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <button 
            onClick={nextProduct}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronDown size={24} />
          </button>
          <button 
            onClick={() => addToCart(products[currentProductIndex])}
            className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
          >
            View
          </button>
        </div>
      </section>

      {/* Section 3: Categories Grid */}
      <section ref={categoriesRef} className="relative z-25 py-24 px-[4vw] bg-[#0B0B0D]">
        <div className="max-w-7xl mx-auto">
          <div className="categories-title text-center mb-16">
            <h2 className="headline-xl text-white mb-4" style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}>
              Shop By Category
            </h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Explore our curated collections across fashion, beauty, and lifestyle
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <div 
                key={category.id}
                className="category-card group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
              >
                <img 
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3 className="text-white font-semibold text-lg md:text-xl mb-1">{category.name}</h3>
                  <p className="text-white/60 text-sm">{category.itemCount} items</p>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#FF2D8D] transition-colors duration-300 rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Detail */}
      <section ref={detailRef} className="section-pinned z-30">
        <img 
          src="/images/detail_texture.jpg" 
          alt="Detail Texture"
          className="detail-bg bg-image"
        />
        <div className="bg-overlay" />
        <div className="vignette-overlay" />
        
        <div className="detail-headline absolute right-[6vw] top-1/2 -translate-y-1/2 text-right">
          <h2 className="headline-xl text-white" style={{ fontSize: 'clamp(40px, 8vw, 120px)' }}>
            <span className="block">Designed</span>
            <span className="block">To Stand</span>
            <span className="block">Out</span>
          </h2>
          <p className="mt-6 text-white/60 text-sm">
            Premium fabrics. Clean finishes.
          </p>
        </div>

        <div className="detail-navigator product-navigator absolute right-[10vw] top-1/2 -translate-y-1/2 hidden lg:flex">
          <button 
            onClick={prevProduct}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronUp size={24} />
          </button>
          <div className="relative w-32 h-32 my-4">
            <img 
              src={products[currentProductIndex].image}
              alt={products[currentProductIndex].name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <button 
            onClick={nextProduct}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronDown size={24} />
          </button>
          <button 
            onClick={() => addToCart(products[currentProductIndex])}
            className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
          >
            View
          </button>
        </div>
      </section>

      {/* Section 5: Accessories */}
      <section ref={accessoriesRef} className="section-pinned z-40">
        <img 
          src="/images/accessories_portrait.jpg" 
          alt="Accessories"
          className="accessories-bg bg-image"
        />
        <div className="bg-overlay" />
        <div className="vignette-overlay" />
        
        <div className="accessories-headline absolute left-[6vw] top-1/2 -translate-y-1/2">
          <h2 className="headline-xl text-white" style={{ fontSize: 'clamp(40px, 8vw, 120px)' }}>
            <span className="block">The</span>
            <span className="block">Details</span>
            <span className="block">Matter</span>
          </h2>
          <a href="#" className="inline-flex items-center gap-2 mt-6 text-white/70 hover:text-white transition-colors">
            Shop accessories <ArrowRight size={16} />
          </a>
        </div>

        <div className="accessories-navigator product-navigator absolute right-[10vw] top-1/2 -translate-y-1/2 hidden lg:flex">
          <button 
            onClick={prevProduct}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronUp size={24} />
          </button>
          <div className="relative w-32 h-32 my-4">
            <img 
              src={products[currentProductIndex].image}
              alt={products[currentProductIndex].name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <button 
            onClick={nextProduct}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronDown size={24} />
          </button>
          <button 
            onClick={() => addToCart(products[currentProductIndex])}
            className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
          >
            View
          </button>
        </div>
      </section>

      {/* Section 6: Footwear */}
      <section ref={footwearRef} className="section-pinned z-50">
        <img 
          src="/images/footwear_scene.jpg" 
          alt="Footwear"
          className="footwear-bg bg-image"
        />
        <div className="bg-overlay" />
        <div className="vignette-overlay" />
        
        <div className="footwear-headline absolute right-[6vw] top-1/2 -translate-y-1/2 text-right">
          <h2 className="headline-xl text-white" style={{ fontSize: 'clamp(40px, 8vw, 120px)' }}>
            <span className="block">Step</span>
            <span className="block">Into</span>
            <span className="block">Something</span>
            <span className="block">New</span>
          </h2>
          <p className="mt-6 text-white/60 text-sm">
            New arrivals weekly.
          </p>
        </div>

        <div className="footwear-navigator product-navigator absolute right-[10vw] top-1/2 -translate-y-1/2 hidden lg:flex">
          <button 
            onClick={prevProduct}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronUp size={24} />
          </button>
          <div className="relative w-32 h-32 my-4">
            <img 
              src={products[currentProductIndex].image}
              alt={products[currentProductIndex].name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <button 
            onClick={nextProduct}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronDown size={24} />
          </button>
          <button 
            onClick={() => addToCart(products[currentProductIndex])}
            className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
          >
            View
          </button>
        </div>
      </section>

      {/* Section 7: Lifestyle */}
      <section ref={lifestyleRef} className="section-pinned z-[60]">
        <img 
          src="/images/lifestyle_portrait.jpg" 
          alt="Lifestyle"
          className="lifestyle-bg bg-image"
        />
        <div className="bg-overlay" />
        <div className="vignette-overlay" />
        
        <div className="lifestyle-headline absolute left-[6vw] top-1/2 -translate-y-1/2">
          <h2 className="headline-xl text-white" style={{ fontSize: 'clamp(40px, 8vw, 120px)' }}>
            <span className="block">Wear</span>
            <span className="block">It Your</span>
            <span className="block">Way</span>
          </h2>
          <p className="mt-6 text-white/60 text-sm">
            Tag #QuickShop
          </p>
        </div>

        <div className="lifestyle-navigator product-navigator absolute right-[10vw] top-1/2 -translate-y-1/2 hidden lg:flex">
          <button 
            onClick={prevProduct}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronUp size={24} />
          </button>
          <div className="relative w-32 h-32 my-4">
            <img 
              src={products[currentProductIndex].image}
              alt={products[currentProductIndex].name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <button 
            onClick={nextProduct}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronDown size={24} />
          </button>
          <button 
            onClick={() => addToCart(products[currentProductIndex])}
            className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
          >
            View
          </button>
        </div>
      </section>

      {/* Section 8: Closing */}
      <section ref={closingRef} className="relative z-[70] min-h-screen">
        <div 
          className="min-h-[70vh] flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(135deg, #6B4BFF 0%, #4a2fd8 100%)' 
          }}
        >
          <div className="text-center px-6">
            <h2 className="closing-headline headline-xl text-white mb-6" style={{ fontSize: 'clamp(48px, 10vw, 160px)' }}>
              Shop The Look
            </h2>
            <p className="closing-subhead text-white/80 text-lg md:text-xl mb-10 max-w-xl mx-auto">
              Curated fits. Easy checkout. Delivered fast.
            </p>
            <div className="closing-cta flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Start Shopping
              </button>
              <button className="btn-secondary">
                View Lookbook
              </button>
            </div>
          </div>
        </div>

        <div className="py-16 px-6 bg-[#0B0B0D] border-t border-white/10">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-xl font-semibold mb-2">Get drops in your inbox</h3>
            <p className="text-white/60 text-sm mb-6">Be the first to know about new arrivals and exclusive offers.</p>
            <div className="flex gap-2">
              <input 
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-full text-sm focus:outline-none focus:border-[#FF2D8D]"
              />
              <button className="btn-primary px-6">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <footer className="py-12 px-[4vw] bg-[#0B0B0D] border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="micro-label text-white/40 mb-4">Shop</h4>
              <ul className="space-y-2">
                {['New Arrivals', 'Women', 'Men', 'Accessories', 'Sale'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="micro-label text-white/40 mb-4">Support</h4>
              <ul className="space-y-2">
                {['Help Center', 'Shipping', 'Returns', 'Size Guide', 'Track Order'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="micro-label text-white/40 mb-4">Company</h4>
              <ul className="space-y-2">
                {['About Us', 'Careers', 'Press', 'Sustainability', 'Affiliates'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="micro-label text-white/40 mb-4">Social</h4>
              <ul className="space-y-2">
                {['Instagram', 'TikTok', 'Pinterest', 'Twitter', 'YouTube'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">© QuickShop. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>
      </section>

      {/* Persistent Command Bar */}
      <div className="command-bar">
        <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <Search size={18} />
          <span className="micro-label hidden sm:inline">Search</span>
        </button>
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <Menu size={18} />
          <span className="micro-label hidden sm:inline">Menu</span>
        </button>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ShoppingBag size={18} />
          <span className="micro-label hidden sm:inline">Cart ({cartCount})</span>
        </button>
      </div>
    </div>
  );
}

export default App;
