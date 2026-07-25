import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { DollarSign, Inbox, ShieldAlert, Calendar, ShoppingBag, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function Dashboard({ setActiveAdminTab }) {
  const { orders, products, leads } = useContext(AppContext);

  const safeOrders = orders || [];
  const safeProducts = products || [];
  const safeLeads = leads || [];

  // Math metrics
  const totalSales = safeOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const pendingFulfillCount = safeOrders.filter(o => o.status === 'pending').length;
  const lowStockProducts = safeProducts.filter(p => p.stock <= p.lowStockThreshold);

  // Simple static days for sales charts
  const salesHistory = [
    { day: 'Mon', sales: 12000 },
    { day: 'Tue', sales: 19000 },
    { day: 'Wed', sales: 15000 },
    { day: 'Thu', sales: 22000 },
    { day: 'Fri', sales: 34000 },
    { day: 'Sat', sales: 28000 },
    { day: 'Sun', sales: totalSales > 0 ? totalSales % 50000 : 8000 }
  ];

  const maxVal = Math.max(...salesHistory.map(d => d.sales));

  return (
    <div className="animate-fade-in">
      
      {/* Welcome header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Admin Command Dashboard</h1>
          <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.875rem' }}>Real-time overview of AeonCare operations and stock.</p>
        </div>
        <div className="badge badge-success" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
          ● Live Store Sync Enabled
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        
        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'hsl(var(--success-bg))', color: 'hsl(var(--success))', padding: '0.75rem', borderRadius: '12px' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: '600', display: 'block' }}>REVENUE TOTAL</span>
            <strong style={{ fontSize: '1.35rem', color: 'hsl(var(--text-main))' }}>₹{totalSales.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'hsl(var(--secondary))', color: 'hsl(var(--secondary-foreground))', padding: '0.75rem', borderRadius: '12px' }}>
            <Inbox size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: '600', display: 'block' }}>AWAITING FULFILLMENT</span>
            <strong style={{ fontSize: '1.35rem', color: 'hsl(var(--text-main))' }}>{pendingFulfillCount} Orders</strong>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'hsl(var(--warning-bg))', color: 'hsl(var(--warning))', padding: '0.75rem', borderRadius: '12px' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: '600', display: 'block' }}>TOTAL PRODUCTS</span>
            <strong style={{ fontSize: '1.35rem', color: 'hsl(var(--text-main))' }}>{products.length} Items</strong>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'hsl(var(--destructive-bg))', color: 'hsl(var(--destructive))', padding: '0.75rem', borderRadius: '12px' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: '600', display: 'block' }}>LOW STOCK ITEMS</span>
            <strong style={{ fontSize: '1.35rem', color: 'hsl(var(--text-main))' }}>{lowStockProducts.length} Alerts</strong>
          </div>
        </div>

      </div>

      {/* Main Charts & Action splits */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', marginBottom: '2rem', alignItems: 'start' }}>
        
        {/* Left Column: Sales SVG bar chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Store Sales Performance (Last 7 Days)</h3>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'hsl(var(--success))', fontWeight: '700' }}>
              <TrendingUp size={16} /> +18.4% this week
            </span>
          </div>

          <div style={{ height: '240px', width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '1rem 0' }}>
            {salesHistory.map((item, i) => {
              const heightPct = Math.max(10, Math.round((item.sales / maxVal) * 80));
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(var(--text-muted))' }}>₹{Math.round(item.sales/1000)}k</span>
                  <div style={{
                    width: '60%',
                    height: `${heightPct}%`,
                    backgroundColor: 'hsl(var(--primary))',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.4s ease-out'
                  }}></div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Alerts and Recent Task Centers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Action Tasks */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '0.5rem' }}>Store Actions Task Center</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              
              {pendingFulfillCount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span>📦 Fulfill {pendingFulfillCount} pending orders</span>
                  <button className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setActiveAdminTab('orders')}>
                    Fulfill
                  </button>
                </div>
              )}

              {lowStockProducts.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span style={{ color: 'hsl(var(--destructive))' }}>⚠️ {lowStockProducts.length} items low in stock!</span>
                  <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setActiveAdminTab('products')}>
                    Restock
                  </button>
                </div>
              )}

              {safeLeads.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span>📞 Callback requested on {safeLeads.length} leads</span>
                  <button className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setActiveAdminTab('marketing')}>
                    View
                  </button>
                </div>
              )}

              {pendingFulfillCount === 0 && lowStockProducts.length === 0 && (
                <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>✅ All operational queues clear!</p>
              )}
            </div>
          </div>
          {/* Quick Stats overview */}
          <div className="card" style={{ backgroundColor: 'hsl(var(--secondary) / 0.2)', border: 'none' }}>
            <h4 style={{ fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Inventory Status Check:</h4>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'hsl(var(--secondary-foreground))', marginBottom: '0.5rem' }}>
              {lowStockProducts.length === 0 ? '✓ All Items Healthy' : `${lowStockProducts.length} Items Low`}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Monitor stock levels and restock items to prevent out-of-stock listings.</p>
          </div>

        </div>

      </div>

      {/* Recent Orders table */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem' }}>Recent Transactions</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid hsl(var(--border))', paddingBottom: '0.5rem' }}>
                <th style={{ padding: '0.5rem' }}>Order ID</th>
                <th>Customer</th>
                <th>Order Date</th>
                <th>Subtotal</th>
                <th>Payment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 3).map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: '700' }}>{o.id}</td>
                  <td>{o.customerName}</td>
                  <td>{o.date}</td>
                  <td>₹{o.subtotal.toLocaleString('en-IN')}</td>
                  <td>
                    <span className="badge badge-success">{o.paymentStatus}</span>
                  </td>
                  <td>
                    <button className="btn btn-ghost" style={{ padding: '4px', display: 'flex', alignItems: 'center', gap: '0.2,rem' }} onClick={() => setActiveAdminTab('orders')}>
                      View <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
