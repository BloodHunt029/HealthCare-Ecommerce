import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  Calendar, Search, Check, Ban, DollarSign, Download, 
  ChevronRight, FileSpreadsheet, Plus, X, ArrowLeft, 
  Edit, Globe, Tag, Trash2, ShoppingBag, CreditCard, User, AlertCircle, Printer, UserPlus, PlusCircle
} from 'lucide-react';

export default function Orders() {
  const { orders, products, customers, setCustomers, createOrder, updateOrderStatus, updatePaymentStatus } = useContext(AppContext);
  
  // View Toggle: Table View vs Shopify Create Order Page View
  const [isCreatingOrderPage, setIsCreatingOrderPage] = useState(false);

  // Table View Filter States
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // All | pending | fulfilled | shipped
  const [searchQuery, setSearchQuery] = useState('');
  const [refundAmount, setRefundAmount] = useState('');

  // -------------------------------------------------------------
  // SHOPIFY-STYLE CREATE ORDER PAGE STATES
  // -------------------------------------------------------------
  const [draftItems, setDraftItems] = useState([]);
  const [showProductPickerModal, setShowProductPickerModal] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [selectedProductIdsInModal, setSelectedProductIdsInModal] = useState([]);

  const [showCustomItemModal, setShowCustomItemModal] = useState(false);
  const [customItemTitle, setCustomItemTitle] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');
  const [customItemQty, setCustomItemQty] = useState(1);

  // Financial adjustment states
  const [discountAmount, setDiscountAmount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [showShippingInput, setShowShippingInput] = useState(false);

  // Payment & Status Defaults
  const [draftPaymentMethod, setDraftPaymentMethod] = useState('razorpay');
  const [draftPaymentStatus, setDraftPaymentStatus] = useState('paid');
  const [draftOrderStatus, setDraftOrderStatus] = useState('pending');
  const [draftOrderType, setDraftOrderType] = useState('buy');

  // Sidebar States (Notes, Customer, Markets, Tags)
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [orderTags, setOrderTags] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('India');
  const [selectedCurrency, setSelectedCurrency] = useState('Indian Rupee (INR ₹)');

  // Customer Selection & Search Dropdown
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('Chennai');
  const [customerPincode, setCustomerPincode] = useState('600089');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  // -------------------------------------------------------------
  // SHOPIFY-STYLE "NEW CUSTOMER" MODAL STATES
  // -------------------------------------------------------------
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [newCustFirstName, setNewCustFirstName] = useState('');
  const [newCustLastName, setNewCustLastName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustLanguage, setNewCustLanguage] = useState('English [Default]');
  const [newCustAgreeEmail, setNewCustAgreeEmail] = useState(false);
  const [newCustAgreeSms, setNewCustAgreeSms] = useState(false);
  const [newCustAgreeWhatsapp, setNewCustAgreeWhatsapp] = useState(false);
  const [newCustAddressLine1, setNewCustAddressLine1] = useState('');
  const [newCustCity, setNewCustCity] = useState('Chennai');
  const [newCustPincode, setNewCustPincode] = useState('600089');
  const [newCustNotes, setNewCustNotes] = useState('');
  const [newCustTags, setNewCustTags] = useState('');

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  // Filtered Orders for Table List
  const filteredOrders = orders.filter(o => {
    if (filterStatus !== 'All' && o.status !== filterStatus) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchCustomer = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.includes(q);
      if (!matchId && !matchCustomer && !matchPhone) return false;
    }
    return true;
  });

  // Calculate Draft Order Financials
  const draftSubtotal = draftItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const draftTotal = Math.max(0, draftSubtotal - Number(discountAmount) + Number(shippingFee));

  // Toggle selection of product in Shopify Modal
  const handleToggleProductInModal = (id) => {
    setSelectedProductIdsInModal(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Add all checked products from Shopify modal to draft order
  const handleAddSelectedProductsFromModal = () => {
    const productsToAdd = products.filter(p => selectedProductIdsInModal.includes(p.id));
    setDraftItems(prev => {
      let updated = [...prev];
      productsToAdd.forEach(p => {
        const existingIndex = updated.findIndex(i => i.id === p.id);
        if (existingIndex > -1) {
          updated[existingIndex].qty += 1;
        } else {
          updated.push({
            id: p.id,
            title: p.title,
            price: p.price,
            qty: 1,
            image: p.image,
            category: p.category
          });
        }
      });
      return updated;
    });

    setSelectedProductIdsInModal([]);
    setShowProductPickerModal(false);
  };

  // Add Custom Item to Draft
  const handleAddCustomItem = (e) => {
    e.preventDefault();
    if (!customItemTitle || !customItemPrice) return;
    setDraftItems(prev => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        title: customItemTitle,
        price: Number(customItemPrice),
        qty: Number(customItemQty),
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300',
        category: 'Custom Item'
      }
    ]);
    setCustomItemTitle('');
    setCustomItemPrice('');
    setCustomItemQty(1);
    setShowCustomItemModal(false);
  };

  // Update Quantity of Item in Draft
  const handleUpdateDraftQty = (id, delta) => {
    setDraftItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  // Remove Item from Draft
  const handleRemoveDraftItem = (id) => {
    setDraftItems(prev => prev.filter(item => item.id !== id));
  };

  // Create New Customer from Shopify Modal
  const handleCreateNewCustomerSubmit = (e) => {
    if (e) e.preventDefault();
    const fullName = `${newCustFirstName} ${newCustLastName}`.trim() || 'New Customer';
    const newCustObj = {
      id: `CUST-${Date.now()}`,
      name: fullName,
      phone: newCustPhone || '+91 98401 23456',
      email: newCustEmail || `${fullName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      location: `${newCustAddressLine1 || '114 Mount Poonamallee Rd'}, ${newCustCity} - ${newCustPincode}`.trim(),
      ordersCount: 0,
      totalSpent: 0,
      notes: newCustNotes,
      tags: newCustTags
    };

    if (setCustomers) {
      setCustomers(prev => [newCustObj, ...prev]);
    }

    // Automatically set as active customer for draft order
    setSelectedCustomer(newCustObj);
    setCustomerName(fullName);
    setCustomerPhone(newCustObj.phone);
    setCustomerEmail(newCustObj.email);
    setCustomerAddress(newCustObj.location);
    setCustomerSearch(fullName);

    setShowNewCustomerModal(false);

    // Reset modal state
    setNewCustFirstName('');
    setNewCustLastName('');
    setNewCustEmail('');
    setNewCustPhone('');
    setNewCustAddressLine1('');
    setNewCustNotes('');
    setNewCustTags('');
  };

  // Submit & Save Draft Order
  const handleSaveDraftOrder = (e) => {
    if (e) e.preventDefault();

    if (draftItems.length === 0) {
      alert('Please add at least one product or custom item to create the order.');
      return;
    }

    if (!customerName || !customerPhone) {
      alert('Please select or create a customer on the right sidebar.');
      return;
    }

    const payload = {
      customerName,
      customerEmail: customerEmail || `${customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      customerPhone,
      items: draftItems,
      subtotal: draftSubtotal,
      depositTotal: draftOrderType === 'rental' ? 3000 : 0,
      discountAmount: Number(discountAmount),
      shippingFee: Number(shippingFee),
      total: draftTotal,
      paymentMethod: draftPaymentMethod,
      paymentStatus: draftPaymentStatus,
      status: draftOrderStatus,
      shippingAddress: {
        name: customerName,
        phone: customerPhone,
        address: customerAddress || '114 Mount Poonamallee High Rd',
        city: customerCity,
        pincode: customerPincode
      },
      orderType: draftOrderType,
      notes,
      tags: orderTags,
      currency: selectedCurrency
    };

    const newId = createOrder(payload);
    setSelectedOrderId(newId);
    setIsCreatingOrderPage(false);

    // Reset draft state
    setDraftItems([]);
    setSelectedCustomer(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setCustomerAddress('');
    setNotes('');
    setOrderTags('');
    setDiscountAmount(0);
    setShippingFee(0);
  };

  const handleProcessRefund = (e) => {
    e.preventDefault();
    if (!refundAmount) return;
    updatePaymentStatus(selectedOrder.id, 'refunded');
    setRefundAmount('');
    alert(`Refund of ₹${refundAmount} logged successfully and queued to gateway.`);
  };

  const handlePrintGstLabel = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Shipping Label - ${order.id}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; text-align: center; }
            .label-box { border: 3px double #000; padding: 20px; border-radius: 8px; max-width: 450px; margin: 0 auto; text-align: left; }
            .header { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; display: flex; justify-content: space-between; }
            .qr-mock { background: #000; width: 60px; height: 60px; }
            .pincode { font-size: 24px; font-weight: bold; border: 2px solid #000; padding: 5px 10px; display: inline-block; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="label-box">
            <div class="header">
              <div>
                <strong>AeonCare Ship Label</strong><br/>
                Express Courier Services
              </div>
              <div class="qr-mock"></div>
            </div>
            <div>To: <strong>${order.shippingAddress.name}</strong></div>
            <div>Phone: ${order.shippingAddress.phone}</div>
            <div>Address: ${order.shippingAddress.address}</div>
            <div>City: ${order.shippingAddress.city}</div>
            <div class="pincode">PIN: ${order.shippingAddress.pincode}</div>
            <hr/>
            <div><strong>Items:</strong> ${order.items.map(i => `${i.title} (x${i.qty})`).join(', ')}</div>
            <div><strong>Weight / Volumetric:</strong> Auto-calculated Cargo</div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSendWhatsAppAlert = (order) => {
    const rawPhone = (order.customerPhone || '').replace(/[^0-9]/g, '');
    const formattedPhone = rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`;
    const text = `📦 AeonCare Order Alert: Hi ${order.customerName}! Your order #${order.id} status is: ${order.status.toUpperCase()}. Total Amount: ₹${order.total.toLocaleString('en-IN')}. Tracking ID: EXP${order.id}33. Contact support: +91 98401 23456.`;
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handlePrintB2bTaxInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    const cgst = (order.total * 0.06).toFixed(2);
    const sgst = (order.total * 0.06).toFixed(2);
    const taxable = (order.total * 0.88).toFixed(2);

    printWindow.document.write(`
      <html>
        <head>
          <title>GST Tax Invoice - ${order.id}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #1e293b; line-height: 1.5; }
            .invoice-card { border: 2px solid #0d9488; border-radius: 12px; padding: 25px; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 20px; }
            .logo { font-size: 26px; font-weight: 800; color: #0d9488; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
            .panel { border: 1px solid #cbd5e1; padding: 12px 15px; border-radius: 8px; font-size: 13px; background: #f8fafc; }
            .panel h4 { margin: 0 0 8px; color: #0f766e; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
            th { background: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: left; padding: 10px; font-weight: 700; }
            td { border-bottom: 1px solid #e2e8f0; padding: 10px; }
            .totals { width: 320px; margin-left: auto; text-align: right; font-size: 13px; line-height: 1.8; }
            .totals div { display: flex; justify-content: space-between; }
            .grand-total { font-weight: 800; font-size: 16px; border-top: 2px solid #0d9488; color: #0d9488; margin-top: 6px; padding-top: 6px; }
            .footer { border-top: 1px dashed #cbd5e1; text-align: center; font-size: 11px; color: #64748b; margin-top: 30px; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            <div class="header">
              <div>
                <div class="logo">AeonCare Healthcare</div>
                <div>Aeon Healthcare Pvt Ltd, Porur, Chennai - 600089</div>
                <div><strong>GSTIN:</strong> 33AAAAA0000A1Z5 | <strong>PAN:</strong> AAAAA0000A</div>
              </div>
              <div style="text-align: right;">
                <h2 style="margin: 0; color: #0d9488;">TAX INVOICE</h2>
                <div style="font-size: 13px; margin-top: 6px;">Invoice No: <strong>${order.id}</strong></div>
                <div style="font-size: 13px;">Date: ${order.date}</div>
              </div>
            </div>

            <div class="grid">
              <div class="panel">
                <h4>BILLED TO (RECIPIENT)</h4>
                <div><strong>${order.customerName}</strong></div>
                <div>${order.shippingAddress.address}</div>
                <div>${order.shippingAddress.city} - ${order.shippingAddress.pincode}</div>
                <div>Phone: ${order.customerPhone}</div>
              </div>
              <div class="panel">
                <h4>PAYMENT & STATUS</h4>
                <div>Payment Method: <strong>${order.paymentMethod.toUpperCase()}</strong></div>
                <div>Payment Status: <strong>${order.paymentStatus.toUpperCase()}</strong></div>
                <div>Fulfillment: <strong>${order.status.toUpperCase()}</strong></div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item Description</th>
                  <th>HSN Code</th>
                  <th>Qty</th>
                  <th>Rate (₹)</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map((item, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td><strong>${item.title}</strong></td>
                    <td>9021.10</td>
                    <td>${item.qty}</td>
                    <td>₹${item.price.toLocaleString('en-IN')}.00</td>
                    <td>₹${(item.price * item.qty).toLocaleString('en-IN')}.00</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="totals">
              <div><span>Taxable Amount:</span> <span>₹${taxable}</span></div>
              <div><span>CGST (6%):</span> <span>₹${cgst}</span></div>
              <div><span>SGST (6%):</span> <span>₹${sgst}</span></div>
              <div class="grand-total"><span>Grand Total:</span> <span>₹${order.total.toLocaleString('en-IN')}.00</span></div>
            </div>

            <div class="footer">
              This is a computer-generated tax invoice issued in accordance with GST Rules 2017.
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // -------------------------------------------------------------
  // RENDER SHOPIFY "CREATE ORDER" PAGE VIEW
  // -------------------------------------------------------------
  if (isCreatingOrderPage) {
    const filteredProductsForPicker = products.filter(p => {
      if (productCategoryFilter !== 'All' && p.category !== productCategoryFilter) return false;
      if (!productSearchQuery.trim()) return true;
      return p.title.toLowerCase().includes(productSearchQuery.toLowerCase()) || p.category.toLowerCase().includes(productSearchQuery.toLowerCase());
    });

    const filteredCustomersForSearch = (customers || []).filter(c => {
      if (!customerSearch.trim()) return true;
      const q = customerSearch.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q);
    });

    return (
      <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
        
        {/* Top Header Breadcrumb & Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>
              <button 
                onClick={() => setIsCreatingOrderPage(false)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#2563eb', fontWeight: '700', padding: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <ArrowLeft size={16} /> Drafts
              </button>
              <span>/</span>
              <span>Create order</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Create order
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              className="btn btn-outline" 
              onClick={() => setIsCreatingOrderPage(false)}
              style={{ fontWeight: '600' }}
            >
              Discard
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleSaveDraftOrder}
              style={{ padding: '0.65rem 1.5rem', fontWeight: '700' }}
            >
              Save Order
            </button>
          </div>
        </div>

        {/* Shopify 2-Column Dashboard Grid: Main Left Pane (2/3) + Sidebar Right Cards (1/3) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.75rem', alignItems: 'start' }}>
          
          {/* LEFT MAIN PANE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* 1. PRODUCTS CARD */}
            <div className="card" style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Products</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    type="button" 
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowProductPickerModal(true)}
                    style={{ fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Plus size={14} /> Add product
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowCustomItemModal(true)}
                    style={{ fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Plus size={14} /> Add custom item
                  </button>
                </div>
              </div>

              {/* Draft Items List */}
              {draftItems.length === 0 ? (
                <div style={{ padding: '2.5rem 1rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                  <ShoppingBag size={32} style={{ color: '#94a3b8', marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>
                    Add a product to calculate total and view payment options
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {draftItems.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#ffffff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img src={item.image} alt={item.title} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', backgroundColor: '#f1f5f9' }} />
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>{item.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>₹{item.price.toLocaleString('en-IN')} each ({item.category})</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        {/* Quantity Counter */}
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                          <button 
                            type="button" 
                            onClick={() => handleUpdateDraftQty(item.id, -1)}
                            style={{ padding: '4px 10px', border: 'none', backgroundColor: '#f1f5f9', cursor: 'pointer', fontWeight: '700' }}
                          >-</button>
                          <span style={{ padding: '0 12px', fontSize: '0.85rem', fontWeight: '700' }}>{item.qty}</span>
                          <button 
                            type="button" 
                            onClick={() => handleUpdateDraftQty(item.id, 1)}
                            style={{ padding: '4px 10px', border: 'none', backgroundColor: '#f1f5f9', cursor: 'pointer', fontWeight: '700' }}
                          >+</button>
                        </div>

                        <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', width: '90px', textAlign: 'right' }}>
                          ₹{(item.price * item.qty).toLocaleString('en-IN')}
                        </div>

                        <button 
                          type="button" 
                          onClick={() => handleRemoveDraftItem(item.id)}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. PAYMENT CARD */}
            <div className="card" style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                Payment
              </h3>

              {/* Financial Calculation Box */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#fafafa', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem', fontSize: '0.9rem' }}>
                  <span style={{ color: '#64748b' }}>Subtotal</span>
                  <span style={{ fontWeight: '700', color: '#1e293b' }}>₹{draftSubtotal.toLocaleString('en-IN')}.00</span>
                </div>

                {/* Add Discount Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', fontSize: '0.9rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowDiscountInput(!showDiscountInput)}
                    style={{ border: 'none', background: 'none', color: '#2563eb', cursor: 'pointer', padding: 0, fontSize: '0.9rem', fontWeight: '600' }}
                  >
                    {showDiscountInput ? 'Discount' : 'Add discount'}
                  </button>
                  {showDiscountInput ? (
                    <input 
                      type="number" 
                      className="form-input" 
                      value={discountAmount} 
                      onChange={(e) => setDiscountAmount(e.target.value)} 
                      placeholder="Amount ₹"
                      style={{ width: '110px', padding: '2px 8px', fontSize: '0.85rem' }}
                    />
                  ) : (
                    <span style={{ color: '#64748b' }}>— ₹{discountAmount}.00</span>
                  )}
                </div>

                {/* Add Shipping Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', fontSize: '0.9rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowShippingInput(!showShippingInput)}
                    style={{ border: 'none', background: 'none', color: '#2563eb', cursor: 'pointer', padding: 0, fontSize: '0.9rem', fontWeight: '600' }}
                  >
                    {showShippingInput ? 'Shipping Fee' : 'Add shipping or delivery'}
                  </button>
                  {showShippingInput ? (
                    <input 
                      type="number" 
                      className="form-input" 
                      value={shippingFee} 
                      onChange={(e) => setShippingFee(e.target.value)} 
                      placeholder="Amount ₹"
                      style={{ width: '110px', padding: '2px 8px', fontSize: '0.85rem' }}
                    />
                  ) : (
                    <span style={{ color: '#64748b' }}>— ₹{shippingFee}.00</span>
                  )}
                </div>

                {/* Tax row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.65rem' }}>
                  <span style={{ color: '#64748b' }}>Estimated tax (12% GST)</span>
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Inclusive</span>
                </div>

                {/* Total */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' }}>
                  <span>Total</span>
                  <span>₹{draftTotal.toLocaleString('en-IN')}.00</span>
                </div>
              </div>

              {/* Order Fulfillment & Payment Options Controls */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>Payment Gateway</label>
                  <select className="form-input" value={draftPaymentMethod} onChange={(e) => setDraftPaymentMethod(e.target.value)}>
                    <option value="razorpay">Razorpay Online</option>
                    <option value="paypal">PayPal Express</option>
                    <option value="upi">Direct UPI</option>
                    <option value="cod">Cash on Delivery</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>Payment Status</label>
                  <select className="form-input" value={draftPaymentStatus} onChange={(e) => setDraftPaymentStatus(e.target.value)}>
                    <option value="paid">Paid (Mark as paid)</option>
                    <option value="pending">Pending (Send invoice)</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>Fulfillment Status</label>
                  <select className="form-input" value={draftOrderStatus} onChange={(e) => setDraftOrderStatus(e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="shipped">Shipped</option>
                  </select>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT SIDEBAR PANE (Shopify Stacked Cards) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* CARD 1: NOTES */}
            <div className="card" style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Notes</h4>
                <button 
                  type="button" 
                  onClick={() => setIsEditingNotes(!isEditingNotes)}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <Edit size={16} />
                </button>
              </div>
              {isEditingNotes ? (
                <textarea 
                  className="form-input" 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  placeholder="Add internal order notes..."
                  style={{ minHeight: '70px', fontSize: '0.85rem' }}
                />
              ) : (
                <div style={{ fontSize: '0.85rem', color: notes ? '#334155' : '#94a3b8' }}>
                  {notes || 'No notes'}
                </div>
              )}
            </div>

            {/* CARD 2: CUSTOMER (SHOPIFY EXACT MATCH DROPDOWN & SELECTED STATE) */}
            <div className="card" style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Customer</h4>
                {selectedCustomer && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setSelectedCustomer(null);
                      setCustomerName('');
                      setCustomerPhone('');
                      setCustomerEmail('');
                      setCustomerAddress('');
                      setCustomerSearch('');
                    }}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.75rem', fontWeight: '700' }}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              {!selectedCustomer ? (
                /* Customer Search / Selection Box */
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={customerSearch} 
                    onFocus={() => setShowCustomerDropdown(true)}
                    onChange={(e) => { setCustomerSearch(e.target.value); setShowCustomerDropdown(true); }}
                    placeholder="Search or create a customer"
                    style={{ paddingLeft: '2.25rem', fontSize: '0.85rem', borderColor: '#2563eb' }}
                  />
                  <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />

                  {/* Dropdown Menu matching Screenshot 1 */}
                  {showCustomerDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%', left: 0, right: 0,
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
                      zIndex: 30,
                      maxHeight: '260px',
                      overflowY: 'auto',
                      marginTop: '4px'
                    }}>
                      {/* Top Item: Create a new customer button */}
                      <button 
                        type="button"
                        onClick={() => { setShowCustomerDropdown(false); setShowNewCustomerModal(true); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          width: '100%',
                          padding: '0.75rem 0.85rem',
                          backgroundColor: '#f1f5f9',
                          border: 'none',
                          borderBottom: '1px solid #e2e8f0',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          color: '#1e293b',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        <UserPlus size={16} style={{ color: '#2563eb' }} />
                        <span>Create a new customer</span>
                      </button>

                      {/* Existing Customer Rows */}
                      {filteredCustomersForSearch.length === 0 ? (
                        <div style={{ padding: '0.85rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
                          No customers found matching query.
                        </div>
                      ) : (
                        filteredCustomersForSearch.map(c => (
                          <div 
                            key={c.id} 
                            onClick={() => {
                              setSelectedCustomer(c);
                              setCustomerName(c.name);
                              setCustomerPhone(c.phone);
                              setCustomerEmail(c.email);
                              setCustomerAddress(c.location || '114 Mount Poonamallee High Rd');
                              setCustomerSearch(c.name);
                              setShowCustomerDropdown(false);
                            }}
                            style={{ padding: '0.75rem 0.85rem', borderBottom: '1px solid #f8fafc', cursor: 'pointer', transition: 'background 0.15s ease' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.85rem' }}>{c.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{c.phone}</div>
                            {c.email && <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{c.email}</div>}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Selected Customer Details Display Card */
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#2563eb', marginBottom: '0.25rem' }}>
                    {customerName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#334155' }}>📞 {customerPhone}</div>
                  {customerEmail && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>✉️ {customerEmail}</div>}
                  {customerAddress && (
                    <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.4rem' }}>
                      📍 {customerAddress}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CARD 3: MARKETS & CURRENCY */}
            <div className="card" style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Markets</h4>
                <Globe size={16} style={{ color: '#64748b' }} />
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', backgroundColor: '#f1f5f9', color: '#1e293b', padding: '4px 10px', borderRadius: '12px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  🌐 {selectedMarket}
                </span>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Currency</label>
                <select className="form-input" value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)} style={{ fontSize: '0.85rem' }}>
                  <option value="Indian Rupee (INR ₹)">Indian Rupee (INR ₹)</option>
                  <option value="US Dollar (USD $)">US Dollar (USD $)</option>
                  <option value="Euro (EUR €)">Euro (EUR €)</option>
                </select>
              </div>
            </div>

            {/* CARD 4: TAGS */}
            <div className="card" style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Tags</h4>
                <Tag size={16} style={{ color: '#64748b' }} />
              </div>
              <input 
                type="text" 
                className="form-input" 
                value={orderTags} 
                onChange={(e) => setOrderTags(e.target.value)} 
                placeholder="e.g. urgent, vip, chennai"
                style={{ fontSize: '0.85rem' }}
              />
            </div>

          </div>

        </div>

        {/* SHOPIFY-STYLE "NEW CUSTOMER" MODAL */}
        {showNewCustomerModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}>
            <div className="card animate-fade-in" style={{
              backgroundColor: '#ffffff',
              maxWidth: '850px',
              width: '100%',
              maxHeight: '90vh',
              borderRadius: '16px',
              padding: 0,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              
              {/* Modal Header Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.75rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={20} style={{ color: '#2563eb' }} />
                  New customer
                </h3>
                <button 
                  type="button" 
                  onClick={() => setShowNewCustomerModal(false)} 
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.8rem', fontWeight: '700' }}
                >
                  Close
                </button>
              </div>

              {/* Modal Body: 2 Columns */}
              <form onSubmit={handleCreateNewCustomerSubmit} style={{ flex: 1, overflowY: 'auto', padding: '1.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.75rem', alignItems: 'start' }}>
                  
                  {/* Left Column: Customer Overview, Default Address, Tax Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    {/* Customer Overview */}
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', backgroundColor: '#ffffff' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                        Customer overview
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">First name *</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            required 
                            value={newCustFirstName} 
                            onChange={(e) => setNewCustFirstName(e.target.value)} 
                            placeholder="e.g. JINTO"
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Last name</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={newCustLastName} 
                            onChange={(e) => setNewCustLastName(e.target.value)} 
                            placeholder="e.g. Luies"
                          />
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">Language</label>
                        <select className="form-input" value={newCustLanguage} onChange={(e) => setNewCustLanguage(e.target.value)}>
                          <option value="English [Default]">English [Default]</option>
                          <option value="Tamil">Tamil</option>
                          <option value="Hindi">Hindi</option>
                        </select>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                          This customer will receive notifications in this language.
                        </span>
                      </div>

                      <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">Email</label>
                        <input 
                          type="email" 
                          className="form-input" 
                          value={newCustEmail} 
                          onChange={(e) => setNewCustEmail(e.target.value)} 
                          placeholder="customer@example.com"
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label className="form-label">Phone number *</label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ backgroundColor: '#f1f5f9', padding: '0.5rem 0.75rem', border: '1px solid #cbd5e1', borderRight: 'none', borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px', fontSize: '0.85rem', fontWeight: '700' }}>
                            🇮🇳 +91
                          </span>
                          <input 
                            type="tel" 
                            className="form-input" 
                            required 
                            value={newCustPhone} 
                            onChange={(e) => setNewCustPhone(e.target.value)} 
                            placeholder="9840123456"
                            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                          />
                        </div>
                      </div>

                      {/* Permission Checkboxes */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={newCustAgreeEmail} onChange={(e) => setNewCustAgreeEmail(e.target.checked)} />
                          <span>Customer agreed to receive marketing emails.</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={newCustAgreeSms} onChange={(e) => setNewCustAgreeSms(e.target.checked)} />
                          <span>Customer agreed to receive SMS marketing text messages.</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={newCustAgreeWhatsapp} onChange={(e) => setNewCustAgreeWhatsapp(e.target.checked)} />
                          <span>Customer agreed to receive WhatsApp marketing messages.</span>
                        </label>
                      </div>
                    </div>

                    {/* Default Address */}
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', backgroundColor: '#ffffff' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>
                        Default address
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 1rem' }}>The primary address of this customer</p>

                      <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <label className="form-label">Address Line 1</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={newCustAddressLine1} 
                          onChange={(e) => setNewCustAddressLine1(e.target.value)} 
                          placeholder="House No, Street, Area"
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">City</label>
                          <input type="text" className="form-input" value={newCustCity} onChange={(e) => setNewCustCity(e.target.value)} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Pincode</label>
                          <input type="text" className="form-input" value={newCustPincode} onChange={(e) => setNewCustPincode(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    {/* Tax details */}
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', backgroundColor: '#ffffff' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.75rem' }}>
                        Tax details
                      </h4>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Tax settings</label>
                        <select className="form-input" style={{ fontSize: '0.85rem' }}>
                          <option value="collect">Collect tax</option>
                          <option value="exempt">Tax exempt</option>
                        </select>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Private Notes & Tags */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', backgroundColor: '#ffffff' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>Notes</h4>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.75rem' }}>
                        Notes are private and won't be shared with the customer.
                      </p>
                      <textarea 
                        className="form-input" 
                        value={newCustNotes} 
                        onChange={(e) => setNewCustNotes(e.target.value)} 
                        placeholder="Add private staff notes..."
                        style={{ minHeight: '80px', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', backgroundColor: '#ffffff' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.75rem' }}>Tags</h4>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={newCustTags} 
                        onChange={(e) => setNewCustTags(e.target.value)} 
                        placeholder="e.g. VIP, clinic, regular"
                        style={{ fontSize: '0.85rem' }}
                      />
                    </div>

                  </div>

                </div>

                {/* Footer buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowNewCustomerModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem', fontWeight: '700' }}>
                    Save Customer
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* SHOPIFY-STYLE "SELECT PRODUCTS" MULTI-SELECTION MODAL */}
        {showProductPickerModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}>
            <div className="card animate-fade-in" style={{
              backgroundColor: '#ffffff',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '85vh',
              borderRadius: '16px',
              padding: 0,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Select products</h3>
                <button type="button" onClick={() => setShowProductPickerModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
                  <X size={20} />
                </button>
              </div>

              {/* Search & Filter Bar */}
              <div style={{ padding: '1rem 1.5rem 0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={productSearchQuery} 
                      onChange={(e) => setProductSearchQuery(e.target.value)} 
                      placeholder="Search products"
                      style={{ paddingLeft: '2.25rem', borderColor: '#2563eb' }}
                    />
                    <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  </div>

                  <select 
                    className="form-input" 
                    value={productCategoryFilter} 
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    style={{ width: '160px', fontSize: '0.85rem' }}
                  >
                    <option value="All">Search by All</option>
                    <option value="Mobility Aid">Mobility Aid</option>
                    <option value="Hospital Beds">Hospital Beds</option>
                    <option value="Respiratory Care">Respiratory Care</option>
                    <option value="Orthopedic Braces">Orthopedic Braces</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    type="button" 
                    className="btn btn-ghost btn-sm" 
                    onClick={() => { setProductSearchQuery(''); setProductCategoryFilter('All'); }}
                    style={{ fontSize: '0.75rem', color: '#64748b', padding: '2px 8px', border: '1px solid #e2e8f0' }}
                  >
                    Add filter +
                  </button>
                </div>
              </div>

              {/* Table Body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '0.75rem 0.5rem', width: '36px' }}>
                        <input 
                          type="checkbox" 
                          checked={filteredProductsForPicker.length > 0 && selectedProductIdsInModal.length === filteredProductsForPicker.length} 
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProductIdsInModal(filteredProductsForPicker.map(p => p.id));
                            } else {
                              setSelectedProductIdsInModal([]);
                            }
                          }}
                          style={{ cursor: 'pointer', accentColor: '#2563eb' }}
                        />
                      </th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Product</th>
                      <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center', width: '100px' }}>Available</th>
                      <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right', width: '130px' }}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProductsForPicker.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No products found matching filters.</td>
                      </tr>
                    ) : (
                      filteredProductsForPicker.map(p => {
                        const isChecked = selectedProductIdsInModal.includes(p.id);
                        return (
                          <tr 
                            key={p.id} 
                            style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', backgroundColor: isChecked ? '#f0f7ff' : 'transparent' }}
                            onClick={() => handleToggleProductInModal(p.id)}
                          >
                            <td style={{ padding: '0.75rem 0.5rem' }} onClick={(e) => e.stopPropagation()}>
                              <input 
                                type="checkbox" 
                                checked={isChecked} 
                                onChange={() => handleToggleProductInModal(p.id)}
                                style={{ cursor: 'pointer', accentColor: '#2563eb' }}
                              />
                            </td>
                            <td style={{ padding: '0.75rem 0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <img src={p.image} alt={p.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', backgroundColor: '#f1f5f9' }} />
                                <div>
                                  <div style={{ fontWeight: '700', color: '#1e293b', lineHeight: '1.3' }}>{p.title}</div>
                                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{p.category}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', fontWeight: '700', color: (p.stock !== undefined ? p.stock : 20) > 0 ? '#1e293b' : '#d97706' }}>
                              {p.stock !== undefined ? p.stock : 20}
                            </td>
                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: '800', color: '#1e293b' }}>
                              ₹{p.price.toLocaleString('en-IN')}.00 INR
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Modal Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#fafafa' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>
                  {selectedProductIdsInModal.length} / {products.length} variants selected
                </span>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    type="button" 
                    className="btn btn-outline btn-sm" 
                    onClick={() => { setSelectedProductIdsInModal([]); setShowProductPickerModal(false); }}
                    style={{ fontWeight: '600' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm" 
                    disabled={selectedProductIdsInModal.length === 0}
                    onClick={handleAddSelectedProductsFromModal}
                    style={{ fontWeight: '700', padding: '0.5rem 1.25rem', opacity: selectedProductIdsInModal.length === 0 ? 0.5 : 1 }}
                  >
                    Add
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* MODAL: ADD CUSTOM ITEM */}
        {showCustomItemModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}>
            <div className="card animate-fade-in" style={{ backgroundColor: '#ffffff', maxWidth: '450px', width: '100%', borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Add custom item</h3>
                <button type="button" onClick={() => setShowCustomItemModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddCustomItem}>
                <div className="form-group">
                  <label className="form-label">Item Title *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={customItemTitle} 
                    onChange={(e) => setCustomItemTitle(e.target.value)} 
                    placeholder="e.g. Special Express Cargo Setup" 
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Price (₹) *</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      required 
                      value={customItemPrice} 
                      onChange={(e) => setCustomItemPrice(e.target.value)} 
                      placeholder="1500" 
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Quantity</label>
                    <input 
                      type="number" 
                      min="1" 
                      className="form-input" 
                      value={customItemQty} 
                      onChange={(e) => setCustomItemQty(e.target.value)} 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowCustomItemModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Item</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER NORMAL ORDERS MANAGEMENT TABLE VIEW
  // -------------------------------------------------------------
  return (
    <div className="animate-fade-in">
      
      {/* Top Header Bar with "+ Create order" button on Top Right */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Order Management</h1>
          <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.875rem', margin: '4px 0 0' }}>Track outright purchases, fulfillment logs, manual draft orders, and print shipping labels.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => setIsCreatingOrderPage(true)} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', padding: '0.65rem 1.25rem' }}
          >
            <Plus size={18} /> Create Order
          </button>
          <button className="btn btn-outline" onClick={() => alert('Bulk orders exported to CSV.')} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FileSpreadsheet size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1fr 420px' : '1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Side: Order Listing Grid */}
        <div className="card" style={{ padding: '1.25rem' }}>
          
          {/* Filters Row */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by Order ID, name, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.25rem' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }} />
            </div>

            <select className="form-input" style={{ width: '180px' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {/* Grid list table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid hsl(var(--border))', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem', fontWeight: '700' }}>Order ID</th>
                  <th style={{ padding: '0.75rem', fontWeight: '700' }}>Customer</th>
                  <th style={{ padding: '0.75rem', fontWeight: '700' }}>Date</th>
                  <th style={{ padding: '0.75rem', fontWeight: '700' }}>Type</th>
                  <th style={{ padding: '0.75rem', fontWeight: '700' }}>Total</th>
                  <th style={{ padding: '0.75rem', fontWeight: '700' }}>Payment</th>
                  <th style={{ padding: '0.75rem', fontWeight: '700' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '700' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>No orders found matching filters.</td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr 
                      key={order.id} 
                      style={{ 
                        borderBottom: '1px solid hsl(var(--border))', 
                        backgroundColor: selectedOrderId === order.id ? 'hsl(var(--secondary))' : 'transparent',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <td style={{ padding: '0.75rem', fontWeight: '700', color: 'hsl(var(--primary))' }}>{order.id}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <div><strong>{order.customerName}</strong></div>
                        <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>{order.customerPhone}</div>
                      </td>
                      <td style={{ padding: '0.75rem', color: 'hsl(var(--text-muted))' }}>{order.date}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontWeight: '700',
                          backgroundColor: order.orderType === 'rental' ? 'hsl(var(--accent) / 0.15)' : 'hsl(var(--secondary))',
                          color: order.orderType === 'rental' ? 'hsl(var(--accent-foreground))' : 'hsl(var(--primary))'
                        }}>
                          {order.orderType === 'rental' ? 'Rental' : 'Buy'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: '700' }}>₹{order.total.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: order.paymentStatus === 'paid' ? 'hsl(var(--success))' : 'hsl(var(--warning))'
                        }}>
                          {order.paymentStatus.toUpperCase()} ({order.paymentMethod.toUpperCase()})
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${
                          order.status === 'fulfilled' ? 'badge-success' :
                          order.status === 'shipped' ? 'badge-accent' :
                          order.status === 'delivered' ? 'badge-primary' : 'badge-warning'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <button 
                          className="btn btn-ghost btn-sm" 
                          onClick={(e) => { e.stopPropagation(); setSelectedOrderId(order.id); }}
                          style={{ padding: '4px 8px' }}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Side Drawer: Detailed Fulfillment / Label Print */}
        {selectedOrder && (
          <aside className="card animate-fade-in" style={{ padding: '1.5rem', border: '2px solid hsl(var(--primary))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Order Details #{selectedOrder.id}</h3>
                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Placed on {selectedOrder.date}</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedOrderId('')}>Close</button>
            </div>

            {/* Customer Info */}
            <div style={{ marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: '700', color: 'hsl(var(--primary))', marginBottom: '0.25rem' }}>CUSTOMER & DELIVERY ADDRESS</div>
              <div><strong>Name:</strong> {selectedOrder.customerName}</div>
              <div><strong>Phone:</strong> {selectedOrder.customerPhone}</div>
              <div><strong>Email:</strong> {selectedOrder.customerEmail}</div>
              <div style={{ marginTop: '0.5rem', backgroundColor: 'hsl(var(--secondary))', padding: '0.5rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                <div><strong>Shipping Address:</strong></div>
                <div>{selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.pincode}</div>
              </div>
            </div>

            {/* Order Items */}
            <div style={{ marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: '700', color: 'hsl(var(--primary))', marginBottom: '0.5rem' }}>PURCHASED ITEMS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '0.4rem' }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Qty: {item.qty} × ₹{item.price}</div>
                    </div>
                    <div style={{ fontWeight: '700' }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontWeight: '800', fontSize: '0.95rem' }}>
                <span>Total Amount:</span>
                <span>₹{selectedOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <button className="btn btn-primary btn-sm" onClick={() => handlePrintGstLabel(selectedOrder)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Printer size={14} /> Print GST Courier Shipping Label
              </button>

              <button className="btn btn-outline btn-sm" onClick={() => handlePrintB2bTaxInvoice(selectedOrder)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '700' }}>
                <FileSpreadsheet size={14} /> Print 1-Click B2B Tax Invoice
              </button>

              <button className="btn btn-outline btn-sm" onClick={() => handleSendWhatsAppAlert(selectedOrder)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#16a34a', borderColor: '#16a34a', fontWeight: '700' }}>
                📲 Send WhatsApp Customer Alert
              </button>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {selectedOrder.status !== 'fulfilled' && (
                  <button 
                    className="btn btn-accent btn-sm" 
                    onClick={() => updateOrderStatus(selectedOrder.id, 'fulfilled')}
                    style={{ flex: 1 }}
                  >
                    Mark Fulfilled
                  </button>
                )}
                {selectedOrder.status !== 'shipped' && (
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                    style={{ flex: 1 }}
                  >
                    Mark Shipped
                  </button>
                )}
              </div>
            </div>

            {/* Issue Refund Form */}
            <div style={{ borderTop: '1px solid hsl(var(--border))', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: '700', marginBottom: '0.5rem' }}>ISSUE REFUNDS</div>
              <form onSubmit={handleProcessRefund} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Refund Amount (₹)"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
                />
                <button className="btn btn-ghost" style={{ padding: '0.35rem 0.75rem', color: 'hsl(var(--destructive))', fontSize: '0.8rem', border: '1px solid hsl(var(--border))' }}>Refund</button>
              </form>
            </div>

            {/* Timeline Logs */}
            <div style={{ borderTop: '1px solid hsl(var(--border))', marginTop: '1.25rem', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: '700', marginBottom: '0.5rem' }}>ORDER ACTIVITY TIMELINE</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '120px', overflowY: 'auto' }}>
                {selectedOrder.timeline.map((log, i) => (
                  <div key={i} style={{ fontSize: '0.7rem', borderLeft: '2px solid hsl(var(--primary))', paddingLeft: '0.5rem', marginLeft: '0.25rem' }}>
                    <span style={{ color: 'hsl(var(--text-muted))', display: 'block' }}>{log.time}</span>
                    <span>{log.text}</span>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        )}

      </div>

    </div>
  );
}
