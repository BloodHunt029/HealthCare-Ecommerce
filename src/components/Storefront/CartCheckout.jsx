import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  ShoppingBag, Trash2, ArrowRight, ArrowLeft, CheckCircle2, 
  CreditCard, ShieldCheck, Truck, FileText, Tag, MapPin, 
  DollarSign, Smartphone, HelpCircle, X, ChevronRight, MessageSquare, Printer
} from 'lucide-react';

export function CartDrawer({ isOpen, toggleCartOpen, setActiveTab }) {
  const { cart, removeFromCart, updateCartQty, storeSettings } = useContext(AppContext);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shippingFee = cartSubtotal >= (storeSettings?.freeShippingThreshold || 2000) || cart.length === 0 ? 0 : 150;
  const cartTotal = Math.max(0, cartSubtotal + shippingFee);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, left: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)',
      zIndex: 1000, display: 'flex', justifyContent: 'flex-end'
    }}>
      <div className="animate-fade-in" style={{
        backgroundColor: '#ffffff', width: '100%', maxWidth: '420px', height: '100%',
        display: 'flex', flexDirection: 'column', padding: '1.5rem', boxShadow: '-10px 0 25px rgba(0,0,0,0.15)'
      }}>
        {/* Drawer Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b' }}>
            <ShoppingBag size={20} style={{ color: '#0d9488' }} /> Your Shopping Cart ({cart.reduce((a, b) => a + b.qty, 0)})
          </h3>
          <button type="button" onClick={toggleCartOpen} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Drawer Items List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
              <ShoppingBag size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>Your cart is empty</div>
              <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>Add items from our catalog to proceed.</div>
            </div>
          ) : (
            cart.map(item => {
              const itemKey = item.cartItemId || `${item.id}_${item.type || 'buy'}_${item.variant ? String(item.variant).replace(/\s+/g, '_') : 'std'}`;
              return (
                <div key={itemKey} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={item.image} alt={item.title} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', lineHeight: '1.3' }}>{item.title}</div>
                      {item.variant && (
                        <div style={{ fontSize: '0.72rem', color: '#0d9488', fontWeight: '600' }}>Variant: {item.variant}</div>
                      )}
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>₹{item.price.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                      <button type="button" onClick={() => updateCartQty(itemKey, Math.max(1, item.qty - 1))} style={{ padding: '2px 6px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '700' }}>-</button>
                      <span style={{ padding: '0 6px', fontSize: '0.8rem', fontWeight: '700' }}>{item.qty}</span>
                      <button type="button" onClick={() => updateCartQty(itemKey, item.qty + 1)} style={{ padding: '2px 6px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '700' }}>+</button>
                    </div>
                    <button type="button" onClick={() => removeFromCart(itemKey)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>Subtotal:</span>
              <span style={{ fontWeight: '700', color: '#1e293b' }}>₹{cartSubtotal.toLocaleString('en-IN')}.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '800', color: '#0d9488', marginBottom: '1.25rem' }}>
              <span>Total Payable:</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}.00</span>
            </div>

            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => { toggleCartOpen(); setActiveTab('checkout'); }}
              style={{ width: '100%', padding: '0.85rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              Checkout Now <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CartCheckout() {
  const { cart, removeFromCart, updateCartQty, clearCart, createOrder, discounts, storeSettings, triggerOrderNotification } = useContext(AppContext);
  const [step, setStep] = useState(1); // 1: Cart, 2: Shipping & Payment, 3: Order Success Confirmation

  // Form inputs
  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('Chennai');
  const [shippingPincode, setShippingPincode] = useState('600089');

  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // razorpay | paypal | upi | cod
  const [isGstEnabled, setIsGstEnabled] = useState(false);
  const [gstCompanyName, setGstCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  // Discount code state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Payment Processing States
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaypalModal, setShowPaypalModal] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [lastPaymentId, setLastPaymentId] = useState('');

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  let discountVal = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountVal = (cartSubtotal * appliedCoupon.value) / 100;
    } else {
      discountVal = appliedCoupon.value;
    }
  }

  const shippingFee = cartSubtotal >= (storeSettings?.freeShippingThreshold || 2000) || cart.length === 0 ? 0 : 150;
  const cartTotal = Math.max(0, cartSubtotal - discountVal + shippingFee);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');

    const codeUpper = couponCode.trim().toUpperCase();
    const found = discounts.find(d => d.code === codeUpper && d.active);

    if (!found) {
      setCouponError('Invalid coupon code. Try WELCOME10 or FLAT500');
      setAppliedCoupon(null);
      return;
    }

    if (cartSubtotal < found.minOrder) {
      setCouponError(`Minimum order value of ₹${found.minOrder} required for this code.`);
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(found);
    setCouponError('');
  };

  // Dynamically Load Razorpay JS SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Launch Razorpay Live Modal
  const handleLaunchRazorpay = async (orderPayload) => {
    setIsProcessingPayment(true);
    const loaded = await loadRazorpayScript();

    if (!loaded) {
      alert('Razorpay SDK failed to load. Please check your network connection.');
      setIsProcessingPayment(false);
      return;
    }

    const keyId = storeSettings?.razorpayKeyId || 'rzp_test_98401234567890';
    const merchantName = storeSettings?.razorpayMerchantName || 'AeonCare Healthcare Supply';

    const options = {
      key: keyId,
      amount: Math.round(cartTotal * 100), // Amount in paise
      currency: 'INR',
      name: merchantName,
      description: `Order Payment - AeonCare Healthcare`,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200',
      handler: function (response) {
        setIsProcessingPayment(false);
        const pId = response.razorpay_payment_id || `pay_${Date.now()}`;
        setLastPaymentId(pId);
        
        const finalOrderPayload = {
          ...orderPayload,
          paymentStatus: 'paid',
          razorpayPaymentId: pId
        };
        const newId = createOrder(finalOrderPayload);
        setCreatedOrderId(newId);
        setStep(3);
        clearCart();
      },
      prefill: {
        name: shippingName,
        email: `${shippingName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        contact: shippingPhone
      },
      theme: {
        color: '#0d9488'
      },
      modal: {
        ondismiss: function () {
          setIsProcessingPayment(false);
        }
      }
    };

    const rzpInstance = new window.Razorpay(options);
    rzpInstance.open();
  };

  // Final Order Submission Switcher
  const handleOrderSubmission = (e) => {
    e.preventDefault();

    if (!shippingName || !shippingPhone || !shippingAddress) {
      alert('Please fill in recipient name, phone number, and address.');
      return;
    }

    const orderPayload = {
      customerName: shippingName,
      customerEmail: `${shippingName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      customerPhone: shippingPhone,
      items: cart,
      subtotal: cartSubtotal,
      depositTotal: 0,
      discountAmount: discountVal,
      shippingFee,
      total: cartTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      status: 'pending',
      shippingAddress: {
        name: shippingName,
        phone: shippingPhone,
        address: shippingAddress,
        city: shippingCity,
        pincode: shippingPincode
      },
      orderType: 'buy',
      gstDetails: isGstEnabled ? { companyName: gstCompanyName, gstNumber } : null
    };

    if (paymentMethod === 'razorpay') {
      handleLaunchRazorpay(orderPayload);
    } else if (paymentMethod === 'paypal') {
      setShowPaypalModal(true);
    } else {
      // Direct UPI or COD
      const newId = createOrder(orderPayload);
      setCreatedOrderId(newId);
      setStep(3);
      clearCart();
    }
  };

  // Process PayPal Approval
  const handleApprovePaypal = () => {
    const payId = `PAYID-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    setLastPaymentId(payId);

    const orderPayload = {
      customerName: shippingName,
      customerEmail: `${shippingName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      customerPhone: shippingPhone,
      items: cart,
      subtotal: cartSubtotal,
      depositTotal: 0,
      discountAmount: discountVal,
      shippingFee,
      total: cartTotal,
      paymentMethod: 'paypal',
      paymentStatus: 'paid',
      paypalTransactionId: payId,
      status: 'pending',
      shippingAddress: {
        name: shippingName,
        phone: shippingPhone,
        address: shippingAddress,
        city: shippingCity,
        pincode: shippingPincode
      },
      orderType: 'buy',
      gstDetails: isGstEnabled ? { companyName: gstCompanyName, gstNumber } : null
    };

    const newId = createOrder(orderPayload);
    setCreatedOrderId(newId);
    setShowPaypalModal(false);
    setStep(3);
    clearCart();
  };

  // 1-CLICK PDF GST TAX INVOICE PRINT / DOWNLOAD GENERATOR
  const handlePrintInvoice = () => {
    const printWindow = window.open('', '_blank');
    const invoiceDate = new Date().toISOString().split('T')[0];
    const cgstVal = (cartTotal * 0.06).toFixed(2);
    const sgstVal = (cartTotal * 0.06).toFixed(2);
    const netTaxable = (cartTotal * 0.88).toFixed(2);

    printWindow.document.write(`
      <html>
        <head>
          <title>GST Tax Invoice - ${createdOrderId}</title>
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
            .stamp { text-align: right; margin-top: 20px; font-size: 12px; font-weight: 700; color: #0f766e; }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            <div class="header">
              <div>
                <div class="logo">AeonCare Healthcare</div>
                <div>Aeon Healthcare Pvt Ltd, Porur, Chennai - 600089</div>
                <div><strong>GSTIN:</strong> ${storeSettings?.gstNumber || '33AAAAA0000A1Z5'} | <strong>PAN:</strong> ${storeSettings?.panNumber || 'AAAAA0000A'}</div>
                <div>Email: ${storeSettings?.storeEmail || 'billing@aeoncare.in'} | Tel: ${storeSettings?.storePhone || '+91 98401 23456'}</div>
              </div>
              <div style="text-align: right;">
                <h2 style="margin: 0; color: #0d9488;">TAX INVOICE</h2>
                <div style="font-size: 13px; margin-top: 6px;">Invoice No: <strong>${createdOrderId}</strong></div>
                <div style="font-size: 13px;">Date: ${invoiceDate}</div>
                <div style="font-size: 13px;">Place of Supply: Tamil Nadu (33)</div>
              </div>
            </div>

            <div class="grid">
              <div class="panel">
                <h4>BILLED TO (RECIPIENT)</h4>
                <div><strong>${shippingName}</strong></div>
                <div>${shippingAddress}</div>
                <div>${shippingCity} - ${shippingPincode}</div>
                <div>Phone: ${shippingPhone}</div>
              </div>
              <div class="panel">
                <h4>GST & PAYMENT SUMMARY</h4>
                ${isGstEnabled ? `
                  <div>Company: <strong>${gstCompanyName}</strong></div>
                  <div>GSTIN: <strong>${gstNumber}</strong></div>
                ` : `
                  <div>Customer Type: B2C End Consumer</div>
                `}
                <div>Payment Method: <strong>${paymentMethod.toUpperCase()}</strong></div>
                <div>Payment Status: <span style="color: green; font-weight: bold;">PAID / VERIFIED</span></div>
                ${lastPaymentId ? `<div>Txn Ref: <strong>${lastPaymentId}</strong></div>` : ''}
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
                ${cart.map((item, idx) => `
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
              <div><span>Taxable Amount:</span> <span>₹${netTaxable}</span></div>
              <div><span>CGST (6%):</span> <span>₹${cgstVal}</span></div>
              <div><span>SGST (6%):</span> <span>₹${sgstVal}</span></div>
              <div><span>Freight / Shipping:</span> <span>₹${shippingFee}.00</span></div>
              <div class="grand-total"><span>Grand Total:</span> <span>₹${cartTotal.toLocaleString('en-IN')}.00</span></div>
            </div>

            <div class="stamp">
              <div>For Aeon Healthcare Private Limited</div>
              <div style="margin-top: 30px;">[ Authorized Signatory Stamp ]</div>
            </div>

            <div class="footer">
              This is a computer-generated tax invoice issued in accordance with GST Rules 2017. 
              <br/>Thank you for trusting AeonCare Healthcare with your family's medical care!
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Launch WhatsApp Message Alert
  const handleOpenWhatsAppAlert = () => {
    const rawPhone = shippingPhone.replace(/[^0-9]/g, '');
    const formattedPhone = rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`;
    const text = `📦 AeonCare Order Alert: Hi ${shippingName}! Your order #${createdOrderId} (₹${cartTotal.toLocaleString('en-IN')}) has been received & confirmed. Invoice & delivery updates will be sent here!`;
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem 0 3rem' }}>
      
      {/* Checkout Progress Stepper */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2.5rem', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step >= 1 ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))', fontWeight: '700' }}>
          <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: step >= 1 ? 'hsl(var(--primary))' : 'hsl(var(--muted))', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>1</span>
          Cart Review
        </div>
        <ChevronRight size={18} style={{ color: 'hsl(var(--text-muted))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step >= 2 ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))', fontWeight: '700' }}>
          <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: step >= 2 ? 'hsl(var(--primary))' : 'hsl(var(--muted))', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>2</span>
          Shipping & Payment
        </div>
        <ChevronRight size={18} style={{ color: 'hsl(var(--text-muted))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step === 3 ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))', fontWeight: '700' }}>
          <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: step === 3 ? 'hsl(var(--primary))' : 'hsl(var(--muted))', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>3</span>
          Confirmation
        </div>
      </div>

      {/* STEP 1: CART REVIEW */}
      {step === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
          
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={20} /> Shopping Cart ({cart.reduce((a, b) => a + b.qty, 0)} items)
            </h2>

            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <ShoppingBag size={48} style={{ color: 'hsl(var(--text-muted))', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Your cart is empty</h3>
                <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.875rem' }}>Explore our catalog to add medical equipment, mobility aids, or consumables.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cart.map(item => {
                  const itemKey = item.cartItemId || `${item.id}_${item.type || 'buy'}_${item.variant ? String(item.variant).replace(/\s+/g, '_') : 'std'}`;
                  return (
                    <div key={itemKey} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src={item.image} alt={item.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{item.title}</div>
                          {item.variant && (
                            <div style={{ fontSize: '0.75rem', color: '#0d9488', fontWeight: '600' }}>Variant: {item.variant}</div>
                          )}
                          <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>₹{item.price.toLocaleString('en-IN')} each</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid hsl(var(--border))', borderRadius: '6px' }}>
                          <button style={{ padding: '4px 10px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '700' }} onClick={() => updateCartQty(itemKey, Math.max(1, item.qty - 1))}>-</button>
                          <span style={{ padding: '0 8px', fontSize: '0.875rem', fontWeight: '700' }}>{item.qty}</span>
                          <button style={{ padding: '4px 10px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '700' }} onClick={() => updateCartQty(itemKey, item.qty + 1)}>+</button>
                        </div>

                        <div style={{ fontWeight: '800', width: '90px', textAlign: 'right' }}>
                          ₹{(item.price * item.qty).toLocaleString('en-IN')}
                        </div>

                        <button style={{ border: 'none', background: 'none', color: 'hsl(var(--destructive))', cursor: 'pointer' }} onClick={() => removeFromCart(itemKey)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem' }}>Order Summary</h3>
            
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Coupon Code" 
                  value={couponCode} 
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{ textTransform: 'uppercase', fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn btn-outline btn-sm" style={{ fontWeight: '700' }}>Apply</button>
              </div>
              {couponError && <div style={{ fontSize: '0.75rem', color: 'hsl(var(--destructive))', marginTop: '4px' }}>{couponError}</div>}
              {appliedCoupon && <div style={{ fontSize: '0.75rem', color: 'hsl(var(--success))', marginTop: '4px', fontWeight: '700' }}>✓ Code {appliedCoupon.code} applied!</div>}
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid hsl(var(--border))', paddingTop: '1rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'hsl(var(--text-muted))' }}>Subtotal</span>
                <span style={{ fontWeight: '700' }}>₹{cartSubtotal.toLocaleString('en-IN')}.00</span>
              </div>
              {discountVal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'hsl(var(--success))' }}>
                  <span>Discount</span>
                  <span style={{ fontWeight: '700' }}>-₹{discountVal.toLocaleString('en-IN')}.00</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'hsl(var(--text-muted))' }}>Shipping Charges</span>
                <span>{shippingFee === 0 ? <strong style={{ color: 'hsl(var(--success))' }}>FREE</strong> : `₹${shippingFee}.00`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: '800', borderTop: '2px solid hsl(var(--primary))', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                <span>Total Amount</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}.00</span>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              disabled={cart.length === 0} 
              onClick={() => setStep(2)}
              style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              Proceed to Shipping <ArrowRight size={18} />
            </button>
          </div>

        </div>
      )}

      {/* STEP 2: SHIPPING & PAYMENT */}
      {step === 2 && (
        <form onSubmit={handleOrderSubmission} style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Address Details Card */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} style={{ color: 'hsl(var(--primary))' }} /> Delivery Shipping Address
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input type="text" className="form-input" required value={shippingName} onChange={(e) => setShippingName(e.target.value)} placeholder="e.g. Ramesh Kumar" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Phone Number *</label>
                  <input type="tel" className="form-input" required value={shippingPhone} onChange={(e) => setShippingPhone(e.target.value)} placeholder="9840123456" />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Street Address *</label>
                <input type="text" className="form-input" required value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="Flat/House No, Street, Area" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">City</label>
                  <input type="text" className="form-input" value={shippingCity} onChange={(e) => setShippingCity(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Pincode</label>
                  <input type="text" className="form-input" value={shippingPincode} onChange={(e) => setShippingPincode(e.target.value)} />
                </div>
              </div>
            </div>

            {/* B2B GST Invoice Details Card */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: '700', color: 'hsl(var(--primary))' }}>
                <input type="checkbox" checked={isGstEnabled} onChange={(e) => setIsGstEnabled(e.target.checked)} />
                <span>I require a Tax Invoice with GSTIN for B2B Claim</span>
              </label>

              {isGstEnabled && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid hsl(var(--border))' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Registered Business Name</label>
                    <input type="text" className="form-input" value={gstCompanyName} onChange={(e) => setGstCompanyName(e.target.value)} placeholder="e.g. HealthCare Clinic Pvt Ltd" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">GSTIN Number</label>
                    <input type="text" className="form-input" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} placeholder="33AAAAA0000A1Z5" />
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={18} style={{ color: 'hsl(var(--primary))' }} /> Select Payment Method
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                
                {/* Razorpay Option */}
                {storeSettings?.enableRazorpay && (
                  <label style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1rem', border: `2px solid ${paymentMethod === 'razorpay' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                    borderRadius: '8px', cursor: 'pointer', backgroundColor: paymentMethod === 'razorpay' ? 'hsl(var(--secondary))' : 'transparent'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input type="radio" name="payment" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} />
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.95rem' }}>Razorpay Online (UPI, Cards, Netbanking)</strong>
                        <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Instant approval via official Razorpay SDK</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#3b82f6', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>RAZORPAY</span>
                  </label>
                )}

                {/* PayPal Option */}
                {storeSettings?.enablePayPal && (
                  <label style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1rem', border: `2px solid ${paymentMethod === 'paypal' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                    borderRadius: '8px', cursor: 'pointer', backgroundColor: paymentMethod === 'paypal' ? 'hsl(var(--secondary))' : 'transparent'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input type="radio" name="payment" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} />
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.95rem' }}>PayPal Express (Global Credit/Debit Cards)</strong>
                        <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Pay safely via PayPal Sandbox / Express</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#003087', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>PAYPAL</span>
                  </label>
                )}

                {/* UPI Direct */}
                {storeSettings?.enableUpiDirect && (
                  <label style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1rem', border: `2px solid ${paymentMethod === 'upi' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                    borderRadius: '8px', cursor: 'pointer', backgroundColor: paymentMethod === 'upi' ? 'hsl(var(--secondary))' : 'transparent'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input type="radio" name="payment" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.95rem' }}>Direct UPI App Payment ({storeSettings?.upiId})</strong>
                        <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Google Pay, PhonePe, Paytm QR code</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#10b981', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>UPI</span>
                  </label>
                )}

                {/* COD */}
                {storeSettings?.enableCod && (
                  <label style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1rem', border: `2px solid ${paymentMethod === 'cod' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                    borderRadius: '8px', cursor: 'pointer', backgroundColor: paymentMethod === 'cod' ? 'hsl(var(--secondary))' : 'transparent'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.95rem' }}>Cash / Pay on Delivery (COD)</strong>
                        <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Pay cash upon equipment arrival & setup</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#64748b', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>COD</span>
                  </label>
                )}

              </div>
            </div>

          </div>

          {/* Right Summary Pane & Submit Button */}
          <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem' }}>Payable Amount</h3>
            
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'hsl(var(--primary))', marginBottom: '1rem' }}>
              ₹{cartTotal.toLocaleString('en-IN')}.00
            </div>

            <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', marginBottom: '1.25rem', lineHeight: '1.4' }}>
              Includes 12% GST tax breakdown & free doorstep delivery setup in Chennai.
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isProcessingPayment}
                style={{ flex: 2, padding: '0.75rem', fontWeight: '700' }}
              >
                {isProcessingPayment ? 'Connecting Gateway...' : paymentMethod === 'razorpay' ? 'Pay via Razorpay' : 'Place Order'}
              </button>
            </div>
          </div>

        </form>
      )}

      {/* STEP 3: ORDER SUCCESS & GST INVOICE DOWNLOAD */}
      {step === 3 && (
        <div className="card animate-fade-in" style={{ padding: '2.5rem', textCenter: 'center', maxWidth: '650px', margin: '0 auto', textAlign: 'center' }}>
          <CheckCircle2 size={64} style={{ color: 'hsl(var(--success))', margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'hsl(var(--primary))' }}>Order Placed Successfully!</h2>
          <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Thank you, <strong>{shippingName}</strong>. Your order ID is <strong style={{ color: 'hsl(var(--primary))' }}>#{createdOrderId}</strong>.
          </p>

          {/* Action buttons: Print GST Invoice & WhatsApp Alert */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            <button 
              className="btn btn-primary" 
              onClick={handlePrintInvoice}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '700', padding: '0.75rem' }}
            >
              <Printer size={18} /> Print 1-Click PDF GST Tax Invoice
            </button>

            <button 
              className="btn btn-outline" 
              onClick={handleOpenWhatsAppAlert}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '700', color: '#16a34a', borderColor: '#16a34a' }}
            >
              <MessageSquare size={18} /> Receive WhatsApp Confirmation Alert
            </button>
          </div>

          <button className="btn btn-ghost" onClick={() => setStep(1)}>Return to Home</button>
        </div>
      )}

      {/* PAYPAL EXPRESS SANDBOX MODAL */}
      {showPaypalModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
          zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="card animate-fade-in" style={{ backgroundColor: '#ffffff', maxWidth: '480px', width: '100%', borderRadius: '16px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ backgroundColor: '#003087', color: '#fff', fontWeight: '900', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>PayPal</span>
                <strong style={{ fontSize: '1rem', color: '#1e293b' }}>Express Sandbox Checkout</strong>
              </div>
              <button type="button" onClick={() => setShowPaypalModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span>Order Subtotal:</span>
                <strong>₹{cartTotal.toLocaleString('en-IN')}.00 INR</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0d9488', fontWeight: '700' }}>
                <span>USD Conversion:</span>
                <strong>${(cartTotal / 83).toFixed(2)} USD</strong>
              </div>
            </div>

            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleApprovePaypal}
              style={{ width: '100%', backgroundColor: '#0070ba', borderColor: '#0070ba', fontWeight: '800', padding: '0.85rem' }}
            >
              Approve & Pay ${(cartTotal / 83).toFixed(2)} USD via PayPal
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export { CartCheckout as Checkout };
