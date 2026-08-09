import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import Home from '../Storefront/Home';
import Navbar from '../Storefront/Navbar';
import { 
  Save, Smartphone, Monitor, ChevronRight, Image as ImageIcon, 
  Sliders, Type, FileText, HelpCircle, Palette, Layers, ShoppingCart,
  ArrowLeft, Plus, Trash, Video, ArrowUp, ArrowDown, Search, X, AppWindow,
  Eye, EyeOff, Maximize2, ExternalLink, CheckCircle2
} from 'lucide-react';

export default function OnlineStore() {
  const { 
    layout, updateLayout, blogs, addBlog, deleteBlog, 
    faqs, addFAQ, deleteFAQ, storeSettings, showToast 
  } = useContext(AppContext);
  
  const [selectedSection, setSelectedSection] = useState(null); // header_branding | hero | trust | collections | slideshow | featured_collection | video | faq | blog | footer | branding | image_banner | collection_with_image | rich_text
  const [viewportMode, setViewportMode] = useState('desktop'); // desktop | mobile
  const [sectionsOrderList, setSectionsOrderList] = useState(layout.sectionsOrder || ['hero', 'trust', 'collections', 'featured', 'video', 'blog']);
  const [hiddenSections, setHiddenSections] = useState(layout.hiddenSections || []);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [addMenuTab, setAddMenuTab] = useState('sections'); // sections | apps
  const addMenuRef = useRef(null);
  
  // Edit Form States
  const [logoText, setLogoText] = useState(layout.logoText);
  const [announcementBar, setAnnouncementBar] = useState(layout.announcementBar);
  const [heroTitle, setHeroTitle] = useState(layout.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(layout.heroSubtitle);
  const [bannerTitle, setBannerTitle] = useState(layout.bannerTitle || 'PURCHASE WITH CONFIDENCE.');
  const [bannerSubtitle, setBannerSubtitle] = useState(layout.bannerSubtitle || 'Visit Our Showroom For A Complimentary Test Drive And Find Your Perfect Fit');
  const [bannerImage, setBannerImage] = useState(layout.bannerImage || '');
  const [collectionsList, setCollectionsList] = useState(layout.collectionsList || []);
  const [themeColors, setThemeColors] = useState(layout.themeColors || 'teal');
  const [productListColor, setProductListColor] = useState(layout.productListColor || 'white');
  const [promoVideoUrl, setPromoVideoUrl] = useState(layout.promoVideoUrl || '');
  const [footerText, setFooterText] = useState(layout.footerText || 'Trusted home patient care support, mobility aids, clinical diagnostic devices sales and supply hub in Chennai.');
  const [footerSupportTitle, setFooterSupportTitle] = useState(layout.footerSupportTitle || 'Support Hub');
  const [footerContactTitle, setFooterContactTitle] = useState(layout.footerContactTitle || 'Contact Info');
  const [footerContactAddress, setFooterContactAddress] = useState(layout.footerContactAddress || 'Aeon Healthcare Pvt Ltd, Besant Nagar, Chennai, TN 600090');
  const [footerContactPhone, setFooterContactPhone] = useState(layout.footerContactPhone || '+91 98401 23456');
  const [footerContactEmail, setFooterContactEmail] = useState(layout.footerContactEmail || 'support@aeoncare.in');
  const [footerCopyrightText, setFooterCopyrightText] = useState(layout.footerCopyrightText || '© 2026 AeonCare. Partner of AeonCare.in. India CDSCO labeling compliant. All rights reserved.');
  const [navigationTabs, setNavigationTabs] = useState(layout.navigationTabs || [
    { id: 'home', label: 'Home' },
    { id: 'catalog', label: 'Shop Catalog' },
    { id: 'services', label: 'Care Services' },
    { id: 'blog', label: 'Blog & FAQs' },
    { id: 'userPortal', label: 'My Account' }
  ]);
  
  // New Customizable Sections States
  const [imageBannerImage, setImageBannerImage] = useState(layout.imageBannerImage || '');
  const [imageBannerTitle, setImageBannerTitle] = useState(layout.imageBannerTitle || '');
  const [imageBannerSubtitle, setImageBannerSubtitle] = useState(layout.imageBannerSubtitle || '');
  const [colWithImageImage, setColWithImageImage] = useState(layout.colWithImageImage || '');
  const [colWithImageTitle, setColWithImageTitle] = useState(layout.colWithImageTitle || '');
  const [colWithImageCategory, setColWithImageCategory] = useState(layout.colWithImageCategory || 'Mobility Aid');
  const [richTextHeading, setRichTextHeading] = useState(layout.richTextHeading || '');
  const [richTextBody, setRichTextBody] = useState(layout.richTextBody || '');
  const [productsPerPage, setProductsPerPage] = useState(layout.productsPerPage || 20);
  
  // Section Sizes & Spacing State
  const [sectionSizes, setSectionSizes] = useState(layout.sectionSizes || {});

  // Dynamic Unsaved Changes state
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const markDirty = () => setHasUnsavedChanges(true);

  const isInitialized = useRef(false);
  const lastSyncedUpdatedAt = useRef(null);

  const resetFormFromLayout = () => {
    setLogoText(layout.logoText || 'AeonCare');
    setAnnouncementBar(layout.announcementBar || '');
    setHeroTitle(layout.heroTitle || '');
    setHeroSubtitle(layout.heroSubtitle || '');
    setBannerTitle(layout.bannerTitle || '');
    setBannerSubtitle(layout.bannerSubtitle || '');
    setBannerImage(layout.bannerImage || '');
    setCollectionsList(layout.collectionsList || []);
    setThemeColors(layout.themeColors || 'teal');
    setProductListColor(layout.productListColor || 'white');
    setPromoVideoUrl(layout.promoVideoUrl || '');
    setFooterText(layout.footerText || storeSettings?.slogan || 'Trusted home patient care support, mobility aids, clinical diagnostic devices sales and supply hub in Chennai.');
    setFooterSupportTitle(layout.footerSupportTitle || 'Support Hub');
    setFooterContactTitle(layout.footerContactTitle || 'Contact Info');
    setFooterContactAddress(layout.footerContactAddress || (storeSettings?.addressLine1 ? `${storeSettings.storeName}, ${storeSettings.addressLine1}, ${storeSettings.addressLine2 ? storeSettings.addressLine2 + ', ' : ''}${storeSettings.city}, ${storeSettings.state} - ${storeSettings.pincode}` : 'Aeon Healthcare Pvt Ltd, Besant Nagar, Chennai, TN 600090'));
    setFooterContactPhone(layout.footerContactPhone || storeSettings?.storePhone || '+91 98401 23456');
    setFooterContactEmail(layout.footerContactEmail || storeSettings?.storeEmail || 'support@aeoncare.in');
    setFooterCopyrightText(layout.footerCopyrightText || '© 2026 AeonCare. Partner of AeonCare.in. India CDSCO labeling compliant. All rights reserved.');
    setNavigationTabs(layout.navigationTabs || []);
    setSectionsOrderList(layout.sectionsOrder || ['hero', 'trust', 'collections', 'featured', 'video', 'blog']);
    setHiddenSections(layout.hiddenSections || []);
    setImageBannerImage(layout.imageBannerImage || '');
    setImageBannerTitle(layout.imageBannerTitle || '');
    setImageBannerSubtitle(layout.imageBannerSubtitle || '');
    setColWithImageImage(layout.colWithImageImage || '');
    setColWithImageTitle(layout.colWithImageTitle || '');
    setColWithImageCategory(layout.colWithImageCategory || 'Mobility Aid');
    setRichTextHeading(layout.richTextHeading || '');
    setRichTextBody(layout.richTextBody || '');
    setProductsPerPage(layout.productsPerPage || 20);
    setSectionSizes(layout.sectionSizes || {});
    setHasUnsavedChanges(false);
  };

  // Sync layout form state on initial mount or when a new Firestore update arrives
  useEffect(() => {
    if (layout) {
      const isNewDbUpdate = Boolean(layout.updatedAt && layout.updatedAt !== lastSyncedUpdatedAt.current);
      if (!isInitialized.current || isNewDbUpdate) {
        isInitialized.current = true;
        if (layout.updatedAt) lastSyncedUpdatedAt.current = layout.updatedAt;
        resetFormFromLayout();
      }
    }
  }, [layout, storeSettings]);

  const handleDiscardChanges = () => {
    resetFormFromLayout();
    showToast?.('Unsaved theme changes discarded.', 'info');
  };

  const handleSaveAll = (e) => {
    if (e) e.preventDefault();
    updateLayout({
      logoText,
      announcementBar,
      heroTitle,
      heroSubtitle,
      bannerTitle,
      bannerSubtitle,
      bannerImage,
      collectionsList,
      themeColors,
      productListColor,
      promoVideoUrl,
      footerText,
      footerSupportTitle,
      footerContactTitle,
      footerContactAddress,
      footerContactPhone,
      footerContactEmail,
      footerCopyrightText,
      sectionsOrder: sectionsOrderList,
      hiddenSections,
      sectionSizes,
      imageBannerImage,
      imageBannerTitle,
      imageBannerSubtitle,
      colWithImageImage,
      colWithImageTitle,
      colWithImageCategory,
      richTextHeading,
      richTextBody,
      productsPerPage: Number(productsPerPage) || 20,
      navigationTabs
    });
    setHasUnsavedChanges(false);
    showToast?.('Theme settings saved and synced successfully to the live storefront!', 'success');
  };

  // FAQ local form state
  const [faqQ, setFaqQ] = useState('');
  const [faqAns, setFaqAns] = useState('');

  // Blog local form state
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSummary, setBlogSummary] = useState('');

  // Section Hide / Unhide Helper
  const toggleHideSection = (secKey, e) => {
    if (e) e.stopPropagation();
    setHiddenSections(prev => 
      prev.includes(secKey) 
        ? prev.filter(k => k !== secKey) 
        : [...prev, secKey]
    );
  };

  const renderVisibilityBanner = (secKey, titleName) => {
    const isHidden = hiddenSections.includes(secKey);
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0.65rem 0.85rem', 
        backgroundColor: isHidden ? '#fff1f2' : '#f0fdf4', 
        border: '1px solid', 
        borderColor: isHidden ? '#fecdd3' : '#bbf7d0', 
        borderRadius: '8px', 
        marginBottom: '1.25rem' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isHidden ? (
            <EyeOff size={16} style={{ color: '#e11d48' }} />
          ) : (
            <Eye size={16} style={{ color: '#16a34a' }} />
          )}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: '800', color: isHidden ? '#9f1239' : '#166534' }}>
              {isHidden ? 'Hidden from Storefront' : 'Visible on Storefront'}
            </div>
            <div style={{ fontSize: '0.65rem', color: isHidden ? '#be123c' : '#15803d' }}>
              {isHidden ? `"${titleName || secKey}" is currently hidden.` : `"${titleName || secKey}" is active & visible.`}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => toggleHideSection(secKey, e)}
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: isHidden ? '#e11d48' : '#16a34a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          {isHidden ? <><Eye size={12} /> Unhide</> : <><EyeOff size={12} /> Hide</>}
        </button>
      </div>
    );
  };

  const renderSectionSizeControls = (secKey) => {
    if (!secKey || secKey === 'header_branding' || secKey === 'navigation_menu') return null;

    let targetKey = secKey;
    if (secKey === 'featured_collection') targetKey = 'featured';
    if (secKey === 'slideshow' || secKey === 'confidence_banner') targetKey = 'banner';
    const sizeConfig = sectionSizes[targetKey] || {
      width: 1280,
      minHeight: 0,
      paddingY: 64,
      isFullWidth: false
    };

    const updateSize = (key, val) => {
      setSectionSizes(prev => ({
        ...prev,
        [targetKey]: {
          ...(prev[targetKey] || { width: 1280, minHeight: 0, paddingY: 64, isFullWidth: false }),
          [key]: val
        }
      }));
    };

    return (
      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Maximize2 size={16} style={{ color: '#2563eb' }} /> Section Dimensions (Length, Width & Height)
          </span>
          <button 
            type="button" 
            onClick={() => {
              setSectionSizes(prev => ({
                ...prev,
                [targetKey]: { width: 1280, minHeight: 0, paddingY: 64, isFullWidth: false }
              }));
            }}
            style={{ fontSize: '0.65rem', border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Reset Dimensions
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* 1. CONTAINER LENGTH / MAX WIDTH (PX) */}
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#334155' }}>
                📏 Length / Max Width (px)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.68rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={sizeConfig.isFullWidth || false} 
                    onChange={(e) => updateSize('isFullWidth', e.target.checked)} 
                  /> Full Width (100%)
                </label>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#2563eb', backgroundColor: '#eff6ff', padding: '1px 6px', borderRadius: '4px' }}>
                  {sizeConfig.isFullWidth ? '100%' : `${sizeConfig.width || 1280}px`}
                </span>
              </div>
            </div>
            
            {!sizeConfig.isFullWidth && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input 
                  type="range" 
                  min={400} 
                  max={1920} 
                  step={10} 
                  value={sizeConfig.width || 1280}
                  onChange={(e) => updateSize('width', Number(e.target.value))}
                  style={{ flex: 1, accentColor: '#2563eb', cursor: 'pointer' }}
                />
                <input 
                  type="number" 
                  min={400} 
                  max={1920} 
                  value={sizeConfig.width || 1280}
                  onChange={(e) => updateSize('width', Number(e.target.value))}
                  style={{ width: '75px', padding: '4px 6px', fontSize: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                />
              </div>
            )}
          </div>

          {/* 2. SECTION HEIGHT (MIN HEIGHT IN PX) */}
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#334155' }}>
                ↕️ Section Minimum Height (px)
              </label>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#2563eb', backgroundColor: '#eff6ff', padding: '1px 6px', borderRadius: '4px' }}>
                {sizeConfig.minHeight ? `${sizeConfig.minHeight}px` : 'Auto Height'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input 
                type="range" 
                min={0} 
                max={900} 
                step={10} 
                value={sizeConfig.minHeight || 0}
                onChange={(e) => updateSize('minHeight', Number(e.target.value))}
                style={{ flex: 1, accentColor: '#2563eb', cursor: 'pointer' }}
              />
              <input 
                type="number" 
                min={0} 
                max={900} 
                value={sizeConfig.minHeight || 0}
                onChange={(e) => updateSize('minHeight', Number(e.target.value))}
                style={{ width: '75px', padding: '4px 6px', fontSize: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
              />
            </div>
          </div>

          {/* 3. VERTICAL PADDING HEIGHT (TOP & BOTTOM SPACING IN PX) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#334155' }}>
                ↕️ Vertical Padding Height (Top & Bottom Spacing)
              </label>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#2563eb', backgroundColor: '#eff6ff', padding: '1px 6px', borderRadius: '4px' }}>
                {sizeConfig.paddingY !== undefined ? `${sizeConfig.paddingY}px` : '64px'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input 
                type="range" 
                min={0} 
                max={160} 
                step={4} 
                value={sizeConfig.paddingY !== undefined ? sizeConfig.paddingY : 64}
                onChange={(e) => updateSize('paddingY', Number(e.target.value))}
                style={{ flex: 1, accentColor: '#2563eb', cursor: 'pointer' }}
              />
              <input 
                type="number" 
                min={0} 
                max={160} 
                value={sizeConfig.paddingY !== undefined ? sizeConfig.paddingY : 64}
                onChange={(e) => updateSize('paddingY', Number(e.target.value))}
                style={{ width: '75px', padding: '4px 6px', fontSize: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
              />
            </div>
          </div>

        </div>
      </div>
    );
  };

  // Close popup helper on outer click
  useEffect(() => {
    function handleClickOutside(event) {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target)) {
        setShowAddMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Image File Uploader Helper with Canvas Compression (Fits within Firestore 1MB limits)
  const handleJpgUpload = (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const fileName = file.name.toLowerCase();
    if (!file.type.startsWith('image/') && !fileName.endsWith('.jpg') && !fileName.endsWith('.jpeg') && !fileName.endsWith('.png') && !fileName.endsWith('.webp')) {
      alert('Invalid file format. Please upload image files (JPG/PNG/WEBP)!');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const scale = Math.min(1, MAX_WIDTH / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        callback(compressedBase64);
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Section List Mutation Helpers
  const shiftSectionUp = (idx, e) => {
    e.stopPropagation();
    if (idx === 0) return;
    const list = [...sectionsOrderList];
    const temp = list[idx];
    list[idx] = list[idx - 1];
    list[idx - 1] = temp;
    setSectionsOrderList(list);
  };

  const shiftSectionDown = (idx, e) => {
    e.stopPropagation();
    if (idx === sectionsOrderList.length - 1) return;
    const list = [...sectionsOrderList];
    const temp = list[idx];
    list[idx] = list[idx + 1];
    list[idx + 1] = temp;
    setSectionsOrderList(list);
  };

  const deleteSectionItem = (idx, e) => {
    e.stopPropagation();
    const doDelete = () => {
      const list = sectionsOrderList.filter((_, i) => i !== idx);
      setSectionsOrderList(list);
      setSelectedSection(null);
    };
    if (showConfirm) {
      showConfirm('Remove Store Section', 'Are you sure you want to remove this section from your storefront?', doDelete);
    } else {
      doDelete();
    }
  };

  const handleAddSection = (sectionType) => {
    setSectionsOrderList([...sectionsOrderList, sectionType]);
    setSelectedSection(sectionType);
    setShowAddMenu(false);
    setSearchQuery('');
  };

  const handleAddFaq = (e) => {
    e.preventDefault();
    if (!faqQ || !faqAns) return;
    addFAQ({ question: faqQ, answer: faqAns, category: 'Returns' });
    setFaqQ('');
    setFaqAns('');
  };

  const handleAddBlog = (e) => {
    e.preventDefault();
    if (!blogTitle || !blogSummary) return;
    addBlog({
      title: blogTitle,
      summary: blogSummary,
      category: 'Senior Care',
      author: 'Clinical Lead',
      date: new Date().toISOString().split('T')[0]
    });
    setBlogTitle('');
    setBlogSummary('');
  };

  // Section Label Mappers
  const getSectionLabel = (type) => {
    switch (type) {
      case 'hero': return 'Hero Header Section';
      case 'trust': return 'Trust Badges Section';
      case 'collections': return 'Collection List (Circles)';
      case 'featured': case 'featured_collection': return 'Featured Collection Grid';
      case 'banner': case 'slideshow': case 'confidence_banner': return 'Confidence Promo Slider Banner';
      case 'image_banner': return 'Image Banner';
      case 'collection_with_image': return 'Collection with Image';
      case 'logo_list': return 'Brands Logo List';
      case 'rich_text': return 'Rich Text Details';
      case 'video': return 'Video Showcase (YouTube)';
      case 'faq': return 'FAQ Centre Accordion';
      case 'blog': return 'Caregiver Blog Posts';
      case 'cta': return 'Call to Action Consultation';
      default: return type.charAt(0).toUpperCase() + type.slice(1).replace(/[-_]/g, ' ') + ' Section';
    }
  };

  // Add section options list (Matching exact Shopify taxonomy)
  const sectionOptions = [
    { type: 'banner', name: 'Image with text overlay / Slider', category: 'Banners', desc: 'Promo slider banner with background image, title, and action buttons.' },
    { type: 'image_banner', name: 'Image banner', category: 'Banners', desc: 'Large image banner with overlay text and direct shop catalog link.' },
    { type: 'cta', name: 'Contact form / Consultation', category: 'Call to action', desc: 'Patient consultation hotline banner & lead form.' },
    { type: 'collections', name: 'Collection list', category: 'Collections', desc: 'Circular category navigation row for fast medical equipment browsing.' },
    { type: 'collection_with_image', name: 'Collection with image', category: 'Collections', desc: 'Featured category showcase side-by-side with an uploaded banner.' },
    { type: 'featured', name: 'Featured collection', category: 'Collections', desc: 'Top grid listing curated catalog items.' },
    { type: 'blog', name: 'Caregiver Blog posts', category: 'Content', desc: 'Horizontal medical advice and care guide summary cards.' },
    { type: 'rich_text', name: 'Rich text', category: 'Content', desc: 'Focused brand mission, sterilization standards, or custom paragraph box.' },
    { type: 'logo_list', name: 'Logo list', category: 'Media', desc: 'Display clinical partner, hospital, or brand logos.' },
    { type: 'video', name: 'Video Showcase', category: 'Media', desc: 'Embed responsive product demo or hospital setup YouTube video.' },
    { type: 'hero', name: 'Hero header banner', category: 'Products', desc: 'Primary landing section highlighting home healthcare solutions.' },
    { type: 'faq', name: 'Frequently Asked Questions', category: 'Trust & social proof', desc: 'Accordion listings for rental deposits, setup, and home delivery.' },
    { type: 'trust', name: 'Trust & Security Badges', category: 'Trust & social proof', desc: 'CDSCO compliance, free delivery, and sanitized equipment badges.' }
  ];

  const filteredOptions = sectionOptions.filter(opt => 
    opt.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    opt.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', margin: '-1.5rem', backgroundColor: '#f8fafc' }} className="animate-fade-in">
      
      {/* Top Customizer Header */}
      <div style={{ 
        height: '56px', 
        backgroundColor: '#ffffff', 
        borderBottom: '1px solid #e2e8f0', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 1.5rem',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>Current Theme Final</span>
          <span style={{ backgroundColor: '#def7ec', color: '#03543f', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>Active</span>
          <div style={{ width: '1px', height: '20px', backgroundColor: '#cbd5e1' }}></div>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>Home page template</span>
        </div>

        {/* Viewport switchers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '2px' }}>
          <button 
            onClick={() => setViewportMode('desktop')} 
            style={{ 
              padding: '4px 8px', 
              borderRadius: '4px', 
              backgroundColor: viewportMode === 'desktop' ? '#eff6ff' : 'transparent',
              color: viewportMode === 'desktop' ? '#2563eb' : '#64748b',
              border: 'none',
              cursor: 'pointer'
            }}
            title="Desktop View"
          >
            <Monitor size={16} />
          </button>
          <button 
            onClick={() => setViewportMode('mobile')} 
            style={{ 
              padding: '4px 8px', 
              borderRadius: '4px', 
              backgroundColor: viewportMode === 'mobile' ? '#eff6ff' : 'transparent',
              color: viewportMode === 'mobile' ? '#2563eb' : '#64748b',
              border: 'none',
              cursor: 'pointer'
            }}
            title="Mobile View"
          >
            <Smartphone size={16} />
          </button>
        </div>

        <div>
          {hasUnsavedChanges ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#fff7ed', padding: '4px 10px', borderRadius: '6px', border: '1px solid #ffedd5' }}>
                ⚠️ Unsaved changes
              </span>
              <button 
                type="button"
                onClick={handleDiscardChanges}
                style={{ backgroundColor: '#ffffff', color: '#64748b', border: '1px solid #cbd5e1', padding: '0.4rem 0.85rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}
              >
                Discard
              </button>
              <button 
                type="button"
                onClick={handleSaveAll}
                style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '0.4rem 1.15rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)' }}
              >
                Save Theme
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontSize: '0.78rem', fontWeight: '700', backgroundColor: '#f0fdf4', padding: '4px 12px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
              <CheckCircle2 size={15} /> All changes saved
            </div>
          )}
        </div>
      </div>

      {/* Editor Split Pane */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        
        {/* Left Control Panel */}
        <div style={{ width: '340px', borderRight: '1px solid #e2e8f0', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
          {selectedSection === null ? (
            /* Home Page Sections List Mode */
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Header/Branding settings group */}
              <div>
                <h4 style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Header & Branding</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <button 
                    onClick={() => setSelectedSection('branding')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0.65rem', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#ffffff', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#334155' }}>Palette & Theme Presets</span>
                    <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                  </button>
                  <button 
                    onClick={() => setSelectedSection('admin_dashboard_widgets')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0.65rem', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: selectedSection === 'admin_dashboard_widgets' ? '#eff6ff' : '#ffffff', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#334155' }}>Admin Home Dashboard Data</span>
                    <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                  </button>
                  <div 
                    onClick={() => setSelectedSection('header_branding')}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      width: '100%', 
                      padding: '0.65rem', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '6px', 
                      backgroundColor: (hiddenSections.includes('announcementBar') && hiddenSections.includes('header')) ? '#f8fafc' : '#ffffff', 
                      cursor: 'pointer' 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: (hiddenSections.includes('announcementBar') && hiddenSections.includes('header')) ? '#94a3b8' : '#334155' }}>
                        Logo & Announcement Bar
                      </span>
                      {(hiddenSections.includes('announcementBar') || hiddenSections.includes('header')) && (
                        <span style={{ fontSize: '0.6rem', padding: '1px 5px', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#dc2626', fontWeight: '700' }}>
                          {hiddenSections.includes('announcementBar') && hiddenSections.includes('header') ? 'Hidden' : 'Partially Hidden'}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button 
                        type="button"
                        onClick={(e) => toggleHideSection('announcementBar', e)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: hiddenSections.includes('announcementBar') ? '#ef4444' : '#10b981', padding: '2px' }}
                        title={hiddenSections.includes('announcementBar') ? 'Unhide Announcement Bar' : 'Hide Announcement Bar'}
                      >
                        {hiddenSections.includes('announcementBar') ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                    </div>
                  </div>
                  <div 
                    onClick={() => setSelectedSection('navigation_menu')}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      width: '100%', 
                      padding: '0.65rem', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '6px', 
                      backgroundColor: hiddenSections.includes('navigation_menu') ? '#f8fafc' : '#ffffff', 
                      cursor: 'pointer' 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: hiddenSections.includes('navigation_menu') ? '#94a3b8' : '#334155' }}>
                        Navigation Menu Links
                      </span>
                      {hiddenSections.includes('navigation_menu') && (
                        <span style={{ fontSize: '0.6rem', padding: '1px 5px', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#dc2626', fontWeight: '700' }}>
                          Hidden
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button 
                        type="button"
                        onClick={(e) => toggleHideSection('navigation_menu', e)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: hiddenSections.includes('navigation_menu') ? '#ef4444' : '#10b981', padding: '2px' }}
                        title={hiddenSections.includes('navigation_menu') ? 'Unhide Navigation Bar' : 'Hide Navigation Bar'}
                      >
                        {hiddenSections.includes('navigation_menu') ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => setSelectedSection('catalog_pagination')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0.65rem', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: selectedSection === 'catalog_pagination' ? '#eff6ff' : '#ffffff', cursor: 'pointer', textAlign: 'left', marginTop: '0.35rem' }}
                  >
                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: selectedSection === 'catalog_pagination' ? '#2563eb' : '#334155' }}>Catalog Pagination ({productsPerPage} / page)</span>
                    <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                  </button>
                </div>
              </div>

              {/* Template blocks list - loaded dynamically */}
              <div>
                <h4 style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Template Sections</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                  {sectionsOrderList.map((secType, idx) => {
                    const isHidden = hiddenSections.includes(secType);
                    return (
                      <div 
                        key={`${secType}-${idx}`}
                        onClick={() => setSelectedSection(secType)}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          width: '100%', 
                          padding: '0.5rem 0.65rem', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '6px', 
                          backgroundColor: isHidden ? '#f8fafc' : '#ffffff', 
                          cursor: 'pointer',
                          opacity: isHidden ? 0.75 : 1
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: isHidden ? '#94a3b8' : '#334155', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '120px', textDecoration: isHidden ? 'line-through' : 'none' }}>
                            {getSectionLabel(secType)}
                          </span>
                          {isHidden && (
                            <span style={{ fontSize: '0.58rem', padding: '1px 4px', borderRadius: '3px', backgroundColor: '#fee2e2', color: '#dc2626', fontWeight: '700' }}>
                              Hidden
                            </span>
                          )}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.15rem', alignItems: 'center' }}>
                          <button 
                            type="button"
                            onClick={(e) => toggleHideSection(secType, e)}
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: isHidden ? '#ef4444' : '#10b981', padding: '2px', marginRight: '2px' }}
                            title={isHidden ? "Unhide section" : "Hide section"}
                          >
                            {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <button 
                            disabled={idx === 0} 
                            onClick={(e) => shiftSectionUp(idx, e)}
                            style={{ border: 'none', background: 'transparent', cursor: idx === 0 ? 'not-allowed' : 'pointer', color: '#94a3b8', padding: '2px' }}
                            title="Move up"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button 
                            disabled={idx === sectionsOrderList.length - 1} 
                            onClick={(e) => shiftSectionDown(idx, e)}
                            style={{ border: 'none', background: 'transparent', cursor: idx === sectionsOrderList.length - 1 ? 'not-allowed' : 'pointer', color: '#94a3b8', padding: '2px' }}
                            title="Move down"
                          >
                            <ArrowDown size={12} />
                          </button>
                          <button 
                            onClick={(e) => deleteSectionItem(idx, e)}
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', padding: '2px', marginLeft: '4px' }}
                            title="Remove section"
                          >
                            <Trash size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ADD SECTION TRIGGER */}
                <button 
                  onClick={() => setShowAddMenu(!showAddMenu)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.4rem', 
                    width: '100%', 
                    padding: '0.6rem', 
                    border: '2px dashed #cbd5e1', 
                    borderRadius: '6px', 
                    backgroundColor: '#f8fafc', 
                    color: '#2563eb', 
                    fontWeight: '700', 
                    fontSize: '0.8rem', 
                    cursor: 'pointer' 
                  }}
                >
                  <Plus size={14} /> Add section
                </button>
              </div>

              {/* Footer settings group */}
              <div>
                <h4 style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Footer group</h4>
                <div 
                  onClick={() => setSelectedSection('footer')}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    width: '100%', 
                    padding: '0.65rem', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '6px', 
                    backgroundColor: hiddenSections.includes('footer') ? '#f8fafc' : '#ffffff', 
                    cursor: 'pointer' 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: hiddenSections.includes('footer') ? '#94a3b8' : '#334155' }}>
                      Footer / Branding Group
                    </span>
                    {hiddenSections.includes('footer') && (
                      <span style={{ fontSize: '0.6rem', padding: '1px 5px', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#dc2626', fontWeight: '700' }}>
                        Hidden
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button 
                      type="button"
                      onClick={(e) => toggleHideSection('footer', e)}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: hiddenSections.includes('footer') ? '#ef4444' : '#10b981', padding: '2px' }}
                      title={hiddenSections.includes('footer') ? 'Unhide Footer' : 'Hide Footer'}
                    >
                      {hiddenSections.includes('footer') ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Inner Section Customizer Inputs */
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ 
                padding: '1rem', 
                borderBottom: '1px solid #e2e8f0', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                backgroundColor: '#f8fafc' 
              }}>
                <button 
                  onClick={() => setSelectedSection(null)} 
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#2563eb', padding: '4px' }}
                >
                  <ArrowLeft size={16} />
                </button>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#1e293b' }}>
                  Edit {selectedSection.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div style={{ padding: '1.25rem', flex: 1, overflowY: 'auto' }}>
                
                {/* Palette & Theme Presets */}
                {selectedSection === 'catalog_pagination' && (
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '0.5rem', color: '#1e293b' }}>Catalog Pagination & Products Per Page</h4>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: '1.4' }}>
                      Choose how many products display per page on your storefront catalog before pagination controls appear.
                    </p>
                    
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: '700' }}>Products Per Page (Rows Preset)</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                        {[
                          { count: 20, label: '20 Items (5 Rows)' },
                          { count: 24, label: '24 Items (6 Rows)' },
                          { count: 40, label: '40 Items (10 Rows)' },
                          { count: 60, label: '60 Items (15 Rows)' }
                        ].map(opt => (
                          <button
                            key={opt.count}
                            type="button"
                            onClick={() => setProductsPerPage(opt.count)}
                            style={{
                              padding: '0.6rem',
                              border: '1px solid',
                              borderColor: Number(productsPerPage) === opt.count ? '#2563eb' : '#cbd5e1',
                              backgroundColor: Number(productsPerPage) === opt.count ? '#eff6ff' : '#ffffff',
                              color: Number(productsPerPage) === opt.count ? '#1d4ed8' : '#334155',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Custom Products Per Page</label>
                      <input 
                        type="number" 
                        min={4} 
                        max={120}
                        className="form-input"
                        value={productsPerPage} 
                        onChange={(e) => setProductsPerPage(Math.max(1, Number(e.target.value)))} 
                      />
                    </div>
                  </div>
                )}
                {selectedSection === 'branding' && (
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.75rem', color: '#1e293b' }}>Primary Theme Color</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      {[
                        { id: 'teal', label: 'Healing Teal', hex: '#1b8a7a' },
                        { id: 'emerald', label: 'Emerald Health', hex: '#10b981' },
                        { id: 'blue', label: 'Clinical Blue', hex: '#3b82f6' },
                        { id: 'purple', label: 'Slate Purple', hex: '#8b5cf6' },
                        { id: 'crimson', label: 'Crimson Red', hex: '#ef4444' },
                        { id: 'amber', label: 'Warm Amber', hex: '#f59e0b' },
                        { id: 'dark', label: 'Modern Dark', hex: '#1e293b' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setThemeColors(opt.id);
                            updateLayout({ themeColors: opt.id });
                            markDirty();
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.65rem',
                            border: '1px solid',
                            borderColor: (layout?.themeColors || themeColors) === opt.id ? '#2563eb' : '#e2e8f0',
                            backgroundColor: (layout?.themeColors || themeColors) === opt.id ? '#eff6ff' : '#ffffff',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}
                        >
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: opt.hex, flexShrink: 0 }}></span>
                          <span style={{ flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{opt.label}</span>
                        </button>
                      ))}
                    </div>

                    <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.75rem', color: '#1e293b' }}>Product List / Card Color</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      {[
                        { id: 'white', label: 'Pure White', hex: '#ffffff' },
                        { id: 'slate', label: 'Soft Slate', hex: '#f8fafc' },
                        { id: 'mint', label: 'Mint Warmth', hex: '#f0fdf4' },
                        { id: 'ice', label: 'Ice Blue', hex: '#f0f9ff' },
                        { id: 'cream', label: 'Warm Cream', hex: '#fffbeb' },
                        { id: 'dark', label: 'Dark Slate', hex: '#1e293b' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setProductListColor(opt.id);
                            updateLayout({ productListColor: opt.id });
                            markDirty();
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.65rem',
                            border: '1px solid',
                            borderColor: (layout?.productListColor || productListColor) === opt.id ? '#2563eb' : '#e2e8f0',
                            backgroundColor: (layout?.productListColor || productListColor) === opt.id ? '#eff6ff' : '#ffffff',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}
                        >
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: opt.hex, border: '1px solid #cbd5e1', flexShrink: 0 }}></span>
                          <span style={{ flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Dashboard Widgets Form */}
                {selectedSection === 'admin_dashboard_widgets' && (
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem', color: '#1e293b' }}>Admin Home Dashboard Data Widgets</h4>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1.25rem' }}>Customize which cards & metrics to show on your Admin Home Page.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {[
                        { key: 'showRevenue', label: 'Revenue Total Stat Card' },
                        { key: 'showFulfillment', label: 'Awaiting Fulfillment Stat Card' },
                        { key: 'showTotalProducts', label: 'Total Products Stat Card' },
                        { key: 'showLowStock', label: 'Low Stock Alerts Stat Card' },
                        { key: 'showSalesChart', label: 'Sales Performance (7 Days)' },
                        { key: 'showTaskCenter', label: 'Store Actions Task Center' },
                        { key: 'showInventoryCheck', label: 'Inventory Status Check' },
                        { key: 'showRecentTransactions', label: 'Recent Transactions Table' }
                      ].map(w => {
                        const activeWidgets = {
                          showRevenue: true, showFulfillment: true, showTotalProducts: true, showLowStock: true,
                          showSalesChart: true, showTaskCenter: true, showInventoryCheck: true, showRecentTransactions: true,
                          ...(layout?.adminDashboardWidgets || {})
                        };
                        const isEnabled = activeWidgets[w.key] !== false;

                        return (
                          <div key={w.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: isEnabled ? '#ffffff' : '#f8fafc' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: isEnabled ? '#1e293b' : '#94a3b8' }}>{w.label}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = { ...activeWidgets, [w.key]: !isEnabled };
                                updateLayout({ adminDashboardWidgets: updated });
                                markDirty();
                              }}
                              style={{
                                padding: '2px 8px',
                                borderRadius: '12px',
                                border: '1px solid',
                                borderColor: isEnabled ? '#2563eb' : '#cbd5e1',
                                backgroundColor: isEnabled ? '#eff6ff' : '#f1f5f9',
                                color: isEnabled ? '#1d4ed8' : '#64748b',
                                fontWeight: '700',
                                fontSize: '0.7rem',
                                cursor: 'pointer'
                              }}
                            >
                              {isEnabled ? 'Shown' : 'Hidden'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Header Announcement Form */}
                {selectedSection === 'header_branding' && (
                  <div>
                    {renderVisibilityBanner('announcementBar', 'Announcement Bar')}
                    {renderVisibilityBanner('header', 'Header Logo & Search Bar')}
                    <div className="form-group">
                      <label className="form-label">Branding Navbar Text</label>
                      <input type="text" className="form-input" value={logoText} onChange={(e) => setLogoText(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Header Alert Announcement Bar</label>
                      <input type="text" className="form-input" value={announcementBar} onChange={(e) => setAnnouncementBar(e.target.value)} />
                    </div>
                  </div>
                )}

                {/* Navigation Menu Links Form */}
                {selectedSection === 'navigation_menu' && (
                  <div>
                    {renderVisibilityBanner('navigation_menu', 'Navigation Menu Links')}
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1rem', color: '#1e293b' }}>Navigation Bar Links</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {navigationTabs.map((tab, idx) => (
                        <div key={tab.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', backgroundColor: '#f8fafc' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>
                              Item #{idx + 1} ({tab.id})
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <button 
                                type="button"
                                disabled={idx === 0} 
                                onClick={() => {
                                  const updated = [...navigationTabs];
                                  const [moved] = updated.splice(idx, 1);
                                  updated.splice(idx - 1, 0, moved);
                                  setNavigationTabs(updated);
                                }}
                                className="btn btn-ghost" style={{ padding: '2px 6px', fontSize: '0.72rem', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.4 : 1 }} title="Move Up"
                              >
                                ▲ Up
                              </button>
                              <button 
                                type="button"
                                disabled={idx === navigationTabs.length - 1} 
                                onClick={() => {
                                  const updated = [...navigationTabs];
                                  const [moved] = updated.splice(idx, 1);
                                  updated.splice(idx + 1, 0, moved);
                                  setNavigationTabs(updated);
                                }}
                                className="btn btn-ghost" style={{ padding: '2px 6px', fontSize: '0.72rem', cursor: idx === navigationTabs.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === navigationTabs.length - 1 ? 0.4 : 1 }} title="Move Down"
                              >
                                ▼ Down
                              </button>
                              {navigationTabs.length > 1 && (
                                <button 
                                  type="button"
                                  className="btn btn-ghost" 
                                  style={{ padding: '2px 6px', color: '#ef4444', fontSize: '0.72rem' }}
                                  onClick={() => {
                                    setNavigationTabs(prev => prev.filter((_, i) => i !== idx));
                                  }}
                                >
                                  ✕ Delete
                                </button>
                              )}
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label" style={{ fontWeight: '700', fontSize: '0.8rem' }}>Display Name</label>
                              <input 
                                type="text" 
                                className="form-input" 
                                placeholder="e.g. Hospital Beds"
                                value={tab.label} 
                                onChange={(e) => {
                                  const updated = [...navigationTabs];
                                  updated[idx] = { ...updated[idx], label: e.target.value };
                                  setNavigationTabs(updated);
                                }} 
                              />
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label" style={{ fontWeight: '700', fontSize: '0.8rem' }}>Select Collection / Link Target</label>
                              <select
                                className="form-input"
                                value={tab.collection || (tab.id === 'home' ? 'home' : tab.id === 'services' ? 'services' : tab.id === 'blog' ? 'blog' : tab.id === 'userPortal' ? 'userPortal' : 'All')}
                                onChange={(e) => {
                                  const updated = [...navigationTabs];
                                  updated[idx] = { ...updated[idx], collection: e.target.value };
                                  setNavigationTabs(updated);
                                }}
                                style={{ fontSize: '0.8rem' }}
                              >
                                <optgroup label="Main Collections">
                                  <option value="All">All Collections (Full Catalog)</option>
                                  <option value="Home Care">Home Care</option>
                                  <option value="Mobility Aid">Mobility Aid</option>
                                  <option value="Medical Devices">Medical Devices</option>
                                  <option value="Surgicals & PPE">Surgicals & PPE</option>
                                </optgroup>
                                <optgroup label="Popular Equipment Collections">
                                  <option value="Hospital Bed">Hospital Bed Collection</option>
                                  <option value="Walkers & Walkstick">Walkers & Walkstick Collection</option>
                                  <option value="Wheelchairs">Wheelchairs Collection</option>
                                  <option value="Respiratory Care">Respiratory Care Collection</option>
                                  <option value="Diagnostics">Diagnostics Collection</option>
                                </optgroup>
                                <optgroup label="Featured Category Highlights">
                                  {collectionsList.map(c => (
                                    <option key={c.name} value={c.name}>{c.name}</option>
                                  ))}
                                </optgroup>
                                <optgroup label="Store Pages">
                                  <option value="home">Home Page</option>
                                  <option value="services">Care Services</option>
                                  <option value="blog">Blog & FAQs</option>
                                  <option value="userPortal">My Account</option>
                                </optgroup>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}

                      <button 
                        type="button"
                        className="btn btn-outline"
                        onClick={() => {
                          setNavigationTabs(prev => [
                            ...prev,
                            { id: `nav_${Date.now()}`, label: 'New Collection', collection: 'Home Care' }
                          ]);
                        }}
                        style={{ marginTop: '0.5rem', width: '100%', borderStyle: 'dashed' }}
                      >
                        + Add Navigation Menu Item
                      </button>
                    </div>
                  </div>
                )}

                {/* Hero Header Form */}
                {selectedSection === 'hero' && (
                  <div>
                    {renderVisibilityBanner('hero', 'Hero Header Banner')}
                    {renderSectionSizeControls('hero')}
                    <div className="form-group">
                      <label className="form-label">Hero Title Text</label>
                      <input type="text" className="form-input" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Hero Subtitle Description</label>
                      <textarea 
                        className="form-input" 
                        style={{ minHeight: '80px', fontFamily: 'inherit' }} 
                        value={heroSubtitle} 
                        onChange={(e) => setHeroSubtitle(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* Trust Section details */}
                {selectedSection === 'trust' && (
                  <div>
                    {renderVisibilityBanner('trust', 'Trust Badges Section')}
                    {renderSectionSizeControls('trust')}
                    <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>Trust Badges Details</h4>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.4' }}>
                      This section displays core value metrics (Express shipping, Easy returns, verified medical safety, and B2B GST billing credits).
                    </p>
                  </div>
                )}

                {/* Circular collections list edit & SEO metadata */}
                {selectedSection === 'collections' && (
                  <div>
                    {renderVisibilityBanner('collections', 'Circular Collections List')}
                    {renderSectionSizeControls('collections')}
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '0.5rem', color: '#1e293b' }}>Featured Collections & SEO Settings</h4>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '1.25rem' }}>
                      Configure category names, cover photos, meta titles, descriptions, and URL handles for Google search optimization:
                    </span>
                    {collectionsList.map((col, idx) => (
                      <div key={idx} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '1.25rem', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                          <strong style={{ fontSize: '0.85rem', color: '#1e293b' }}>Collection #{idx + 1}: {col.name}</strong>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontWeight: '700' }}>Collection Name</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              value={col.name} 
                              onChange={(e) => {
                                const updated = [...collectionsList];
                                updated[idx].name = e.target.value;
                                if (!updated[idx].slug) {
                                  updated[idx].slug = e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
                                }
                                setCollectionsList(updated);
                              }} 
                            />
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontWeight: '700' }}>Cover Image (JPG)</label>
                            <input 
                              type="file" 
                              accept=".jpg,.jpeg"
                              onChange={(e) => handleJpgUpload(e, (dataUrl) => {
                                const updated = [...collectionsList];
                                updated[idx].image = dataUrl;
                                setCollectionsList(updated);
                              })}
                              style={{ fontSize: '0.7rem', marginTop: '0.25rem', display: 'block', width: '100%' }}
                            />
                            {col.image && (
                              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#f8fafc', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #cbd5e1' }}>
                                  <img src={col.image} alt={col.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Storefront Preview</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Search Engine Listing Card for Collection (Identical to Product Page SEO) */}
                        <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '1rem' }}>
                          <h5 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>Search engine listing</h5>
                          
                          {/* SERP Snippet Preview */}
                          <div style={{ marginBottom: '1.25rem', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            <div style={{ color: '#5f6368', fontSize: '11px', marginBottom: '2px' }}>
                              https://{storeSettings?.domain || 'store.com'}/collections/{col.slug || col.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '')}
                            </div>
                            <h6 style={{ color: '#1a0dab', fontSize: '15px', fontWeight: 'normal', margin: 0 }}>
                              {col.metaTitle || `${col.name} Collection - Buy Online | ${storeSettings?.storeName || 'Store'}`}
                            </h6>
                            <p style={{ color: '#4d5156', margin: '4px 0 0', fontSize: '12px', lineHeight: '1.4' }}>
                              {col.metaDescription || `Explore top-rated ${col.name} medical supplies, clinical equipment, and patient care essentials with doorstep setup in Chennai.`}
                            </p>
                          </div>

                          <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <label className="form-label">Page title</label>
                              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{(col.metaTitle || '').length} of 70 characters used</span>
                            </div>
                            <input 
                              type="text" 
                              className="form-input" 
                              placeholder={`${col.name} Collection - Buy Online | AeonCare`}
                              value={col.metaTitle || ''} 
                              onChange={(e) => {
                                const updated = [...collectionsList];
                                updated[idx].metaTitle = e.target.value;
                                setCollectionsList(updated);
                              }} 
                              maxLength={70}
                            />
                          </div>

                          <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <label className="form-label">Meta description</label>
                              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{(col.metaDescription || '').length} of 320 characters used</span>
                            </div>
                            <textarea 
                              className="form-input" 
                              style={{ minHeight: '65px', fontFamily: 'inherit' }}
                              placeholder={`Explore top-rated ${col.name} medical supplies with doorstep setup.`}
                              value={col.metaDescription || ''} 
                              onChange={(e) => {
                                const updated = [...collectionsList];
                                updated[idx].metaDescription = e.target.value;
                                setCollectionsList(updated);
                              }} 
                              maxLength={320}
                            ></textarea>
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">URL handle</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              placeholder={col.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '')}
                              value={col.slug || ''} 
                              onChange={(e) => {
                                const updated = [...collectionsList];
                                updated[idx].slug = e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
                                setCollectionsList(updated);
                              }} 
                            />
                          </div>
                        </div>

                      </div>
                    ))}

                    <button 
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        setCollectionsList(prev => [
                          ...prev,
                          { 
                            name: 'New Collection', 
                            image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=200',
                            metaTitle: 'New Collection - Buy Online | AeonCare',
                            metaDescription: 'Explore top-rated medical equipment and home care products online.',
                            slug: `collection-${Date.now().toString().slice(-4)}`
                          }
                        ]);
                      }}
                      style={{ width: '100%', borderStyle: 'dashed', marginTop: '0.5rem' }}
                    >
                      + Add Collection Category
                    </button>
                  </div>
                )}

                {/* Confidence Promo Banner inputs */}
                {(selectedSection === 'banner' || selectedSection === 'slideshow' || selectedSection === 'confidence_banner') && (
                  <div>
                    {renderVisibilityBanner(selectedSection, 'Confidence Promo Slider Banner')}
                    {renderSectionSizeControls(selectedSection)}
                    <div className="form-group" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1rem' }}>
                      <label className="form-label" style={{ fontWeight: '700' }}>Banner Cover Photo (Only JPG)</label>
                      <input 
                        type="file" 
                        accept=".jpg,.jpeg" 
                        onChange={(e) => handleJpgUpload(e, (dataUrl) => setBannerImage(dataUrl))}
                        style={{ fontSize: '0.75rem', marginTop: '0.5rem', display: 'block', width: '100%' }}
                      />
                      {bannerImage && (
                        <div style={{ marginTop: '0.75rem' }}>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Image Preview:</span>
                          <img src={bannerImage} alt="Slideshow banner" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1', marginTop: '0.25rem' }} />
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Banner Header Title</label>
                      <input type="text" className="form-input" value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Banner Subtitle Promo</label>
                      <textarea className="form-input" style={{ minHeight: '60px', fontFamily: 'inherit' }} value={bannerSubtitle} onChange={(e) => setBannerSubtitle(e.target.value)}></textarea>
                    </div>
                  </div>
                )}

                {/* Image Banner editing form */}
                {selectedSection === 'image_banner' && (
                  <div>
                    {renderVisibilityBanner('image_banner', 'Image Banner')}
                    {renderSectionSizeControls('image_banner')}
                    <div className="form-group" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1rem' }}>
                      <label className="form-label" style={{ fontWeight: '700' }}>Upload Banner Cover (Only JPG)</label>
                      <input 
                        type="file" 
                        accept=".jpg,.jpeg" 
                        onChange={(e) => handleJpgUpload(e, (dataUrl) => setImageBannerImage(dataUrl))}
                        style={{ fontSize: '0.75rem', marginTop: '0.5rem', display: 'block', width: '100%' }}
                      />
                      {imageBannerImage && (
                        <div style={{ marginTop: '0.75rem' }}>
                          <img src={imageBannerImage} alt="Image banner preview" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1', marginTop: '0.25rem' }} />
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Banner Title</label>
                      <input type="text" className="form-input" value={imageBannerTitle} onChange={(e) => setImageBannerTitle(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Banner Description</label>
                      <textarea className="form-input" style={{ minHeight: '65px', fontFamily: 'inherit' }} value={imageBannerSubtitle} onChange={(e) => setImageBannerSubtitle(e.target.value)}></textarea>
                    </div>
                  </div>
                )}

                {/* Collection with Image editing form */}
                {selectedSection === 'collection_with_image' && (
                  <div>
                    {renderVisibilityBanner('collection_with_image', 'Collection with Image')}
                    {renderSectionSizeControls('collection_with_image')}
                    <div className="form-group" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1rem' }}>
                      <label className="form-label" style={{ fontWeight: '700' }}>Upload Side Spotlight Photo (Only JPG)</label>
                      <input 
                        type="file" 
                        accept=".jpg,.jpeg" 
                        onChange={(e) => handleJpgUpload(e, (dataUrl) => setColWithImageImage(dataUrl))}
                        style={{ fontSize: '0.75rem', marginTop: '0.5rem', display: 'block', width: '100%' }}
                      />
                      {colWithImageImage && (
                        <div style={{ marginTop: '0.75rem' }}>
                          <img src={colWithImageImage} alt="Spotlight image preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1', marginTop: '0.25rem' }} />
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Heading Title</label>
                      <input type="text" className="form-input" value={colWithImageTitle} onChange={(e) => setColWithImageTitle(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Spotlight Collection Category</label>
                      <select 
                        className="form-input" 
                        value={colWithImageCategory} 
                        onChange={(e) => setColWithImageCategory(e.target.value)}
                        style={{ fontSize: '0.8rem' }}
                      >
                        <option value="Home Care">Home Care</option>
                        <option value="Mobility Aid">Mobility Aid</option>
                        <option value="Medical Devices">Medical Devices</option>
                        <option value="Surgicals & PPE">Surgicals & PPE</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Rich text editing form */}
                {selectedSection === 'rich_text' && (
                  <div>
                    {renderVisibilityBanner('rich_text', 'Rich Text Details')}
                    {renderSectionSizeControls('rich_text')}
                    <div className="form-group">
                      <label className="form-label">Rich Text Heading</label>
                      <input type="text" className="form-input" value={richTextHeading} onChange={(e) => setRichTextHeading(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Body Paragraph Text</label>
                      <textarea className="form-input" style={{ minHeight: '80px', fontFamily: 'inherit' }} value={richTextBody} onChange={(e) => setRichTextBody(e.target.value)}></textarea>
                    </div>
                  </div>
                )}

                {/* Featured Products Grid info */}
                {selectedSection === 'featured_collection' && (
                  <div>
                    {renderVisibilityBanner('featured', 'Featured Products Grid')}
                    {renderSectionSizeControls('featured')}
                    <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>Featured Grid Details</h4>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.4' }}>
                      Shows your top products grid automatically layout on the storefront main page.
                    </p>
                  </div>
                )}

                {/* Video showcase inputs */}
                {selectedSection === 'video' && (
                  <div>
                    {renderVisibilityBanner('video', 'YouTube Video Showcase')}
                    {renderSectionSizeControls('video')}
                    <h4 style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '0.5rem', color: '#1e293b' }}>YouTube Video Showcase</h4>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1.25rem' }}>
                      Input the standard YouTube link or sharing format to display the patient care guides video player on the homepage.
                    </p>
                    <div className="form-group">
                      <label className="form-label">YouTube Link Format</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. https://www.youtube.com/watch?v=68M_K93dC30"
                        value={promoVideoUrl}
                        onChange={(e) => setPromoVideoUrl(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* FAQ list manager */}
                {selectedSection === 'faq' && (
                  <div>
                    {renderVisibilityBanner('faq', 'Frequently Asked Questions')}
                    {renderSectionSizeControls('faq')}
                    <form onSubmit={handleAddFaq} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '0.75rem' }}>Create FAQ Item</h4>
                      <div className="form-group">
                        <label className="form-label">Question Text</label>
                        <input type="text" className="form-input" required value={faqQ} onChange={(e) => setFaqQ(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Answer Description</label>
                        <textarea className="form-input" style={{ minHeight: '60px', fontFamily: 'inherit' }} required value={faqAns} onChange={(e) => setFaqAns(e.target.value)}></textarea>
                      </div>
                      <button className="btn btn-primary" style={{ width: '100%' }}>Add FAQ</button>
                    </form>

                    <h4 style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '0.75rem' }}>FAQs List ({faqs.length})</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {faqs.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#334155' }}>{item.question.substring(0, 30)}...</span>
                          <button className="btn btn-ghost" style={{ padding: '2px', color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => deleteFAQ(item.id)}>
                            <Trash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Blogs posts list manager */}
                {selectedSection === 'blog' && (
                  <div>
                    {renderVisibilityBanner('blog', 'Caregiver Blog Posts')}
                    {renderSectionSizeControls('blog')}
                    <form onSubmit={handleAddBlog} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '0.75rem' }}>Publish Article</h4>
                      <div className="form-group">
                        <label className="form-label">Article Title</label>
                        <input type="text" className="form-input" required value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Summary</label>
                        <textarea className="form-input" style={{ minHeight: '60px', fontFamily: 'inherit' }} required value={blogSummary} onChange={(e) => setBlogSummary(e.target.value)}></textarea>
                      </div>
                      <button className="btn btn-primary" style={{ width: '100%' }}>Publish</button>
                    </form>

                    <h4 style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '0.75rem' }}>Articles ({blogs.length})</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {blogs.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#334155' }}>{item.title.substring(0, 30)}...</span>
                          <button className="btn btn-ghost" style={{ padding: '2px', color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => deleteBlog(item.id)}>
                            <Trash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer inputs */}
                {selectedSection === 'footer' && (
                  <div>
                    {renderVisibilityBanner('footer', 'Footer & Copyright Group')}
                    {renderSectionSizeControls('footer')}
                    
                    <div className="form-group">
                      <label className="form-label">Footer Description / About Copy</label>
                      <textarea 
                        className="form-input" 
                        style={{ minHeight: '75px', fontFamily: 'inherit' }} 
                        value={footerText} 
                        onChange={(e) => setFooterText(e.target.value)}
                        placeholder="Enter store description for the footer..."
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Support Column Heading</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={footerSupportTitle} 
                        onChange={(e) => setFooterSupportTitle(e.target.value)}
                        placeholder="e.g. Support Hub"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Contact Column Heading</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={footerContactTitle} 
                        onChange={(e) => setFooterContactTitle(e.target.value)}
                        placeholder="e.g. Contact Info"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Company Address Line</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={footerContactAddress} 
                        onChange={(e) => setFooterContactAddress(e.target.value)}
                        placeholder="e.g. Aeon Healthcare Pvt Ltd, Besant Nagar, Chennai, TN 600090"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Helpline Phone Number</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={footerContactPhone} 
                        onChange={(e) => setFooterContactPhone(e.target.value)}
                        placeholder="e.g. +91 98401 23456"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Support Email Address</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={footerContactEmail} 
                        onChange={(e) => setFooterContactEmail(e.target.value)}
                        placeholder="e.g. support@aeoncare.in"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Copyright & Compliance Notice</label>
                      <textarea 
                        className="form-input" 
                        style={{ minHeight: '65px', fontFamily: 'inherit' }} 
                        value={footerCopyrightText} 
                        onChange={(e) => setFooterCopyrightText(e.target.value)}
                        placeholder="e.g. © 2026 AeonCare. Partner of AeonCare.in. India CDSCO labeling compliant. All rights reserved."
                      ></textarea>
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Save Trigger */}
              <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <button 
                  onClick={handleSaveAll}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContext: 'center', justifyContent: 'center', gap: '0.5rem' }} 
                  className="btn btn-primary"
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= SHOPIFY-STYLE ADD SECTION FLOATING POPOVER MENU ================= */}
        {showAddMenu && (
          <div 
            ref={addMenuRef}
            style={{
              position: 'absolute',
              top: '120px',
              left: '350px',
              width: '320px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '450px'
            }}
            className="animate-fade-in"
          >
            {/* Popover search header */}
            <div style={{ padding: '0.75rem', borderBottom: '1px solid #f1f5f9', position: 'relative' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search sections..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2rem', paddingRight: '1.5rem', fontSize: '0.8rem' }}
              />
              <Search size={14} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sections / Apps Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', fontSize: '0.75rem', fontWeight: '700' }}>
              <button 
                onClick={() => setAddMenuTab('sections')}
                style={{ flex: 1, padding: '0.5rem', border: 'none', cursor: 'pointer', backgroundColor: addMenuTab === 'sections' ? '#ffffff' : '#f8fafc', color: addMenuTab === 'sections' ? '#2563eb' : '#64748b', borderBottom: addMenuTab === 'sections' ? '2px solid #2563eb' : 'none' }}
              >
                Sections
              </button>
              <button 
                onClick={() => setAddMenuTab('apps')}
                style={{ flex: 1, padding: '0.5rem', border: 'none', cursor: 'pointer', backgroundColor: addMenuTab === 'apps' ? '#ffffff' : '#f8fafc', color: addMenuTab === 'apps' ? '#2563eb' : '#64748b', borderBottom: addMenuTab === 'apps' ? '2px solid #2563eb' : 'none' }}
              >
                Apps
              </button>
            </div>

            {/* List options container */}
            <div style={{ overflowY: 'auto', flex: 1, padding: '0.5rem 0' }}>
              {addMenuTab === 'sections' ? (
                <>
                  {['Banners', 'Call to action', 'Collections', 'Content', 'Media', 'Products', 'Trust & social proof'].map(categoryName => {
                    const categoryItems = filteredOptions.filter(o => o.category === categoryName);
                    if (categoryItems.length === 0) return null;
                    return (
                      <div key={categoryName}>
                        <div style={{ padding: '0.5rem 0.75rem 0.25rem', fontSize: '0.65rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderTop: '1px solid #f1f5f9', marginTop: '0.25rem' }}>
                          {categoryName}
                        </div>
                        {categoryItems.map(opt => (
                          <div 
                            key={opt.type} 
                            onClick={() => handleAddSection(opt.type)}
                            style={{ padding: '0.5rem 0.75rem', cursor: 'pointer', display: 'flex', gap: '0.5rem', transition: 'all 0.1s', borderRadius: '4px' }}
                            className="card-hover"
                          >
                            <Layers size={15} style={{ color: '#2563eb', marginTop: '2px', flexShrink: 0 }} />
                            <div>
                              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1e293b' }}>{opt.name}</div>
                              <div style={{ fontSize: '0.65rem', color: '#64748b', lineHeight: '1.3' }}>{opt.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}

                  {filteredOptions.length === 0 && (
                    <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>No matching sections found.</div>
                  )}
                </>
              ) : (
                <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                  <AppWindow size={32} style={{ color: '#94a3b8', margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#334155' }}>No Theme Apps Installed</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '4px' }}>Integrate custom widgets in your backend dashboard.</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Preview Pane (Direct Real Storefront Rendering in Editing Page) */}
        {(() => {
          const liveEditingLayout = {
            ...layout,
            isMobileViewport: viewportMode === 'mobile',
            logoText,
            announcementBar,
            heroTitle,
            heroSubtitle,
            bannerTitle,
            bannerSubtitle,
            bannerImage,
            collectionsList,
            themeColors,
            promoVideoUrl,
            footerText,
            footerSupportTitle,
            footerContactTitle,
            footerContactAddress,
            footerContactPhone,
            footerContactEmail,
            footerCopyrightText,
            sectionsOrder: sectionsOrderList,
            hiddenSections,
            sectionSizes,
            imageBannerImage,
            imageBannerTitle,
            imageBannerSubtitle,
            colWithImageImage,
            colWithImageTitle,
            colWithImageCategory,
            richTextHeading,
            richTextBody,
            navigationTabs
          };

          return (
            <div style={{ flex: 1, backgroundColor: '#cbd5e1', overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: viewportMode === 'mobile' ? '2rem' : '0' }}>
              <div style={{
                width: viewportMode === 'desktop' ? '100%' : '375px',
                minHeight: viewportMode === 'desktop' ? '100%' : '667px',
                backgroundColor: '#ffffff',
                borderRadius: viewportMode === 'desktop' ? '0' : '32px',
                border: viewportMode === 'desktop' ? 'none' : '10px solid #1e293b',
                boxShadow: viewportMode === 'desktop' ? 'none' : '0 10px 30px rgba(0,0,0,0.15)',
                overflowY: 'auto',
                transition: 'all 0.3s ease-in-out',
                position: 'relative'
              }}>
                <Navbar 
                  activeTab="home" 
                  setActiveTab={() => {}} 
                  setViewMode={() => {}} 
                  toggleCartOpen={() => {}} 
                  layoutOverride={liveEditingLayout} 
                />
                <Home 
                  setActiveTab={() => {}} 
                  setSelectedProductId={() => {}} 
                  layoutOverride={liveEditingLayout} 
                  isMobileViewport={viewportMode === 'mobile'} 
                />
                {!liveEditingLayout?.hiddenSections?.includes('footer') && (
                  <footer style={{ 
                    backgroundColor: '#0f172a', 
                    color: '#94a3b8', 
                    padding: `${liveEditingLayout.sectionSizes?.footer?.paddingY !== undefined ? liveEditingLayout.sectionSizes.footer.paddingY : 48}px 1.5rem`, 
                    borderTop: '1px solid hsl(var(--border))' 
                  }}>
                    <div style={{ 
                      maxWidth: liveEditingLayout.sectionSizes?.footer?.isFullWidth ? '100%' : `${liveEditingLayout.sectionSizes?.footer?.width || 1280}px`, 
                      margin: '0 auto', 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                      gap: '2rem' 
                    }}>
                      <div>
                        <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.2rem' }}>{liveEditingLayout?.logoText || storeSettings?.storeName || 'AeonCare'}</h4>
                        <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>{liveEditingLayout?.footerText || storeSettings?.slogan || 'Trusted home patient care support, mobility aids, clinical diagnostic devices sales and supply hub in Chennai.'}</p>
                      </div>
                      <div>
                        <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>{liveEditingLayout?.footerSupportTitle || 'Support Hub'}</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                          <li><a href="#tel" onClick={(e) => e.preventDefault()}>FAQ Helpdesk</a></li>
                          <li><a href="#tel" onClick={(e) => e.preventDefault()}>Request Home Setup</a></li>
                          <li><a href="#tel" onClick={(e) => e.preventDefault()}>Refund Policy</a></li>
                          <li><a href="#tel" onClick={(e) => e.preventDefault()}>Terms & Conditions</a></li>
                        </ul>
                      </div>
                      <div>
                        <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>{liveEditingLayout?.footerContactTitle || 'Contact Info'}</h4>
                        <p style={{ fontSize: '0.85rem', lineHeight: '1.6', whitespace: 'pre-line' }}>
                          {liveEditingLayout?.footerContactAddress || (storeSettings?.addressLine1 ? `${storeSettings.storeName}\n${storeSettings.addressLine1}, ${storeSettings.addressLine2 ? storeSettings.addressLine2 + ', ' : ''}${storeSettings.city}, ${storeSettings.state} - ${storeSettings.pincode}` : 'Aeon Healthcare Pvt Ltd, Besant Nagar, Chennai, TN 600090')}<br/>
                          Helpline: {liveEditingLayout?.footerContactPhone || storeSettings?.storePhone || '+91 98401 23456'}<br/>
                          Email: {liveEditingLayout?.footerContactEmail || storeSettings?.storeEmail || 'support@aeoncare.in'}
                        </p>
                      </div>
                    </div>
                    <div style={{ maxWidth: liveEditingLayout.sectionSizes?.footer?.isFullWidth ? '100%' : `${liveEditingLayout.sectionSizes?.footer?.width || 1280}px`, margin: '2rem auto 0', borderTop: '1px solid #1e293b', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem' }}>
                      <span>{liveEditingLayout?.footerCopyrightText || '© 2026 AeonCare. Partner of AeonCare.in. India CDSCO labeling compliant. All rights reserved.'}</span>
                    </div>
                  </footer>
                )}
              </div>
            </div>
          );
        })()}

      </div>

    </div>
  );
}
