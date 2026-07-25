import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

export default function SEOManager({ activeTab, selectedProductId }) {
  const { products, layout, storeSettings } = useContext(AppContext);
  const [currentCategory, setCurrentCategory] = useState('All');

  const siteName = storeSettings?.storeName || layout?.logoText || 'Store';
  const siteDomain = storeSettings?.domain || 'store.com';
  const baseOrigin = `https://${siteDomain}`;

  // Listen for category selection events from Navbar, Home, or Catalog
  useEffect(() => {
    const handleSelectCategory = (e) => {
      if (e.detail) {
        setCurrentCategory(e.detail);
      }
    };
    window.addEventListener('selectCategory', handleSelectCategory);
    return () => window.removeEventListener('selectCategory', handleSelectCategory);
  }, []);

  // Reset category when leaving catalog page
  useEffect(() => {
    if (activeTab !== 'catalog') {
      setCurrentCategory('All');
    }
  }, [activeTab]);

  const selectedProduct = selectedProductId ? products.find(p => p.id === selectedProductId) : null;

  useEffect(() => {
    let title = `${siteName} - Home Care & Medical Equipment`;
    let description = `Shop medical equipment, hospital beds, wheelchairs, and clinical monitors online at ${siteName}.`;
    let canonicalUrl = `${baseOrigin}${window.location.pathname}`;
    let ogImage = 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=1200';
    let ogType = 'website';
    
    let productSchema = null;
    let collectionSchema = null;

    if (selectedProduct) {
      // ================= 1. PRODUCT PAGE SEO =================
      const p = selectedProduct;
      title = p.seo?.title ? p.seo.title : `${p.title} | ${siteName}`;
      description = p.seo?.description || p.description?.substring(0, 160) || `Buy ${p.title} online at best price from ${siteName}.`;
      ogImage = p.image;
      ogType = 'og:product';
      canonicalUrl = `${baseOrigin}/products/${p.seo?.slug || p.id}`;

      // Google JSON-LD Product Schema
      productSchema = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        'name': p.title,
        'image': p.images || [p.image],
        'description': description,
        'sku': p.sku || `AC${p.id}`,
        'gtin': p.barcode || undefined,
        'mpn': p.sku || `AC${p.id}`,
        'brand': {
          '@type': 'Brand',
          'name': p.brand || siteName
        },
        'offers': {
          '@type': 'Offer',
          'url': canonicalUrl,
          'priceCurrency': storeSettings?.currencyCode || 'INR',
          'price': p.price,
          'priceValidUntil': '2027-12-31',
          'itemCondition': 'https://schema.org/NewCondition',
          'availability': p.stock > 0 || p.allowBackorder ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          'seller': {
            '@type': 'Organization',
            'name': siteName
          }
        }
      };
    } else if (activeTab === 'catalog') {
      // ================= 2. COLLECTION / CATALOG PAGE SEO =================
      const collectionItem = layout.collectionsList?.find(c => c.name.toLowerCase() === currentCategory.toLowerCase());
      const customSlug = collectionItem?.slug || currentCategory.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

      if (currentCategory && currentCategory !== 'All') {
        title = collectionItem?.metaTitle ? collectionItem.metaTitle : `${currentCategory} Collection | ${siteName}`;
        description = collectionItem?.metaDescription || `Browse top-rated ${currentCategory} medical equipment and home-care products at ${siteName}.`;
        canonicalUrl = `${baseOrigin}/collections/${customSlug}`;
        if (collectionItem?.image) {
          ogImage = collectionItem.image;
        }
      } else {
        title = `Full Catalog & Medical Equipment | ${siteName}`;
        description = `Browse hospital beds, wheelchairs, patient monitors, oxygen concentrators, and clinical consumables at ${siteName}.`;
        canonicalUrl = `${baseOrigin}/catalog`;
      }

      // Filter products belonging to current collection
      const categoryProducts = currentCategory !== 'All' 
        ? products.filter(p => p.category === currentCategory || p.title.toLowerCase().includes(currentCategory.toLowerCase()))
        : products;

      // Google JSON-LD Collection & ItemList Schema for Google Rich Snippets
      collectionSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': currentCategory !== 'All' ? `${currentCategory} Collection` : 'Full Product Catalog',
        'description': description,
        'url': canonicalUrl,
        'mainEntity': {
          '@type': 'ItemList',
          'numberOfItems': categoryProducts.length,
          'itemListElement': categoryProducts.map((p, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'url': `${baseOrigin}/products/${p.seo?.slug || p.id}`,
            'name': p.title,
            'image': p.image,
            'offers': {
              '@type': 'Offer',
              'priceCurrency': storeSettings?.currencyCode || 'INR',
              'price': p.price
            }
          }))
        }
      };

    } else {
      // ================= 3. OTHER PAGES SEO =================
      switch (activeTab) {
        case 'services':
          title = `Home Care Nursing & Equipment Services | ${siteName}`;
          description = `Professional home care nursing, patient attendant care, and medical equipment rentals from ${siteName}.`;
          canonicalUrl = `${baseOrigin}/services`;
          break;
        case 'blog':
          title = `Caregiver Guide & Senior Health Blog | ${siteName}`;
          description = `Read expert caregiver guides, senior health tips, and buying guides from ${siteName}.`;
          canonicalUrl = `${baseOrigin}/blog`;
          break;
        case 'userPortal':
          title = `My Account & Orders | ${siteName}`;
          description = `Manage your ${siteName} account, track live orders, and check invoices.`;
          canonicalUrl = `${baseOrigin}/account`;
          break;
        default:
          title = layout.heroTitle ? `${layout.heroTitle} - ${siteName}` : `${siteName} - ${storeSettings?.slogan || 'Caring for your family'}`;
          description = layout.heroSubtitle || `Buy & rent medical equipment with doorstep setup from ${siteName}.`;
          canonicalUrl = baseOrigin;
      }
    }

    // 1. Update document title
    document.title = title;

    // 2. Helper to set meta tags dynamically
    const setMetaTag = (selector, attribute, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (selector.includes('name=')) {
          element.setAttribute('name', selector.split('name="')[1].split('"')[0]);
        } else if (selector.includes('property=')) {
          element.setAttribute('property', selector.split('property="')[1].split('"')[0]);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    setMetaTag('meta[name="description"]', 'content', description);
    setMetaTag('meta[property="og:title"]', 'content', title);
    setMetaTag('meta[property="og:description"]', 'content', description);
    setMetaTag('meta[property="og:image"]', 'content', ogImage);
    setMetaTag('meta[property="og:url"]', 'content', canonicalUrl);
    setMetaTag('meta[property="og:type"]', 'content', ogType);
    setMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'content', title);
    setMetaTag('meta[name="twitter:description"]', 'content', description);
    setMetaTag('meta[name="twitter:image"]', 'content', ogImage);

    // 3. Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 4. Inject Google JSON-LD Schema
    let schemaScript = document.getElementById('json-ld-schema');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('id', 'json-ld-schema');
      schemaScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schemaScript);
    }

    const businessSchema = {
      '@context': 'https://schema.org',
      '@type': 'MedicalBusiness',
      'name': siteName,
      'image': 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=600',
      'telephone': storeSettings?.storePhone || '+91 98401 23456',
      'email': storeSettings?.storeEmail || 'support@aeoncare.in',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': `${storeSettings?.addressLine1 || ''} ${storeSettings?.addressLine2 || ''}`.trim(),
        'addressLocality': storeSettings?.city || 'Chennai',
        'addressRegion': storeSettings?.state || 'TN',
        'postalCode': storeSettings?.pincode || '600089',
        'addressCountry': storeSettings?.country || 'IN'
      },
      'priceRange': '₹₹'
    };

    const schemasToInject = [businessSchema];
    if (productSchema) schemasToInject.unshift(productSchema);
    if (collectionSchema) schemasToInject.unshift(collectionSchema);

    schemaScript.textContent = JSON.stringify(schemasToInject);

  }, [activeTab, selectedProduct, currentCategory, products, layout, storeSettings, siteName, siteDomain, baseOrigin]);

  return null;
}
