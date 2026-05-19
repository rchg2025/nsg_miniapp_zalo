import React, { useState, useEffect } from "react";
import { Box, Button, Page, Text, Header, List } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { DataManager, SystemStats } from "@/utils/data-manager";

function AdminStatsPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

  // Kiểm tra quyền admin
  useEffect(() => {
    const adminStatus = localStorage.getItem("admin_logged_in");
    if (adminStatus !== "true") {
      navigate("/profile");
      return;
    }

    loadStats();
  }, [navigate]);

  const loadStats = () => {
    const statsData = DataManager.getStats();
    setStats(statsData);
  };

  const formatNumber = (num: number) => {
    if (num === null || num === undefined || isNaN(num)) {
      return '0';
    }
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const formatPercent = (num: number) => {
    if (num === null || num === undefined || isNaN(num)) {
      return '0%';
    }
    return `${num.toFixed(1)}%`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getPeriodName = (period: string) => {
    const periods = {
      'today': 'H�m nay',
      'week': 'Tuần n�y',
      'month': 'Th�ng n�y',
      'year': 'Năm n�y'
    };
    return periods[period] || period;
  };

  if (!stats) {
    return (
      <Page className="page-with-header bg-gray-50">
        <Header 
          title="Thống k� & B�o c�o" 
          showBackIcon={true}
          className="bg-blue-600 text-white"
        />
        <Box className="p-4">
          <Text>Đang tải dữ liệu...</Text>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="page-with-header bg-gray-50">
      <Header 
        title="Thống k� & B�o c�o" 
        showBackIcon={true}
        className="bg-blue-600 text-white"
      />
      
      {/* Back Button */}
      <Box className="absolute top-4 left-4 z-20">
        <Button
          size="small"
          variant="tertiary"
          onClick={() => navigate("/admin")}
          className="bg-white/20 text-white rounded-full"
        >
          ← Quay lại
        </Button>
      </Box>

      <Box className="p-4">
        {/* Period Selector */}
        <Box className="mb-4">
          <Text className="mb-2 font-medium">Thời gian:</Text>
          <Box className="flex gap-2 overflow-x-auto">
            {(['today', 'week', 'month', 'year'] as const).map((period) => (
              <Button
                key={period}
                size="small"
                variant={selectedPeriod === period ? "primary" : "tertiary"}
                onClick={() => setSelectedPeriod(period)}
                className="whitespace-nowrap"
              >
                {getPeriodName(period)}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Overview Stats */}
        <Box className="mb-6">
          <Text.Title className="mb-3">📊 Tổng quan hệ thống</Text.Title>
          <Box className="grid grid-cols-2 gap-3 mb-4">
            <Box className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
              <Text className="text-2xl font-bold">{formatNumber(stats.users.total)}</Text>
              <Text className="text-sm opacity-90">Tổng người d�ng</Text>
              <Text className="text-xs opacity-75">+{stats.users.newThisMonth} th�ng n�y</Text>
            </Box>
            <Box className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
              <Text className="text-2xl font-bold">{formatNumber(stats.news.published)}</Text>
              <Text className="text-sm opacity-90">Tin tức đ� xuất bản</Text>
              <Text className="text-xs opacity-75">{stats.news.total} tổng cộng</Text>
            </Box>
            <Box className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg">
              <Text className="text-2xl font-bold">{formatNumber(stats.majors.active)}</Text>
              <Text className="text-sm opacity-90">Ng�nh đang tuyển</Text>
              <Text className="text-xs opacity-75">{stats.majors.total} tổng cộng</Text>
            </Box>
            <Box className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg">
              <Text className="text-2xl font-bold">{formatNumber(stats.applications.total)}</Text>
              <Text className="text-sm opacity-90">Đơn tuyển sinh</Text>
              <Text className="text-xs opacity-75">+{stats.applications.thisMonth} th�ng n�y</Text>
            </Box>
          </Box>
        </Box>

        {/* User Statistics */}
        <Box className="mb-6">
          <Text.Title className="mb-3">👥 Thống k� người d�ng</Text.Title>
          <Box className="bg-white p-4 rounded-lg space-y-3">
            <Box className="flex justify-between items-center">
              <Text className="text-gray-600">Tổng số người d�ng:</Text>
              <Text className="font-bold text-lg">{formatNumber(stats.users.total)}</Text>
            </Box>
            <Box className="flex justify-between items-center">
              <Text className="text-gray-600">Người d�ng hoạt động:</Text>
              <Text className="font-bold text-green-600">{formatNumber(stats.users.active)}</Text>
            </Box>
            <Box className="flex justify-between items-center">
              <Text className="text-gray-600">Sinh vi�n:</Text>
              <Text className="font-bold text-blue-600">{formatNumber(stats.users.students)}</Text>
            </Box>
            <Box className="flex justify-between items-center">
              <Text className="text-gray-600">Giảng vi�n:</Text>
              <Text className="font-bold text-purple-600">{formatNumber(stats.users.teachers)}</Text>
            </Box>
            <Box className="flex justify-between items-center">
              <Text className="text-gray-600">Quản trị vi�n:</Text>
              <Text className="font-bold text-red-600">{formatNumber(stats.users.admins)}</Text>
            </Box>
            <Box className="flex justify-between items-center pt-2 border-t">
              <Text className="text-gray-600">Người d�ng mới th�ng n�y:</Text>
              <Text className="font-bold text-orange-600">{formatNumber(stats.users.newThisMonth)}</Text>
            </Box>
          </Box>
        </Box>

        {/* News Statistics */}
        <Box className="mb-6">
          <Text.Title className="mb-3">📰 Thống k� tin tức</Text.Title>
          <Box className="bg-white p-4 rounded-lg">
            <Box className="grid grid-cols-2 gap-4 mb-4">
              <Box className="text-center">
                <Text className="text-2xl font-bold text-green-600">{stats.news.published}</Text>
                <Text className="text-sm text-gray-600">Đ� xuất bản</Text>
              </Box>
              <Box className="text-center">
                <Text className="text-2xl font-bold text-yellow-600">{stats.news.draft}</Text>
                <Text className="text-sm text-gray-600">Bản nh�p</Text>
              </Box>
              <Box className="text-center">
                <Text className="text-2xl font-bold text-red-600">{stats.news.featured}</Text>
                <Text className="text-sm text-gray-600">Nổi bật</Text>
              </Box>
              <Box className="text-center">
                <Text className="text-2xl font-bold text-blue-600">{formatNumber(stats.news.totalViews)}</Text>
                <Text className="text-sm text-gray-600">Lượt xem</Text>
              </Box>
            </Box>
            <Box className="flex justify-between items-center pt-3 border-t">
              <Text className="text-gray-600">Tổng số lượt th�ch:</Text>
              <Text className="font-bold text-pink-600">{formatNumber(stats.news.totalLikes)}</Text>
            </Box>
          </Box>
        </Box>

        {/* Majors Statistics */}
        <Box className="mb-6">
          <Text.Title className="mb-3">📚 Thống k� tuyển sinh</Text.Title>
          <Box className="bg-white p-4 rounded-lg space-y-3">
            <Box className="flex justify-between items-center">
              <Text className="text-gray-600">Tổng ng�nh học:</Text>
              <Text className="font-bold text-lg">{formatNumber(stats.majors.total)}</Text>
            </Box>
            <Box className="flex justify-between items-center">
              <Text className="text-gray-600">Ng�nh đang tuyển:</Text>
              <Text className="font-bold text-green-600">{formatNumber(stats.majors.active)}</Text>
            </Box>
            <Box className="flex justify-between items-center">
              <Text className="text-gray-600">Tổng chỉ ti�u:</Text>
              <Text className="font-bold text-blue-600">{formatNumber(stats.majors.totalQuota)}</Text>
            </Box>
            <Box className="flex justify-between items-center">
              <Text className="text-gray-600">Đ� tuyển:</Text>
              <Text className="font-bold text-purple-600">{formatNumber(stats.majors.totalEnrolled)}</Text>
            </Box>
            <Box className="flex justify-between items-center pt-2 border-t">
              <Text className="text-gray-600">Tỷ lệ tuyển sinh:</Text>
              <Text className="font-bold text-orange-600">{formatPercent(stats.majors.admissionRate)}</Text>
            </Box>
          </Box>
        </Box>

        {/* Applications Statistics */}
        <Box className="mb-6">
          <Text.Title className="mb-3">📄 Thống k� đơn tuyển sinh</Text.Title>
          <Box className="bg-white p-4 rounded-lg">
            <Box className="grid grid-cols-2 gap-4 mb-4">
              <Box className="text-center">
                <Text className="text-2xl font-bold text-blue-600">{stats.applications.total}</Text>
                <Text className="text-sm text-gray-600">Tổng đơn</Text>
              </Box>
              <Box className="text-center">
                <Text className="text-2xl font-bold text-yellow-600">{stats.applications.pending}</Text>
                <Text className="text-sm text-gray-600">Chờ duyệt</Text>
              </Box>
              <Box className="text-center">
                <Text className="text-2xl font-bold text-green-600">{stats.applications.approved}</Text>
                <Text className="text-sm text-gray-600">Đ� duyệt</Text>
              </Box>
              <Box className="text-center">
                <Text className="text-2xl font-bold text-red-600">{stats.applications.rejected}</Text>
                <Text className="text-sm text-gray-600">Từ chối</Text>
              </Box>
            </Box>
            <Box className="flex justify-between items-center pt-3 border-t">
              <Text className="text-gray-600">Đơn mới th�ng n�y:</Text>
              <Text className="font-bold text-orange-600">{formatNumber(stats.applications.thisMonth)}</Text>
            </Box>
          </Box>
        </Box>

        {/* Activity Statistics */}
        <Box className="mb-6">
          <Text.Title className="mb-3">📈 Hoạt động hệ thống</Text.Title>
          <Box className="bg-white p-4 rounded-lg space-y-3">
            <Box className="flex justify-between items-center">
              <Text className="text-gray-600">Người d�ng hoạt động h�ng ng�y:</Text>
              <Text className="font-bold text-green-600">{formatNumber(stats.activities.dailyActiveUsers)}</Text>
            </Box>
            <Box className="flex justify-between items-center">
              <Text className="text-gray-600">Người d�ng hoạt động h�ng th�ng:</Text>
              <Text className="font-bold text-blue-600">{formatNumber(stats.activities.monthlyActiveUsers)}</Text>
            </Box>
          </Box>
        </Box>

        {/* Popular Majors */}
        <Box className="mb-6">
          <Text.Title className="mb-3">🔥 Ng�nh học được quan t�m nhất</Text.Title>
          <List>
            {stats.activities.popularMajors.map((major, index) => (
              <List.Item
                key={major.majorId}
                title={`${index + 1}. ${major.majorName}`}
                subTitle={`${major.applications} đơn đăng k�`}
                suffix={
                  <Box className="text-center">
                    <Text className="text-lg font-bold text-blue-600">{major.applications}</Text>
                    <Text className="text-xs text-gray-500">đơn</Text>
                  </Box>
                }
              />
            ))}
          </List>
          {stats.activities.popularMajors.length === 0 && (
            <Box className="bg-white p-4 rounded text-center">
              <Text className="text-gray-500">Chưa c� dữ liệu</Text>
            </Box>
          )}
        </Box>

        {/* Popular News */}
        <Box className="mb-6">
          <Text.Title className="mb-3">📰 Tin tức được xem nhiều nhất</Text.Title>
          <List>
            {stats.activities.popularNews.map((news, index) => (
              <List.Item
                key={news.newsId}
                title={`${index + 1}. ${news.title}`}
                subTitle={`${formatNumber(news.views)} lượt xem`}
                suffix={
                  <Box className="text-center">
                    <Text className="text-lg font-bold text-green-600">{formatNumber(news.views)}</Text>
                    <Text className="text-xs text-gray-500">lượt xem</Text>
                  </Box>
                }
              />
            ))}
          </List>
          {stats.activities.popularNews.length === 0 && (
            <Box className="bg-white p-4 rounded text-center">
              <Text className="text-gray-500">Chưa c� dữ liệu</Text>
            </Box>
          )}
        </Box>

        {/* Refresh Button */}
        <Box className="text-center mt-6">
          <Button
            variant="secondary"
            onClick={() => {
              DataManager.updateStats();
              loadStats();
            }}
          >
            🔄 Cập nhật dữ liệu
          </Button>
        </Box>
      </Box>
    </Page>
  );
}

export default AdminStatsPage;