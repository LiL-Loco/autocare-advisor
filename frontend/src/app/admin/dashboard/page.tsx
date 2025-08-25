'use client';

import {
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface DashboardStats {
  totalInvitations: number;
  pendingInvitations: number;
  acceptedInvitations: number;
  expiredInvitations: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInvitations: 0,
    pendingInvitations: 0,
    acceptedInvitations: 0,
    expiredInvitations: 0,
  });
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/invitations`);
      const invitations = response.data.invitations;

      const stats = {
        totalInvitations: invitations.length,
        pendingInvitations: invitations.filter(
          (inv: any) => inv.status === 'pending'
        ).length,
        acceptedInvitations: invitations.filter(
          (inv: any) => inv.status === 'accepted'
        ).length,
        expiredInvitations: invitations.filter(
          (inv: any) => inv.status === 'expired'
        ).length,
      };

      setStats(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total Invitations',
      value: stats.totalInvitations,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Pending',
      value: stats.pendingInvitations,
      icon: ClockIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'Accepted',
      value: stats.acceptedInvitations,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Expired',
      value: stats.expiredInvitations,
      icon: EnvelopeIcon,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Admin Dashboard
        </h1>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {statCards.map((stat) => (
                <div
                  key={stat.name}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`${stat.color} p-3 rounded-md`}>
                          <stat.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {stat.name}
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {stat.value}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <a
                    href="/admin/invitations"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <UserGroupIcon className="w-5 h-5 mr-2" />
                    Manage Invitations
                  </a>
                  <a
                    href="/admin/invitations/new"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <EnvelopeIcon className="w-5 h-5 mr-2" />
                    Send New Invitation
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
