import React, { useState } from "react";
import { Box, Button, Icon, Page, Text, Header } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { ZaloUserService } from "@/utils/zalo-user-service";
import ZaloPhonePermission from "@/components/zalo-phone-permission";

function ZaloPermissionTestPage() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const checkPermissions = async () => {
    addLog("🔍 Kiểm tra quyền truy cập...");
    try {
      const perms = await ZaloUserService.checkPermissions();
      setPermissions(perms);
      addLog(`📋 Kết quả: UserInfo=${perms.userInfo}, Phone=${perms.phone}`);
      console.log("Chi tiết quyền:", perms);
    } catch (error) {
      addLog(`❌ Lỗi: ${error}`);
    }
  };

  const getUserInfo = async () => {
    addLog("👤 Lấy thông tin người dùng...");
    try {
      const info = await ZaloUserService.getUserInfo();
      setUserInfo(info);
      if (info) {
        addLog(`✅ Thành công: ${info.name} (${info.id})`);
      } else {
        addLog("❌ Không lấy được thông tin");
      }
    } catch (error) {
      addLog(`❌ Lỗi: ${error}`);
    }
  };

  const testPhonePermissionSteps = async () => {
    addLog("📞 Test quy trình số điện thoại chi tiết...");
    try {
      const result = await ZaloUserService.getPhoneNumberWithSteps();
      
      // Log từng bước
      result.steps.forEach(step => addLog(step));
      
      if (result.success) {
        addLog(`🎉 THÀNH CÔNG: ${result.phone}`);
      } else {
        addLog(`💥 THẤT BẠI: ${result.error}`);
      }
    } catch (error) {
      addLog(`❌ Lỗi: ${error}`);
    }
  };

  const handlePhoneReceived = (phone: string) => {
    addLog(`📱 Nhận được số điện thoại: ${phone}`);
  };

  const handlePhoneError = (error: string) => {
    addLog(`📱 Lỗi số điện thoại: ${error}`);
  };

  const clearLogs = () => {
    setLogs([]);
    setPermissions(null);
    setUserInfo(null);
  };

  return (
    <Page className="bg-gray-50">
      <Header 
        title="Test Quyền Zalo"
        showBackIcon={true}
        onBackClick={() => navigate(-1)}
        className="bg-blue-600 text-white"
      />

      <Box className="h-4"></Box>

      <Box className="p-4">
        {/* Test Actions */}
        <Box className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Text.Title className="text-blue-600 mb-4">🧪 Test Actions</Text.Title>
          
          <Box className="grid grid-cols-2 gap-3 mb-4">
            <Button
              variant="secondary"
              onClick={checkPermissions}
              className="flex flex-col items-center p-3"
            >
              <Icon icon="zi-check-circle" className="mb-1" />
              <Text className="text-xs">Kiểm tra quyền</Text>
            </Button>
            
            <Button
              variant="secondary"
              onClick={getUserInfo}
              className="flex flex-col items-center p-3"
            >
              <Icon icon="zi-user" className="mb-1" />
              <Text className="text-xs">Lấy User Info</Text>
            </Button>
            
            <Button
              variant="secondary"
              onClick={testPhonePermissionSteps}
              className="flex flex-col items-center p-3"
            >
              <Icon icon="zi-call" className="mb-1" />
              <Text className="text-xs">Test Phone Steps</Text>
            </Button>
            
            <Button
              variant="secondary"
              onClick={clearLogs}
              className="flex flex-col items-center p-3"
            >
              <Icon icon="zi-delete" className="mb-1" />
              <Text className="text-xs">Xóa logs</Text>
            </Button>
          </Box>

          {/* Phone Permission Component */}
          <Box className="border-t pt-4">
            <Text className="text-gray-700 mb-2">Component Test:</Text>
            <ZaloPhonePermission
              onPhoneReceived={handlePhoneReceived}
              onError={handlePhoneError}
              buttonText="🔮 Test Component Phone"
              showModal={true}
            />
          </Box>
        </Box>

        {/* Current Status */}
        <Box className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Text.Title className="text-green-600 mb-4">📊 Trạng thái hiện tại</Text.Title>
          
          {permissions && (
            <Box className="mb-4">
              <Text className="font-medium">Quyền truy cập:</Text>
              <Text className="text-sm text-gray-600">
                • UserInfo: {permissions.userInfo ? "✅" : "❌"}{'\n'}
                • Phone: {permissions.phone ? "✅" : "❌"}
              </Text>
            </Box>
          )}

          {userInfo && (
            <Box className="mb-4">
              <Text className="font-medium">Thông tin user:</Text>
              <Text className="text-sm text-gray-600">
                • ID: {userInfo.id}{'\n'}
                • Tên: {userInfo.name}{'\n'}
                • Avatar: {userInfo.avatar ? "Có" : "Không"}{'\n'}
                • Phone: {userInfo.phone || "Chưa có"}
              </Text>
            </Box>
          )}
        </Box>

        {/* Logs */}
        <Box className="bg-white rounded-lg shadow-sm p-4">
          <Text.Title className="text-purple-600 mb-4">📝 Logs ({logs.length})</Text.Title>
          
          <Box className="bg-gray-50 rounded p-3 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <Text className="text-gray-500 text-sm">Chưa có logs...</Text>
            ) : (
              logs.map((log, index) => (
                <Text key={index} className="text-xs font-mono text-gray-700 block mb-1">
                  {log}
                </Text>
              ))
            )}
          </Box>
        </Box>

        {/* Instructions */}
        <Box className="bg-blue-50 rounded-lg p-4 mt-4">
          <Text.Title size="small" className="text-blue-800 mb-2">
            📚 Hướng dẫn test:
          </Text.Title>
          <Text className="text-sm text-blue-700">
            1. Bấm "Kiểm tra quyền" để xem quyền hiện tại{'\n'}
            2. Bấm "Lấy User Info" để lấy thông tin cơ bản{'\n'}
            3. Bấm "Test Phone Steps" để xem quy trình chi tiết{'\n'}
            4. Bấm "Test Component Phone" để test UI component{'\n'}
            5. Xem logs để theo dõi quá trình
          </Text>
        </Box>

        <Box className="h-20"></Box>
      </Box>
    </Page>
  );
}

export default ZaloPermissionTestPage;