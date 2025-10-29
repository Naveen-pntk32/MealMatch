import React, { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';

const SidebarItem = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
      active ? 'bg-[#28b26f] text-white' : 'hover:bg-gray-100'
    }`}
  >
    {label}
  </button>
);

const StatCard = ({ label, value }) => (
  <Card>
    <CardContent className="p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [section, setSection] = useState('Dashboard');

  // Mock data for frontend-only view
  const baseData = useMemo(() => ({
    totals: { totalCooks: 42, pendingCooks: 7, verifiedCooks: 31, totalUsers: 320 },
    recentActivities: [
      { id: 1, text: 'New cook registered: Priya Sharma' },
      { id: 2, text: 'User subscribed to Cook #18' },
      { id: 3, text: 'Cook #12 verified by admin' },
      { id: 4, text: 'Rejected cook application: Incomplete docs' },
    ],
    users: [ { id: 'U001', name: 'Rohit' }, { id: 'U002', name: 'Sneha' }, { id: 'U003', name: 'Vikram' } ],
  }), []);

  const [pendingCooks, setPendingCooks] = useState([ { id: 'C101', name: 'Anil Kumar' }, { id: 'C102', name: 'Ritika Verma' } ]);
  const [verifiedCooks, setVerifiedCooks] = useState([ { id: 'C001', name: 'Meera' }, { id: 'C002', name: 'Arun' } ]);
  const [rejectedCooks, setRejectedCooks] = useState([ { id: 'C900', name: 'Dev Test' } ]);

  const totals = {
    totalCooks: pendingCooks.length + verifiedCooks.length + rejectedCooks.length,
    pendingCooks: pendingCooks.length,
    verifiedCooks: verifiedCooks.length,
    totalUsers: baseData.totals.totalUsers,
  };

  const acceptCook = (id) => {
    const item = pendingCooks.find(c => c.id === id);
    if (!item) return;
    setPendingCooks(pendingCooks.filter(c => c.id !== id));
    setVerifiedCooks([item, ...verifiedCooks]);
  };

  const rejectCook = (id) => {
    const item = pendingCooks.find(c => c.id === id);
    if (!item) return;
    setPendingCooks(pendingCooks.filter(c => c.id !== id));
    setRejectedCooks([item, ...rejectedCooks]);
  };

  const moveToPending = (id, from) => {
    if (from === 'verified') {
      const item = verifiedCooks.find(c => c.id === id);
      if (!item) return;
      setVerifiedCooks(verifiedCooks.filter(c => c.id !== id));
      setPendingCooks([item, ...pendingCooks]);
    } else if (from === 'rejected') {
      const item = rejectedCooks.find(c => c.id === id);
      if (!item) return;
      setRejectedCooks(rejectedCooks.filter(c => c.id !== id));
      setPendingCooks([item, ...pendingCooks]);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Cooks" value={totals.totalCooks} />
        <StatCard label="Pending Cooks" value={totals.pendingCooks} />
        <StatCard label="Verified Cooks" value={totals.verifiedCooks} />
        <StatCard label="Total Users" value={totals.totalUsers} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            {baseData.recentActivities.map(item => (
              <li key={item.id} className="text-sm text-gray-700">{item.text}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );

  const renderCookList = (list, kind) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{section}</CardTitle>
      </CardHeader>
      <CardContent>
        {list.length === 0 ? (
          <p className="text-sm text-gray-500">No records</p>
        ) : (
          <ul className="divide-y">
            {list.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-3">
                <span className="text-sm">{c.name}</span>
                <div className="flex gap-2">
                  {kind === 'pending' && (
                    <>
                      <Button size="sm" className="bg-[#28b26f] hover:bg-[#28b26f]/90" onClick={() => acceptCook(c.id)}>Accept</Button>
                      <Button size="sm" variant="outline" onClick={() => rejectCook(c.id)}>Decline</Button>
                    </>
                  )}
                  {kind === 'verified' && (
                    <Button size="sm" variant="outline" onClick={() => moveToPending(c.id, 'verified')}>Move to Pending</Button>
                  )}
                  {kind === 'rejected' && (
                    <Button size="sm" variant="outline" onClick={() => moveToPending(c.id, 'rejected')}>Move to Pending</Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );

  const renderUsers = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Users</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {baseData.users.map(u => (
            <li key={u.id} className="flex items-center justify-between py-3">
              <span className="text-sm">{u.name}</span>
              <Button size="sm" variant="outline">View</Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  const content = () => {
    switch (section) {
      case 'Dashboard':
        return renderDashboard();
      case 'Pending Cooks':
        return renderCookList(pendingCooks, 'pending');
      case 'Verified Cooks':
        return renderCookList(verifiedCooks, 'verified');
      case 'Rejected Cooks':
        return renderCookList(rejectedCooks, 'rejected');
      case 'User Management':
        return renderUsers();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Admin Panel</h1>
          <Button variant="outline" onClick={() => (window.location.href = '/')}>Back to Site</Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <Card>
            <CardContent className="p-3 space-y-2">
              <p className="text-xs uppercase text-gray-500 px-1">Admin Panel</p>
              <SidebarItem label="Dashboard" active={section === 'Dashboard'} onClick={() => setSection('Dashboard')} />
              <Separator />
              <p className="text-xs uppercase text-gray-500 px-1 mt-3">Cook Management</p>
              <SidebarItem label="Pending Cooks" active={section === 'Pending Cooks'} onClick={() => setSection('Pending Cooks')} />
              <SidebarItem label="Verified Cooks" active={section === 'Verified Cooks'} onClick={() => setSection('Verified Cooks')} />
              <SidebarItem label="Rejected Cooks" active={section === 'Rejected Cooks'} onClick={() => setSection('Rejected Cooks')} />
              <Separator />
              <SidebarItem label="User Management" active={section === 'User Management'} onClick={() => setSection('User Management')} />
              <Separator />
              <SidebarItem label="Logout" active={false} onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.replace('/');
                }
              }} />
            </CardContent>
          </Card>
        </aside>

        <section className="lg:col-span-3 space-y-6">
          {content()}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;


