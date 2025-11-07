import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { useToast } from '../../hooks/use-toast';

const API_BASE = import.meta?.env?.VITE_API_URL || 'http://localhost:3000';

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

const StatCard = ({ label, value, loading }) => (
  <Card>
    <CardContent className="p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">{loading ? '...' : value}</p>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [section, setSection] = useState('Dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalCooks: 0, pendingCooks: 0, verifiedCooks: 0, rejectedCooks: 0, totalUsers: 0 });
  const [activities, setActivities] = useState([]);
  const [pendingCooks, setPendingCooks] = useState([]);
  const [verifiedCooks, setVerifiedCooks] = useState([]);
  const [rejectedCooks, setRejectedCooks] = useState([]);
  const [users, setUsers] = useState([]);
  const { toast } = useToast();

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/dashboard/stats`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({ title: 'Error', description: 'Failed to load dashboard stats', variant: 'destructive' });
    }
  };

  // Fetch activities
  const fetchActivities = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/dashboard/activities`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch activities');
      const data = await response.json();
      if (data.success) {
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  // Fetch cooks by status
  const fetchCooks = async (status) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/cooks?status=${status}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error(`Failed to fetch ${status} cooks`);
      const data = await response.json();
      if (data.success) {
        return data.cooks || [];
      }
      return [];
    } catch (error) {
      console.error(`Error fetching ${status} cooks:`, error);
      return [];
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/users`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({ title: 'Error', description: 'Failed to load users', variant: 'destructive' });
    }
  };

  // Load data based on section
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (section === 'Dashboard') {
          await Promise.all([fetchStats(), fetchActivities()]);
        } else if (section === 'Pending Cooks') {
          const cooks = await fetchCooks('PENDING');
          setPendingCooks(cooks);
        } else if (section === 'Verified Cooks') {
          const cooks = await fetchCooks('VERIFIED');
          setVerifiedCooks(cooks);
        } else if (section === 'Rejected Cooks') {
          const cooks = await fetchCooks('REJECTED');
          setRejectedCooks(cooks);
        } else if (section === 'User Management') {
          await fetchUsers();
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [section]);

  // Update cook status
  const updateCookStatus = async (cookId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/cooks/${cookId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update cook status');
      }

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Success', description: data.message });
        // Reload current section
        if (section === 'Pending Cooks') {
          const cooks = await fetchCooks('PENDING');
          setPendingCooks(cooks);
        } else if (section === 'Verified Cooks') {
          const cooks = await fetchCooks('VERIFIED');
          setVerifiedCooks(cooks);
        } else if (section === 'Rejected Cooks') {
          const cooks = await fetchCooks('REJECTED');
          setRejectedCooks(cooks);
        }
        // Refresh stats
        await fetchStats();
      }
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const acceptCook = (id) => {
    updateCookStatus(id, 'VERIFIED');
  };

  const rejectCook = (id) => {
    updateCookStatus(id, 'REJECTED');
  };

  const moveToPending = (id) => {
    updateCookStatus(id, 'PENDING');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Cooks" value={stats.totalCooks} loading={loading} />
        <StatCard label="Pending Cooks" value={stats.pendingCooks} loading={loading} />
        <StatCard label="Verified Cooks" value={stats.verifiedCooks} loading={loading} />
        <StatCard label="Total Users" value={stats.totalUsers} loading={loading} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-gray-500">Loading activities...</p>
          ) : activities.length === 0 ? (
            <p className="text-sm text-gray-500">No recent activities</p>
          ) : (
            <ul className="list-disc pl-5 space-y-2">
              {activities.map(item => (
                <li key={item.id} className="text-sm text-gray-700">{item.text}</li>
              ))}
            </ul>
          )}
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
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : list.length === 0 ? (
          <p className="text-sm text-gray-500">No records</p>
        ) : (
          <ul className="divide-y">
            {list.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-3">
                <div className="flex-1">
                  <span className="text-sm font-medium">{c.name}</span>
                  <p className="text-xs text-gray-500">{c.email}</p>
                </div>
                <div className="flex gap-2">
                  {kind === 'pending' && (
                    <>
                      <Button size="sm" className="bg-[#28b26f] hover:bg-[#28b26f]/90" onClick={() => acceptCook(c.id)}>Accept</Button>
                      <Button size="sm" variant="outline" onClick={() => rejectCook(c.id)}>Decline</Button>
                    </>
                  )}
                  {kind === 'verified' && (
                    <Button size="sm" variant="outline" onClick={() => moveToPending(c.id)}>Move to Pending</Button>
                  )}
                  {kind === 'rejected' && (
                    <Button size="sm" variant="outline" onClick={() => moveToPending(c.id)}>Move to Pending</Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );

  // Verify cook from user management
  const verifyCook = async (cookId) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/users/${cookId}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to verify cook');
      }

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Success', description: data.message });
        // Reload users list
        await fetchUsers();
      }
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const renderUsers = () => {
    // Separate users by role
    const students = users.filter(u => u.role === 'STUDENT');
    const cooks = users.filter(u => u.role === 'COOK');

    return (
      <div className="space-y-6">
        {/* Cooks Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cooks ({cooks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : cooks.length === 0 ? (
              <p className="text-sm text-gray-500">No cooks found</p>
            ) : (
              <ul className="divide-y">
                {cooks.map(u => {
                  const status = u.status || 'PENDING';
                  const statusColors = {
                    'VERIFIED': 'bg-green-100 text-green-800',
                    'PENDING': 'bg-yellow-100 text-yellow-800',
                    'REJECTED': 'bg-red-100 text-red-800'
                  };
                  
                  return (
                    <li key={u.id} className="flex items-center justify-between py-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{u.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                            {status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{u.email}</p>
                        {u.aadharNumber && (
                          <p className="text-xs text-gray-400 mt-1">Aadhar: {u.aadharNumber}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {status === 'PENDING' && (
                          <Button 
                            size="sm" 
                            className="bg-[#28b26f] hover:bg-[#28b26f]/90"
                            onClick={() => verifyCook(u.id)}
                          >
                            Verify
                          </Button>
                        )}
                        {status === 'VERIFIED' && (
                          <span className="text-xs text-green-600 font-medium">Verified</span>
                        )}
                        {status === 'REJECTED' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => verifyCook(u.id)}
                          >
                            Verify
                          </Button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Students Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Students ({students.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : students.length === 0 ? (
              <p className="text-sm text-gray-500">No students found</p>
            ) : (
              <ul className="divide-y">
                {students.map(u => (
                  <li key={u.id} className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{u.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          STUDENT
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{u.email}</p>
                      {u.foodPreference && (
                        <p className="text-xs text-gray-400 mt-1">Preference: {u.foodPreference}</p>
                      )}
                    </div>
                    <Button size="sm" variant="outline">View</Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

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
          <Button variant="outline" onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.replace('/');
            }
          }}>Back to Site</Button>
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
